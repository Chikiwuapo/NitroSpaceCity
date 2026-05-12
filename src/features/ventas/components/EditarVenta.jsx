import { useState, useEffect } from 'react'
import { X, ShoppingCart, CheckCircle2, Loader2, Trash2, Info } from 'lucide-react'
import { ventasApi } from '../services/ventasApi'
import { useNotificationSystem } from '../../notificaciones/hooks/useNotificationSystem'

const IGV_RATE = 0.18

/**
 * Modal de edición de venta.
 * Carga los datos de la venta por ID (GET) y permite editarlos.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - saleId: string  — ID de la venta a editar
 *  - onSuccess: () => void
 */
const EditarVenta = ({ isOpen, onClose, saleId, onSuccess }) => {
  const { pushAlert } = useNotificationSystem()

  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [rawSale, setRawSale] = useState(null)   // datos crudos del GET

  // Campos editables del formulario
  const [form, setForm] = useState({
    serie: '',
    nro_comprobante: '',
    fecha_venta: '',
    id_estado_pago: 1,
    id_tipo_comprobante: 1,
  })

  // Vehículos de la venta (solo lectura, se muestran para referencia)
  const [vehiculos, setVehiculos] = useState([])

  // ── Animación de entrada ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) setTimeout(() => setIsAnimating(true), 10)
    else setIsAnimating(false)
  }, [isOpen])

  // ── Cargar venta por ID cuando se abre el modal ───────────────────────────
  useEffect(() => {
    if (!isOpen || !saleId) return

    const fetchSale = async () => {
      try {
        setLoading(true)
        const data = await ventasApi.getSaleById(saleId)
        setRawSale(data)

        // Poblar formulario con los campos del JSON
        setForm({
          serie: data.serie || '',
          nro_comprobante: data.nro_comprobante || data.numero_comprobante || '',
          fecha_venta: data.fecha_venta
            ? data.fecha_venta.split('T')[0]
            : new Date().toISOString().split('T')[0],
          id_estado_pago: data.id_estado_pago ?? 1,
          id_tipo_comprobante: data.id_tipo_comprobante ?? 1,
        })

        // Mapear vehículos del array del JSON
        const vehs = (data.vehiculos || []).map((item) => {
          const v = item.vehiculo || item
          const modelo = v.modelo || {}
          const marca = modelo.marca || {}
          return {
            id_vehiculo: v.id || item.id_vehiculo,
            anio: v.anio || item.anio || '',
            url_img: v.url_img || item.url_img || '',
            precio_u: v.precio || v.precio_u || item.precio_u || 0,
            marca: marca.nombre || v.marca || '',
            modelo: typeof modelo === 'string' ? modelo : (modelo.nombre || v.modelo || ''),
            placa: v.placa || '',
            cantidad: item.cantidad || 1,
          }
        })
        setVehiculos(vehs)
      } catch (err) {
        console.error('Error al cargar venta:', err)
        pushAlert('Error', 'No se pudo cargar la venta', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchSale()
  }, [isOpen, saleId])

  // ── Cálculos financieros ──────────────────────────────────────────────────
  const subtotal = vehiculos.reduce((acc, v) => acc + v.precio_u * v.cantidad, 0)
  const igv = subtotal * IGV_RATE
  const total = subtotal + igv

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.nro_comprobante) {
      alert('El número de comprobante es obligatorio')
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        serie: form.serie,
        nro_comprobante: form.nro_comprobante,
        fecha_venta: form.fecha_venta,
        subtotal,
        igv,
        total,
        id_estado_pago: Number(form.id_estado_pago),
        id_tipo_comprobante: Number(form.id_tipo_comprobante),
        // Mantener los vehículos originales
        vehiculos: vehiculos.map((v) => ({
          id_vehiculo: v.id_vehiculo,
          cantidad: v.cantidad,
          subtotal: v.precio_u * v.cantidad,
        })),
      }

      await ventasApi.updateVenta(saleId, payload)
      pushAlert('Venta Actualizada', `Comprobante ${form.serie}-${form.nro_comprobante} actualizado`, 'success')
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Error al actualizar venta:', err)
      alert(`Error al actualizar: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-black/40 transition-opacity duration-300">
      <div
        className={`bg-[#f8fafb] w-full max-w-4xl h-full shadow-2xl transform transition-transform duration-500 ease-out flex flex-col
        ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 bg-white border-b">
          <div className="flex items-center gap-2 text-[#0a332a]">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-bold">Editar Venta</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <Loader2 className="w-10 h-10 text-[#0a332a] animate-spin mb-4" />
              <p className="text-gray-500">Cargando datos de la venta...</p>
            </div>
          ) : (
            <>
              {/* ── DATOS DEL COMPROBANTE ── */}
              <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-blue-600 font-semibold mb-4">Datos del Comprobante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Serie</label>
                    <input
                      type="text"
                      value={form.serie}
                      onChange={(e) => setForm({ ...form, serie: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">N° Comprobante</label>
                    <input
                      type="text"
                      value={form.nro_comprobante}
                      onChange={(e) => setForm({ ...form, nro_comprobante: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Fecha de Venta</label>
                    <input
                      type="date"
                      value={form.fecha_venta}
                      onChange={(e) => setForm({ ...form, fecha_venta: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Tipo Comprobante</label>
                    <select
                      value={form.id_tipo_comprobante}
                      onChange={(e) => setForm({ ...form, id_tipo_comprobante: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                    >
                      <option value={1}>Boleta</option>
                      <option value={2}>Factura</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Estado de Pago</label>
                    <select
                      value={form.id_estado_pago}
                      onChange={(e) => setForm({ ...form, id_estado_pago: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                    >
                      <option value={1}>Pendiente</option>
                      <option value={2}>Pagado</option>
                      <option value={3}>Anulado</option>
                    </select>
                  </div>

                  {/* Campos de solo lectura del JSON */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Subtotal (calculado)</label>
                    <div className="w-full border rounded-lg p-2 text-sm bg-gray-100 text-gray-700">
                      S/ {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">IGV 18% (calculado)</label>
                    <div className="w-full border rounded-lg p-2 text-sm bg-gray-100 text-gray-700">
                      S/ {igv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Total (calculado)</label>
                    <div className="w-full border rounded-lg p-2 text-sm bg-blue-50 text-blue-700 font-bold">
                      S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── VEHÍCULOS DE LA VENTA ── */}
              <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-blue-600 font-semibold">Vehículos de la Venta</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {vehiculos.length} vehículo(s)
                  </span>
                </div>

                {vehiculos.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-8">Sin vehículos registrados</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="px-4 py-3">#</th>
                          <th className="px-4 py-3">Vehículo</th>
                          <th className="px-4 py-3">Año</th>
                          <th className="px-4 py-3">Placa</th>
                          <th className="px-4 py-3 text-right">Precio Unit.</th>
                          <th className="px-4 py-3 text-center">Cant.</th>
                          <th className="px-4 py-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {vehiculos.map((v, idx) => (
                          <tr key={v.id_vehiculo || idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {v.url_img ? (
                                  <img
                                    src={v.url_img}
                                    alt={v.modelo}
                                    className="w-12 h-9 rounded object-cover border"
                                  />
                                ) : (
                                  <div className="w-12 h-9 rounded bg-gray-100 flex items-center justify-center border">
                                    <ShoppingCart size={14} className="text-gray-300" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {v.marca} {v.modelo}
                                  </p>
                                  <p className="text-[10px] text-gray-400">ID: {v.id_vehiculo}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{v.anio}</td>
                            <td className="px-4 py-3 font-medium">{v.placa || '—'}</td>
                            <td className="px-4 py-3 text-right font-semibold">
                              S/ {v.precio_u.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-center">{v.cantidad}</td>
                            <td className="px-4 py-3 text-right font-semibold text-[#0a332a]">
                              S/ {(v.precio_u * v.cantidad).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* ── NOTA INFORMATIVA ── */}
              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Los montos (subtotal, IGV, total) se recalculan automáticamente a partir de los vehículos.
                  Para modificar los vehículos de la venta, contacta al administrador.
                </p>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        {!loading && (
          <div className="p-5 bg-white border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0a332a] hover:bg-[#0d4438] text-white font-bold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditarVenta
