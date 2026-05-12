import { DollarSign, Car, Users, TrendingUp, FileText, Target, TrendingDown } from 'lucide-react';

const iconMap = {
  DollarSign: DollarSign,
  Car: Car,
  Users: Users,
  TrendingUp: TrendingUp,
  FileText: FileText,
  Target: Target
};

export const KPIGrid = ({ kpis }) => {
  const gridCols = kpis.length <= 3 ? `xl:grid-cols-${kpis.length}` : 'xl:grid-cols-6';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-6 mb-8`}>
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.icon];
        const isUp = kpi.trend === 'up';
        const TrendIcon = isUp ? TrendingUp : TrendingDown;
        
        return (
          <div key={kpi.id} className="bg-white rounded-[32px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`${kpi.color} p-4 rounded-2xl`}>
                <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{kpi.percentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
