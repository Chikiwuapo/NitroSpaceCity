const BASE_URL = 'https://faithful-healing-production-9e06.up.railway.app/api/user';
const RENIEC_API = 'https://api.decolecta.com/v1/reniec/dni';
const RENIEC_TOKEN = 'sk_11607.v8AuHbEp1AxHXqNCwewVivIdmG2b82m8';

export const usuariosApi = {

  getUsers: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Sesión expirada. Por favor, inicia sesión.");

      const response = await fetch(`${BASE_URL}/getAll`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });

      if (!response.ok) throw new Error(`Error ${response.status}: No autorizado`);
      
      const data = await response.json();
      const lista = data.data || data;

      return lista.map((u) => ({
        id: u.id,
        firstName: u.primer_nombre,
        secondName: u.segundo_nombre || '',
        lastName: `${u.primer_apellido} ${u.segundo_apellido || ''}`,
        dni: u.dni,
        phone: u.telefono,
        email: u.correo,
        role: u.id_rol === 1 ? 'Administrador' : u.id_rol === 2 ? 'Empleado' : 'Mecánico',
        status: u.id_estado_usuario === 1 ? 'Activo' : 'Inactivo',
        photo: u.url_img,
      }));
    } catch (error) {
      console.error('Error en getUsers:', error);
      throw error;
    }
  },

  registerUser: async (userData) => {
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        ...userData,
        id_rol: Number(userData.id_rol),
        id_estado_usuario: Number(userData.id_estado_usuario)
      };

      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      // Si el backend responde con error pero formato JSON
      if (!response.ok) {
        throw new Error(result.message || result.error || 'Error en el registro');
      }
      
      return result;
    } catch (error) {
      console.error('Error en registerUser:', error);
      throw error;
    }
  },

  // 3. CONSULTA RENIEC
  fetchDniData: async (dni) => {
    try {
      const response = await fetch(`${RENIEC_API}?numero=${dni}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${RENIEC_TOKEN}`
        }
      });

      if (!response.ok) throw new Error('DNI no encontrado');

      const data = await response.json();
      
      return {
        nombres: data.data.nombres || '', 
        apellidoPaterno: data.data.apellido_paterno || '',
        apellidoMaterno: data.data.apellido_materno || ''
      };

    } catch (error) {
      // Manejo silencioso de CORS para no asustar al usuario
      if (error.name === 'TypeError') {
        throw new Error('La consulta automática no está disponible (CORS). Ingrese los datos manualmente.');
      }
      throw error;
    }
  }
};