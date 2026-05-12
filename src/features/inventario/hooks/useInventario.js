import { useState, useEffect , useCallback} from 'react';
import { inventarioApi } from '../services/inventarioService';
import { useNotificationSystem } from '../../notificaciones/hooks/useNotificationSystem';

export const useInventario = () => {
  const { pushAlert } = useNotificationSystem();
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventarioApi.getInventario();
      setVehiculos(data);
      setFilteredVehiculos(data);
      
      // Verificar stock bajo (< 5)
      data.forEach(v => {
        if (v.stock === 0) {
          pushAlert('Sin Stock', `El modelo ${v.marca} ${v.modelo} se ha quedado sin unidades (Stock: 0)`, 'error');
        } else if (v.stock < 5) {
          pushAlert('Stock Crítico', `Quedan pocas unidades de ${v.marca} ${v.modelo} (Stock: ${v.stock})`, 'warning');
        }
      });

      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  }, []);
  const [filters, setFilters] = useState({
    search: '',
    marca: '',
    tipo: '',
    estado: '',
    transmision: '',
    precioMin: '',
    precioMax: ''
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await inventarioApi.getInventario();
        setVehiculos(data);
        setFilteredVehiculos(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar el inventario');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...vehiculos];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.marca.toLowerCase().includes(searchLower) ||
          v.modelo.toLowerCase().includes(searchLower)
      );
    }

    if (filters.marca) {
      result = result.filter((v) => v.marca === filters.marca);
    }

    if (filters.tipo) {
      result = result.filter((v) => v.tipo === filters.tipo);
    }

    if (filters.estado) {
      result = result.filter((v) => v.estado === filters.estado);
    }

    if (filters.transmision) {
      result = result.filter((v) => v.transmision === filters.transmision);
    }

    if (filters.precioMin) {
      result = result.filter((v) => v.precio >= Number(filters.precioMin));
    }

    if (filters.precioMax) {
      result = result.filter((v) => v.precio <= Number(filters.precioMax));
    }

    setFilteredVehiculos(result);
  }, [filters, vehiculos]);

  const kpis = {
    totalVehiculos: vehiculos.length,
    disponibles: vehiculos.filter((v) => v.estado === 'Disponible').length,
    vendidos: vehiculos.filter((v) => v.estado === 'Vendido').length,
    valorTotal: vehiculos.reduce((sum, v) => sum + v.precio * v.stock, 0)
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      marca: '',
      tipo: '',
      estado: '',
      transmision: '',
      precioMin: '',
      precioMax: ''
    });
  };

  const marcas = [...new Set(vehiculos.map((v) => v.marca))];
  const tipos = [...new Set(vehiculos.map((v) => v.tipo))];
  const estados = [...new Set(vehiculos.map((v) => v.estado))];
  const transmisiones = [...new Set(vehiculos.map((v) => v.transmision))];

  return {
    vehiculos: filteredVehiculos,
    loading,
    error,
    filters,
    kpis,
    marcas,
    tipos,
    estados,
    transmisiones,
    handleFilterChange,
    refetch: fetchData,
    resetFilters
  };
};

export default useInventario;
