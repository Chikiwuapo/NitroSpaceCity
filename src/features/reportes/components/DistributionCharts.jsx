import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const DistributionCharts = ({ metodosPago, estadoEntregas }) => {
  const renderDonutChart = (data, title) => {
    return (
      <div className="bg-white rounded-[32px] p-6 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex-shrink-0">{title}</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value) => [`${value}%`, 'Porcentaje']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {renderDonutChart(metodosPago, 'Métodos de Pago')}
      {renderDonutChart(estadoEntregas, 'Estado de Entregas')}
    </div>
  );
};
