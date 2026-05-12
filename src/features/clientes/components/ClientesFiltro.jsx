import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const ClientesFiltros = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Barra de Búsqueda */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o correo..."
            className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a] transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
      
      {/* Badge de resultados */}
      {searchTerm && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Mostrando resultados para:</span>
          <span className="px-2 py-1 bg-[#0a332a]/10 text-[#0a332a] text-xs font-bold rounded-lg">
            {searchTerm}
          </span>
        </div>
      )}
    </div>
  );
};

export default ClientesFiltros;