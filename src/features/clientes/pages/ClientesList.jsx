import React, { useState } from 'react'
import { Plus, Users, TrendingUp, Edit, Trash2 } from 'lucide-react'
import { useClientes } from '../hooks/useClientes'
import { clientesApi } from '../services/clientesApi'
import ClienteForm from '../components/ClienteForm'

const statWidgets = [
  {
    title: 'Total Clientes',
    icon: Users,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Clientes Activos',
    icon: TrendingUp,
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Tasa de Retención',
    icon: TrendingUp,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
]

const ClientesList = () => {
  const { clientes, loading, error, refetch } = useClientes()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [clienteToEdit, setClienteToEdit] = useState(null)

  const stats = {
    totalClientes: clientes.length,
    clientesActivos: Math.round(clientes.length * 0.7),
    tasaRetencion: 87.5,
  }

  const handleEdit = (cliente) => {
    setClienteToEdit(cliente)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await clientesApi.deleteCliente(id)
        refetch()
      } catch (error) {
        console.error('Error al eliminar:', error)
        alert('Error al eliminar el cliente')
      }
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Clientes
        </h1>

        <button 
          onClick={() => {
            setClienteToEdit(null)
            setIsFormOpen(true)
          }}
          className="bg-[#0a332a] text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:bg-[#0d4438] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Cliente
        </button>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statWidgets.map((widget, index) => {
          const Icon = widget.icon
          let value = '-'
          let unit = null
          
          if (index === 0) value = stats.totalClientes
          if (index === 1) {
            value = stats.clientesActivos
            unit = 'últimos 30 días'
          }
          if (index === 2) {
            value = stats.tasaRetencion
            unit = '%'
          }

          return (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`${widget.color} p-4 rounded-2xl`}>
                  <Icon className={`w-6 h-6 ${widget.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {widget.title}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-800">
                      {value}
                    </span>
                    {unit && (
                      <span className="text-xs text-gray-500">
                        {unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Foto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Nombre Completo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  DNI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Dirección
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Cargando clientes...
                  </td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    No hay clientes
                  </td>
                </tr>
              ) : (
                clientes.map((c) => {
                  const getFullName = () => {
                    const names = [c.primer_nombre, c.segundo_nombre, c.primer_apellido, c.segundo_apellido].filter(Boolean)
                    return names.join(' ')
                  }

                  const getInitials = () => {
                    const initials = [c.primer_nombre?.[0], c.primer_apellido?.[0]].filter(Boolean).join('')
                    return initials.toUpperCase()
                  }

                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {c.url_img ? (
                            <img
                              src={c.url_img}
                              alt={getFullName()}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#0a332a] flex items-center justify-center text-white font-semibold text-sm">
                              {getInitials()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-800">{getFullName()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{c.dni}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {c.telefono && (
                            <div className="flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5 text-gray-400" style={{ visibility: 'hidden' }} />
                              <span className="text-xs text-gray-600">{c.telefono}</span>
                            </div>
                          )}
                          {c.correo && (
                            <div className="flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5 text-gray-400" style={{ visibility: 'hidden' }} />
                              <span className="text-xs text-gray-600 truncate max-w-[180px]">{c.correo}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 truncate max-w-[200px] block">{c.direccion}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(c)}
                            className="p-2 text-gray-400 hover:text-[#0a332a] hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(c.id)}
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClienteForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        clienteToEdit={clienteToEdit}
        onSuccess={() => {
          refetch()
          setClienteToEdit(null)
        }}
      />
    </div>
  )
}

export default ClientesList