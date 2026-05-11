import { Search, RefreshCw, Filter } from 'lucide-react';

export const InventarioFilters = ({
  filters,
  marcas = [],
  onFilterChange,
  onReset
}) => {
  
  // Función para asegurar que las opciones sean únicas y no nulas
  const getUniqueOptions = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    return [...new Set(arr)].filter(Boolean).sort();
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm mb-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4 text-[#0a332a]">
        <Filter size={18} />
        <h2 className="text-sm font-black uppercase tracking-widest">Filtros de Inventario</h2>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        {/* Barra de Búsqueda */}
        <div className="flex-1 min-w-[250px]">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Búsqueda Rápida</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Marca, modelo o año..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/10 focus:border-[#0a332a] transition-all"
            />
          </div>
        </div>

        {/* Marca */}
        <div className="min-w-[140px]">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Marca</label>
          <select
            value={filters.marca || ''}
            onChange={(e) => onFilterChange('marca', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/10 cursor-pointer"
          >
            <option value="">Todas</option>
            {getUniqueOptions(marcas).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Estado de Venta (ID 1, 2, 3) */}
        <div className="min-w-[140px]">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Estado Venta</label>
          <select
            value={filters.estado || ''}
            onChange={(e) => onFilterChange('estado', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/10 cursor-pointer"
          >
            <option value="">Todos</option>
            <option value="1">Disponible</option>
            <option value="2">No disponible</option>
            <option value="3">Vendido</option>
          </select>
        </div>

        {/* Transmisión (Valor sin tilde para match con API) */}
        <div className="min-w-[140px]">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Caja</label>
          <select
            value={filters.transmision || ''}
            onChange={(e) => onFilterChange('transmision', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/10 cursor-pointer"
          >
            <option value="">Todas</option>
            <option value="Mecánica">Mecánica</option>
            <option value="Automatica">Automática</option>
          </select>
        </div>

        {/* Combustible (Nuevo Filtro) */}
        <div className="min-w-[140px]">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Combustible
          </label>
          <select
            value={filters.combustible || ''}
            onChange={(e) => onFilterChange('combustible', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/10 cursor-pointer"
          >
            <option value="">Todos</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Eléctrico">Eléctrico</option>
            <option value="Híbrido">Híbrido</option>
            <option value="GLP">GLP</option>
            <option value="GNV">GNV</option>
          </select>
        </div>

        {/* Rangos de Precio */}
        <div className="flex gap-2">
          <div className="w-[110px]">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Precio Mín</label>
            <input
              type="number"
              value={filters.precioMin || ''}
              onChange={(e) => onFilterChange('precioMin', e.target.value)}
              placeholder="Min"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/10"
            />
          </div>
          <div className="w-[110px]">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Precio Máx</label>
            <input
              type="number"
              value={filters.precioMax || ''}
              onChange={(e) => onFilterChange('precioMax', e.target.value)}
              placeholder="Max"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/10"
            />
          </div>
        </div>

        {/* Botón Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-500 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-xs uppercase tracking-widest border border-transparent hover:border-rose-100"
        >
          <RefreshCw className="w-4 h-4" />
          Limpiar
        </button>
      </div>
    </div>
  );
};