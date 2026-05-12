export const providerService = {
  getProviders: async () => {
    try {
      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/provider/getAll',
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('<!DOCTYPE html>')) {
          throw new Error('Problema de conexión con el servidor de Railway (404/500)');
        }
        throw new Error(errorText || `Error ${response.status}: No se pudieron obtener los proveedores`);
      }

      const data = await response.json();
      const list = data.data || data;

      if (!Array.isArray(list)) return [];

      return list.map((p) => ({
        id: p.id,
        ruc: p.ruc,
        razon_social: p.razon_social,
        direccion: p.direccion,
        contacto: p.contacto,
        condiciones_pago: p.condiciones_pago || 'Contado',
      }));
    } catch (error) {
      throw error;
    }
  },

  createProvider: async (provider) => {
    try {
      // Preparar el body según el formato requerido por el endpoint
      const body = {
        razon_social: provider.razon_social,
        ruc: provider.ruc,
        telefono: provider.telefono || provider.contacto, // Usar contacto como teléfono si no hay teléfono explícito
        correo: provider.correo,
        direccion: provider.direccion,
        id_estado: provider.id_estado || 1,
        condiciones_pago: provider.condiciones_pago
      };

      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/provider/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('<!DOCTYPE html>')) {
          throw new Error('Problema de conexión con el servidor de Railway (404/500)');
        }
        // Manejar errores específicos de RUC o Correo duplicados según el texto del error
        if (errorText.toLowerCase().includes('ruc') || errorText.toLowerCase().includes('correo')) {
          throw new Error('El RUC o Correo ya se encuentra registrado');
        }
        throw new Error(errorText || `Error ${response.status}: No se pudo registrar el proveedor`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateProvider: async (id, provider) => {
    try {
      const response = await fetch(
        `https://faithful-healing-production-9e06.up.railway.app/api/provider/update/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(provider),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('<!DOCTYPE html>')) {
          throw new Error('Problema de conexión con el servidor de Railway (404/500)');
        }
        throw new Error(errorText || `Error ${response.status}: No se pudo actualizar el proveedor`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
