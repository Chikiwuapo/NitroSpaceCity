import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useInventario } from '../hooks/useInventario';
import { KPISection } from '../components/KPISection';
import { InventarioFilters } from '../components/InventarioFilters';
import { InventarioTable } from '../components/InventarioTable';
import { LoadingAnimation } from '../../../shared/components/LoadingAnimation';
import VehiculoForm from '../components/InventarioForm';

const InventarioPage = () => {
  // Extraemos datos y funciones del hook
  const {
    vehiculos,
    loading,
    error,
    kpis,
    refetch,
  } = useInventario();

  // --- ESTADOS LOCALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // --- ESTADO DE FILTROS (Manejado localmente para respuesta instantánea) ---
  const [filters, setFilters] = useState({
    search: '',
    marca: '',
    estado: '',
    transmision: '',
    combustible: '', // Añadido
    precioMin: '',
    precioMax: '',
  });

  // --- FUNCIONES DE FILTRADO ---
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      marca: '',
      estado: '',
      transmision: '',
      combustible: '',
      precioMin: '',
      precioMax: '',
    });
  };

  // --- LÓGICA DE FILTRADO REAL ---
  const filteredVehiculos = vehiculos.filter((v) => {
    // Búsqueda por texto (Marca, Modelo, Año)
    const searchMatch =
      !filters.search ||
      v.marca?.toLowerCase().includes(filters.search.toLowerCase()) ||
      v.modelo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      String(v.anio).includes(filters.search);

    const marcaMatch = !filters.marca || v.marca === filters.marca;

    const estadoMatch =
      !filters.estado || String(v.id_estado_vehiculo_venta) === filters.estado;

    const transmisionMatch =
      !filters.transmision || v.transmision === filters.transmision;

    // Filtro de combustible añadido
    const combustibleMatch =
      !filters.combustible || v.tipo_combustible === filters.combustible;

    const precioMinMatch =
      !filters.precioMin || Number(v.precio_u) >= Number(filters.precioMin);

    const precioMaxMatch =
      !filters.precioMax || Number(v.precio_u) <= Number(filters.precioMax);

    return (
      searchMatch &&
      marcaMatch &&
      estadoMatch &&
      transmisionMatch &&
      combustibleMatch &&
      precioMinMatch &&
      precioMaxMatch
    );
  });

  // --- HANDLERS ACCIONES ---
  const handleEdit = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleView = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setIsReadOnly(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setVehiculoSeleccionado(null);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este vehículo?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://faithful-healing-production-9e06.up.railway.app/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        refetch(); // Refrescar la lista tras eliminar
      }
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  // --- RENDERS DE CARGA Y ERROR ---
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f6f9]">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4f6f9]">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">Error al cargar el inventario</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f4f6f9]">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6">
          {/* CABECERA */}
          <div className="flex justify-between items-end mb-6">
            
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Inventario</h1>
              <p className="text-gray-500">Administra y monitorea tu stock de vehículos</p>
            </div>
            
            <button 
              onClick={handleAdd}
              className="bg-[#0a332a] text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:bg-[#0d4438] transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nuevo Vehículo
            </button>
          </div>

          {/* KPIS */}
          <KPISection kpis={kpis} />
          
          {/* FILTROS */}
          <InventarioFilters
            filters={filters}
            marcas={[...new Set(vehiculos.map((v) => v.marca))]} 
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />

          {/* TABLA */}
          <div className="mt-6">
            <InventarioTable 
              vehiculos={filteredVehiculos}
              onEdit={handleEdit}     
              onDelete={handleEliminar} 
              onView={handleView}
            />
          </div>
        </div>
      </div>

      {/* MODAL / FORMULARIO */}
      {isModalOpen && (
        <VehiculoForm 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialData={vehiculoSeleccionado}
          onSuccess={() => {
            refetch(); 
            setIsModalOpen(false);
          }}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  );
};

export default InventarioPage;