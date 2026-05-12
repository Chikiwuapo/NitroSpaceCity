import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, XCircle, Clock, Trash2, Check } from 'lucide-react';
import { useNotificationSystem } from '../features/notificaciones/hooks/useNotificationSystem';

export const DashboardNavbar = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotificationSystem();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="h-20 px-8 flex items-center justify-end bg-transparent sticky top-0 z-40">
      <div className="relative" ref={dropdownRef}>
        {/* Campana */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-white/20 transition-all shadow-sm"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {unreadCount > 9 ? '+9' : unreadCount}
            </span>
          )}
        </button>

        {/* Panel de Notificaciones */}
        {isOpen && (
          <div className="absolute right-0 mt-4 w-96 bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header del Panel */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                Notificaciones
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs rounded-full">
                    {unreadCount} nuevas
                  </span>
                )}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  title="Marcar todas como leídas"
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={clearAll}
                  title="Limpiar todo"
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lista de Notificaciones */}
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-5 flex gap-4 hover:bg-white/40 transition-colors cursor-pointer relative group ${
                        notification.unread ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-bold truncate ${notification.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0 ml-2">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${notification.unread ? 'text-gray-700' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No hay notificaciones</p>
                  <p className="text-xs text-gray-400 mt-1">Te avisaremos cuando algo ocurra</p>
                </div>
              )}
            </div>

            {/* Footer opcional */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cerrar panel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
