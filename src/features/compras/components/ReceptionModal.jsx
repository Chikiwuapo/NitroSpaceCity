import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'

const ReceptionModal = ({ isOpen, onClose, order, onConfirm }) => {
  const [receptionData, setReceptionData] = useState(
    order?.items.map((item) => ({
      modelo: item.modelo,
      vin: '',
      estado_fisico: '',
    })) || []
  )

  const handleFieldChange = (index, field, value) => {
    setReceptionData((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleConfirm = () => {
    if (receptionData.some((item) => !item.vin || !item.estado_fisico)) {
      alert('Ingresa el VIN y el estado físico para cada unidad')
      return
    }

    onConfirm(receptionData)
    onClose()
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registrar Recepción</h2>
            <p className="text-sm text-gray-600">Confirma la llegada física y completa los VIN de cada vehículo.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 mb-6">
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Orden</p>
              <p className="mt-1 font-semibold text-gray-800">{order.nro_orden}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle className="w-4 h-4" /> Recepción pendiente
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {receptionData.map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="font-semibold text-gray-800 mb-3">{item.modelo || `Unidad ${index + 1}`}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  VIN real
                  <input
                    value={item.vin}
                    onChange={(e) => handleFieldChange(index, 'vin', e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Estado físico
                  <input
                    value={item.estado_fisico}
                    onChange={(e) => handleFieldChange(index, 'estado_fisico', e.target.value)}
                    placeholder="Ej. Perfecto, rayado leve, faltante de accesorios"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-gray-200 px-5 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-2xl bg-[#0a332a] px-5 py-3 text-sm font-medium text-white hover:bg-[#0a332a]/90 transition-all"
          >
            Confirmar recepción
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceptionModal