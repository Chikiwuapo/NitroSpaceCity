import React, { useState } from 'react'
import { X, Search, Plus, Car } from 'lucide-react'

const AgregarCarro = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Simulación de base de datos de stock
  const inventario = [
    { id: 101, marca: 'Toyota', modelo: 'Corolla', vin: 'JT1234567890', placa: 'ABC-123', precio: 80000, anio: 2024, color: 'Blanco', stock: 5, img: 'https://via.placeholder.com/80' },
    { id: 102, marca: 'Honda', modelo: 'Civic', vin: 'HC9876543210', placa: 'DEF-456', precio: 75000, anio: 2024, color: 'Gris', stock: 2, img: 'https://via.placeholder.com/80' },
    { id: 103, marca: 'Hyundai', modelo: 'Tucson', vin: 'HY1122334455', placa: 'GHI-789', precio: 92000, anio: 2023, color: 'Azul', stock: 3, img: 'https://via.placeholder.com/80' },
  ]

  const vehiculosFiltrados = inventario.filter(v => 
    `${v.marca} ${v.modelo} ${v.placa} ${v.vin}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              placeholder="Buscar por placa, modelo o VIN..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0a332a]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Lista de Resultados */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {vehiculosFiltrados.length > 0 ? (
            vehiculosFiltrados.map(v => (
              <div 
                key={v.id}
                className="border rounded-2xl p-4 hover:border-[#0a332a] hover:bg-[#0a332a]/5 transition-all cursor-pointer group"
                onClick={() => onSelect(v)}
              >
                <div className="flex gap-4">
                  <img src={v.img} alt={v.modelo} className="w-20 h-16 object-cover rounded-lg border" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800">{v.marca} {v.modelo}</h4>
                      <span className="text-[#0a332a] font-bold">S/ {v.precio.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">Placa: <span className="text-gray-700 font-medium">{v.placa}</span> • Año: {v.anio}</p>
                    <p className="text-[10px] text-gray-400 mt-1">VIN: {v.vin}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${v.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Stock: {v.stock} uds.
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