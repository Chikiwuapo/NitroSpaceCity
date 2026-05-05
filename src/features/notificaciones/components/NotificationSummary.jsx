import { Gauge, CheckCircle, AlertCircle } from "lucide-react";

export const NotificationSummary = ({ total, leidas, criticas }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-[#062D24] text-white p-5 rounded-xl flex justify-between items-end h-32">
        <Gauge size={32} className="opacity-50" />
        <div className="text-right">
          <div className="text-3xl font-bold">{total}</div>
          <div className="text-xs opacity-70">Total notificaciones</div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-end h-32">
        <CheckCircle size={28} className="text-blue-500" />
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800">{leidas}</div>
          <div className="text-xs text-gray-500">Atendidas</div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-end h-32">
        <AlertCircle size={28} className="text-red-500" />
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800">{criticas}</div>
          <div className="text-xs text-gray-500">Pendientes críticas</div>
        </div>
      </div>
    </div>
  );
};