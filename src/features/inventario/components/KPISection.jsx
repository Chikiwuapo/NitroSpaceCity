import { Car, CheckCircle, XCircle, DollarSign } from 'lucide-react';

export const KPISection = ({ kpis }) => {
  const kpiItems = [
    {
      title: 'Total Vehículos',
      value: kpis.totalVehiculos,
      icon: Car,
      color: 'bg-[#0a332a]/10',
      iconColor: 'text-[#0a332a]'
    },
    {
      title: 'Disponibles',
      value: kpis.disponibles,
      icon: CheckCircle,
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Vendidos',
      value: kpis.vendidos,
      icon: XCircle,
      color: 'bg-rose-100',
      iconColor: 'text-rose-600'
    },
    {
      title: 'Valor Total',
      value: `S/ ${kpis.valorTotal.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {kpiItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`${item.color} p-4 rounded-2xl`}>
                <Icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{item.title}</p>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
