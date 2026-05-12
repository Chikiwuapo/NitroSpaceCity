import { useState, useEffect, useCallback } from 'react';

const NOTIFICATIONS_KEY = 'nitrospace_notifications';
const EVENT_NAME = 'app:notification';

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Cargar notificaciones iniciales
  const loadNotifications = useCallback(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Escuchar cambios desde otros componentes/ventanas
    const handleStorageChange = (e) => {
      if (e.key === NOTIFICATIONS_KEY) {
        loadNotifications();
      }
    };

    const handleCustomEvent = () => {
      loadNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(EVENT_NAME, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(EVENT_NAME, handleCustomEvent);
    };
  }, [loadNotifications]);

  const pushAlert = (title, message, type = 'success') => {
    try {
      const stored = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      
      const newNotification = {
        id: Date.now(),
        title,
        message,
        type, // 'success' | 'warning' | 'error'
        unread: true,
        timestamp: new Date().toISOString(),
      };

      const updatedNotifications = [newNotification, ...stored];
      
      // Persistir en localStorage
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
      
      // Disparar evento personalizado para actualizar componentes en la misma ventana
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
      
      return newNotification;
    } catch (error) {
      console.error('Error pushing alert:', error);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    );
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  };

  const clearAll = () => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => n.unread).length,
    pushAlert,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};

export default useNotificationSystem;
