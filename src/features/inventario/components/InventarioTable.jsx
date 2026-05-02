import { Car, Eye, Edit, Trash2 } from 'lucide-react';

const StatusBadge = ({ estado }) => {
  const statusConfig = {
    Disponible: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    Reservado: { bg: 'bg-amber-100', text: 'text-amber-700' },
    Vendido: { bg: 'bg-rose-100', text: 'text-rose-700' }
  };

  const config = statusConfig[estado] || statusConfig.Disponible;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {estado}
    </span>
  );
};

export const InventarioTable = ({ vehiculos }) => {
  return (
    <div className="bg-white rounded-[32px] shadow-sm overflow-hidden flex flex-col flex-1">
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Vehículo
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Marca/Modelo
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Características
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Atributos
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="w-20 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                  {vehiculo.imagen ? (
                    <img src={vehiculo.imagen} alt={vehiculo.modelo} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Car className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-semibold text-gray-800">{vehiculo.marca}</p>
                  <p className="text-sm text-gray-500">{vehiculo.modelo}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  <p>{vehiculo.anio} • {vehiculo.color}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-gray-800">S/ {vehiculo.precio.toLocaleString()}</p>
              </td>
              <td className="px-6 py-4">
                <p className={`font-semibold ${vehiculo.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {vehiculo.stock}
                </p>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  <p>{vehiculo.combustible} • {vehiculo.transmision}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge estado={vehiculo.estado} />
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-[#0a332a] hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};
