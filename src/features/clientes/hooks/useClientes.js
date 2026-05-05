import { useState, useEffect } from 'react';
import { clientesApi } from '../services/clientesApi';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesApi.getClientes();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return { clientes, loading, error, refetch: fetchClientes };
};

export default useClientes;
