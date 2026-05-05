import React, { useState } from 'react'
import { X, CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { usuariosApi } from '../services/usuariosApi'

const RegistrarUsuario = ({ isOpen, onClose, onUserAdded }) => {
  const [submitting, setSubmitting] = useState(false)
  // Estado para la notificación personalizada
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
  
  const [formData, setFormData] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    dni: '',
    correo: '',
    telefono: '',
    url_img: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    direccion: '',
    id_estado_usuario: 1,
    id_rol: 2, 
    contrasena: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    if (type === 'success') {
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' })
        if (onUserAdded) onUserAdded()
        onClose()
      }, 2000)
    } else {
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await usuariosApi.registerUser(formData)
      showToast('¡Usuario registrado con éxito!', 'success')
    } catch (error) {
      showToast('Error: ' + error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {notification.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in zoom-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            notification.type === 'success' 
              ? 'bg-white border-emerald-100 text-emerald-800' 
              : 'bg-white border-red-100 text-red-800'
          }`}>
            {notification.type === 'success' 
              ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> 
              : <AlertCircle className="text-red-500 w-6 h-6" />
            }
            <span className="font-bold">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Registrar Usuario</h2>
            <p className="text-sm text-gray-500">Complete los datos del personal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Documento de Identidad (DNI)</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input 
                required name="dni" value={formData.dni} onChange={handleChange} maxLength={8}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]" 
                placeholder="Ingrese 8 dígitos"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Primer Nombre</label>
              <input required name="primer_nombre" value={formData.primer_nombre} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Segundo Nombre</label>
              <input name="segundo_nombre" value={formData.segundo_nombre} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Apellido Paterno</label>
              <input required name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Apellido Materno</label>
              <input name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Correo Electrónico</label>
            <input required type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]" placeholder="ejemplo@correo.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Teléfono</label>
              <input name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]" placeholder="921..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Rol</label>
              <select name="id_rol" value={formData.id_rol} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none bg-white focus:ring-2 focus:ring-[#0a332a]">
                <option value={1}>Administrador</option>
                <option value={2}>Empleado</option>
                <option value={3}>Mecánico</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Contraseña Temporal</label>
            <input required type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]" />
          </div>

          <div className="pt-6 grid grid-cols-2 gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 border rounded-2xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-3 bg-[#0a332a] text-white rounded-2xl font-semibold shadow-lg disabled:bg-gray-400 flex justify-center items-center transition-transform active:scale-95"
            >
              {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default RegistrarUsuario