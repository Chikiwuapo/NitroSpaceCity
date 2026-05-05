import React, { useState, useEffect } from 'react'
import { Plus, Users, TrendingUp } from 'lucide-react'
import { CustomerRow } from '../components/CustomerRow'

const statWidgets = [
  {
    title: 'Total Clientes',
    value: '1,247',
    icon: Users,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Clientes Activos',
    value: '892',
    unit: 'últimos 30 días',
    icon: TrendingUp,
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Tasa de Retención',
    value: '87.5',
    unit: '%',
    icon: TrendingUp,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
]

const ClientesList = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  const fetchClientes = async () => {
    try {
      const response = await fetch(
        'https://faithful-healing-production-9e06.up.railway.app/api/client/getAll',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()

      console.log('Respuesta backend:', data)

      const lista = data.data || data

      if (!Array.isArray(lista)) {
        throw new Error('La respuesta no es un array')
      }

      const clientesFormateados = lista.map((c) => ({
        id: c.id,
        firstName: c.primer_nombre,
        secondName: c.segundo_nombre,
        lastName: `${c.primer_apellido} ${c.segundo_apellido}`,
        dni: c.dni,
        phone: c.telefono,
        email: c.correo,
        address: c.direccion,
        photo: c.url_img,
      }))

      setClientes(clientesFormateados)
    } catch (error) {
      console.error('Error al obtener clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchClientes()
}, [])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Clientes
        </h1>

        <button className="bg-[#1a1e22] text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:bg-[#2d3135] transition-colors">
          <Plus className="w-5 h-5" />
          Agregar Cliente
        </button>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statWidgets.map((widget, index) => {
          const Icon = widget.icon
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
                      {widget.value}
                    </span>
                    {widget.unit && (
                      <span className="text-xs text-gray-500">
                        {widget.unit}
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
                clientes.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ClientesList