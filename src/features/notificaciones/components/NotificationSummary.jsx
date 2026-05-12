import { Gauge, CheckCircle, AlertCircle } from "lucide-react";

export const NotificationSummary = ({ total, leidas, criticas }) => {
  const stats = [
    {
      label: 'Total Notificaciones',
      value: total,
      icon: Gauge,
      gradient: 'from-[#0a332a] to-[#164d41]',
      textColor: 'text-white'
    },
    {
      label: 'Atendidas',
      value: leidas,
      icon: CheckCircle,
      gradient: 'from-emerald-500/10 to-emerald-500/5',
      textColor: 'text-emerald-400',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Pendientes Críticas',
      value: criticas,
      icon: AlertCircle,
      gradient: 'from-red-500/10 to-red-500/5',
      textColor: 'text-red-400',
      border: 'border-red-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} ${stat.border || ''} border p-6 rounded-[32px] h-32 flex flex-col justify-between shadow-lg shadow-black/5`}
        >
          <div className="flex justify-between items-start">
            <stat.icon className={`w-8 h-8 ${stat.textColor} opacity-80`} strokeWidth={1.5} />
            <span className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</span>
          </div>
          <p className={`text-sm font-medium ${stat.textColor} opacity-60`}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};
