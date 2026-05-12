import { useState, useMemo } from 'react'
import { Wrench, AlertTriangle, CheckCircle, Clock, Search, Filter } from 'lucide-react'
import { Pagination } from '../../../shared/components/Pagination'

// Datos simulados de 20 vehículos con fallas
const vehiculosConFallas = [
  { id: 1, marca: 'Toyota', modelo: 'Corolla', anio: 2018, placa: 'ABC-123', imagen: 'https://toyotayacopini.com/wp-content/uploads/2023/03/toyota-yaris-2022-1.jpg', fallas: ['Motor con ruido', 'Frenos desgastados'], prioridad: 'alta', estado: 'En espera' },
  { id: 2, marca: 'Honda', modelo: 'Civic', anio: 2019, placa: 'DEF-456', imagen: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2010_Hyundai_Accent_%28cropped%29.jpg', fallas: ['Transmisión defectuosa'], prioridad: 'alta', estado: 'En reparación' },
  { id: 3, marca: 'Nissan', modelo: 'Sentra', anio: 2017, placa: 'GHI-789', imagen: 'https://automercantiltoyota.com/wp-content/uploads/2016/10/1c200impverde.png', fallas: ['Suspensión dañada', 'Luces delanteras'], prioridad: 'media', estado: 'En espera' },
  { id: 4, marca: 'Mazda', modelo: 'CX-5', anio: 2020, placa: 'JKL-012', imagen: 'https://toyotayacopini.com/wp-content/uploads/2023/03/toyota-yaris-2022-1.jpg', fallas: ['Sistema eléctrico'], prioridad: 'baja', estado: 'Completado' },
  { id: 5, marca: 'Hyundai', modelo: 'Elantra', anio: 2016, placa: 'MNO-345', imagen: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2010_Hyundai_Accent_%28cropped%29.jpg', fallas: ['Aire acondicionado', 'Batería baja'], prioridad: 'media', estado: 'En reparación' },
  { id: 6, marca: 'Kia', modelo: 'Sportage', anio: 2021, placa: 'PQR-678', imagen: 'https://automercantiltoyota.com/wp-content/uploads/2016/10/1c200impverde.png', fallas: ['Neumáticos desgastados'], prioridad: 'baja', estado: 'En espera' },
  { id: 7, marca: 'Chevrolet', modelo: 'Cruze', anio: 2015, placa: 'STU-901', imagen: 'https://toyotayacopini.com/wp-content/uploads/2023/03/toyota-yaris-2022-1.jpg', fallas: ['Motor sobrecalentado', 'Radiador'], prioridad: 'alta', estado: 'En reparación' },
  { id: 8, marca: 'Ford', modelo: 'Focus', anio: 2019, placa: 'VWX-234', imagen: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2010_Hyundai_Accent_%28cropped%29.jpg', fallas: ['Embrague desgastado'], prioridad: 'media', estado: 'En espera' },
  { id: 9, marca: 'Volkswagen', modelo: 'Jetta', anio: 2018, placa: 'YZA-567', imagen: 'https://automercantiltoyota.com/wp-content/uploads/2016/10/1c200impverde.png', fallas: ['Sistema de frenos ABS'], prioridad: 'alta', estado: 'En reparación' },
  { id: 10, marca: 'Renault', modelo: 'Logan', anio: 2017, placa: 'BCD-890', imagen: 'https://toyotayacopini.com/wp-content/uploads/2023/03/toyota-yaris-2022-1.jpg', fallas: ['Caja de cambios', 'Clutch'], prioridad: 'alta', estado: 'En espera' },
  { id: 11, marca: 'Peugeot', modelo: '208', anio: 2020, placa: 'EFG-123', imagen: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2010_Hyundai_Accent_%28cropped%29.jpg', fallas: ['Dirección asistida'], prioridad: 'media', estado: 'Completado' },
  { id: 12, marca: 'Suzuki', modelo: 'Swift', anio: 2016, placa: 'HIJ-456', imagen: 'https://automercantiltoyota.com/wp-content/uploads/2016/10/1c200impverde.png', fallas: ['Escape roto', 'Catalizador'], prioridad: 'media', estado: 'En reparación' },
  { id: 13, marca: 'Mitsubishi', modelo: 'Lancer', anio: 2015, placa: 'KLM-789', imagen: 'https://toyotayacopini.com/wp-content/uploads/2023/03/toyota-yaris-2022-1.jpg', fallas: ['Bomba de agua'], prioridad: 'baja', estado: 'En espera' },
  { id: 14, marca: 'Subaru', modelo: 'Impreza', anio: 2019, placa: 'NOP-012', imagen: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2010_Hyundai_Accent_%28cropped%29.jpg', fallas: ['Turbo dañado', 'Inyectores'], prioridad: 'alta', estado: 'En reparación' },
  { id: 15, marca: 'Seat', modelo: 'Ibiza', anio: 2018, placa: 'QRS-345', imagen: 'https://automercantiltoyota.com/wp-content/uploads/2016/10/1c200impverde.png', fallas: ['Amortiguadores'], prioridad: 'baja', estado: 'Completado' },
  { id: 16, marca: 'Fiat', modelo: 'Punto', anio: 2017, placa: 'TUV-678', imagen: 'https://toyotayacopini.com/wp-content/uploads/2023/03/toyota-yaris-2022-1.jpg', fallas: ['Sistema de encendido', 'Bujías'], prioridad: 'media', estado: 'En espera' },
  { id: 17, marca: 'Audi', modelo: 'A3', anio: 2020, placa: 'WXY-901', imagen: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2010_Hyundai_Accent_%28cropped%29.jpg', fallas: ['Sensor de oxígeno'], prioridad: 'baja', estado: 'En reparación' },
  { id: 18, marca: 'BMW', modelo: 'Serie 3', anio: 2016, placa: 'ZAB-234', imagen: 'https://automercantiltoyota.com/wp-content/uploads/2016/10/1c200impverde.png', fallas: ['Válvula EGR', 'Filtro de partículas'], prioridad: 'alta', estado: 'En espera' },
  { id: 19, marca: 'Mercedes', modelo: 'Clase A', anio: 2019, placa: 'CDE-567', imagen: 'https://toyotayacopini.com/wp-content/uploads/2023/03/toyota-yaris-2022-1.jpg', fallas: ['Correa de distribución'], prioridad: 'media', estado: 'Completado' },
  { id: 20, marca: 'Volvo', modelo: 'S60', anio: 2018, placa: 'FGH-890', imagen: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2010_Hyundai_Accent_%28cropped%29.jpg', fallas: ['Sistema de refrigeración', 'Termostato'], prioridad: 'media', estado: 'En reparación' },
]

const MantenimientoPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterPrioridad, setFilterPrioridad] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8 // 2 filas x 4 columnas

  const vehiculosFiltrados = useMemo(() => {
    return vehiculosConFallas.filter(v => {
      const matchSearch = !searchTerm || 
        v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.placa.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchEstado = !filterEstado || v.estado === filterEstado
      const matchPrioridad = !filterPrioridad || v.prioridad === filterPrioridad

      return matchSearch && matchEstado && matchPrioridad
    })
  }, [searchTerm, filterEstado, filterPrioridad])

  const totalPages = Math.ceil(vehiculosFiltrados.length / ITEMS_PER_PAGE)
  const currentItems = vehiculosFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const stats = {
    total: vehiculosConFallas.length,
    enEspera: vehiculosConFallas.filter(v => v.estado === 'En espera').length,
    enReparacion: vehiculosConFallas.filter(v => v.estado === 'En reparación').length,
    completados: vehiculosConFallas.filter(v => v.estado === 'Completado').length,
  }

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-700 border-red-200'
      case 'media': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'baja': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'En espera': return 'bg-blue-100 text-blue-700'
      case 'En reparación': return 'bg-amber-100 text-amber-700'
      case 'Completado': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'En espera': return <Clock className="w-4 h-4" />
      case 'En reparación': return <Wrench className="w-4 h-4" />
      case 'Completado': return <CheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mantenimiento de Vehículos</h1>
        <p className="text-gray-500">Gestión de vehículos de segunda mano con fallas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-2xl">
              <Wrench className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Vehículos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">En Espera</p>
              <p className="text-2xl font-bold text-gray-800">{stats.enEspera}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">En Reparación</p>
              <p className="text-2xl font-bold text-gray-800">{stats.enReparacion}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Completados</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-3xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo o placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all text-sm"
            />
          </div>

          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all text-sm appearance-none"
            >
              <option value="">Todos los estados</option>
              <option value="En espera">En espera</option>
              <option value="En reparación">En reparación</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div className="relative md:w-48">
            <select
              value={filterPrioridad}
              onChange={(e) => setFilterPrioridad(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all text-sm appearance-none"
            >
              <option value="">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Vehículos - 4 por fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentItems.map((vehiculo) => (
          <div key={vehiculo.id} className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={vehiculo.imagen}
                alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(vehiculo.prioridad)}`}>
                  <AlertTriangle className="w-3 h-3" />
                  {vehiculo.prioridad.charAt(0).toUpperCase() + vehiculo.prioridad.slice(1)}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{vehiculo.marca} {vehiculo.modelo}</h3>
                  <p className="text-sm text-gray-500">{vehiculo.anio} • {vehiculo.placa}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Fallas detectadas:</p>
                <div className="space-y-1">
                  {vehiculo.fallas.map((falla, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">{falla}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${getEstadoColor(vehiculo.estado)}`}>
                  {getEstadoIcon(vehiculo.estado)}
                  {vehiculo.estado}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vehiculosFiltrados.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
          <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron vehículos con los filtros aplicados</p>
        </div>
      )}

      {/* Paginación */}
      {vehiculosFiltrados.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

export default MantenimientoPage
