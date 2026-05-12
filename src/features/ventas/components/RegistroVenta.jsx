import { useState, useEffect } from 'react'
import { X, Plus, Trash2, CheckCircle2, Search, ShoppingCart, Info, User } from 'lucide-react'
import AgregarCarro from './AgregarCarro'
import ClienteSelector from './ClienteSelector'
import { ventasApi } from '../services/ventasApi'
import { Modal } from '../../../shared'
import { useNotificationSystem } from '../../notificaciones/hooks/useNotificationSystem'

const IGV_RATE = 0.18

const RegistrarVenta = ({ isOpen, onClose, onSuccess }) => {
  const { pushAlert } = useNotificationSystem()
  const [showSuccess, setShowSuccess] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAgregarModalOpen, setIsAgregarModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([])
  const [showStockModal, setShowStockModal] = useState(false)
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })

  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    serie: 'F001',
    numero: '',
    vendedor: user.primer_nombre ? `${user.primer_nombre} ${user.primer_apellido || ''}` : 'Administrador',
    metodoPago: 'Contado',
    observacion: '',
    id_estado_pago: 1,
    id_tipo_comprobante: 1
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      document.body.style.overflow = 'unset';
      setIsAnimating(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        fecha: new Date().toISOString().split('T')[0],
        serie: 'F001',
        numero: '',
        vendedor: 'Administrador',
        metodoPago: 'Contado',
        observacion: ''
      })
      setSelectedCliente(null)
      setVehiculosSeleccionados([])
    }
  }, [isOpen])

  const manejarSeleccionVehiculo = (vehiculo) => {
    if (vehiculosSeleccionados.find(v => v.id === vehiculo.id)) {
      alert("Este vehículo ya ha sido agregado a la lista.")
      return
    }
    
    if (vehiculo.stock < 1) {
      setShowStockModal(true)
      return
    }
    
    setVehiculosSeleccionados([...vehiculosSeleccionados, { ...vehiculo, cantidad: 1, descuento: 0 }])
    setIsAgregarModalOpen(false) 
  }

  const eliminarVehiculo = (id) => {
    setVehiculosSeleccionados(prev => prev.filter(v => v.id !== id))
  }

  const subtotal = vehiculosSeleccionados.reduce((acc, v) => acc + (v.precio * v.cantidad), 0)
  const descuentoTotal = vehiculosSeleccionados.reduce((acc, v) => acc + (v.descuento || 0), 0)
  const baseImponible = subtotal - descuentoTotal
  const igv = baseImponible * IGV_RATE
  const total = baseImponible + igv

  const handleSubmit = async () => {
    if (!selectedCliente) {
      alert('Por favor seleccione un cliente')
      return
    }
    if (vehiculosSeleccionados.length === 0) {
      alert('Por favor agregue al menos un vehículo')
      return
    }
    if (!form.numero) {
      alert('Por favor ingrese el número de comprobante')
      return
    }

    try {
      setIsSubmitting(true)
      
      const ventaData = {
        id_cliente: selectedCliente.id,
        cliente_id: selectedCliente.id,
        serie: form.serie,
        numero_comprobante: form.numero,
        nro_comprobante: form.numero,
        fecha_venta: form.fecha,
        observacion: form.observacion,
        metodo_pago: form.metodoPago,
        subtotal: subtotal,
        igv: igv,
        total: total,
        id_estado_pago: form.id_estado_pago,
        id_tipo_comprobante: form.id_tipo_comprobante,
        id_usuario: user.id,
        vehiculos: vehiculosSeleccionados.map(v => ({
          id_vehiculo: v.id,
          cantidad: v.cantidad,
          subtotal: v.precio * v.cantidad
        }))
      }

      const response = await ventasApi.createVenta(ventaData)
      
      // Extraer ID del comprobante o usar el número ingresado
      const saleId = response?.data?.numero_comprobante || form.numero;
      pushAlert('Venta Exitosa', `Se registró la boleta ${form.serie}-${saleId}`, 'success');
      
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error('Error al registrar venta:', error)
      alert(`Error al registrar la venta: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-black/40 transition-opacity duration-300">
      
      <div 
        className={`bg-[#f8fafb] w-full max-w-6xl h-full shadow-2xl transform transition-transform duration-500 ease-out flex flex-col
        ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
      >
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 bg-white border-b">
          <div className="flex items-center gap-2 text-[#0a332a]">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-bold">Registrar Venta</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECCIÓN: DATOS DE LA VENTA */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-blue-600 font-semibold mb-4">Datos de la Venta</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-600">Cliente *</label>
                <ClienteSelector
                  selectedCliente={selectedCliente}
                  onSelectCliente={setSelectedCliente}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Fecha de Venta *</label>
                <input 
                  type="date" 
                  value={form.fecha} 
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Serie *</label>
                <input 
                  type="text" 
                  value={form.serie}
                  onChange={(e) => setForm({ ...form, serie: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">N° Comprobante *</label>
                <input 
                  type="text" 
                  placeholder="000245"
                  value={form.numero}
                  onChange={(e) => setForm({ ...form, numero: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Vendedor *</label>
                <div className="w-full border rounded-lg p-2 text-sm bg-gray-100 text-gray-700">
                  {form.vendedor}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Forma de Pago *</label>
                <select 
                  className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none"
                  value={form.metodoPago}
                  onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}
                >
                  <option>Contado</option>
                  <option>Crédito</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-600">Observación</label>
                <input 
                  type="text" 
                  placeholder="Observación (opcional)"
                  value={form.observacion}
                  onChange={(e) => setForm({ ...form, observacion: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none" 
                />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SECCIÓN IZQUIERDA: TABLA */}
            <div className="lg:col-span-2 space-y-4">
              {/* RESUMEN DE CLIENTE SELECCIONADO */}
              {selectedCliente && (
                <section className="bg-gradient-to-r from-[#0a332a] to-[#0d4438] p-4 rounded-xl text-white shadow-sm">
                  <p className="text-xs opacity-75 mb-2">CLIENTE SELECCIONADO</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedCliente.url_img || selectedCliente.img_url || 'https://via.placeholder.com/50'} 
                      alt={selectedCliente.nombre_completo}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                      <p className="font-bold text-lg">{selectedCliente.nombre_completo || 'Cliente'}</p>
                      {selectedCliente.dni && <p className="text-xs opacity-75">DNI: {selectedCliente.dni}</p>}
                    </div>
                  </div>
                </section>
              )}

              <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-blue-600 font-semibold">Vehículos de la Venta</h3>
                  <button 
                    onClick={() => setIsAgregarModalOpen(true)}
                    className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-all"
                  >
                    <Plus size={18} /> Agregar Vehículo
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Vehículo</th>
                        <th className="px-4 py-3">Placa</th>
                        <th className="px-4 py-3 text-right">Precio Unit.</th>
                        <th className="px-4 py-3 text-center">Cant.</th>
                        <th className="px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {vehiculosSeleccionados.map((v, idx) => (
                        <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">{idx + 1}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img src={v.img} className="w-10 h-8 rounded object-cover border" alt="car" />
                              <div>
                                <p className="font-bold text-gray-800">{v.marca} {v.modelo}</p>
                                <p className="text-[10px] text-gray-400">Año: {v.anio}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium">{v.placa}</td>
                          <td className="px-4 py-4 text-right font-semibold">S/ {v.precio.toLocaleString()}</td>
                          <td className="px-4 py-4 text-center">
                             <input 
                               type="number" 
                               value={v.cantidad} 
                               onChange={(e) => {
                                 const val = parseInt(e.target.value)
                                 const newItems = [...vehiculosSeleccionados]
                                 newItems[idx].cantidad = val > 0 ? val : 1
                                 setVehiculosSeleccionados(newItems)
                               }}
                               className="w-16 border rounded p-1 text-center outline-none focus:border-[#0a332a]" 
                             />
                          </td>
                          <td className="px-4 py-4">
                            <button onClick={() => eliminarVehiculo(v.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {vehiculosSeleccionados.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                      <ShoppingCart size={48} className="mb-2 opacity-20" />
                      <p className="italic text-sm">No hay vehículos agregados.</p>
                    </div>
                  )}
                </div>
                
                {vehiculosSeleccionados.length > 0 && (
                  <button 
                    onClick={() => setVehiculosSeleccionados([])}
                    className="mt-4 text-gray-400 text-xs flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} /> Limpiar lista
                  </button>
                )}
              </section>
            </div>

            {/* SECCIÓN DERECHA: RESUMEN */}
            <div className="space-y-4">
              <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-0">
                <h3 className="text-blue-600 font-semibold mb-6">Resumen de la Venta</h3>
                
                <div className="space-y-3 text-sm border-b pb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">S/ {subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Descuento</span>
                    <span className="font-medium">S/ {descuentoTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IGV (18%)</span>
                    <span className="font-medium">S/ {igv.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-6">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-blue-700">
                    S/ {total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start mb-6">
                  <Info className="text-blue-500 shrink-0" size={20} />
                  <p className="text-xs text-blue-700 leading-tight">
                    Se registrarán {vehiculosSeleccionados.length} vehículo(s) en esta venta.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={vehiculosSeleccionados.length === 0 || isSubmitting}
                  className="w-full bg-[#0a332a] hover:bg-[#0d4438] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:bg-gray-400 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <CheckCircle2 size={20} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  {isSubmitting ? 'Registrando...' : 'Registrar Venta'}
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE SELECCIÓN DE VEHÍCULOS */}
      <AgregarCarro 
        isOpen={isAgregarModalOpen} 
        onClose={() => setIsAgregarModalOpen(false)} 
        onSelect={manejarSeleccionVehiculo}
      />

      {/* MODAL DE STOCK INSUFICIENTE */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Stock Insuficiente"
        bgColor="bg-[#1a3c34]"
        textColor="text-white"
        size="sm"
      >
        <p className="text-center">
          El vehículo seleccionado no tiene stock disponible en el inventario.
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowStockModal(false)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-2xl font-medium transition-colors"
          >
            Entendido
          </button>
        </div>
      </Modal>

      {/* TOAST EXITOSO */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#0a332a] text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="text-green-400" />
          <span className="font-bold">¡Venta registrada con éxito!</span>
        </div>
      )}
    </div>
  )
}

export default RegistrarVenta