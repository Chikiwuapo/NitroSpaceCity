const BASE_URL = 'https://faithful-healing-production-9e06.up.railway.app/api/sale'

const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No hay token')
  return token
}

export const ventasApi = {
  getSaleById: async (id) => {
    const response = await fetch(`${BASE_URL}/getById/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!response.ok) throw new Error('Error al obtener la venta')
    const json = await response.json()
    return json.data || json
  },

  updateVenta: async (id, venta) => {
    const response = await fetch(`${BASE_URL}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(venta),
    })
    const json = await response.json()
    if (!response.ok) throw new Error(json.message || json.error || 'Error al actualizar venta')
    return json
  },

  getSales: async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token');
      }

      const response = await fetch(
        `${BASE_URL}/getAll`,
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
        // El backend puede devolver el cliente como:
        // a) objeto anidado: v.cliente = { primer_nombre, primer_apellido, ... }
        // b) cadena: v.cliente = "Juan Lopez"
        // c) null/undefined (solo viene id_cliente)
        let clienteData = {};
        if (v.cliente && typeof v.cliente === 'object') {
          clienteData = v.cliente;
        } else if (typeof v.cliente === 'string' && v.cliente.trim()) {
          clienteData = { nombre_completo: v.cliente };
        }

        // El backend puede devolver el usuario como objeto o cadena
        let usuarioData = {};
        if (v.usuario && typeof v.usuario === 'object') {
          usuarioData = v.usuario;
        } else if (typeof v.usuario === 'string' && v.usuario.trim()) {
          usuarioData = { nombre_completo: v.usuario };
        }

        const estadoPago = v.estadoPago || v.estado_pago_obj || {};
        const estadoEntrega = v.estadoEntrega || v.estado_entrega_obj || {};
        const tipoComprobante = v.tipoComprobante || v.tipo_comprobante_obj || {};
        const vehiculos = v.vehiculos || [];

        return {
          id: v.id,
          id_cliente: v.id_cliente || clienteData.id || '',
          id_usuario: v.id_usuario || usuarioData.id || '',

          cliente: {
            id: clienteData.id || v.id_cliente || '',
            nombre_completo:
              `${clienteData.primer_nombre || ''} ${clienteData.segundo_nombre || ''} ${clienteData.primer_apellido || ''} ${clienteData.segundo_apellido || ''}`.trim() ||
              clienteData.nombre_completo ||
              clienteData.nombre ||
              clienteData.name ||
              `${clienteData.nombres || ''} ${clienteData.apellidos || ''}`.trim() ||
              'Sin nombre',
            img_url:
              clienteData.url_img ||
              clienteData.img_url ||
              clienteData.imagen ||
              `https://placehold.co/80x80/e2e8f0/64748b?text=C`,
          },

          usuario:
            `${usuarioData.primer_nombre || ''} ${usuarioData.segundo_nombre || ''} ${usuarioData.primer_apellido || ''} ${usuarioData.segundo_apellido || ''}`.trim() ||
            usuarioData.nombre_completo ||
            usuarioData.nombre ||
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
            // El backend puede devolver dos estructuras distintas:
            // 1) Estructura ANIDADA: item = { vehiculo: { modelo: { nombre, marca: { nombre } }, placa, precio_u }, cantidad, subtotal }
            // 2) Estructura PLANA (GET /getAll actual): item = { id_vehiculo, anio, url_img, precio_u }
            // Se detecta automáticamente cuál es y se extraen los campos correctamente.

            const hasNested = item.vehiculo && typeof item.vehiculo === 'object';

            const vehiculo  = hasNested ? item.vehiculo          : item;
            const modeloObj = hasNested ? (vehiculo.modelo || {}) : {};
            const marcaObj  = hasNested ? (modeloObj.marca || {}) : {};

            // Nombre del modelo: intenta anidado, luego plano
            const modeloNombre =
              modeloObj.nombre ||
              vehiculo.modelo   ||
              '';

            // Nombre de la marca: intenta anidado
            const marcaNombre  =
              marcaObj.nombre  ||
              vehiculo.marca   ||
              '';

            // Precio unitario
            const precioU = Number(
              vehiculo.precio_u  ??
              vehiculo.precio    ??
              item.precio_u      ??
              0
            );

            // Cantidad: puede venir en item o no existir en estructura plana (default 1)
            const cantidad = item.cantidad ?? 1;

            // Subtotal por ítem
            const subtotalItem = Number(
              item.subtotal ??
              (precioU * cantidad)
            );

            return {
              id:            item.id || item.id_vehiculo,
              id_vehiculo:   item.id_vehiculo || vehiculo.id || '',
              descripcion:   modeloNombre || 'Vehículo',
              marca:         marcaNombre,
              modelo:        modeloNombre,
              placa:         vehiculo.placa  || '',
              color:         vehiculo.color  || '',
              anio:          vehiculo.anio   || item.anio || '',
              url_img:       vehiculo.url_img || item.url_img || '',
              transmision:   vehiculo.transmision     || '',
              combustible:   vehiculo.tipo_combustible || '',
              cantidad,
              precio_unitario: precioU,
              subtotal:        subtotalItem,
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
        `${BASE_URL}/register`,
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
