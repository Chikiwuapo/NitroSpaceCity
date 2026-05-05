import { useState, useEffect } from 'react';
import { inventarioApi } from '../services/inventarioService';

export const useInventario = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    resetFilters
  };
};

export default useInventario;
