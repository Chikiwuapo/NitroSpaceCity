import { useState, useEffect, useCallback } from 'react';
import { providerService } from '../services/providerService';

export const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await providerService.getProviders();
      setProviders(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los proveedores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const addProvider = async (providerData) => {
    try {
      await providerService.createProvider(providerData);
      await fetchProviders();
    } catch (err) {
      throw err;
    }
  };

  const updateProvider = async (id, providerData) => {
    try {
      await providerService.updateProvider(id, providerData);
      await fetchProviders();
    } catch (err) {
      throw err;
    }
  };

  return { 
    providers, 
    loading, 
    error, 
    refetch: fetchProviders,
    addProvider,
    updateProvider
  };
};

export default useProviders;
