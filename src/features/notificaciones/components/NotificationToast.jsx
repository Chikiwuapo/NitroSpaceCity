import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export const NotificationToast = ({ notificacion, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getColor = () => {
    switch (notificacion.tipo) {
      case "ventas": return "text-emerald-600 bg-emerald-100";
      case "compras": return "text-blue-600 bg-blue-100";
      case "usuarios": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 pr-8 flex items-start gap-3 animate-in slide-in-from-right-4 duration-300 max-w-sm">
      <div className={`w-8 h-8 rounded-full ${getColor()} flex items-center justify-center`}>
        <CheckCircle2 size={18} className="text-current" />
      </div>
      <div>
        <h5 className="font-semibold text-gray-800 text-sm">{notificacion.titulo}</h5>
        <p className="text-xs text-gray-500">{notificacion.mensaje}</p>
      </div>
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">
        <X size={14} />
      </button>
    </div>
  );
};