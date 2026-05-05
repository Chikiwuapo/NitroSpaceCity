import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotificaciones } from "../hooks/useNotificaciones";
import { NotificationItem } from "../components/NotificationItem";
import { NotificationSummary } from "../components/NotificationSummary";
import { NotificationFilters } from "../components/NotificationFilters";

const NotificacionesPage = () => {
  const { notificaciones, marcarTodas } = useNotificaciones();
  const [filtro, setFiltro] = useState("todas");

  const notificacionesFiltradas = notificaciones.filter((n) =>
    filtro === "todas" ? true : n.tipo === filtro
  );
  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notificaciones</h1>
          <p className="text-gray-500 text-sm mt-1">
            Actividad reciente de compras, ventas y usuarios
          </p>
        </div>
        <button
          onClick={marcarTodas}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
        >
          <CheckCheck size={18} />
          Marcar todas como leídas
        </button>
      </div>

      {/* Filtros */}
      <NotificationFilters filtro={filtro} setFiltro={setFiltro} />

      {/* Lista de notificaciones */}
      <div className="space-y-3 mb-10">
        {notificacionesFiltradas.length === 0 ? (
          <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-2">
            <Bell size={40} strokeWidth={1} />
            <p>No hay notificaciones para mostrar</p>
          </div>
        ) : (
          notificacionesFiltradas.map((n) => <NotificationItem key={n.id} notificacion={n} />)
        )}
      </div>

      {/* Resumen tipo bento */}
      <NotificationSummary total={notificaciones.length} leidas={notificaciones.length - noLeidas} criticas={noLeidas} />
    </div>
  );
};

export default NotificacionesPage;