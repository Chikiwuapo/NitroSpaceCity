import { Plus, Users, TrendingUp } from 'lucide-react'
import { CustomerRow } from '../components/CustomerRow'

const mockCustomers = [
  {
    id: 1,
    firstName: 'Carlos',
    secondName: 'Alberto',
    lastName: 'García Pérez',
    dni: '71234567',
    phone: '+51 987 654 321',
    email: 'carlos.garcia@gmail.com',
    address: 'Av. Arequipa 1234, Lima',
    photo: null,
  },
  {
    id: 2,
    firstName: 'María',
    secondName: 'Fernanda',
    lastName: 'López Silva',
    dni: '72345678',
    phone: '+51 912 345 678',
    email: 'maria.lopez@hotmail.com',
    address: 'Calle Los Olivos 567, Miraflores',
    photo: null,
  },
  {
    id: 3,
    firstName: 'José',
    secondName: 'Luis',
    lastName: 'Rodríguez',
    dni: '73456789',
    phone: '+51 923 456 789',
    email: 'jose.rodriguez@gmail.com',
    address: 'Jr. Pizarro 890, San Isidro',
    photo: null,
  },
  {
    id: 4,
    firstName: 'Ana',
    secondName: '',
    lastName: 'Martínez',
    dni: '74567890',
    phone: '+51 934 567 890',
    email: 'ana.martinez@yahoo.com',
    address: 'Av. Javier Prado 4567, Surco',
    photo: null,
  },
  {
    id: 5,
    firstName: 'Pedro',
    secondName: 'Pablo',
    lastName: 'González Rojas',
    dni: '75678901',
    phone: '+51 945 678 901',
    email: 'pedro.gonzalez@gmail.com',
    address: 'Calle Berlin 123, San Borja',
    photo: null,
  },
]

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
  return (
    <div className="p-8">
      {/* Header de Sección */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
        </div>
        <button className="bg-[#1a1e22] text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:bg-[#2d3135] transition-colors">
          <Plus className="w-5 h-5" />
          Agregar Cliente
        </button>
      </div>

      {/* Widgets de Resumen */}
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
                  <p className="text-sm text-gray-500 font-medium">{widget.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-800">{widget.value}</span>
                    {widget.unit && <span className="text-xs text-gray-500">{widget.unit}</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Listado de Clientes - Tabla Profesional */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Foto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {mockCustomers.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ClientesList
