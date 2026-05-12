import { useState, useEffect } from 'react';
import { Car, Eye, Edit, Trash2, Fuel, Zap, Gauge } from 'lucide-react';
import { Pagination } from '../../../shared/components/Pagination';

const StatusBadge = ({ estado, idVenta }) => {
  // Mapeo basado en tus fotos de la BD y tu nota
  // Priorizamos el nombre que viene de la BD, pero si no viene, usamos el ID
  const statusConfig = {
    'Disponible': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    '1': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    
    'No disponible': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    '2': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    
    'Vendido': { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
    '3': { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' }
  };

  const label = estado || (idVenta === 1 ? 'Disponible' : idVenta === 2 ? 'No Disponible' : idVenta === 3 ? 'Vendido' : 'Sin Estado');
  const config = statusConfig[estado] || statusConfig[idVenta?.toString()] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };

  return (
    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label}
    </span>
  );
};

export const InventarioTable = ({ vehiculos, onEdit, onDelete, onView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  useEffect(() => {
    setCurrentPage(1);
  }, [vehiculos]);

  const totalPages = Math.ceil((vehiculos?.length || 0) / ITEMS_PER_PAGE);
  const currentItems = vehiculos?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) || [];

  return (
    <div className="bg-white rounded-[32px] shadow-sm overflow-hidden flex flex-col border border-gray-100 flex-1 min-h-0 h-full">
      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Vista</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Vehículo</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Año / Color</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Precio</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Stock</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Mecánica / Km</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Estado</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] text-center">Acciones</th>
            </tr>
          </thead>
<tbody className="divide-y divide-gray-50">

  {!vehiculos?.length ? (
    <tr>
      <td colSpan={8} className="p-0">
        <div className="bg-white p-10 text-center">
          <Car className="mx-auto text-gray-200 mb-4" size={48} />

          <h3 className="text-lg font-bold text-gray-700">
            No hay vehículos registrados
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Agrega un vehículo para comenzar.
          </p>
        </div>
      </td>
    </tr>
  ) : (
    currentItems.map((v) => (
      <tr
        key={v.id}
        className="hover:bg-gray-50/50 transition-all group"
      >
        <td className="px-6 py-4">
          <div className="w-16 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
            <img
              src={
                v.url_img ||
                'https://via.placeholder.com/150?text=Auto'
              }
              alt={v.modelo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </td>

        <td className="px-6 py-4">
          <p className="font-bold text-gray-800 text-sm">
            {v.marca}
          </p>

          <p className="text-xs text-gray-500 font-medium">
            {v.modelo}
          </p>
        </td>

        <td className="px-6 py-4">
          <p className="text-sm font-bold text-gray-700">
            {v.anio}
          </p>

          <p className="text-[10px] text-gray-400 uppercase font-black">
            {v.color}
          </p>
        </td>

        <td className="px-6 py-4">
          <span className="text-sm font-black text-[#0a332a]">
            $
            {' '}
            {Number(v.precio_u || 0).toLocaleString()}
          </span>
        </td>

        <td className="px-6 py-4">
          <div
            className={`text-sm font-black ${
              Number(v.stock) > 0
                ? 'text-emerald-600'
                : 'text-rose-600'
            }`}
          >
            {v.stock}

            <span className="text-[10px] font-medium text-gray-400">
              {' '}
              UND
            </span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-col gap-1">

            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-bold uppercase">
              <Fuel size={12} className="text-orange-400" />

              {v.tipo_combustible}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-bold uppercase">
              <Zap size={12} className="text-blue-400" />

              {v.transmision}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <Gauge size={12} />

              {Number(v.kilometraje || 0).toLocaleString()} km
            </div>

          </div>
        </td>

        <td className="px-6 py-4">
          <StatusBadge
            estado={v.estado_vehiculo_venta}
            idVenta={v.id_estado_vehiculo_venta}
          />
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center justify-center gap-1">

            <button
              onClick={() => onView(v)}
              className="p-2 text-gray-400 hover:text-[#0a332a] hover:bg-emerald-50 rounded-lg transition-all"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() => onEdit(v)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => onDelete(v.id)}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>

          </div>
        </td>
      </tr>
    ))
  )}

</tbody>
        </table>
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};