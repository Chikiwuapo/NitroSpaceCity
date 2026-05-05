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
  TrendingUp,
  LogOut
} from 'lucide-react'
import { NavLink,useNavigate } from 'react-router-dom'
import { PERMISSIONS } from '../logueo/roles'
export const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard' },
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
  const user = JSON.parse(localStorage.getItem('user'))
  const allowedRoutes = PERMISSIONS[user?.role] || []

const filteredNavItems = navItems.filter(item =>
  allowedRoutes.includes(item.path)
)
const navigate = useNavigate()

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  navigate('/login')
}
  return (
    <aside className="fixed top-0 left-0 w-72 h-screen bg-sidebar-green flex flex-col text-white">
      {/* Logo */}
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-white">Nitro</span>
          <span className="text-emerald-400">Space</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Navegación
        </div>
        {filteredNavItems.map((item, index) => (
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
{/* Logout */}
<div className="px-4 mb-4">
  <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-red-500/20 transition-all"
  >
    <LogOut className="w-5 h-5" />
    <span className="font-medium">Cerrar sesión</span>
  </button>
</div>
      {/* User Card */}
      <div className="p-4">
        <div className="bg-white/10 rounded-3xl p-4">
          <div className="flex items-center gap-3 min-w-0"> {/* Añadir min-w-0 */}
  <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center">
    <User className="w-5 h-5" />
  </div>
  <div className="min-w-0"> {/* Añadir min-w-0 */}
    <div className="font-semibold truncate">
      {user?.primer_nombre || 'Usuario'}
    </div>
    <div className="text-xs text-gray-400 truncate">
      {user?.correo || ''}
    </div>
  </div>
</div>
              </div>
            </div>
          </aside>
  )
}
