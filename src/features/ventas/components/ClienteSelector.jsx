import React, { useState } from 'react'
import { X, Search, Plus, User } from 'lucide-react'
import { useClientes } from '../../clientes'
import { useNavigate } from 'react-router-dom'

const ClienteSelector = ({ selectedCliente, onSelectCliente }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { clientes, loading } = useClientes()
  const navigate = useNavigate()

  const clientesFiltrados = clientes.filter(c => 
    `${c.primer_nombre || ''} ${c.segundo_nombre || ''} ${c.primer_apellido || ''} ${c.segundo_apellido || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.dni && c.dni.includes(searchTerm))
  )

  const handleSelectCliente = (cliente) => {
    onSelectCliente(cliente)
    setIsDropdownOpen(false)
    setSearchTerm('')
  }

  return (
    <>
      <div className="relative">
        <div
          className={`border rounded-lg p-2 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-[#0a332a] cursor-pointer flex items-center justify-between ${isDropdownOpen ? 'border-[#0a332a] ring-1 ring-[#0a332a]' : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedCliente ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedCliente.url_img || 'https://via.placeholder.com/40'}
                alt={selectedCliente.nombre_completo}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-800 font-medium">{selectedCliente.nombre_completo}</span>
            </div>
          ) : (
            <span className="text-gray-500">Seleccionar cliente</span>
          )}
        </div>

        {isDropdownOpen && (
          <>
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-2 border-b sticky top-0 bg-white">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o DNI..."
                    className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#0a332a]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              <div className="p-1">
                {loading ? (
                  <div className="p-4 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#0a332a] animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Cargando...</span>
                  </div>
                ) : clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="p-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-2"
                      onClick={() => handleSelectCliente(cliente)}
                    >
                      <img
                        src={cliente.url_img || 'https://via.placeholder.com/40'}
                        alt={cliente.nombre_completo}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{cliente.nombre_completo}</p>
                        {cliente.dni && (
                          <p className="text-xs text-gray-500">DNI: {cliente.dni}</p>
                        )}
                      </div>
                      {selectedCliente?.id === cliente.id && (
                        <CheckCircle2 className="w-5 h-5 text-[#0a332a]" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No se encontraron clientes
                  </div>
                )}
              </div>

              <div className="p-2 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDropdownOpen(false)
                    navigate('/clientes')
                  }}
                  className="w-full p-2 flex items-center justify-center gap-2 text-[#0a332a] hover:bg-[#0a332a]/5 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Crear nuevo cliente</span>
                </button>
              </div>
            </div>

            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
          </>
        )}
      </div>
    </>
  )
}

export default ClienteSelector
