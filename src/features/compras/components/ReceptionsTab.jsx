import { Calendar } from 'lucide-react'

const ReceptionsTab = ({ orders, onStartReception }) => {
  const availableReceptionOrders = orders.filter((order) => order.estado_entrega !== 'Entregado')

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
          <h2 className="text-2xl font-bold text-gray-800">Registrar Recepción</h2>
          <p className="text-sm text-gray-600">Confirma la llegada física de los vehículos y actualiza el estado de las órdenes.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orden</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entrega estimada</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {availableReceptionOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay órdenes pendientes de recepción.
                  </td>
                </tr>
              ) : (
                availableReceptionOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{order.nro_orden}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{order.proveedor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.fecha_entrega)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.estado_entrega)}`}>
                        {order.estado_entrega}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => onStartReception(order)}
                        className="rounded-2xl bg-[#0a332a] px-4 py-2 text-sm text-white hover:bg-[#0a332a]/90 transition-all"
                      >
                        Registrar recepción
                      </button>
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

export default ReceptionsTab