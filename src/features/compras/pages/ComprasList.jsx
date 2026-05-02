import { useState } from 'react'
import { ShoppingCart, CreditCard, Truck, Calendar, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { usePurchases } from '../hooks/usePurchases'

const ComprasList = () => {
  const { data: purchases, loading, error } = usePurchases()
  const [selectedPurchase, setSelectedPurchase] = useState(null)

  const statWidgets = [
    {
      title: 'Total Compras',
      value: purchases.length,
      icon: ShoppingCart,
      color: 'bg-[#0a332a]/10',
      iconColor: 'text-[#0a332a]',
    },
    {
      title: 'Compras Pagadas',
      value: purchases.filter(p => p.estado_pago === 'Pagado').length,
      icon: CreditCard,
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Compras Entregadas',
      value: purchases.filter(p => p.estado_entrega === 'Entregado').length,
      icon: Truck,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ]

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
    switch (status.toLowerCase()) {
      case 'pagado':
      case 'entregado':
        return 'bg-emerald-100 text-emerald-700'
      case 'pendiente':
        return 'bg-amber-100 text-amber-700'
      case 'en proceso':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPaymentIcon = (method) => {
    return <CreditCard className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-[#0a332a] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Compras</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statWidgets.map((widget, index) => {
          const Icon = widget.icon
          return (
            <div key={index} className="bg-white rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`${widget.color} p-4 rounded-2xl`}>
                  <Icon className={`w-6 h-6 ${widget.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{widget.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-800">{widget.value}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Identificación
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha y Pago
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Financiero
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estados
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedPurchase(purchase)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={purchase.img_url}
                        alt={purchase.modelo_auto}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{purchase.modelo_auto}</p>
                        <p className="text-sm text-gray-500">{purchase.tipo_vehiculo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {purchase.placa_auto}
                      </span>
                      <p className="text-sm text-gray-600">{purchase.nro_comprobante}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(purchase.fecha_compra)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getPaymentIcon(purchase.metodo_pago)}
                        <span>{purchase.metodo_pago}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-lg font-bold text-[#0a332a]">{formatCurrency(purchase.total)}</p>
                      <p className="text-xs text-gray-400">
                        Subtotal: {formatCurrency(purchase.subtotal)} | IGV: {formatCurrency(purchase.igv)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.estado_pago)}`}>
                        {purchase.estado_pago}
                      </span>
                      <br />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.estado_entrega)}`}>
                        {purchase.estado_entrega}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Detalle de Compra</h2>
                  <p className="text-gray-500">{selectedPurchase.nro_comprobante}</p>
                </div>
                <button
                  onClick={() => setSelectedPurchase(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedPurchase.img_url}
                  alt={selectedPurchase.modelo_auto}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <p className="text-xl font-bold text-gray-800">{selectedPurchase.modelo_auto}</p>
                  <p className="text-gray-500">{selectedPurchase.tipo_vehiculo}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                    {selectedPurchase.placa_auto}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Fecha de Compra</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedPurchase.fecha_compra)}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Fecha de Pago</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedPurchase.fecha_pago)}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Método de Pago</p>
                  <p className="font-semibold text-gray-800">{selectedPurchase.metodo_pago}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Estado de Pago</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPurchase.estado_pago)}`}>
                    {selectedPurchase.estado_pago}
                  </span>
                </div>
              </div>

              <div className="bg-[#0a332a]/5 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Desglose Financiero</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">{formatCurrency(selectedPurchase.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IGV (18%)</span>
                    <span className="font-medium text-gray-800">{formatCurrency(selectedPurchase.igv)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-[#0a332a]">{formatCurrency(selectedPurchase.total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPurchase(null)}
                  className="bg-[#0a332a] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#0a332a]/90 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComprasList
