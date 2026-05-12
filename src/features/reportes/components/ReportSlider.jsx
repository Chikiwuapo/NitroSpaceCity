import { useState } from 'react';
import { BarChart3, Warehouse } from 'lucide-react';
import { MainAnalytics } from './MainAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const slideNavItems = [
  { id: 0, icon: BarChart3, label: 'Ventas' },
  { id: 1, icon: Warehouse, label: 'Inventario' },
];

export const ReportSlider = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
          {slideNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSlide === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goToSlide(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#0a332a] text-white' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          <div className="min-w-full h-full pr-3">
            <MainAnalytics
              ventasMensuales={data.ventasMensuales}
              actividadUsuarios={data.actividadUsuarios}
            />
          </div>

          <div className="min-w-full h-full pl-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <div className="bg-white rounded-[32px] p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex-shrink-0">Inventario de Autos por Tipo</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.inventarioPorTipo} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0a332a" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0a332a" stopOpacity={0.3} />
                        </linearGradient>
                        <linearGradient id="colorUsados" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="tipo" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="nuevos" name="Nuevos" fill="url(#colorNuevos)" radius={[10, 10, 0, 0]} />
                      <Bar dataKey="usados" name="Usados" fill="url(#colorUsados)" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex-shrink-0">Top Vendedores del Mes</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.topVendedores} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorVendedores" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis dataKey="nombre" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={100} />
                      <Tooltip
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value) => [`${value} ventas`, 'Ventas']}
                      />
                      <Bar dataKey="ventas" fill="url(#colorVendedores)" radius={[0, 10, 10, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
