import React, { useState, useEffect } from 'react'
import { X, Search, Plus, Car, Loader2 } from 'lucide-react'
import { inventarioApi } from '../../inventario/services/inventarioService'

const AgregarCarro = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchVehiculos()
    }
  }, [isOpen])

  const fetchVehiculos = async () => {
    try {
      setLoading(true)
      const data = await inventarioApi.getInventario()
      setVehiculos(data)
    } catch (error) {
      console.error('Error al cargar vehículos:', error)
    } finally {
      setLoading(false)
    }
  }

  const vehiculosFiltrados = vehiculos
    .filter(v => 
      `${v.marca} ${v.modelo} ${v.tipo} ${v.anio} ${v.color}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.precio || 0) - (b.precio || 0))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop oscuro local */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      
      {/* Panel Deslizante */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-[#0a332a] text-white">
          <div className="flex items-center gap-2">
            <Car size={20} />
            <h3 className="font-bold">Seleccionar Vehículo</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por marca, modelo, tipo..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Lista de Resultados */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#0a332a] animate-spin mb-4" />
              <p className="text-gray-500">Cargando vehículos...</p>
            </div>
          ) : vehiculosFiltrados.length > 0 ? (
            vehiculosFiltrados.map(v => (
              <div 
                key={v.id}
                className="border rounded-2xl p-4 hover:border-[#0a332a] hover:bg-[#0a332a]/5 transition-all cursor-pointer group"
                onClick={() => onSelect({
                  id: v.id,
                  marca: v.marca,
                  modelo: v.modelo,
                  anio: v.anio,
                  color: v.color,
                  precio: v.precio,
                  stock: v.stock,
                  img: v.imagen || 'https://via.placeholder.com/80',
                  placa: v.placa || `PLACA-${v.id}`,
                  vin: `VIN-${v.id}`,
                  tipo: v.tipo,
                  transmision: v.transmision,
                  combustible: v.combustible,
                  estado: v.estado,
                })}
              >
                <div className="flex gap-4">
                  <img src={v.imagen || 'https://via.placeholder.com/80'} alt={v.modelo} className="w-20 h-16 object-cover rounded-lg border" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80?text=Auto'; }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800">{v.marca} {v.modelo}</h4>
                      <span className="text-[#0a332a] font-bold">S/ {v.precio?.toLocaleString() || '0'}</span>
                    </div>
                    <p className="text-xs text-gray-500">Tipo: <span className="text-gray-700 font-medium">{v.tipo}</span> • Año: {v.anio} • {v.color}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Transmisión: {v.transmision} • Combustible: {v.combustible}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${(v.stock > 0 || v.estado === 'Disponible') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {v.estado} • Stock: {v.stock || 1} ud.
                      </span>
                      <button className="text-[#0a332a] text-xs font-bold flex items-center gap-1 group-hover:underline">
                        <Plus size={14} /> Seleccionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Search size={40} className="mx-auto mb-2 opacity-20" />
              <p>No se encontraron vehículos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgregarCarro