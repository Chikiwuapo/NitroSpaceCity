import { Plus } from 'lucide-react'

const ProvidersTab = ({ providers, onNewProvider }) => {
  return (
    <div className="space-y-6">
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

      {providers.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-gray-300 p-8 text-gray-600 text-center">
          No hay proveedores registrados. Añade un nuevo proveedor para iniciar las órdenes de compra.
        </div>
      ) : (
        <div className="grid gap-4">
          {providers.map((provider) => (
            <div key={provider.id} className="rounded-[32px] border border-gray-200 p-6 bg-white shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{provider.razon_social}</p>
                    <p className="text-sm text-gray-500">RUC: {provider.ruc}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">{provider.condiciones_pago || 'Contado'}</span>
                </div>
                <p className="text-sm text-gray-600">Dirección: {provider.direccion}</p>
                <p className="text-sm text-gray-600">Contacto: {provider.contacto}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProvidersTab