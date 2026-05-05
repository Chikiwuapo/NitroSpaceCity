export const inventarioApi = {
  getInventario: async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token, usuario no autenticado');
      }

      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/vehicles',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener vehículos');
      }

      const data = await response.json();

return data.map((v) => ({
  id: v.id,

  // 🔥 MARCA
  marca:
    v.modelo?.marca?.nombre ||
    v.modelo?.marca ||
    v.marca?.nombre ||
    v.marca ||
    '',

  // 🔥 MODELO
  modelo:
    v.modelo?.nombre ||
    v.modelo ||
    '',

  // 🔥 ESTADO
  estado:
    v.estadoVehiculoVenta?.nombre ||
    v.estadoVehiculo?.nombre ||
    v.estado ||
    'Disponible',

  tipo: v.tipoVehiculo?.nombre || v.tipo || '',

  transmision: v.transmision,
  combustible: v.tipo_combustible,
  imagen: v.url_img,

  precio: v.precio_u,
  stock: v.stock,
  anio: v.anio,
  color: v.color,
  placa: v.placa || `PLACA-${v.id}`,
}));

    } catch (error) {
      throw error;
    }
  }
};