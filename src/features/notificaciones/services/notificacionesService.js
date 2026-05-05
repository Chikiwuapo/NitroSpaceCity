// Simula el almacenamiento y emisión de notificaciones
let notificaciones = [];
let listeners = [];

export const agregarNotificacion = (nueva) => {
  const notificacion = {
    id: Date.now(),
    leida: false,
    timestamp: new Date(),
    ...nueva,
  };
  notificaciones = [notificacion, ...notificaciones];
  listeners.forEach((fn) => fn([...notificaciones]));
  return notificacion;
};

export const suscribirse = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((fn) => fn !== callback);
  };
};

export const marcarTodasLeidas = () => {
  notificaciones = notificaciones.map((n) => ({ ...n, leida: true }));
  listeners.forEach((fn) => fn([...notificaciones]));
};

export const obtenerNotificaciones = () => [...notificaciones];