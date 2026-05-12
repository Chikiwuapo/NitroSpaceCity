import { ShoppingCart, Users, Package, TrendingUp, ArrowRight, DollarSign, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSales } from '../../ventas/hooks/useSales'
import { useClientes } from '../../clientes/hooks/useClientes'
import { useInventario } from '../../inventario/hooks/useInventario'

const Dashboard = () => {
  const navigate = useNavigate()
  const { data: ventas, loading: loadingVentas } = useSales()
  const { clientes, loading: loadingClientes } = useClientes()
  const { vehiculos, loading: loadingInventario } = useInventario()

  const isLoading = loadingVentas || loadingClientes || loadingInventario

  // Asegurar que los datos sean arrays
  const ventasArray = Array.isArray(ventas) ? ventas : []
  const clientesArray = Array.isArray(clientes) ? clientes : []
  const vehiculosArray = Array.isArray(vehiculos) ? vehiculos : []

  // Stats reales
  const totalVentas = ventasArray.reduce((acc, v) => acc + (Number(v.total) || 0), 0)
  const ventasEsteMes = ventasArray.filter(v => {
    if (!v.fecha_venta) return false
    const fecha = new Date(v.fecha_venta)
    const hoy = new Date()
    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
  }).length
  const vehiculosDisponibles = vehiculosArray.filter(v => v.estado === 'Disponible').length
  const ultimasVentas = ventasArray.slice(0, 4)

  const stats = [
    {
      label: 'Total Ventas',
      value: isLoading ? '...' : ventasArray.length,
      sub: `${ventasEsteMes} este mes`,
      icon: TrendingUp,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      path: '/ventas'
    },
    {
      label: 'Clientes',
      value: isLoading ? '...' : clientesArray.length,
      sub: 'Registrados',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      path: '/clientes'
    },
    {
      label: 'Inventario',
      value: isLoading ? '...' : vehiculosArray.length,
      sub: `${vehiculosDisponibles} disponibles`,
      icon: Package,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      path: '/inventario'
    },
    {
      label: 'Ingresos',
      value: isLoading ? '...' : `S/ ${(totalVentas / 1000).toFixed(0)}k`,
      sub: 'Total acumulado',
      icon: DollarSign,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      path: '/ventas'
    },
  ]

  const shortcuts = [
    { label: 'Ventas', icon: TrendingUp, color: 'bg-emerald-600 hover:bg-emerald-700', path: '/ventas' },
    { label: 'Clientes', icon: Users, color: 'bg-blue-600 hover:bg-blue-700', path: '/clientes' },
    { label: 'Inventario', icon: Package, color: 'bg-purple-600 hover:bg-purple-700', path: '/inventario' },
    { label: 'Compras', icon: ShoppingCart, color: 'bg-cyan-600 hover:bg-cyan-700', path: '/compras' },
    { label: 'Mantenimiento', icon: Wrench, color: 'bg-orange-600 hover:bg-orange-700', path: '/mantenimiento' },
  ]

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6 space-y-6">

        {/* Stats - Ancho completo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={i}
                onClick={() => navigate(s.path)}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${s.iconBg} p-2 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${s.iconColor}`} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
            )
          })}
        </div>

        {/* Accesos rápidos - Ancho completo */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-600 mb-3">Accesos rápidos</p>
          <div className="flex flex-wrap gap-2">
            {shortcuts.map((s, i) => {
              const Icon = s.icon
              return (
                <button
                  key={i}
                  onClick={() => navigate(s.path)}
                  className={`${s.color} text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors`}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Contenido principal: 2 columnas - Ancho completo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Últimas ventas */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Últimas Ventas</h2>
              <button
                onClick={() => navigate('/ventas')}
                className="text-xs text-[#0a332a] hover:underline flex items-center gap-1"
              >
                Ver todas <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {loadingVentas ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : ultimasVentas.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Sin ventas registradas</p>
            ) : (
              <div className="space-y-2">
                {ultimasVentas.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {typeof v.cliente === 'string' ? v.cliente : v.cliente?.nombre_completo || 'Cliente'}
                      </p>
                      <p className="text-xs text-gray-400">{v.serie}-{v.numero_comprobante}</p>
                    </div>
                    <p className="font-bold text-[#0a332a] text-sm ml-3 shrink-0">
                      S/ {Number(v.total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inventario reciente */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Inventario</h2>
              <button
                onClick={() => navigate('/inventario')}
                className="text-xs text-[#0a332a] hover:underline flex items-center gap-1"
              >
                Ver todo <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {loadingInventario ? (
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : vehiculos.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Sin vehículos en inventario</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {vehiculosArray.slice(0, 4).map((v) => (
                  <div key={v.id} className="bg-gray-50 rounded-xl overflow-hidden">
                    <img
                      src={v.imagen || 'https://placehold.co/200x100/e2e8f0/64748b?text=Auto'}
                      alt={v.modelo}
                      className="w-full h-20 object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/200x100/e2e8f0/64748b?text=Auto' }}
                    />
                    <div className="p-2">
                      <p className="font-semibold text-gray-800 text-xs truncate">{v.marca} {v.modelo}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-gray-400">{v.anio}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          v.estado === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {v.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Banner inferior - Ancho completo */}
        <div
          onClick={() => navigate('/reportes')}
          className="bg-gradient-to-r from-[#0a332a] to-[#0d4438] text-white rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div>
            <p className="font-bold text-lg">Ver Reportes</p>
            <p className="text-white/70 text-sm mt-0.5">Analiza el rendimiento del negocio</p>
          </div>
          <ArrowRight className="w-6 h-6 text-white/60" />
        </div>

      </div>
    </div>
  )
}

export default Dashboard
