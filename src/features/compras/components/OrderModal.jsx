import { useState, useEffect } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { useNotificationSystem } from '../../notificaciones/hooks/useNotificationSystem'
import { inventarioApi } from '../../inventario/services/inventarioService'

const INITIAL_ORDER = {
  serie: 'F001',
  nro_comprobante: '',
  id_proveedor: '',
  id_moneda: 1,
  id_estado_pago: 1,
  id_tipo_comprobante: 1,
  vehiculos: [{ id_vehiculo: '', cantidad: 1, subtotal: 0 }],
}

const OrderModal = ({ isOpen, onClose, onSave, providers }) => {
  const [order, setOrder] = useState(INITIAL_ORDER)
  const [availableVehicles, setAvailableVehicles] = useState([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { pushAlert } = useNotificationSystem()

  useEffect(() => {
    if (isOpen) {
      const fetchVehicles = async () => {
        try {
          setIsLoadingVehicles(true)
          const data = await inventarioApi.getInventario()
          setAvailableVehicles(data)
        } catch (error) {
          console.error('Error fetching vehicles:', error)
          pushAlert('Error', 'No se pudieron cargar los vehículos del inventario', 'error')
        } finally {
          setIsLoadingVehicles(false)
        }
      }
      fetchVehicles()
    } else {
      setOrder(INITIAL_ORDER)
    }
  }, [isOpen])

  const handleChange = (field, value) => {
    setOrder((prev) => ({ ...prev, [field]: value }))
  }

  const handleVehicleChange = (index, field, value) => {
    setOrder((prev) => {
      const nextVehicles = [...prev.vehiculos]
      nextVehicles[index] = { ...nextVehicles[index], [field]: value }
      return { ...prev, vehiculos: nextVehicles }
    })
  }

  const addVehicleRow = () => {
    setOrder((prev) => ({
      ...prev,
      vehiculos: [...prev.vehiculos, { id_vehiculo: '', cantidad: 1, subtotal: 0 }],
    }))
  }

  const removeVehicleRow = (index) => {
    setOrder((prev) => ({
      ...prev,
      vehiculos: prev.vehiculos.filter((_, i) => i !== index),
    }))
  }

  const computedSubtotal = order.vehiculos.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0)
  const computedIgv = Number((computedSubtotal * 0.18).toFixed(2))
  const computedTotal = Number((computedSubtotal + computedIgv).toFixed(2))

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!order.id_proveedor) {
      alert('Selecciona un proveedor')
      return
    }
    if (!order.nro_comprobante) {
      alert('Ingresa el número de comprobante')
      return
    }
    if (order.vehiculos.some(v => !v.id_vehiculo || v.cantidad <= 0 || v.subtotal <= 0)) {
      alert('Completa correctamente los datos de los vehículos')
      return
    }

    try {
      setIsSubmitting(true)
      pushAlert('Intentando Registro', 'Enviando datos al servidor...', 'info')
      
      const purchaseData = {
        serie: order.serie,
        nro_comprobante: order.nro_comprobante,
        subtotal: computedSubtotal,
        igv: computedIgv,
        total: computedTotal,
        id_moneda: Number(order.id_moneda),
        id_estado_pago: Number(order.id_estado_pago),
        id_proveedor: order.id_proveedor,
        id_tipo_comprobante: Number(order.id_tipo_comprobante),
        vehiculos: order.vehiculos.map(v => ({
          id_vehiculo: v.id_vehiculo,
          cantidad: Number(v.cantidad),
          subtotal: Number(v.subtotal)
        }))
      }

      await onSave(purchaseData)
      pushAlert('Compra Registrada', 'Stock actualizado y compra guardada', 'success')
      onClose()
    } catch (error) {
      console.error('Error saving order:', error)
      
      let cleanMessage = error.message;
      if (cleanMessage.includes('<!DOCTYPE html>')) {
        cleanMessage = 'Problema de conexión con el servidor de Railway (404/500)';
      }
      
      pushAlert('Error de Registro', cleanMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[32px] bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registrar Compra de Vehículos</h2>
            <p className="text-sm text-gray-600">Al registrar esta compra, el stock de los vehículos aumentará automáticamente.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-3">
            <label className="space-y-2 text-sm font-bold text-gray-700">
              Proveedor *
              <select
                value={order.id_proveedor}
                onChange={(e) => handleChange('id_proveedor', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all"
              >
                <option value="">Seleccionar proveedor</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.razon_social}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-bold text-gray-700">
              Serie
              <input
                value={order.serie}
                onChange={(e) => handleChange('serie', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all"
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-gray-700">
              N° Comprobante *
              <input
                value={order.nro_comprobante}
                onChange={(e) => handleChange('nro_comprobante', e.target.value)}
                placeholder="0000050"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="space-y-2 text-sm font-bold text-gray-700">
              Moneda
              <select
                value={order.id_moneda}
                onChange={(e) => handleChange('id_moneda', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all"
              >
                <option value={1}>Soles (S/)</option>
                <option value={2}>Dólares ($)</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-bold text-gray-700">
              Estado de Pago
              <select
                value={order.id_estado_pago}
                onChange={(e) => handleChange('id_estado_pago', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all"
              >
                <option value={1}>Pagado</option>
                <option value={2}>Pendiente</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-bold text-gray-700">
              Tipo Comprobante
              <select
                value={order.id_tipo_comprobante}
                onChange={(e) => handleChange('id_tipo_comprobante', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all"
              >
                <option value={1}>Factura</option>
                <option value={2}>Boleta</option>
              </select>
            </label>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-gray-50/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Detalle de Vehículos</h3>
              <button
                type="button"
                onClick={addVehicleRow}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0a332a] px-4 py-2 text-xs font-bold text-white hover:bg-[#0a332a]/90 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Añadir Vehículo
              </button>
            </div>

            <div className="space-y-4">
              {order.vehiculos.map((v, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-12 items-end bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group">
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Vehículo *</label>
                    <select
                      value={v.id_vehiculo}
                      onChange={(e) => handleVehicleChange(index, 'id_vehiculo', e.target.value)}
                      className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0a332a]"
                    >
                      <option value="">Seleccionar vehículo</option>
                      {availableVehicles.map(veh => (
                        <option key={veh.id} value={veh.id}>{veh.marca} {veh.modelo} - {veh.placa}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Cant *</label>
                    <input
                      type="number"
                      value={v.cantidad}
                      onChange={(e) => handleVehicleChange(index, 'cantidad', e.target.value)}
                      className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0a332a]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Subtotal (S/) *</label>
                    <input
                      type="number"
                      value={v.subtotal}
                      onChange={(e) => handleVehicleChange(index, 'subtotal', e.target.value)}
                      className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0a332a]"
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-center">
                    {order.vehiculos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVehicleRow(index)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-[#0a332a] rounded-[32px] text-white">
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-emerald-400/60 mb-1">Subtotal</p>
                <p className="text-xl font-bold">S/ {computedSubtotal.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-emerald-400/60 mb-1">IGV (18%)</p>
                <p className="text-xl font-bold">S/ {computedIgv.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-emerald-400/60 mb-1">Monto Total</p>
              <p className="text-4xl font-black text-white tracking-tight">S/ {computedTotal.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-200 px-8 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || isLoadingVehicles}
              className="rounded-2xl bg-[#0a332a] px-10 py-3 text-sm font-bold text-white hover:bg-[#0a332a]/90 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Registrar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderModal