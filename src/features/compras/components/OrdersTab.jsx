import { Plus, Calendar, ChevronRight } from 'lucide-react'

const OrdersTab = ({ orders, onNewOrder, onSelectOrder }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No disponible'
    return new Date(dateStr).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status) => {
    const normalized = (status || '').toLowerCase()
    switch (normalized) {
      case 'pagado':
      case 'entregado':
        return 'bg-emerald-100 text-emerald-700'
      case 'pendiente':
        return 'bg-amber-100 text-amber-700'
      case 'en camino':
      case 'en proceso':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Órdenes de Compra</h2>
          <p className="text-sm text-gray-600">Crea nuevas órdenes de compra para vehículos y gestiona el estado de cada pedido.</p>
        </div>
        <button
          type="button"
          onClick={onNewOrder}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0a332a] px-5 py-3 text-white hover:bg-[#0a332a]/90 transition-all"
        >
          <Plus className="w-4 h-4" /> Nueva Orden
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orden</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entrega estimada</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay órdenes de compra disponibles.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onSelectOrder(order)}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{order.nro_orden}</p>
                      <p className="text-sm text-gray-500">{order.isLocal ? 'Emitida internamente' : 'Importada'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{order.proveedor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.fecha_entrega)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800 font-semibold">{formatCurrency(order.total)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.estado_pago)}`}>
                          {order.estado_pago}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.estado_entrega)}`}>
                          {order.estado_entrega}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrdersTab