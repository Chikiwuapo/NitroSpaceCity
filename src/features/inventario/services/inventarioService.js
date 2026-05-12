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

      // Unificamos el mapeo para que sea seguro y completo
      return data.map((v) => {
        const urlImagenDefecto = 'https://via.placeholder.com/150?text=Auto';

        // Sanitiza la URL: solo acepta URLs absolutas (http/https). 
        // Paths relativos como "car1.jpg" o URLs mal formadas se reemplazan con el placeholder.
        const rawImg = v.url_img || '';
        const urlImagen = rawImg.startsWith('http://') || rawImg.startsWith('https://')
          ? rawImg
          : urlImagenDefecto;
        
        return {
          id: v.id,
          
          // Marca: Prioriza la relación anidada, luego el campo directo
          marca: v.modelo?.marca?.nombre || v.modelo?.marca || v.marca?.nombre || v.marca || 'Sin marca',
          
          // Modelo
          modelo: v.modelo?.nombre || v.modelo || 'Sin modelo',
          
          // Imagen: Se asegura de tener ambos nombres de propiedad por compatibilidad
          url_img: urlImagen,
          imagen: urlImagen,

          // Números: Forzamos a Number para evitar errores en cálculos o inputs
          precio_u: Number(v.precio_u || 0),
          precio: Number(v.precio_u || 0), // Alias usado en la segunda versión
          stock: Number(v.stock || 0),
          anio: v.anio,
          kilometraje: Number(v.kilometraje || 0),
          nro_puertas: Number(v.nro_puertas || 4),
          
          // Texto y Enums
          color: v.color || 'No especificado',
          tipo_combustible: v.tipo_combustible || 'Gasolina',
          transmision: v.transmision === 'Automatica' ? 'Automatica' : 'Mecánica',
          placa: v.placa || `PLACA-${v.id}`,
          
          // IDs (Cruciales para Update/Put)
          id_modelo: Number(v.id_modelo),
          id_tipo_vehiculo: Number(v.id_tipo_vehiculo),
          id_estado_vehiculo: Number(v.id_estado_vehiculo),
          id_estado_vehiculo_venta: Number(v.id_estado_vehiculo_venta),

          // Lógica de nombres de Estado (con fallback manual si el backend no envía el objeto)
          estado_vehiculo: v.estadoVehiculo?.nombre || (
            Number(v.id_estado_vehiculo) === 1 ? 'Nuevo' :
            Number(v.id_estado_vehiculo) === 2 ? 'Seminuevo' :
            Number(v.id_estado_vehiculo) === 3 ? 'Usado' : 'Sin estado'
          ),

          estado_vehiculo_venta: v.estadoVehiculoVenta?.nombre || (
            Number(v.id_estado_vehiculo_venta) === 1 ? 'Disponible' :
            Number(v.id_estado_vehiculo_venta) === 2 ? 'No disponible' :
            Number(v.id_estado_vehiculo_venta) === 3 ? 'Vendido' : 'Sin estado'
          ),

          tipo: v.tipoVehiculo?.nombre || v.tipo || 'Sin tipo'
        };
      });

    } catch (error) {
      console.error("Error en getInventario:", error);
      throw error;
    }
  },

  createVehiculo: async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch('https://faithful-healing-production-9e06.up.railway.app/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al registrar vehículo');
    return await response.json();
  },

  updateVehiculo: async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://faithful-healing-production-9e06.up.railway.app/api/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar vehículo');
    return await response.json();
  }
};