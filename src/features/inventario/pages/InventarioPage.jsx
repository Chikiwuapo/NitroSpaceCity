import { useInventario } from '../hooks/useInventario';
import { KPISection } from '../components/KPISection';
import { InventarioFilters } from '../components/InventarioFilters';
import { InventarioTable } from '../components/InventarioTable';
import { LoadingAnimation } from '../../../shared/components/LoadingAnimation';

const InventarioPage = () => {
  const {
    vehiculos,
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
  } = useInventario();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f6f9]">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">Error al cargar el inventario</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f4f6f9]">

      {/* CONTENIDO CON SCROLL */}
      <div className="flex-1 overflow-y-auto min-h-0">

        <div className="p-6">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestión de Inventario
            </h1>
            <p className="text-gray-500">
              Administra y monitorea tu stock de vehículos
            </p>
          </div>

          {/* KPIs */}
          <KPISection kpis={kpis} />

          {/* FILTROS */}
          <InventarioFilters
            filters={filters}
            marcas={marcas}
            tipos={tipos}
            estados={estados}
            transmisiones={transmisiones}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />

          {/* TABLA */}
          <div className="mt-6 h-[500px] flex flex-col">
            <InventarioTable vehiculos={vehiculos} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default InventarioPage;