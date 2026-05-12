import { useState } from 'react'
import { X } from 'lucide-react'

const OrderDetailModal = ({ isOpen, onClose, order, onStartReception }) => {
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

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Detalle de Orden</h2>
            <p className="text-sm text-gray-600">Revisa la orden y confirma la recepción cuando los vehículos lleguen.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500 mb-1">Orden</p>
            <p className="font-semibold text-gray-800">{order.nro_orden}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500 mb-1">Proveedor</p>
            <p className="font-semibold text-gray-800">{order.proveedor}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500 mb-1">Entrega estimada</p>
            <p className="font-semibold text-gray-800">{formatDate(order.fecha_entrega)}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500 mb-1">Estado de entrega</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.estado_entrega)}`}>
              {order.estado_entrega}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehículos en la orden</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="rounded-2xl bg-white p-4 border border-gray-200">
                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <p className="font-semibold text-gray-800">{item.modelo || 'N/A'}</p>
                  <p>Año: {item.ano || 'N/A'}</p>
                  <p>Color: {item.color || 'N/A'}</p>
                  <p>Precio de costo: {formatCurrency(Number(item.precio) || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen financiero</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IGV</span>
              <span>{formatCurrency(order.igv)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-gray-200 px-5 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cerrar
          </button>
          {order.estado_entrega !== 'Entregado' && (
            <button
              type="button"
              onClick={() => onStartReception(order)}
              className="rounded-2xl bg-[#0a332a] px-5 py-3 text-sm font-medium text-white hover:bg-[#0a332a]/90 transition-all"
            >
              Registrar recepción
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal