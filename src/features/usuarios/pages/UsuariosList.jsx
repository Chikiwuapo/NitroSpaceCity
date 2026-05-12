import { Users, Loader2, AlertCircle, Mail, Phone, UserPlus, Search, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useUsers } from '../hooks/useUsers'
import RegistrarUsuario from '../components/RegistrarUsuario'
import { Pagination } from '../../../shared/components/Pagination'
import { LoadingAnimation } from '../../../shared/components/LoadingAnimation';

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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 7

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterRole])

  const filteredUsers = users.filter(user => {
    const searchMatch = !searchTerm || 
      getFullName(user).toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.dni?.includes(searchTerm);
    const roleMatch = !filterRole || user.role?.toLowerCase() === filterRole.toLowerCase();
    
    return searchMatch && roleMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f6f9]">
        <LoadingAnimation />
      </div>
    );
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
      {/* Header Removido, el botón va a los filtros */}

      {/* WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statWidgets.map((widget, index) => {
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
        })}
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white p-6 rounded-[32px] shadow-sm">
        <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all text-sm shadow-sm"
            />
          </div>
          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all text-sm shadow-sm appearance-none"
            >
              <option value="">Todos los roles</option>
              <option value="administrador">Administrador</option>
              <option value="empleado">Empleado</option>
              <option value="mecanico">Mecánico</option>
            </select>
          </div>
        </div>

        {/* Botón Nuevo Usuario */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0a332a] px-6 py-3 font-semibold text-white hover:bg-[#0a332a]/90 transition-all shadow-sm whitespace-nowrap w-full md:w-auto"
        >
          <UserPlus className="w-5 h-5" /> Nuevo Usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-x-auto flex-1">
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
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : currentItems.map((user) => (
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
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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