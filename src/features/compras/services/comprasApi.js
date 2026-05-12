const BASE_URL = 'https://faithful-healing-production-9e06.up.railway.app/api/buy/';

export const comprasApi = {
  getPurchases: async () => {
    try {
      const url = `${BASE_URL}getAll`;
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
          proveedor: proveedor.razon_social || 'Proveedor',
          id_proveedor: proveedor.id,
          id_tipo_comprobante: c.id_tipo_comprobante,
          id_moneda: c.id_moneda,
          detalle: vehiculosDetalle.map(item => ({
            id_vehiculo: item.id_vehiculo,
            cantidad: item.cantidad,
            subtotal: item.subtotal
          }))
        };
      });

    } catch (error) {
      throw error;
    }
  },

  registerPurchase: async (purchaseData) => {
    try {
      // ÚLTIMA ALTERNATIVA LÓGICA: Usar el término técnico 'purchase'
      // Siguiendo el patrón de /api/sale/register, /api/client/register, etc.
      const url = 'https://faithful-healing-production-9e06.up.railway.app/api/purchase/register';
      
      console.log('--- ENVIANDO COMPRA (INTENTO TÉCNICO: PURCHASE) ---');
      console.log('URL completa:', url);
      console.log('Body:', JSON.stringify(purchaseData, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response Text:', errorText);

        if (response.status === 404) {
          throw new Error(`El servidor sigue devolviendo 404 en la ruta técnica: ${url}. Si esto falla, el endpoint de registro tiene un nombre no estándar (ej: /save o /create).`);
        }
        
        throw new Error(`Error ${response.status} en el servidor: ${errorText || 'No se pudo registrar la compra'}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updatePurchase: async (id, purchaseData) => {
    try {
      const url = `${BASE_URL}update/${id}`;
      console.log('update en:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status} en el servidor: ${errorText || 'No se pudo actualizar la compra'}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};
