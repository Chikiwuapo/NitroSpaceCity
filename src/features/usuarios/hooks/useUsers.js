import { useState, useEffect } from 'react';
import { usuariosApi } from '../services/usuariosApi';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await usuariosApi.getUsers();
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
