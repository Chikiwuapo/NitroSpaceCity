import { useState, useEffect } from 'react';
import { comprasApi } from '../services/comprasApi';

export const usePurchases = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const purchases = await comprasApi.getPurchases();
        setData(purchases);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar las compras');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return { data, loading, error };
};

export default usePurchases;
