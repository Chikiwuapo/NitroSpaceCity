import { useState, useEffect } from 'react';
import { reportesApi } from '../services/reportesService';

export const useReportes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reportesData = await reportesApi.getReportesData();
        setData(reportesData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los reportes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
