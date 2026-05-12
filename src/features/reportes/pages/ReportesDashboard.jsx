import { useReportes } from '../hooks/useReportes';
import { KPIGrid } from '../components/KPIGrid';
import { ReportSlider } from '../components/ReportSlider';
import { LoadingAnimation } from '../../../shared/components/LoadingAnimation';

const ReportesDashboard = () => {
  const { data, loading, error } = useReportes();

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
          <p className="text-red-500 text-lg font-medium mb-2">Error al cargar los reportes</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f4f6f9]">
      <div className="p-6 flex-shrink-0">
        {data && <KPIGrid kpis={data.kpis} />}
      </div>
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {data && <ReportSlider data={data} />}
      </div>
    </div>
  );
};

export default ReportesDashboard;
