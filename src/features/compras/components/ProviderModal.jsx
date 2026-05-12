import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useNotificationSystem } from '../../notificaciones/hooks/useNotificationSystem'

const INITIAL_PROVIDER = {
  ruc: '',
  razon_social: '',
  direccion: '',
  contacto: '',
  correo: '',
  condiciones_pago: '',
}

const ProviderModal = ({ isOpen, onClose, onSave, editingProvider }) => {
  const [provider, setProvider] = useState(INITIAL_PROVIDER)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const { pushAlert } = useNotificationSystem()

  useEffect(() => {
    if (editingProvider) {
      setProvider(editingProvider)
    } else {
      setProvider(INITIAL_PROVIDER)
    }
    setErrors({})
  }, [editingProvider, isOpen])

  const validate = () => {
    const newErrors = {}
    if (!/^\d{11}$/.test(provider.ruc)) {
      newErrors.ruc = 'El RUC debe tener exactamente 11 dígitos numéricos'
    }
    if (!provider.razon_social.trim()) {
      newErrors.razon_social = 'La razón social es obligatoria'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(provider.correo)) {
      newErrors.correo = 'Ingrese un correo electrónico válido'
    }
    if (!provider.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria'
    }
    if (!provider.contacto.trim()) {
      newErrors.contacto = 'El contacto/teléfono es obligatorio'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setProvider((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      setIsSubmitting(true)
      await onSave(provider)
      
      if (editingProvider) {
        pushAlert('Actualización', 'Datos corregidos exitosamente', 'info')
      } else {
        pushAlert('Nuevo Proveedor', 'Proveedor registrado correctamente', 'success')
      }
      
      setProvider(INITIAL_PROVIDER)
      onClose()
    } catch (error) {
      console.error('Error saving provider:', error)
      let errorMsg = error.message;
      
      if (errorMsg.includes('<!DOCTYPE html>')) {
        errorMsg = 'Problema de conexión con el servidor de Railway (404/500)';
      }

      // Intentar identificar errores específicos para mostrarlos en el campo
      if (errorMsg.toLowerCase().includes('ruc') || errorMsg.toLowerCase().includes('correo')) {
        errorMsg = 'El RUC o Correo ya se encuentra registrado';
        if (errorMsg.toLowerCase().includes('ruc')) setErrors(prev => ({ ...prev, ruc: errorMsg }));
        if (errorMsg.toLowerCase().includes('correo')) setErrors(prev => ({ ...prev, correo: errorMsg }));
      }
      
      pushAlert('Error de Registro', errorMsg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
            <p className="text-sm text-gray-600">Registra la información básica del proveedor antes de crear órdenes de compra.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-gray-700">
              RUC *
              <input
                value={provider.ruc}
                onChange={(e) => handleChange('ruc', e.target.value)}
                placeholder="Ej. 20123456789"
                maxLength={11}
                className={`w-full rounded-2xl border ${errors.ruc ? 'border-red-500' : 'border-gray-200'} bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all`}
              />
              {errors.ruc && <p className="text-[10px] text-red-500 font-medium">{errors.ruc}</p>}
            </label>
            <label className="space-y-2 text-sm font-bold text-gray-700">
              Razón social *
              <input
                value={provider.razon_social}
                onChange={(e) => handleChange('razon_social', e.target.value)}
                placeholder="Nombre de la empresa"
                className={`w-full rounded-2xl border ${errors.razon_social ? 'border-red-500' : 'border-gray-200'} bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all`}
              />
              {errors.razon_social && <p className="text-[10px] text-red-500 font-medium">{errors.razon_social}</p>}
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-gray-700">
              Correo Electrónico *
              <input
                type="email"
                value={provider.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
                placeholder="ejemplo@empresa.com"
                className={`w-full rounded-2xl border ${errors.correo ? 'border-red-500' : 'border-gray-200'} bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all`}
              />
              {errors.correo && <p className="text-[10px] text-red-500 font-medium">{errors.correo}</p>}
            </label>
            <label className="space-y-2 text-sm font-bold text-gray-700">
              Contacto / Teléfono *
              <input
                value={provider.contacto}
                onChange={(e) => handleChange('contacto', e.target.value)}
                placeholder="Nombre o Teléfono"
                className={`w-full rounded-2xl border ${errors.contacto ? 'border-red-500' : 'border-gray-200'} bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all`}
              />
              {errors.contacto && <p className="text-[10px] text-red-500 font-medium">{errors.contacto}</p>}
            </label>
          </div>
          <label className="space-y-2 text-sm font-bold text-gray-700 block">
            Dirección *
            <input
              value={provider.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Dirección fiscal"
              className={`w-full rounded-2xl border ${errors.direccion ? 'border-red-500' : 'border-gray-200'} bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all`}
            />
            {errors.direccion && <p className="text-[10px] text-red-500 font-medium">{errors.direccion}</p>}
          </label>
          <label className="space-y-2 text-sm font-bold text-gray-700 block">
            Condiciones de pago
            <input
              value={provider.condiciones_pago}
              onChange={(e) => handleChange('condiciones_pago', e.target.value)}
              placeholder="Contado, crédito a 30 días, etc."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all"
            />
          </label>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="rounded-2xl bg-[#0a332a] px-8 py-3 text-sm font-bold text-white hover:bg-[#0a332a]/90 transition-all shadow-lg shadow-emerald-900/10 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingProvider ? 'Actualizar' : 'Guardar proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProviderModal
