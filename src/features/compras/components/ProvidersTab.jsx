import { useState, useEffect } from 'react'
import { Plus, Edit2 } from 'lucide-react'
import { Pagination } from '../../../shared/components/Pagination'

const ProvidersTab = ({ providers, onNewProvider, onEditProvider }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 7

  useEffect(() => {
    setCurrentPage(1)
  }, [providers])

  const totalPages = Math.ceil(providers.length / ITEMS_PER_PAGE)
  const currentItems = providers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-6 flex-1 min-h-0 flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Proveedores</h2>
          <p className="text-sm text-gray-600">Registra y administra los proveedores antes de emitir órdenes de compra.</p>
        </div>
        <button
          type="button"
          onClick={onNewProvider}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0a332a] px-5 py-3 text-white hover:bg-[#0a332a]/90 transition-all"
        >
          <Plus className="w-4 h-4" /> Nuevo Proveedor
        </button>
      </div>

      {currentItems.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-gray-300 p-8 text-gray-600 text-center flex-1">
          No hay proveedores registrados. Añade un nuevo proveedor para iniciar las órdenes de compra.
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid gap-4 md:grid-cols-2 pb-4">
            {currentItems.map((provider) => (
              <div key={provider.id} className="group relative rounded-[32px] border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{provider.razon_social}</p>
                      <p className="text-sm text-gray-500">RUC: {provider.ruc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditProvider(provider)}
                        className="p-2 text-gray-400 hover:text-[#0a332a] hover:bg-[#0a332a]/5 rounded-xl transition-all"
                        title="Editar proveedor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        {provider.condiciones_pago || 'Contado'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-semibold text-gray-400">Dir:</span> {provider.direccion}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-semibold text-gray-400">Cont:</span> {provider.contacto}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default ProvidersTab