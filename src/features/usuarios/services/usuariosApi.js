export const usuariosApi = {
  getUsers: async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No hay token, usuario no autenticado')
      }

      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/user/getAll',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Manejo de error HTTP
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log('USUARIOS RESPONSE:', data)
const getRoleName = (id) => {
  switch (id) {
    case 1:
      return 'Administrador'
    case 2:
      return 'Empleado'
    case 3:
      return 'Mecánico'
    default:
      return 'Sin rol'
  }
}
const getStatusName = (id) => {
  return id === 1 ? 'Activo' : 'Inactivo'
}
      // Soporta distintas estructuras
      const lista = data.data || data

      if (!Array.isArray(lista)) {
        throw new Error('La respuesta no es un array')
      }

      return lista.map((u) => ({
        id: u.id,
        firstName: u.primer_nombre,
        secondName: u.segundo_nombre,
        lastName: `${u.primer_apellido} ${u.segundo_apellido || ''}`,
        dni: u.dni,
        phone: u.telefono,
        email: u.correo,
        role: getRoleName(u.id_rol),
        status: getStatusName(u.id_estado_usuario),
        photo: u.url_img,
      }))
    } catch (error) {
      console.error('Error en getUsers:', error)
      throw error
    }
  },
}