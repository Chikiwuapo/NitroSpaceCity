import { 
  Home, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Wrench, 
  Bell, 
  FileText, 
  User, 
  TrendingUp 
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

export const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: ShoppingCart, label: 'Compras', path: '/compras' },
    { icon: DollarSign, label: 'Financiamiento', path: '/financiamiento' },
    { icon: Package, label: 'Inventario', path: '/inventario' },
    { icon: Wrench, label: 'Mantenimiento', path: '/mantenimiento' },
    { icon: Bell, label: 'Notificaciones', path: '/notificaciones' },
    { icon: FileText, label: 'Reportes', path: '/reportes' },
    { icon: User, label: 'Usuarios', path: '/usuarios' },
    { icon: TrendingUp, label: 'Ventas', path: '/ventas' },
  ]

  return (
    <aside className="bg-sidebar-green w-72 h-screen flex flex-col text-white">
      {/* Logo */}
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-white">Nitro</span>
          <span className="text-emerald-400">SpaceCity</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Navegación
        </div>
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4">
        <div className="bg-white/10 rounded-3xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Alex Williamson</div>
              <div className="text-xs text-gray-400">#dela-1974</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
