export const comprasApi = {
  getPurchases: async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token');
      }

      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/buy/getAll',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener compras');
      }

      const data = await response.json();

      console.log('📥 Datos de compras desde API:', data);

      return data.map((c) => {
        const vehiculo = c.vehiculos?.[0]?.vehiculo || {};
        const modelo = vehiculo.modelo || {};
        const marca = modelo.marca || {};
        const estadoPago = c.estadoPago || {};
        const estadoEntrega = c.estadoEntrega || {};
        const usuario = c.usuario || {};

        return {
          id: c.id,
          img_url: vehiculo.url_img || 'https://via.placeholder.com/80',
          modelo_auto: modelo.nombre || 'Vehículo',
          tipo_vehiculo: vehiculo.tipoVehiculo?.nombre || '',
          placa_auto: vehiculo.placa || '',
          nro_comprobante: c.nro_comprobante || c.numero_comprobante,
          fecha_compra: c.fecha_compra || c.fecha,
          metodo_pago: c.metodo_pago || 'Contado',
          subtotal: c.subtotal,
          igv: c.igv,
          total: c.total,
          estado_pago: estadoPago.nombre || c.estado_pago || 'Pendiente',
          estado_entrega: estadoEntrega.nombre || c.estado_entrega || 'Pendiente',
          fecha_pago: c.fecha_pago || null,
        };
      });

    } catch (error) {
      throw error;
    }
  }
};
