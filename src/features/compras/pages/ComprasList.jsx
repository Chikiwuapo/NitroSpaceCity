import { useState, useEffect } from 'react'
import { ShoppingCart, CreditCard, Truck, Calendar, ChevronRight, Loader2, AlertCircle, UserPlus, ClipboardCheck } from 'lucide-react'
import { usePurchases } from '../hooks/usePurchases'
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
  const { data: purchases, loading, error } = usePurchases()
  const [activeTab, setActiveTab] = useState('ordenes')
  const [providers, setProviders] = useState([])
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isReceptionOpen, setIsReceptionOpen] = useState(false)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const storedProviders = localStorage.getItem('compras_proveedores')
    const storedOrders = localStorage.getItem('compras_local_orders')

    if (storedProviders) {
      setProviders(JSON.parse(storedProviders))
    }
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('compras_proveedores', JSON.stringify(providers))
  }, [providers])

  useEffect(() => {
    const localCreatedOrders = orders.filter((order) => order.isLocal)
    localStorage.setItem('compras_local_orders', JSON.stringify(localCreatedOrders))
  }, [orders])

  useEffect(() => {
    if (loading || error) return
    const apiOrders = purchases.map((purchase) => convertPurchaseToOrder(purchase))
    setOrders((current) => {
      const currentIds = new Set(current.map((order) => order.id))
      const merged = [...current]
      apiOrders.forEach((order) => {
        if (!currentIds.has(order.id)) {
          merged.push(order)
        }
      })
      return merged
    })
  }, [loading, purchases, error])

  const convertPurchaseToOrder = (purchase) => {
    const total = Number(purchase.total) || 0
    const subtotal = Number(purchase.subtotal || total) || 0
    return {
      id: purchase.id?.toString() || `api-${Math.random()}`,
      nro_orden: purchase.nro_comprobante || `OC-${purchase.id}`,
      proveedor: purchase.proveedor || 'Proveedor registrado',
      proveedorId: `api-${purchase.id}`,
      fecha_entrega: purchase.fecha_compra || new Date().toISOString(),
      metodo_pago: purchase.metodo_pago || 'Contado',
      items: [
        {
          modelo: purchase.modelo_auto || 'Vehículo',
          ano: 'N/A',
          color: purchase.tipo_vehiculo || 'N/A',
          precio: total,
        },
      ],
      estado_pago: purchase.estado_pago || 'Pendiente',
      estado_entrega: purchase.estado_entrega || 'Pendiente',
      subtotal: subtotal,
      igv: Number(purchase.igv) || 0,
      total: total,
      isLocal: false,
    }
  }

  const handleShowToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2500)
  }

  const handleProviderSave = (provider) => {
    setProviders((prev) => [provider, ...prev])
    handleShowToast('Proveedor registrado correctamente')
  }

  const handleOrderSave = (order) => {
    setOrders((prev) => [order, ...prev])
    handleShowToast('Orden de compra emitida')
    setActiveTab('ordenes')
  }

  const handleStartReception = (order) => {
    setSelectedOrder(order)
    setIsReceptionOpen(true)
  }

  const handleConfirmReception = (receptionData) => {
    const updated = {
      ...selectedOrder,
      estado_entrega: 'Entregado',
      recepcion: receptionData,
      fecha_recepcion: new Date().toISOString(),
    }

    setOrders((prev) => prev.map((order) => (order.id === updated.id ? updated : order)))
    setSelectedOrder(updated)
    handleShowToast('Recepción registrada y el inventario se actualizó')
  }

  const handleSelectOrder = (order) => {
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
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

      {toast && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          {toast}
        </div>
      )}

      {activeTab === 'proveedores' && (
        <ProvidersTab providers={providers} onNewProvider={() => setIsProviderModalOpen(true)} />
      )}

      {activeTab === 'ordenes' && (
        <OrdersTab orders={orders} onNewOrder={() => setIsOrderModalOpen(true)} onSelectOrder={handleSelectOrder} />
      )}

      {activeTab === 'recepciones' && (
        <ReceptionsTab orders={orders} onStartReception={handleStartReception} />
      )}

      <ProviderModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onSave={handleProviderSave}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleOrderSave}
        providers={providers}
      />

      <ReceptionModal
        isOpen={isReceptionOpen}
        onClose={() => setIsReceptionOpen(false)}
        order={selectedOrder}
        onConfirm={handleConfirmReception}
      />

      <OrderDetailModal
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        order={selectedOrder}
        onStartReception={handleStartReception}
      />
    </div>
  )
}

export default ComprasList