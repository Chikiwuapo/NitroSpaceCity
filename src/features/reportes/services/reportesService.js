export const reportesApi = {
  getReportesData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          kpis: [
            {
              id: 1,
              title: 'Ventas Totales',
              value: 'S/ 987,500',
              icon: 'DollarSign',
              trend: 'up',
              percentage: '12.5',
              color: 'bg-[#0a332a]/10',
              iconColor: 'text-[#0a332a]'
            },
            {
              id: 2,
              title: 'Vehículos Vendidos',
              value: '156',
              icon: 'Car',
              trend: 'up',
              percentage: '8.3',
              color: 'bg-blue-100',
              iconColor: 'text-blue-600'
            },
            {
              id: 3,
              title: 'Nuevos Clientes',
              value: '245',
              icon: 'Users',
              trend: 'up',
              percentage: '5.2',
              color: 'bg-purple-100',
              iconColor: 'text-purple-600'
            },
            {
              id: 4,
              title: 'Margen de Utilidad',
              value: '18.5%',
              icon: 'TrendingUp',
              trend: 'up',
              percentage: '2.1',
              color: 'bg-emerald-100',
              iconColor: 'text-emerald-600'
            },
            {
              id: 5,
              title: 'Cotizaciones Activas',
              value: '89',
              icon: 'FileText',
              trend: 'down',
              percentage: '3.4',
              color: 'bg-amber-100',
              iconColor: 'text-amber-600'
            },
            {
              id: 6,
              title: 'Tasa de Conversión',
              value: '23.8%',
              icon: 'Target',
              trend: 'up',
              percentage: '1.2',
              color: 'bg-pink-100',
              iconColor: 'text-pink-600'
            }
          ],
          ventasMensuales: [
            { month: 'Ene', ventas: 65000 },
            { month: 'Feb', ventas: 78000 },
            { month: 'Mar', ventas: 90000 },
            { month: 'Abr', ventas: 85000 },
            { month: 'May', ventas: 95000 },
            { month: 'Jun', ventas: 110000 },
            { month: 'Jul', ventas: 105000 },
            { month: 'Ago', ventas: 120000 },
            { month: 'Sep', ventas: 115000 },
            { month: 'Oct', ventas: 130000 },
            { month: 'Nov', ventas: 125000 },
            { month: 'Dic', ventas: 145000 }
          ],
          actividadUsuarios: [
            { date: 'Ene', activity: 2500 },
            { date: 'Feb', activity: 3000 },
            { date: 'Mar', activity: 2800 },
            { date: 'Abr', activity: 3500 },
            { date: 'May', activity: 3200 },
            { date: 'Jun', activity: 4000 },
            { date: 'Jul', activity: 3800 },
            { date: 'Ago', activity: 4500 },
            { date: 'Sep', activity: 4200 },
            { date: 'Oct', activity: 4800 },
            { date: 'Nov', activity: 4500 },
            { date: 'Dic', activity: 5200 }
          ],
          metodosPago: [
            { name: 'Tarjeta de Crédito', value: 45, color: '#0a332a' },
            { name: 'Transferencia', value: 30, color: '#3b82f6' },
            { name: 'Efectivo', value: 15, color: '#10b981' },
            { name: 'Otros', value: 10, color: '#f59e0b' }
          ],
          estadoEntregas: [
            { name: 'Entregado', value: 65, color: '#10b981' },
            { name: 'En Camino', value: 25, color: '#3b82f6' },
            { name: 'Pendiente', value: 10, color: '#f59e0b' }
          ],
          inventarioPorTipo: [
            { tipo: 'Sedán', nuevos: 25, usados: 18 },
            { tipo: 'SUV', nuevos: 32, usados: 25 },
            { tipo: 'Pickup', nuevos: 15, usados: 12 },
            { tipo: 'Hatchback', nuevos: 18, usados: 22 },
            { tipo: 'Coupé', nuevos: 10, usados: 8 }
          ],
          topVendedores: [
            { nombre: 'Juan Pérez', ventas: 42 },
            { nombre: 'María López', ventas: 38 },
            { nombre: 'Carlos García', ventas: 35 },
            { nombre: 'Ana Rodríguez', ventas: 30 },
            { nombre: 'Pedro Sánchez', ventas: 28 }
          ]
        };
        resolve(mockData);
      }, 1000);
    });
  }
};
