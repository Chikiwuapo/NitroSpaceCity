export const comprasApi = {
  getPurchases: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPurchases = [
          {
            id: 1,
            img_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop",
            modelo_auto: "Toyota Corolla",
            tipo_vehiculo: "Sedán",
            placa_auto: "ABC-123",
            nro_comprobante: "COMP-001234",
            fecha_compra: "2026-04-25",
            metodo_pago: "Tarjeta de Crédito",
            subtotal: 85000,
            igv: 14450,
            total: 99450,
            estado_pago: "Pagado",
            estado_entrega: "Entregado",
            fecha_pago: "2026-04-25"
          },
          {
            id: 2,
            img_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop",
            modelo_auto: "Ford Ranger",
            tipo_vehiculo: "Camioneta",
            placa_auto: "DEF-456",
            nro_comprobante: "COMP-001235",
            fecha_compra: "2026-04-26",
            metodo_pago: "Transferencia Bancaria",
            subtotal: 120000,
            igv: 20400,
            total: 140400,
            estado_pago: "Pendiente",
            estado_entrega: "En Proceso",
            fecha_pago: null
          },
          {
            id: 3,
            img_url: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400&h=400&fit=crop",
            modelo_auto: "Honda Civic",
            tipo_vehiculo: "Sedán",
            placa_auto: "GHI-789",
            nro_comprobante: "COMP-001236",
            fecha_compra: "2026-04-27",
            metodo_pago: "Efectivo",
            subtotal: 78000,
            igv: 13260,
            total: 91260,
            estado_pago: "Pagado",
            estado_entrega: "Entregado",
            fecha_pago: "2026-04-27"
          },
          {
            id: 4,
            img_url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=400&fit=crop",
            modelo_auto: "BMW X5",
            tipo_vehiculo: "SUV",
            placa_auto: "JKL-012",
            nro_comprobante: "COMP-001237",
            fecha_compra: "2026-04-28",
            metodo_pago: "Tarjeta de Crédito",
            subtotal: 250000,
            igv: 42500,
            total: 292500,
            estado_pago: "Pagado",
            estado_entrega: "En Proceso",
            fecha_pago: "2026-04-28"
          },
          {
            id: 5,
            img_url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=400&fit=crop",
            modelo_auto: "Chevrolet Spark",
            tipo_vehiculo: "Hatchback",
            placa_auto: "MNO-345",
            nro_comprobante: "COMP-001238",
            fecha_compra: "2026-04-29",
            metodo_pago: "Transferencia Bancaria",
            subtotal: 45000,
            igv: 7650,
            total: 52650,
            estado_pago: "Pendiente",
            estado_entrega: "Pendiente",
            fecha_pago: null
          }
        ];
        resolve(mockPurchases);
      }, 1000);
    });
  }
};
