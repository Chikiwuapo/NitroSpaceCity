import React, { useState, useEffect } from 'react'
import { X, CheckCircle2, Loader2, Camera } from 'lucide-react'
import { clientesApi } from '../services/clientesApi'

const ClienteForm = ({ isOpen, onClose, clienteToEdit, onSuccess }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [form, setForm] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    dni: '',
    telefono: '',
    correo: '',
    direccion: '',
    url_img: '',
  })

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10)
      if (clienteToEdit) {
        setForm({
          primer_nombre: clienteToEdit.primer_nombre || '',
          segundo_nombre: clienteToEdit.segundo_nombre || '',
          primer_apellido: clienteToEdit.primer_apellido || '',
          segundo_apellido: clienteToEdit.segundo_apellido || '',
          dni: clienteToEdit.dni || '',
          telefono: clienteToEdit.telefono || '',
          correo: clienteToEdit.correo || '',
          direccion: clienteToEdit.direccion || '',
          url_img: clienteToEdit.url_img || '',
        })
      } else {
        setForm({
          primer_nombre: '',
          segundo_nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          dni: '',
          telefono: '',
          correo: '',
          direccion: '',
          url_img: '',
        })
      }
    } else {
      setIsAnimating(false)
    }
  }, [isOpen, clienteToEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      
      if (clienteToEdit) {
        await clientesApi.updateCliente(clienteToEdit.id, form)
      } else {
        await clientesApi.createCliente(form)
      }

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
        onSuccess?.()
      }, 1500)
    } catch (error) {
      console.error('Error:', error)
      alert(`Error al ${clienteToEdit ? 'actualizar' : 'crear'} cliente`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-500 ease-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b flex justify-between items-center bg-[#0a332a] text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} />
            <h3 className="font-bold">{clienteToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {form.url_img ? (
                  <img src={form.url_img} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </div>
            <input
              type="text"
              placeholder="URL de la foto"
              className="mt-2 w-full border rounded-lg p-2 text-sm"
              value={form.url_img}
              onChange={(e) => setForm({ ...form, url_img: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Primer Nombre *</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                value={form.primer_nombre}
                onChange={(e) => setForm({ ...form, primer_nombre: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Segundo Nombre</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                value={form.segundo_nombre}
                onChange={(e) => setForm({ ...form, segundo_nombre: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Primer Apellido *</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                value={form.primer_apellido}
                onChange={(e) => setForm({ ...form, primer_apellido: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Segundo Apellido</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                value={form.segundo_apellido}
                onChange={(e) => setForm({ ...form, segundo_apellido: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">DNI *</label>
            <input
              type="text"
              required
              className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Contacto (Teléfono)</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Correo</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Dirección</label>
            <textarea
              className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a] resize-none"
              rows={3}
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0a332a] hover:bg-[#0d4438] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 size={20} />
              )}
              {isSubmitting ? 'Guardando...' : (clienteToEdit ? 'Actualizar Cliente' : 'Crear Cliente')}
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
            <CheckCircle2 className="text-green-200" />
            <span className="font-bold">¡{clienteToEdit ? 'Actualizado' : 'Creado'}!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClienteForm
