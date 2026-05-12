const BASE_URL = 'https://faithful-healing-production-9e06.up.railway.app/api/buy';

const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No hay token')
  return token
}

export const comprasApi = {
  getPurchaseById: async (id) => {
    try {
      const url = `${BASE_URL}/getById/${id}`;
      console.log('🔍 Fetching compra por ID:', url);

      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) throw new Error('Error al obtener la compra');
      
      const json = await response.json();
      const c = json.data || json;
      
      console.log('📥 Datos RAW de compra por ID:', c);

      // Mapear igual que en getPurchases para consistencia
      const vehiculosDetalle = c.vehiculos || [];
      const proveedor = c.proveedor || {};
      const moneda = c.moneda || {};

      const mapped = {
        id: c.id,
        nro_comprobante: c.nro_comprobante || c.numero_comprobante,
        serie: c.serie,
        fecha_compra: c.fecha_compra || c.fecha,
        subtotal: c.subtotal,
        igv: c.igv,
        total: c.total,
        // Priorizar id_proveedor del root, luego del objeto proveedor
        proveedor: proveedor.razon_social || proveedor.nombre || c.razon_social || 'Sin proveedor',
        id_proveedor: c.id_proveedor || proveedor.id,
        id_tipo_comprobante: c.id_tipo_comprobante,
        id_moneda: c.id_moneda || 1,
        moneda: moneda.nombre || (c.id_moneda === 2 ? 'USD' : 'PEN'),
        detalle: vehiculosDetalle.map(item => {
          const v = item.vehiculo || item || {};
          const m = v.modelo || {};
          const mar = m.marca || {};
          return {
            id_vehiculo: item.id_vehiculo || v.id,
            cantidad: item.cantidad || 1,
            subtotal: item.subtotal || 0,
            marca: mar.nombre || v.marca || '',
            modelo: m.nombre || v.modelo || '',
            placa: v.placa || '',
            anio: v.anio || '',
            url_img: v.url_img || '',
          };
        })
      };

      console.log('📦 Datos MAPEADOS de compra:', mapped);
      console.log('  - Proveedor ID:', mapped.id_proveedor);
      console.log('  - Proveedor Nombre:', mapped.proveedor);
      console.log('  - Vehículos:', mapped.detalle.length);
      return mapped;
    } catch (error) {
      console.error('❌ Error en getPurchaseById:', error);
      throw error;
    }
  },

  getPurchases: async () => {
    try {
      const url = `${BASE_URL}/getAll`;
      console.log('🔍 Fetching de:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status} en el servidor: ${errorText || 'No se pudieron obtener las compras'}`);
      }

      const data = await response.json();
      console.log('📥 Datos de compras desde API:', data);

      return data.map((c) => {
        const vehiculosDetalle = c.vehiculos || [];
        const vehiculoPrincipal = vehiculosDetalle[0]?.vehiculo || {};
        const modelo = vehiculoPrincipal.modelo || {};
        const marca = modelo.marca || {};
        const estadoPago = c.estadoPago || {};
        const estadoEntrega = c.estadoEntrega || {};
        const usuario = c.usuario || {};
        const proveedor = c.proveedor || {};
        const moneda = c.moneda || {};

        return {
          id: c.id,
          img_url: vehiculoPrincipal.url_img || 'https://via.placeholder.com/80',
          modelo_auto: modelo.nombre || 'Vehículo',
          tipo_vehiculo: vehiculoPrincipal.tipoVehiculo?.nombre || '',
          placa_auto: vehiculoPrincipal.placa || '',
          nro_comprobante: c.nro_comprobante || c.numero_comprobante,
          serie: c.serie,
          fecha_compra: c.fecha_compra || c.fecha,
          metodo_pago: c.metodo_pago || 'Contado',
          subtotal: c.subtotal,
          igv: c.igv,
          total: c.total,
          estado_pago: estadoPago.nombre || c.estado_pago || 'Pendiente',
          estado_entrega: estadoEntrega.nombre || c.estado_entrega || 'Pendiente',
          fecha_pago: c.fecha_pago || null,
          // Priorizar id_proveedor del root, luego del objeto proveedor
          proveedor: proveedor.razon_social || proveedor.nombre || c.razon_social || 'Sin proveedor',
          id_proveedor: c.id_proveedor || proveedor.id,
          id_tipo_comprobante: c.id_tipo_comprobante,
          id_moneda: c.id_moneda || 1,
          moneda: moneda.nombre || (c.id_moneda === 2 ? 'USD' : 'PEN'),
          detalle: vehiculosDetalle.map(item => {
            const v = item.vehiculo || item || {}
            const m = v.modelo || {}
            const mar = m.marca || {}
            return {
              id_vehiculo: item.id_vehiculo || v.id,
              cantidad: item.cantidad || 1,
              subtotal: item.subtotal || 0,
              marca: mar.nombre || v.marca || '',
              modelo: m.nombre || v.modelo || '',
              placa: v.placa || '',
              anio: v.anio || '',
              url_img: v.url_img || '',
            }
          })
        };
      });

    } catch (error) {
      throw error;
    }
  },

  registerPurchase: async (purchaseData) => {
    try {
      const url = `${BASE_URL}/register`;
      
      console.log('--- ENVIANDO COMPRA ---');
      console.log('URL completa:', url);
      console.log('Body:', JSON.stringify(purchaseData, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response Text:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'No se pudo registrar la compra'}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      throw error;
    }
  },

  updatePurchase: async (id, purchaseData) => {
    try {
      const url = `${BASE_URL}/update/${id}`;
      console.log('update en:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || 'No se pudo actualizar la compra'}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      throw error;
    }
  },

  deletePurchase: async (id) => {
    try {
      const url = `${BASE_URL}/delete/${id}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || 'No se pudo eliminar la compra'}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      throw error;
    }
  }
};
