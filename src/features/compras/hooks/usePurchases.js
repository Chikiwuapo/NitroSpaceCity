import { useState, useEffect, useCallback } from 'react';
import { comprasApi } from '../services/comprasApi';
import { useNotificationSystem } from '../../notificaciones/hooks/useNotificationSystem';

export const usePurchases = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pushAlert } = useNotificationSystem();

  const fetchPurchases = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const registerPurchase = async (purchaseData) => {
    try {
      await comprasApi.registerPurchase(purchaseData);
      await fetchPurchases();
    } catch (err) {
      throw err;
    }
  };

  const updatePurchase = async (id, purchaseData) => {
    try {
      await comprasApi.updatePurchase(id, purchaseData);
      await fetchPurchases();
    } catch (err) {
      throw err;
    }
  };

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchPurchases,
    registerPurchase,
    updatePurchase
  };
};

export default usePurchases;
