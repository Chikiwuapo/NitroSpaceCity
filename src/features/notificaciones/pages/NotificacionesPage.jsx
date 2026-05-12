import { useState } from "react";
import { Bell, CheckCheck, Info } from "lucide-react";
import { useNotificationSystem } from "../hooks/useNotificationSystem";
import { NotificationItem } from "../components/NotificationItem";
import { NotificationSummary } from "../components/NotificationSummary";
import { NotificationFilters } from "../components/NotificationFilters";

const NotificacionesPage = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotificationSystem();
  const [filtro, setFiltro] = useState("todas");

  const filteredNotifications = notifications.filter((n) =>
    filtro === "todas" ? true : (n.type === filtro || n.tipo === filtro)
  );
  
  const criticalCount = notifications.filter(n => (n.type === 'error' || n.type === 'warning') && n.unread).length;

  return (
    <div className="p-8">
      {/* Header Premium */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Centro de Actividad</h1>
          <p className="text-gray-500 font-medium mt-1">
            Gestiona las alertas y eventos en tiempo real de NitroSpace
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
        >
          <CheckCheck size={20} className="text-emerald-500" />
          Marcar todas como leídas
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
        {/* Tarjetas de Resumen (Top) */}
        <NotificationSummary 
          total={notifications.length} 
          leidas={notifications.length - unreadCount} 
          criticas={criticalCount} 
        />

        {/* Layout de dos columnas (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          
          {/* Columna Izquierda (70%) - Lista de Actividad */}
          <div className="lg:col-span-7 flex flex-col h-[calc(100vh-480px)]">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Historial de Notificaciones
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  {filteredNotifications.length}
                </span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {filteredNotifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Bell size={48} className="text-gray-200" strokeWidth={1} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-400">Sin notificaciones</h4>
                  <p className="text-gray-400 mt-2 max-w-xs mx-auto">
                    No hay alertas que coincidan con el filtro seleccionado en este momento.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((n) => (
                    <NotificationItem key={n.id} notificacion={n} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha (30%) - Filtros */}
          <div className="lg:col-span-3 space-y-6">
            <NotificationFilters filtro={filtro} setFiltro={setFiltro} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificacionesPage;
