import { Search, RefreshCw } from 'lucide-react';

export const InventarioFilters = ({
  filters,
  marcas,
  tipos,
  estados,
  transmisiones,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Buscar por marca o modelo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a]"
            />
          </div>
        </div>

        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
          <select
            value={filters.marca}
            onChange={(e) => onFilterChange('marca', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a]"
          >
            <option value="">Todas</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select
            value={filters.tipo}
            onChange={(e) => onFilterChange('tipo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a]"
          >
            <option value="">Todos</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            value={filters.estado}
            onChange={(e) => onFilterChange('estado', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a]"
          >
            <option value="">Todos</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Transmisión</label>
          <select
            value={filters.transmision}
            onChange={(e) => onFilterChange('transmision', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a]"
          >
            <option value="">Todas</option>
            {transmisiones.map((transmision) => (
              <option key={transmision} value={transmision}>{transmision}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio Mín</label>
          <input
            type="number"
            value={filters.precioMin}
            onChange={(e) => onFilterChange('precioMin', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a]"
          />
        </div>

        <div className="min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máx</label>
          <input
            type="number"
            value={filters.precioMax}
            onChange={(e) => onFilterChange('precioMax', e.target.value)}
            placeholder="999999"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a332a]/20 focus:border-[#0a332a]"
          />
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Resetear
        </button>
      </div>
    </div>
  );
};
