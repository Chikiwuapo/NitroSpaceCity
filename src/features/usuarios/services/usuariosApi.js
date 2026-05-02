export const usuariosApi = {
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUsers = [
          {
            id: 1,
            primer_nombre: 'Juan',
            segundo_nombre: 'Carlos',
            primer_apellido: 'Pérez',
            segundo_apellido: 'García',
            dni: '71234567',
            correo: 'juan.perez@autovalor.com',
            telefono: '+51 987 654 321',
            rol: 'Administrador',
            estado_usuario: 'Activo',
            url_img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
          },
          {
            id: 2,
            primer_nombre: 'María',
            segundo_nombre: 'Fernanda',
            primer_apellido: 'López',
            segundo_apellido: 'Silva',
            dni: '72345678',
            correo: 'maria.lopez@autovalor.com',
            telefono: '+51 912 345 678',
            rol: 'Vendedor',
            estado_usuario: 'Activo',
            url_img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
          },
          {
            id: 3,
            primer_nombre: 'José',
            segundo_nombre: 'Luis',
            primer_apellido: 'Rodríguez',
            segundo_apellido: '',
            dni: '73456789',
            correo: 'jose.rodriguez@autovalor.com',
            telefono: '+51 923 456 789',
            rol: 'Vendedor',
            estado_usuario: 'Inactivo',
            url_img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
          },
          {
            id: 4,
            primer_nombre: 'Ana',
            segundo_nombre: '',
            primer_apellido: 'Martínez',
            segundo_apellido: '',
            dni: '74567890',
            correo: 'ana.martinez@autovalor.com',
            telefono: '+51 934 567 890',
            rol: 'Contador',
            estado_usuario: 'Activo',
            url_img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
          },
          {
            id: 5,
            primer_nombre: 'Pedro',
            segundo_nombre: 'Pablo',
            primer_apellido: 'González',
            segundo_apellido: 'Rojas',
            dni: '75678901',
            correo: 'pedro.gonzalez@autovalor.com',
            telefono: '+51 945 678 901',
            rol: 'Jefe de Ventas',
            estado_usuario: 'Activo',
            url_img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
          }
        ];
        resolve(mockUsers);
      }, 1000);
    });
  }
};
