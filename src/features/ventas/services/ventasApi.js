export const ventasApi = {
  getSales: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSales = [
          {
            id: 1,
            cliente: {
              id: 1,
              nombre_completo: 'Carlos Alberto García Pérez',
              img_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
            },
            usuario: 'Juan Pérez',
            tipo_comprobante: 'Factura',
            serie: 'F001',
            numero_comprobante: '0001234',
            fecha_venta: '2026-04-25',
            estado_pago: 'Pagado',
            estado_entrega: 'Entregado',
            subtotal: 85000,
            igv: 14450,
            total: 99450,
            vehiculo: {
              modelo: 'Toyota Corolla',
              tipo: 'Sedán'
            },
            detalle: [
              { id: 1, descripcion: 'Vehículo Toyota Corolla', cantidad: 1, precio_unitario: 85000, subtotal: 85000 }
            ]
          },
          {
            id: 2,
            cliente: {
              id: 2,
              nombre_completo: 'María Fernanda López Silva',
              img_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
            },
            usuario: 'María González',
            tipo_comprobante: 'Boleta',
            serie: 'B001',
            numero_comprobante: '0005678',
            fecha_venta: '2026-04-26',
            estado_pago: 'Pendiente',
            estado_entrega: 'En Camino',
            subtotal: 120000,
            igv: 20400,
            total: 140400,
            vehiculo: {
              modelo: 'Ford Ranger',
              tipo: 'Camioneta'
            },
            detalle: [
              { id: 2, descripcion: 'Vehículo Ford Ranger', cantidad: 1, precio_unitario: 120000, subtotal: 120000 }
            ]
          },
          {
            id: 3,
            cliente: {
              id: 3,
              nombre_completo: 'José Luis Rodríguez',
              img_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
            },
            usuario: 'Carlos Díaz',
            tipo_comprobante: 'Factura',
            serie: 'F001',
            numero_comprobante: '0001235',
            fecha_venta: '2026-04-27',
            estado_pago: 'Pagado',
            estado_entrega: 'Entregado',
            subtotal: 78000,
            igv: 13260,
            total: 91260,
            vehiculo: {
              modelo: 'Honda Civic',
              tipo: 'Sedán'
            },
            detalle: [
              { id: 3, descripcion: 'Vehículo Honda Civic', cantidad: 1, precio_unitario: 78000, subtotal: 78000 }
            ]
          },
          {
            id: 4,
            cliente: {
              id: 4,
              nombre_completo: 'Ana Martínez',
              img_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
            },
            usuario: 'Juan Pérez',
            tipo_comprobante: 'Boleta',
            serie: 'B001',
            numero_comprobante: '0005679',
            fecha_venta: '2026-04-28',
            estado_pago: 'Pagado',
            estado_entrega: 'En Camino',
            subtotal: 250000,
            igv: 42500,
            total: 292500,
            vehiculo: {
              modelo: 'BMW X5',
              tipo: 'SUV'
            },
            detalle: [
              { id: 4, descripcion: 'Vehículo BMW X5', cantidad: 1, precio_unitario: 250000, subtotal: 250000 }
            ]
          },
          {
            id: 5,
            cliente: {
              id: 5,
              nombre_completo: 'Pedro Pablo González Rojas',
              img_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
            },
            usuario: 'María González',
            tipo_comprobante: 'Factura',
            serie: 'F001',
            numero_comprobante: '0001236',
            fecha_venta: '2026-04-29',
            estado_pago: 'Pendiente',
            estado_entrega: 'Pendiente',
            subtotal: 45000,
            igv: 7650,
            total: 52650,
            vehiculo: {
              modelo: 'Chevrolet Spark',
              tipo: 'Hatchback'
            },
            detalle: [
              { id: 5, descripcion: 'Vehículo Chevrolet Spark', cantidad: 1, precio_unitario: 45000, subtotal: 45000 }
            ]
          }
        ];
        resolve(mockSales);
      }, 1000);
    });
  }
};
