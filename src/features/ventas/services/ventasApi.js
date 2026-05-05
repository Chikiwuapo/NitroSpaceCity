export const ventasApi = {
  getSales: async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token');
      }

      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/sale/getAll',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener ventas');
      }

      const data = await response.json();

      console.log(data); // 🔥 DEBUG (déjalo un rato)

      // 🔥 ADAPTADOR
      return data.map((v) => ({
        id: v.id,

        cliente: {
          id: v.cliente?.id,
          nombre_completo:
            v.cliente?.nombre_completo ||
            `${v.cliente?.nombres || ''} ${v.cliente?.apellidos || ''}`,
          img_url: v.cliente?.img_url || null,
        },

        usuario:
          v.usuario?.nombre ||
          v.usuario?.nombre_completo ||
          '',

        tipo_comprobante:
          v.tipoComprobante?.nombre ||
          v.tipo_comprobante ||
          '',

        serie: v.serie,
        numero_comprobante:
          v.nro_comprobante || v.numero_comprobante,

        fecha_venta: v.fecha_venta,

        estado_pago:
          v.estadoPago?.nombre ||
          v.estado_pago ||
          'Pendiente',

        estado_entrega:
          v.estadoEntrega?.nombre ||
          v.estado_entrega ||
          'Pendiente',

        subtotal: v.subtotal,
        igv: v.igv,
        total: v.total,

        // 🔥 VEHÍCULO (puede venir como lista)
        vehiculo: {
          modelo:
            v.vehiculos?.[0]?.vehiculo?.modelo?.nombre ||
            v.vehiculo?.modelo ||
            '',

          tipo:
            v.vehiculos?.[0]?.vehiculo?.tipoVehiculo?.nombre ||
            v.vehiculo?.tipo ||
            '',
        },

        // 🔥 DETALLE
        detalle:
          v.vehiculos?.map((item) => ({
            id: item.id,
            descripcion:
              item.vehiculo?.modelo?.nombre || 'Vehículo',
            cantidad: item.cantidad,
            precio_unitario:
              item.vehiculo?.precio_u || 0,
            subtotal: item.subtotal,
          })) || [],
      }));

    } catch (error) {
      throw error;
    }
  },
createVenta: async (venta) => {
  const token = localStorage.getItem('token');

  const response = await fetch(
    'https://faithful-healing-production-9e06.up.railway.app/api/sale/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(venta),
    }
  );

  if (!response.ok) {
    throw new Error('Error al registrar venta');
  }

  return await response.json();
}  
};
