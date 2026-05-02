import { Plus, ArrowRight, Leaf, Droplets, MapPin } from 'lucide-react'
import { StatCard } from '../../../shared/components/StatCard'

const Dashboard = () => {
  const statCardsData = [
    {
      title: 'Ventas Totales',
      value: '$967,570',
      trend: 'up',
      percentage: '12.5',
      chartData: [20, 40, 35, 60, 50, 75, 65],
    },
    {
      title: 'Clientes Nuevos',
      value: '35',
      unit: 'mes',
      trend: 'up',
      percentage: '8.2',
      chartData: [30, 50, 40, 70, 55, 80, 45],
    },
    {
      title: 'Inventario Disponible',
      value: '75.50',
      unit: '%',
      trend: 'down',
      percentage: '1.8',
      chartData: [60, 40, 50, 30, 70, 45, 55],
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <button className="bg-sidebar-green text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          Agregar Widget
        </button>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCardsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nivel de Inventario */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-4">Nivel de Inventario</p>
          <div className="text-5xl font-bold text-gray-800 mb-4">72%</div>
          <div className="relative w-32 h-16 mx-auto mb-4">
            {/* Semi-circle progress */}
            <svg className="w-32 h-16" viewBox="0 0 100 50">
              <path
                d="M 10 48 A 40 40 0 0 1 90 48"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <path
                d="M 10 48 A 40 40 0 0 1 82 20"
                fill="none"
                stroke="#34d399"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-500 text-center">Índice de Desviación 2%</p>
        </div>

        {/* Composición de Ventas */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-4">Composición de Ventas</p>
          <div className="text-5xl font-bold text-gray-800 mb-6">86%</div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span className="text-xs text-gray-600">Autos Nuevos</span>
              <span className="text-xs font-semibold text-gray-800 ml-auto">33%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span className="text-xs text-gray-600">Autos Usados</span>
              <span className="text-xs font-semibold text-gray-800 ml-auto">28%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-gray-600">Servicios</span>
              <span className="text-xs font-semibold text-gray-800 ml-auto">25%</span>
            </div>
          </div>
          <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
            Ver Detalles
          </button>
        </div>

        {/* Distribución por Región */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-3">Distribución por Región</p>
          <p className="text-xs text-gray-400 mb-4">Porcentaje de ventas por región</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-600">Lima - 89%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              <span className="text-xs text-gray-600">Arequipa - 62%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Cusco - 45%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Trujillo - 40%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">Piura - 38%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              <span className="text-xs text-gray-600">Chiclayo - 30%</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-gray-100 rounded-xl py-2 px-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>Lima - Mayor Volumen</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Índice de Satisfacción */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
              <div className="text-white font-bold text-lg">92.5</div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 mb-1">Índice de Satisfacción del Cliente</p>
              <p className="text-sm text-gray-500">Puntuación basada en encuestas post-venta</p>
            </div>
          </div>
        </div>

        {/* Comunidad AutoValor */}
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold">AutoValor</h2>
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Únete a nuestra comunidad</h3>
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span className="text-sm text-emerald-200">Sistemas de Calidad</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <Droplets className="w-4 h-4 text-emerald-300" />
              <span className="text-sm text-emerald-200">Negocio Global</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-emerald-700"></div>
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-emerald-700"></div>
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-emerald-700"></div>
              </div>
              <span className="text-sm text-emerald-200">250k+ personas</span>
            </div>
          </div>
          {/* Decorative background */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
