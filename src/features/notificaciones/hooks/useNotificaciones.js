import { useState, useEffect } from "react";
import { suscribirse, marcarTodasLeidas } from "../services/notificacionesService";

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const unsuscribe = suscribirse(setNotificaciones);
    return unsuscribe;
  }, []);

  const marcarTodas = () => {
    marcarTodasLeidas();
  };

  return { notificaciones, marcarTodas };
};