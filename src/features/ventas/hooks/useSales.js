import { useState, useEffect, useCallback } from 'react';
import { ventasApi } from '../services/ventasApi';
import { clientesApi } from '../../clientes/services/clientesApi';
import { usuariosApi } from '../../usuarios/services/usuariosApi';

export const useSales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtenemos ventas, clientes y usuarios en paralelo
      const [salesRes, clientsRes, usersRes] = await Promise.allSettled([
        ventasApi.getSales(),
        clientesApi.getClientes(),
        usuariosApi.getUsers()
      ]);

      if (salesRes.status === 'rejected') {
        throw new Error(salesRes.reason?.message || 'Error al cargar las ventas');
      }

      let sales = salesRes.value;
      const clients = clientsRes.status === 'fulfilled' ? clientsRes.value : [];
      const users = usersRes.status === 'fulfilled' ? usersRes.value : [];

      // Mapear los datos de cliente y usuario usando los IDs si el backend no los trae anidados
      sales = sales.map(sale => {
        // Encontrar cliente si no viene anidado correctamente o si solo dice 'Sin nombre'
        if (sale.id_cliente && (!sale.cliente || sale.cliente.nombre_completo === 'Sin nombre')) {
          const clientObj = clients.find(c => c.id === sale.id_cliente);
          if (clientObj) {
            sale.cliente = {
              id: clientObj.id,
              nombre_completo: clientObj.nombre_completo || 'Cliente sin nombre',
              img_url: clientObj.url_img || 'https://placehold.co/80x80/e2e8f0/64748b?text=C'
            };
          }
        }

        // Encontrar usuario si no viene o viene vacío
        if (sale.id_usuario && (!sale.usuario || sale.usuario.trim() === '')) {
          const userObj = users.find(u => u.id === sale.id_usuario);
          if (userObj) {
            sale.usuario = `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim();
          }
        }

        return sale;
      });

      setData(sales);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar las ventas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return { data, loading, error, refetch: fetchSales };
};

export default useSales;
