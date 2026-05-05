import { useState, useRef } from 'react'
import { ShoppingBag, CreditCard, Truck, Calendar, FileText, ChevronRight, Loader2, AlertCircle, User, FileDown } from 'lucide-react'
import { useSales } from '../hooks/useSales'
import RegistrarVenta from '../components/RegistroVenta' // ajusta la ruta

const VentasList = () => {
  const { data: sales, loading, error, refetch } = useSales()
  const [selectedSale, setSelectedSale] = useState(null)
  const [isOpenRegistrar, setIsOpenRegistrar] = useState(false)
  const printRef = useRef(null)

  const handlePrint = () => {
    window.print()
  }

  const statWidgets = [
    {
      title: 'Total Ventas',
      value: sales.length,
      icon: ShoppingBag,
      color: 'bg-[#0a332a]/10',
      iconColor: 'text-[#0a332a]',
    },
    {
      title: 'Ventas Pagadas',
      value: sales.filter(s => {
        const estado = (s.estado_pago || '').toLowerCase()
        return estado === 'pagado' || estado === 'vendido' || estado === 'pagada'
      }).length,
      icon: CreditCard,
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Ventas Entregadas',
      value: sales.filter(s => {
        const estado = (s.estado_entrega || '').toLowerCase()
        return estado === 'entregado' || estado === 'entregada'
      }).length,
      icon: Truck,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No disponible'
    return new Date(dateStr).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || ''

  switch (s) {
    case 'pagado':
    case 'entregado':
      return 'bg-emerald-100 text-emerald-700'
    case 'pendiente':
      return 'bg-amber-100 text-amber-700'
    case 'en camino':
    case 'en proceso':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-[#0a332a] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
     <div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
  </div>

  <button
    onClick={() => setIsOpenRegistrar(true)}
    className="bg-[#0a332a] text-white px-5 py-3 rounded-2xl font-medium flex items-center gap-2 hover:bg-[#0a332a]/90 transition-all shadow-sm"
  >
    <ShoppingBag className="w-5 h-5" />
    Nueva Venta
  </button>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statWidgets.map((widget, index) => {
          const Icon = widget.icon
          return (
            <div key={index} className="bg-white rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`${widget.color} p-4 rounded-2xl`}>
                  <Icon className={`w-6 h-6 ${widget.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{widget.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-800">{widget.value}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Comprobante
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado y Entrega
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monto Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedSale(sale)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={sale.cliente.img_url}
                        alt={sale.cliente.nombre_completo}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{sale.cliente.nombre_completo}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {sale.usuario}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{sale.tipo_comprobante}</p>
                        <p className="text-sm text-gray-500">{sale.serie}-{sale.numero_comprobante}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(sale.fecha_venta)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sale.estado_pago)}`}>
                        {sale.estado_pago}
                      </span>
                      <br />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sale.estado_entrega)}`}>
                        {sale.estado_entrega}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="group relative">
                      <p className="text-lg font-bold text-[#0a332a]">{formatCurrency(sale.total)}</p>
                      <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        Subtotal: {formatCurrency(sale.subtotal)} | IGV: {formatCurrency(sale.igv)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div ref={printRef} className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Detalle de Venta</h2>
                  <p className="text-gray-500">{selectedSale.tipo_comprobante} {selectedSale.serie}-{selectedSale.numero_comprobante}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-lg transition-colors"
                    title="Exportar a PDF"
                  >
                    <FileDown className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedSale(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedSale.cliente.img_url || 'https://via.placeholder.com/80'}
                  alt={selectedSale.cliente.nombre_completo || 'Cliente'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <p className="text-xl font-bold text-gray-800">{selectedSale.cliente.nombre_completo || 'Cliente'}</p>
                  <p className="text-gray-500 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Vendedor: {selectedSale.usuario || 'Vendedor'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Fecha de Venta</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedSale.fecha_venta)}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Vehículos</p>
                  <p className="font-semibold text-gray-800">{selectedSale.detalle.length} vehículo(s)</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Estado de Pago</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSale.estado_pago)}`}>
                    {selectedSale.estado_pago}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Estado de Entrega</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSale.estado_entrega)}`}>
                    {selectedSale.estado_entrega}
                  </span>
                </div>
              </div>

              <div className="bg-[#0a332a]/5 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Detalle de Productos</h3>
                <div className="space-y-3">
                  {selectedSale.detalle.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.marca && item.modelo ? `${item.marca} ${item.modelo}` : item.descripcion}
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                            {item.placa && <p><span className="font-medium">Placa:</span> {item.placa}</p>}
                            {item.color && <p><span className="font-medium">Color:</span> {item.color}</p>}
                            {item.anio && <p><span className="font-medium">Año:</span> {item.anio}</p>}
                            {item.transmision && <p><span className="font-medium">Transmisión:</span> {item.transmision}</p>}
                            {item.combustible && <p><span className="font-medium">Combustible:</span> {item.combustible}</p>}
                            <p><span className="font-medium">Cantidad:</span> {item.cantidad}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 text-lg">{formatCurrency(item.precio_unitario)}</p>
                          <p className="text-sm text-gray-500">Subtotal: {formatCurrency(item.subtotal)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a332a]/5 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Desglose Financiero</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">{formatCurrency(selectedSale.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IGV (18%)</span>
                    <span className="font-medium text-gray-800">{formatCurrency(selectedSale.igv)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-[#0a332a]">{formatCurrency(selectedSale.total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedSale(null)}
                  className="bg-[#0a332a] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#0a332a]/90 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpenRegistrar && (
  <RegistrarVenta
  isOpen={isOpenRegistrar}
  onClose={() => setIsOpenRegistrar(false)}
  onSuccess={() => {
    setIsOpenRegistrar(false)
    window.location.reload() 
  }}
/>
)}
    </div>
  )
}

export default VentasList
