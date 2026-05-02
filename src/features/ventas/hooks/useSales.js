import { useState, useEffect } from 'react';
import { ventasApi } from '../services/ventasApi';

export const useSales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const sales = await ventasApi.getSales();
        setData(sales);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar las ventas');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return { data, loading, error };
};
