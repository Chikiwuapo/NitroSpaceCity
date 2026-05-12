import { Bell, ShoppingBag, UserPlus, Wrench, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";

const config = {
  success: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ventas: { icon: ShoppingBag, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  compras: { icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  usuarios: { icon: UserPlus, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  mantenimiento: { icon: Wrench, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  default: { icon: Bell, color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" },
};

export const NotificationItem = ({ notificacion }) => {
  const { type, tipo, title, titulo, message, mensaje, timestamp, unread, leida } = notificacion;
  
  // Manejar ambos sistemas de nombres de propiedades (el nuevo y el anterior)
  const notificationType = type || tipo || 'default';
  const notificationTitle = title || titulo;
  const notificationMessage = message || mensaje;
  const isUnread = unread !== undefined ? unread : !leida;

  const { icon: Icon, color, bg, border } = config[notificationType] || config.default;

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:bg-[#0a332a] hover:border-[#0a332a] hover:shadow-emerald-900/10 ${
        isUnread ? "bg-emerald-50/50 border-emerald-100" : ""
      }`}
    >
      {/* Icono Circular */}
      <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors`}>
        <Icon className={`${color} group-hover:text-white transition-colors`} size={22} strokeWidth={1.5} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-4">
          <h4 className={`text-sm font-bold truncate transition-colors group-hover:text-white ${
            isUnread ? "text-gray-900" : "text-gray-600"
          }`}>
            {notificationTitle}
          </h4>
          <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-medium text-gray-400 group-hover:text-white/60 transition-colors">
            <Clock size={12} />
            {formatTime(timestamp)}
          </div>
        </div>
        <p className={`text-xs mt-0.5 line-clamp-1 transition-colors group-hover:text-white/80 ${
          isUnread ? "text-gray-700 font-medium" : "text-gray-500"
        }`}>
          {notificationMessage}
        </p>
      </div>

      {/* Indicador de no leído */}
      {isUnread && (
        <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:bg-white transition-colors" />
      )}
    </div>
  );
};
