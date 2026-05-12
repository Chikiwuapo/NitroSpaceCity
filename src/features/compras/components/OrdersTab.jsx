import { useState, useEffect } from 'react'
import { Plus, Calendar, ChevronRight, Search, Pencil, Trash2 } from 'lucide-react'
import { Pagination } from '../../../shared/components/Pagination'

const OrdersTab = ({ orders, onNewOrder, onSelectOrder, onEditOrder, onDeleteOrder }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 7

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])
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

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const matchProveedor = (order.proveedor || '').toLowerCase().includes(searchLower);
    const matchComprobante = (order.nro_comprobante || '').toLowerCase().includes(searchLower);
    const matchSerie = (order.serie || '').toLowerCase().includes(searchLower);
    
    return matchProveedor || matchComprobante || matchSerie;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentItems = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 flex-1 min-h-0 flex flex-col">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        {/* Filtro de búsqueda */}
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por proveedor o N° comprobante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Botón Nueva Orden */}
        <button
          type="button"
          onClick={onNewOrder}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0a332a] px-6 py-3 font-medium text-white hover:bg-[#0a332a]/90 transition-all shadow-sm whitespace-nowrap w-full md:w-auto"
        >
          <Plus className="w-5 h-5" /> Nueva Orden
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">N° Comprobante</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Moneda</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay órdenes de compra disponibles.
                  </td>
                </tr>
              ) : (
                currentItems.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onSelectOrder(order)}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{order.serie}-{order.nro_comprobante}</p>
                      <p className="text-xs text-gray-400">ID: {order.id.substring(0, 8)}...</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{order.proveedor || 'Sin proveedor'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.id_moneda === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.id_moneda === 1 ? 'PEN (S/)' : 'USD ($)'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-[#0a332a]">{formatCurrency(order.total)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditOrder(order)
                          }}
                          className="p-2 hover:bg-[#0a332a]/10 rounded-lg transition-colors text-[#0a332a]"
                          title="Editar compra"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteOrder(order)
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Eliminar compra"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default OrdersTab