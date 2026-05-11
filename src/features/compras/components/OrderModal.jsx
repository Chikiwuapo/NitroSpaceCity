import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const INITIAL_ORDER = {
  id: '',
  nro_orden: '',
  proveedorId: '',
  proveedor: '',
  fecha_entrega: '',
  metodo_pago: 'Contado',
  items: [{ modelo: '', ano: '', color: '', precio: '' }],
  estado_pago: 'Pendiente',
  estado_entrega: 'Pendiente',
  subtotal: 0,
  igv: 0,
  total: 0,
  isLocal: true,
}

const OrderModal = ({ isOpen, onClose, onSave, providers }) => {
  const [order, setOrder] = useState(INITIAL_ORDER)

  const handleChange = (field, value) => {
    setOrder((prev) => ({ ...prev, [field]: value }))
  }

  const handleVehicleChange = (index, field, value) => {
    setOrder((prev) => {
      const nextItems = [...prev.items]
      nextItems[index] = { ...nextItems[index], [field]: value }
      return { ...prev, items: nextItems }
    })
  }

  const addVehicleRow = () => {
    setOrder((prev) => ({
      ...prev,
      items: [...prev.items, { modelo: '', ano: '', color: '', precio: '' }],
    }))
  }

  const removeVehicleRow = (index) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const computedSubtotal = order.items.reduce((acc, item) => acc + (Number(item.precio) || 0), 0)
  const computedIgv = Number((computedSubtotal * 0.18).toFixed(2))
  const computedTotal = Number((computedSubtotal + computedIgv).toFixed(2))

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const provider = providers.find((item) => item.id === order.proveedorId)
    if (!provider) {
      alert('Selecciona un proveedor válido')
      return
    }

    if (!order.fecha_entrega) {
      alert('Indica la fecha estimada de entrega')
      return
    }

    if (order.items.some((item) => !item.modelo || !item.ano || !item.color || !item.precio)) {
      alert('Completa los datos de todos los vehículos')
      return
    }

    const newOrder = {
      ...order,
      id: `loc-${Date.now()}`,
      nro_orden: `OC-${Date.now()}`,
      proveedor: provider.razon_social,
      subtotal: computedSubtotal,
      igv: computedIgv,
      total: computedTotal,
      estado_pago: 'Pendiente',
      estado_entrega: 'Pendiente',
      isLocal: true,
    }

    onSave(newOrder)
    setOrder(INITIAL_ORDER)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Nueva Orden de Compra</h2>
            <p className="text-sm text-gray-600">Configura el proveedor, los vehículos y el pago para emitir la orden.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-700">
              Proveedor
              <select
                value={order.proveedorId}
                onChange={(e) => handleChange('proveedorId', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
              >
                <option value="">Selecciona un proveedor</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.razon_social}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Fecha de entrega estimada
              <input
                type="date"
                value={order.fecha_entrega}
                onChange={(e) => handleChange('fecha_entrega', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-gray-700">
            Forma de pago acordada
            <input
              value={order.metodo_pago}
              onChange={(e) => handleChange('metodo_pago', e.target.value)}
              placeholder="Contado, crédito, transferencia"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
            />
          </label>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Vehículos</h3>
                <p className="text-sm text-gray-600">Agrega cada unidad con modelo, año, color y precio de costo.</p>
              </div>
              <button
                type="button"
                onClick={addVehicleRow}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0a332a] px-4 py-2 text-sm text-white hover:bg-[#0a332a]/90 transition-all"
              >
                <Plus className="w-4 h-4" /> Añadir vehículo
              </button>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-sm font-semibold text-gray-800">Vehículo {index + 1}</span>
                    {order.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVehicleRow(index)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-all"
                      >
                        <X className="w-4 h-4" /> Eliminar
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <label className="space-y-2 text-sm text-gray-700">
                      Modelo
                      <input
                        value={item.modelo}
                        onChange={(e) => handleVehicleChange(index, 'modelo', e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-700">
                      Año
                      <input
                        value={item.ano}
                        onChange={(e) => handleVehicleChange(index, 'ano', e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-700">
                      Color
                      <input
                        value={item.color}
                        onChange={(e) => handleVehicleChange(index, 'color', e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-700">
                      Precio de costo
                      <input
                        type="number"
                        value={item.precio}
                        onChange={(e) => handleVehicleChange(index, 'precio', e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex flex-col gap-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(computedSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IGV (18%)</span>
                <span>{formatCurrency(computedIgv)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900">
                <span>Total estimado</span>
                <span>{formatCurrency(computedTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-200 px-5 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button type="submit" className="rounded-2xl bg-[#0a332a] px-5 py-3 text-sm font-medium text-white hover:bg-[#0a332a]/90 transition-all">
              Emitir Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderModal