import { useState, useEffect } from 'react'
import { ShoppingCart, CreditCard, Truck, Calendar, ChevronRight, Loader2, AlertCircle, UserPlus, ClipboardCheck } from 'lucide-react'
import { usePurchases } from '../hooks/usePurchases'
import { useProviders } from '../hooks/useProviders'
import {
  ProviderModal,
  OrderModal,
  ReceptionModal,
  OrderDetailModal,
  StatsWidgets,
  ProvidersTab,
  OrdersTab,
  ReceptionsTab,
} from '../index'

const ComprasList = () => {
  const { data: purchases, loading: loadingPurchases, error: errorPurchases, registerPurchase, updatePurchase: updatePurchaseData } = usePurchases()
  const { providers, loading: loadingProviders, error: errorProviders, addProvider, updateProvider } = useProviders()
  
  const [activeTab, setActiveTab] = useState('ordenes')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingProvider, setEditingProvider] = useState(null)
  
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isReceptionOpen, setIsReceptionOpen] = useState(false)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)

  useEffect(() => {
    if (loadingPurchases || errorPurchases) return
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
    setActiveTab('ordenes')
  }

  const handleConfirmReception = (receptionData) => {
    // La recepción ahora se maneja implícitamente por el stock al registrar la compra,
    // pero podemos mantener la lógica visual si es necesario.
    setIsReceptionOpen(false)
  }

  const handleSelectOrder = (order) => {
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
      title: 'Órdenes de Compra',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-[#0a332a]/10',
      iconColor: 'text-[#0a332a]',
    },
    {
      title: 'Órdenes Pendientes',
      value: orders.filter((order) => order.estado_entrega === 'Pendiente').length,
      icon: Truck,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Proveedores registrados',
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
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Compras</h1>
          <p className="mt-4 max-w-2xl text-gray-600 leading-7">
            El módulo de Compras coordina el ingreso de vehículos desde el proveedor al inventario. Registra proveedores, emite órdenes de compra y confirma la recepción cuando los carros llegan.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {['ordenes', 'proveedores', 'recepciones'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-2xl px-5 py-3 font-medium transition ${
                activeTab === tab ? 'bg-[#0a332a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab === 'ordenes' ? 'Órdenes de Compra' : tab === 'proveedores' ? 'Proveedores' : 'Registrar Recepción'}
            </button>
          ))}
        </div>
      </div>

      <StatsWidgets widgets={statWidgets} />

      <div className="mt-8">
        {activeTab === 'ordenes' && (
          <OrdersTab orders={orders} onNewOrder={() => setIsOrderModalOpen(true)} onSelectOrder={handleSelectOrder} />
        )}
        {activeTab === 'proveedores' && (
          <ProvidersTab providers={providers} onNewProvider={handleNewProvider} onEditProvider={handleEditProvider} />
        )}
        {activeTab === 'recepciones' && (
          <ReceptionsTab orders={orders.filter((o) => o.estado_entrega === 'Pendiente')} onStartReception={handleStartReception} />
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
        <>
          <ReceptionModal
            isOpen={isReceptionOpen}
            onClose={() => setIsReceptionOpen(false)}
            onConfirm={handleConfirmReception}
            order={selectedOrder}
          />
          <OrderDetailModal
            isOpen={isOrderDetailOpen}
            onClose={() => setIsOrderDetailOpen(false)}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  )
}

export default ComprasList
