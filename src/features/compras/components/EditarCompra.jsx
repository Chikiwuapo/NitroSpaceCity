import { useState, useEffect } from 'react'
import { X, ShoppingCart, CheckCircle2, Loader2, Info } from 'lucide-react'
import { comprasApi } from '../services/comprasApi'
import { useNotificationSystem } from '../../notificaciones/hooks/useNotificationSystem'

const IGV_RATE = 0.18

/**
 * Modal de edición de compra.
 * Permite editar datos informativos (serie, nro_comprobante, etc.)
 * NO afecta al stock según la documentación del endpoint PUT.
 */
const EditarCompra = ({ isOpen, onClose, purchaseId, onSuccess, providers }) => {
  const { pushAlert } = useNotificationSystem()

  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [rawPurchase, setRawPurchase] = useState(null)

  const [form, setForm] = useState({
    serie: '',
    nro_comprobante: '',
    subtotal: 0,
    igv: 0,
    total: 0,
    id_moneda: 1,
    id_estado_pago: 1,
    id_proveedor: '',
    id_tipo_comprobante: 1,
  })

  const [vehiculos, setVehiculos] = useState([])

  useEffect(() => {
    if (isOpen) setTimeout(() => setIsAnimating(true), 10)
    else setIsAnimating(false)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !purchaseId) return

    const fetchPurchase = async () => {
      try {
        setLoading(true)
        const data = await comprasApi.getPurchaseById(purchaseId)
        setRawPurchase(data)

        setForm({
          serie: data.serie || '',
          nro_comprobante: data.nro_comprobante || data.numero_comprobante || '',
          subtotal: data.subtotal || 0,
          igv: data.igv || 0,
          total: data.total || 0,
          id_moneda: data.id_moneda ?? 1,
          id_estado_pago: data.id_estado_pago ?? 1,
          id_proveedor: data.id_proveedor || '',
          id_tipo_comprobante: data.id_tipo_comprobante ?? 1,
        })

        console.log('📋 Formulario poblado:', {
          proveedor: data.id_proveedor,
          vehiculos: data.detalle?.length || 0
        });

        const vehs = (data.detalle || []).map((item) => ({
          id_vehiculo: item.id_vehiculo,
          marca: item.marca || '',
          modelo: item.modelo || '',
          cantidad: item.cantidad || 1,
          subtotal: item.subtotal || 0,
          url_img: item.url_img || '',
        }));
        
        console.log('🚗 Vehículos mapeados:', vehs);
        setVehiculos(vehs)
      } catch (err) {
        console.error('Error al cargar compra:', err)
        pushAlert('Error', 'No se pudo cargar la compra', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchPurchase()
  }, [isOpen, purchaseId])

  const handleSubmit = async () => {
    if (!form.nro_comprobante) {
      alert('El número de comprobante es obligatorio')
      return
    }
    if (!form.id_proveedor) {
      alert('Debe seleccionar un proveedor')
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        serie: form.serie,
        nro_comprobante: form.nro_comprobante,
        subtotal: Number(form.subtotal),
        igv: Number(form.igv),
        total: Number(form.total),
        id_moneda: Number(form.id_moneda),
        id_estado_pago: Number(form.id_estado_pago),
        id_proveedor: form.id_proveedor,
        id_tipo_comprobante: Number(form.id_tipo_comprobante),
      }

      await comprasApi.updatePurchase(purchaseId, payload)
      pushAlert('Compra Actualizada', `Comprobante ${form.serie}-${form.nro_comprobante} actualizado`, 'success')
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Error al actualizar compra:', err)
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
            <h2 className="text-xl font-bold">Editar Compra</h2>
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
              <p className="text-gray-500">Cargando datos de la compra...</p>
            </div>
          ) : (
            <>
              {/* DATOS DEL COMPROBANTE */}
              <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-blue-600 font-semibold mb-4">Datos del Comprobante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

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
                    <label className="text-xs font-bold text-gray-600">Proveedor</label>
                    <select
                      value={form.id_proveedor}
                      onChange={(e) => setForm({ ...form, id_proveedor: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                    >
                      <option value="">Seleccionar proveedor</option>
                      {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.razon_social || p.nombre}
                        </option>
                      ))}
                    </select>
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

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Moneda</label>
                    <select
                      value={form.id_moneda}
                      onChange={(e) => setForm({ ...form, id_moneda: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                    >
                      <option value={1}>Soles (PEN)</option>
                      <option value={2}>Dólares (USD)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Subtotal</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.subtotal}
                      onChange={(e) => {
                        const sub = Number(e.target.value)
                        const igv = sub * IGV_RATE
                        setForm({ ...form, subtotal: sub, igv, total: sub + igv })
                      }}
                      className="w-full border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">IGV (18%)</label>
                    <div className="w-full border rounded-lg p-2 text-sm bg-gray-100 text-gray-700">
                      S/ {form.igv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Total</label>
                    <div className="w-full border rounded-lg p-2 text-sm bg-blue-50 text-blue-700 font-bold">
                      S/ {form.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </section>

              {/* VEHÍCULOS (SOLO LECTURA) */}
              <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-blue-600 font-semibold">Vehículos de la Compra</h3>
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
                            <td className="px-4 py-3 text-center">{v.cantidad}</td>
                            <td className="px-4 py-3 text-right font-semibold text-[#0a332a]">
                              S/ {v.subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* NOTA */}
              <div className="bg-amber-50 p-4 rounded-xl flex gap-3 items-start">
                <Info className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Nota:</strong> Esta edición solo modifica datos informativos del comprobante.
                  No afecta el stock de inventario según la documentación del endpoint PUT.
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

export default EditarCompra
