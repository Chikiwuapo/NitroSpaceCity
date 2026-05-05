import { Users, Loader2, AlertCircle, Mail, Phone, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import RegistrarUsuario from '../components/RegistrarUsuario'

const getFullName = (user) => {
  const names = [user.firstName, user.secondName, user.lastName].filter(Boolean)
  return names.join(' ')
}

const getRoleColor = (role) => {
  if (!role) return 'bg-gray-100 text-gray-700'
  switch (role.toLowerCase()) {
    case 'administrador': return 'bg-[#0a332a]/10 text-[#0a332a]'
    case 'vendedor': return 'bg-blue-100 text-blue-700'
    case 'contador': return 'bg-purple-100 text-purple-700'
    case 'jefe de ventas': return 'bg-emerald-100 text-emerald-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700'
  switch (status.toLowerCase()) {
    case 'activo': return 'bg-emerald-100 text-emerald-700'
    case 'inactivo': return 'bg-gray-100 text-gray-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const UserRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-6 w-24 bg-gray-200 rounded-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="space-y-2"><div className="h-4 w-32 bg-gray-200 rounded"></div></div></td>
    <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full"></div></td>
  </tr>
)

const UsuariosList = () => {
  const { users, loading, error } = useUsers()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const statWidgets = [
    {
      title: 'Total Usuarios',
      value: users.length,
      icon: Users,
      color: 'bg-[#0a332a]/10',
      iconColor: 'text-[#0a332a]',
    },
    {
      title: 'Usuarios Activos',
      value: users.filter(u => u.status === 'Activo').length,
      icon: Users,
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ]


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
        <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0a332a] text-white px-6 py-3 rounded-2xl hover:bg-[#0a332a]/90 transition-all shadow-lg active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          <span className="font-semibold">Nuevo Usuario</span>
        </button>
      </div>

      {/* WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white rounded-[32px] p-6 shadow-sm animate-pulse h-28 bg-gray-50"></div>
          ))
        ) : (
          statWidgets.map((widget, index) => {
            const Icon = widget.icon
            return (
              <div key={index} className="bg-white rounded-[32px] p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`${widget.color} p-4 rounded-2xl`}>
                    <Icon className={`w-6 h-6 ${widget.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{widget.title}</p>
                    <span className="text-3xl font-bold text-gray-800">{widget.value}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Documento</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading 
                ? [1, 2, 3, 4, 5].map((i) => <UserRowSkeleton key={i} />)
                : users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.photo || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
                          <p className="font-semibold text-gray-800">{getFullName(user)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-800 font-medium">DNI</p>
                        <p className="text-gray-600">{user.dni}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{user.email}</div>
                          <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{user.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

<RegistrarUsuario 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  onUserAdded={() => {
    window.location.reload(); 
  }}
/>
    </div>
  )
}

export default UsuariosList