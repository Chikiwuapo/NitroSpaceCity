import { Bell, ShoppingBag, UserPlus, Wrench, CheckCircle2 } from "lucide-react";

const iconos = {
  ventas: { icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-500" },
  compras: { icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-500" },
  usuarios: { icon: UserPlus, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-500" },
  mantenimiento: { icon: Wrench, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-500" },
  default: { icon: Bell, color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-300" },
};

export const NotificationItem = ({ notificacion }) => {
  const { tipo, titulo, mensaje, timestamp, leida } = notificacion;
  const { icon: Icon, color, bg, border } = iconos[tipo] || iconos.default;

  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-sm flex items-start gap-4 border-l-4 ${border} hover:bg-gray-50 transition-all cursor-pointer ${leida ? "opacity-80" : ""}`}
    >
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={color} size={20} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="font-semibold text-gray-800">{titulo}</h4>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm text-gray-600">{mensaje}</p>
      </div>
      {!leida && <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-1" />}
    </div>
  );
};