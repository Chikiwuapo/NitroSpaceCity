import { X, Calendar, Package, DollarSign } from 'lucide-react'

const OrderDetailModal = ({ isOpen, onClose, order }) => {
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

  if (!isOpen || !order) return null

  // Log para debug
  console.log('🔍 OrderDetailModal - Datos recibidos:', {
    proveedor: order.proveedor,
    id_proveedor: order.id_proveedor,
    detalle: order.detalle,
    detalleLength: order.detalle?.length
  })

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Detalle de Compra</h2>
            <p className="text-sm text-gray-600">Comprobante: {order.serie}-{order.nro_comprobante}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Proveedor</p>
            </div>
            <p className="font-semibold text-gray-800">{order.proveedor || 'Sin proveedor'}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Fecha de Compra</p>
            </div>
            <p className="font-semibold text-gray-800">{formatDate(order.fecha_compra)}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Moneda</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.id_moneda === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {order.id_moneda === 1 ? 'Soles (PEN)' : 'Dólares (USD)'}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehículos de la Compra</h3>
          {!order.detalle || order.detalle.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No hay vehículos registrados</p>
          ) : (
            <div className="space-y-4">
              {order.detalle.map((item, index) => (
                <div key={item.id_vehiculo || index} className="rounded-2xl bg-white p-4 border border-gray-200">
                  <div className="flex gap-4">
                    {item.url_img && (
                      <img 
                        src={item.url_img} 
                        alt={item.modelo}
                        className="w-20 h-16 rounded-lg object-cover border"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">
                        {item.marca && item.modelo ? `${item.marca} ${item.modelo}` : 'Vehículo'}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {item.anio && <p>Año: {item.anio}</p>}
                        {item.placa && <p>Placa: {item.placa}</p>}
                        <p>Cantidad: {item.cantidad}</p>
                        <p className="font-semibold text-[#0a332a]">Subtotal: {formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-[#0a332a]/5 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen Financiero</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IGV (18%)</span>
              <span className="font-medium">{formatCurrency(order.igv)}</span>
            </div>
            <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span className="text-[#0a332a]">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-[#0a332a] px-6 py-3 text-sm font-medium text-white hover:bg-[#0a332a]/90 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal