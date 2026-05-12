import { useState, useEffect } from 'react'
import { ShoppingCart, CreditCard, Truck, UserPlus, Loader2, AlertCircle } from 'lucide-react'
import { usePurchases } from '../hooks/usePurchases'
import { useProviders } from '../hooks/useProviders'
import {
  ProviderModal,
  OrderModal,
  OrderDetailModal,
  StatsWidgets,
  ProvidersTab,
  OrdersTab,
} from '../index'
import EditarCompra from '../components/EditarCompra'
import { Modal } from '../../../shared'
import { LoadingAnimation } from '../../../shared/components/LoadingAnimation';

const ComprasList = () => {
  const { data: purchases, loading: loadingPurchases, error: errorPurchases, registerPurchase, updatePurchase, deletePurchase } = usePurchases()
  const { providers, loading: loadingProviders, error: errorProviders, addProvider, updateProvider } = useProviders()
  
  const [activeTab, setActiveTab] = useState('ordenes')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingProvider, setEditingProvider] = useState(null)
  const [editPurchaseId, setEditPurchaseId] = useState(null)
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState(null)
  
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)

  useEffect(() => {
    if (loadingPurchases || errorPurchases) return
    console.log('📦 Compras cargadas en ComprasList:', purchases);
    console.log('📊 Primera compra (ejemplo):', purchases[0]);
    setOrders(purchases)
  }, [loadingPurchases, purchases, errorPurchases])

  const handleProviderSave = async (providerData) => {
    if (editingProvider) {
      await updateProvider(editingProvider.id, providerData)
    } else {
      await addProvider(providerData)
    }
  }

  const handleOrderSave = async (purchaseData) => {
    await registerPurchase(purchaseData)
    setIsOrderModalOpen(false)
  }

  const handleEditOrder = (order) => {
    setEditPurchaseId(order.id)
  }

  const handleDeleteOrder = (order) => {
    setDeleteConfirmOrder(order)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmOrder) return
    try {
      await deletePurchase(deleteConfirmOrder.id)
      setDeleteConfirmOrder(null)
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  const handleSelectOrder = (order) => {
    console.log('🔍 Orden seleccionada para detalle:', order);
    console.log('  - Proveedor:', order.proveedor);
    console.log('  - Detalle vehiculos:', order.detalle);
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
  }

  const handleEditProvider = (provider) => {
    setEditingProvider(provider)
    setIsProviderModalOpen(true)
  }

  const handleNewProvider = () => {
    setEditingProvider(null)
    setIsProviderModalOpen(true)
  }

  const statWidgets = [
    {
      title: 'Compras Totales',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-[#0a332a]/10',
      iconColor: 'text-[#0a332a]',
    },
    {
      title: 'Proveedores Registrados',
      value: providers.length,
      icon: UserPlus,
      color: 'bg-sky-100',
      iconColor: 'text-sky-600',
    },
  ]

  const isLoading = loadingPurchases || loadingProviders
  const error = errorPurchases || errorProviders

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f6f9]">
        <LoadingAnimation />
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
    <div className="p-8 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-wrap gap-3">
          {['ordenes', 'proveedores'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-2xl px-5 py-3 font-medium transition ${
                activeTab === tab ? 'bg-[#0a332a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab === 'ordenes' ? 'Órdenes de Compra' : 'Proveedores'}
            </button>
          ))}
        </div>
      </div>

      <StatsWidgets widgets={statWidgets} />

      <div className="mt-8 flex-1 min-h-0 flex flex-col">
        {activeTab === 'ordenes' && (
          <OrdersTab 
            orders={orders} 
            onNewOrder={() => setIsOrderModalOpen(true)} 
            onSelectOrder={handleSelectOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        )}
        {activeTab === 'proveedores' && (
          <ProvidersTab providers={providers} onNewProvider={handleNewProvider} onEditProvider={handleEditProvider} />
        )}
      </div>

      <ProviderModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onSave={handleProviderSave}
        editingProvider={editingProvider}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleOrderSave}
        providers={providers}
      />

      {selectedOrder && (
        <OrderDetailModal
          isOpen={isOrderDetailOpen}
          onClose={() => setIsOrderDetailOpen(false)}
          order={selectedOrder}
        />
      )}

      {editPurchaseId && (
        <EditarCompra
          isOpen={!!editPurchaseId}
          purchaseId={editPurchaseId}
          providers={providers}
          onClose={() => setEditPurchaseId(null)}
          onSuccess={() => {
            setEditPurchaseId(null)
          }}
        />
      )}

      {deleteConfirmOrder && (
        <Modal
          isOpen={!!deleteConfirmOrder}
          onClose={() => setDeleteConfirmOrder(null)}
          title="Confirmar Eliminación"
          bgColor="bg-red-600"
          textColor="text-white"
          size="sm"
        >
          <p className="text-center mb-4">
            ¿Estás seguro de eliminar la compra <strong>{deleteConfirmOrder.serie}-{deleteConfirmOrder.nro_comprobante}</strong>?
          </p>
          <p className="text-center text-sm text-gray-500 mb-6">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setDeleteConfirmOrder(null)}
              className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ComprasList
