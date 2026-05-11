import { useState } from 'react'
import { X } from 'lucide-react'

const INITIAL_PROVIDER = {
  id: '',
  ruc: '',
  razon_social: '',
  direccion: '',
  contacto: '',
  condiciones_pago: '',
}

const ProviderModal = ({ isOpen, onClose, onSave }) => {
  const [provider, setProvider] = useState(INITIAL_PROVIDER)

  const handleChange = (field, value) => {
    setProvider((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!provider.ruc || !provider.razon_social || !provider.direccion || !provider.contacto) {
      alert('Completa los datos del proveedor')
      return
    }

    const newProvider = { ...provider, id: `prov-${Date.now()}` }
    onSave(newProvider)
    setProvider(INITIAL_PROVIDER)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Nuevo Proveedor</h2>
            <p className="text-sm text-gray-600">Registra la información básica del proveedor antes de crear órdenes de compra.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-700">
              RUC
              <input
                value={provider.ruc}
                onChange={(e) => handleChange('ruc', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Razón social
              <input
                value={provider.razon_social}
                onChange={(e) => handleChange('razon_social', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-700">
              Dirección
              <input
                value={provider.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Contacto
              <input
                value={provider.contacto}
                onChange={(e) => handleChange('contacto', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm text-gray-700">
            Condiciones de pago
            <input
              value={provider.condiciones_pago}
              onChange={(e) => handleChange('condiciones_pago', e.target.value)}
              placeholder="Contado, crédito a 30 días, etc."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#0a332a]"
            />
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-200 px-5 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button type="submit" className="rounded-2xl bg-[#0a332a] px-5 py-3 text-sm font-medium text-white hover:bg-[#0a332a]/90 transition-all">
              Guardar proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProviderModal