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

      const responseData = await response.json();
      const data = responseData.data || responseData;

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((v) => {
        // Manejar el caso donde v.cliente podría ser un objeto o una cadena
        let clienteData = v.cliente || {};
        
        // Si v.cliente es una cadena (ej: "cliente2"), intentar usarla como nombre
        if (typeof v.cliente === 'string') {
          clienteData = { nombre_completo: v.cliente };
        }

        const usuario = v.usuario || {};
        const estadoPago = v.estadoPago || {};
        const estadoEntrega = v.estadoEntrega || {};
        const tipoComprobante = v.tipoComprobante || {};
        const vehiculos = v.vehiculos || [];

        return {
          id: v.id,

          cliente: {
            id: clienteData.id,
            primer_nombre: clienteData.primer_nombre || '',
            segundo_nombre: clienteData.segundo_nombre || '',
            primer_apellido: clienteData.primer_apellido || '',
            segundo_apellido: clienteData.segundo_apellido || '',
            nombre_completo:
              // Priorizar nombres individuales si existen (más confiable)
              `${clienteData.primer_nombre || ''} ${clienteData.segundo_nombre || ''} ${clienteData.primer_apellido || ''} ${clienteData.segundo_apellido || ''}`.trim() ||
              clienteData.nombre_completo ||
              clienteData.nombre ||
              clienteData.name ||
              `${clienteData.nombres || ''} ${clienteData.apellidos || ''}`.trim() ||
              clienteData.razon_social ||
              'Cliente',
            img_url:
              clienteData.url_img ||
              clienteData.img_url ||
              clienteData.imagen ||
              'https://via.placeholder.com/80?text=Cliente',
          },

          usuario:
            usuario.nombre_completo ||
            `${usuario.primer_nombre || ''} ${usuario.segundo_nombre || ''} ${usuario.primer_apellido || ''} ${usuario.segundo_apellido || ''}`.trim() ||
            usuario.nombre ||
            '',

          tipo_comprobante:
            tipoComprobante.nombre ||
            v.tipo_comprobante ||
            'Boleta',

          serie: v.serie,
          numero_comprobante:
            v.nro_comprobante || v.numero_comprobante,

          fecha_venta: v.fecha_venta,

          estado_pago:
            estadoPago.nombre ||
            v.estado_pago ||
            'Vendido',

          estado_entrega:
            estadoEntrega.nombre ||
            v.estado_entrega ||
            'Entregado',

          subtotal: v.subtotal,
          igv: v.igv,
          total: v.total,

          vehiculo: {
            modelo:
              vehiculos[0]?.vehiculo?.modelo?.nombre ||
              v.vehiculo?.modelo ||
              '',
            tipo:
              vehiculos[0]?.vehiculo?.tipoVehiculo?.nombre ||
              v.vehiculo?.tipo ||
              '',
          },

          detalle: vehiculos.map((item) => {
            const vehiculo = item.vehiculo || {};
            const modelo = vehiculo.modelo || {};
            const marca = modelo.marca || {};

            return {
              id: item.id,
              descripcion: modelo.nombre || 'Vehículo',
              marca: marca.nombre || '',
              modelo: modelo.nombre || '',
              placa: vehiculo.placa || '',
              color: vehiculo.color || '',
              anio: vehiculo.anio || '',
              transmision: vehiculo.transmision || '',
              combustible: vehiculo.tipo_combustible || '',
              cantidad: item.cantidad,
              precio_unitario: vehiculo.precio || vehiculo.precio_u || 0,
              subtotal: item.subtotal || (vehiculo.precio || vehiculo.precio_u || 0) * item.cantidad,
            };
          }) || [],
        };
      });

    } catch (error) {
      throw error;
    }
  },

  createVenta: async (venta) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token, usuario no autenticado');
      }

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

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData.message || responseData.error || 'Error al registrar venta';
        throw new Error(errorMsg);
      }

      return responseData;

    } catch (error) {
      throw error;
    }
  },
};
