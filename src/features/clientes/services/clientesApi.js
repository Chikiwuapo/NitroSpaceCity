export const clientesApi = {
  getClientes: async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token, usuario no autenticado');
      }

      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/client/getAll',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }

      const data = await response.json();
      const lista = data.data || data;

      if (!Array.isArray(lista)) {
        throw new Error('La respuesta no es un array');
      }

      return lista.map((c) => ({
        id: c.id,
        primer_nombre: c.primer_nombre,
        segundo_nombre: c.segundo_nombre,
        primer_apellido: c.primer_apellido,
        segundo_apellido: c.segundo_apellido,
        nombre_completo: `${c.primer_nombre || ''} ${c.segundo_nombre || ''} ${c.primer_apellido || ''} ${c.segundo_apellido || ''}`.trim(),
        dni: c.dni,
        telefono: c.telefono,
        correo: c.correo,
        direccion: c.direccion,
        url_img: c.url_img,
      }));

    } catch (error) {
      throw error;
    }
  },

  createCliente: async (cliente) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token, usuario no autenticado');
      }

      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/client/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cliente),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData.message || responseData.error || 'Error al crear cliente';
        throw new Error(errorMsg);
      }

      return responseData;

    } catch (error) {
      console.error('❌ Error en createCliente:', error);
      throw error;
    }
  },

  updateCliente: async (id, cliente) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token, usuario no autenticado');
      }

      const response = await fetch(
        `https://faithful-healing-production-9e06.up.railway.app/api/client/update/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cliente),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar cliente');
      }

      return await response.json();

    } catch (error) {
      throw error;
    }
  },

  deleteCliente: async (id) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token, usuario no autenticado');
      }

      const response = await fetch(
        `https://faithful-healing-production-9e06.up.railway.app/api/client/delete/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar cliente');
      }

      return await response.json();

    } catch (error) {
      throw error;
    }
  }
};
