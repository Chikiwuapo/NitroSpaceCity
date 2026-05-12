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
      pushAlert('Compra Actualizada', 'La compra se actualizó correctamente', 'success');
      await fetchPurchases();
    } catch (err) {
      pushAlert('Error', err.message || 'No se pudo actualizar la compra', 'error');
      throw err;
    }
  };

  const deletePurchase = async (id) => {
    try {
      await comprasApi.deletePurchase(id);
      pushAlert('Compra Eliminada', 'La compra se eliminó correctamente', 'success');
      await fetchPurchases();
    } catch (err) {
      pushAlert('Error', err.message || 'No se pudo eliminar la compra', 'error');
      throw err;
    }
  };

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchPurchases,
    registerPurchase,
    updatePurchase,
    deletePurchase
  };
};

export default usePurchases;
