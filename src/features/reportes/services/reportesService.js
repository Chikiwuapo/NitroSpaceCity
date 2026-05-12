const BASE_URL = 'https://faithful-healing-production-9e06.up.railway.app/api/reports';

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token');
  return token;
};

const fetchReport = async (endpoint) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error(`Error en ${endpoint}`);
  const json = await response.json();
  return json.data || json;
};

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const reportesApi = {
  getReportesData: async () => {
    try {
      const [
        kpisRaw,
        ventasMensualesRaw,
        actividadUsuariosRaw,
        metodosPagoRaw,
        estadoEntregasRaw,
        inventarioTipoRaw,
        topVendedoresRaw
      ] = await Promise.all([
        fetchReport('kpis'),
        fetchReport('ventas-mensuales'),
        fetchReport('actividad-usuarios'),
        fetchReport('metodos-pago'),
        fetchReport('estado-entregas'),
        fetchReport('inventario-tipo'),
        fetchReport('top-vendedores')
      ]);

      // Transformar KPIs
      const kpiConfig = {
        ventas_totales: { 
          title: 'Ventas Totales', 
          icon: 'DollarSign', 
          color: 'bg-[#0a332a]/10', 
          iconColor: 'text-[#0a332a]',
          format: (val) => `S/ ${Number(val).toLocaleString()}`
        },
        vehiculos_vendidos: { 
          title: 'Vehículos Vendidos', 
          icon: 'Car', 
          color: 'bg-blue-100', 
          iconColor: 'text-blue-600',
          format: (val) => val.toString()
        },
        nuevos_clientes: { 
          title: 'Nuevos Clientes', 
          icon: 'Users', 
          color: 'bg-purple-100', 
          iconColor: 'text-purple-600',
          format: (val) => val.toString()
        }
      };

      const kpis = Object.entries(kpisRaw)
        .filter(([key]) => kpiConfig[key])
        .map(([key, value], index) => ({
          id: index + 1,
          ...kpiConfig[key],
          value: kpiConfig[key].format(value),
          trend: 'up', // Backend no devuelve trend por ahora
          percentage: '0.0' // Backend no devuelve porcentaje por ahora
        }));

      // Transformar Ventas Mensuales
      const ventasMensuales = Array.isArray(ventasMensualesRaw) 
        ? ventasMensualesRaw.map(v => ({
            month: monthNames[v.mes_numero - 1] || `Mes ${v.mes_numero}`,
            ventas: Number(v.total_ventas)
          }))
        : [];

      // Transformar Actividad de Usuarios
      const actividadUsuarios = Array.isArray(actividadUsuariosRaw)
        ? actividadUsuariosRaw.map(a => ({
            date: monthNames[a.mes_numero - 1] || `Mes ${a.mes_numero}`,
            activity: Number(a.total_actividad)
          }))
        : [];

      // Transformar Métodos de Pago
      const colorsPago = ['#0a332a', '#3b82f6', '#10b981', '#f59e0b'];
      const metodosPago = Array.isArray(metodosPagoRaw)
        ? metodosPagoRaw.map((m, i) => ({
            name: m.metodo,
            value: Number(m.total),
            color: colorsPago[i % colorsPago.length]
          }))
        : [];

      // Transformar Estado de Entregas
      const colorsEntrega = ['#10b981', '#3b82f6', '#f59e0b'];
      const estadoEntregas = Array.isArray(estadoEntregasRaw)
        ? estadoEntregasRaw.map((e, i) => ({
            name: e.estado_entrega,
            value: Number(e.total),
            color: colorsEntrega[i % colorsEntrega.length]
          }))
        : [];

      // Transformar Inventario por Tipo
      const inventarioPorTipo = Array.isArray(inventarioTipoRaw)
        ? inventarioTipoRaw.map(i => ({
            tipo: i.tipo_vehiculo,
            nuevos: Number(i.nuevos),
            usados: Number(i.usados)
          }))
        : [];

      // Transformar Top Vendedores
      const topVendedores = Array.isArray(topVendedoresRaw)
        ? topVendedoresRaw.map(v => ({
            nombre: v.vendedor,
            ventas: Number(v.total_ventas)
          }))
        : [];

      return {
        kpis,
        ventasMensuales,
        actividadUsuarios,
        metodosPago,
        estadoEntregas,
        inventarioPorTipo,
        topVendedores
      };
    } catch (error) {
      console.error('Error fetching report data:', error);
      throw error;
    }
  }
};

