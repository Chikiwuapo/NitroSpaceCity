import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('../features/inicio/pages/Dashboard'));
const ClientesList = lazy(() => import('../features/clientes/pages/ClientesList'));
const ComprasList = lazy(() => import('../features/compras/pages/ComprasList'));
const VentasList = lazy(() => import('../features/ventas/pages/VentasList'));
const UsuariosList = lazy(() => import('../features/usuarios/pages/UsuariosList'));
const ReportesDashboard = lazy(() => import('../features/reportes/pages/ReportesDashboard'));
const InventarioPage = lazy(() => import('../features/inventario/pages/InventarioPage'));
const PlaceholderPage = lazy(() => import('../shared/components/PlaceholderPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-gray-500">Cargando...</div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<ClientesList />} />
        <Route path="/compras" element={<ComprasList />} />
        <Route path="/ventas" element={<VentasList />} />
        <Route path="/usuarios" element={<UsuariosList />} />
        <Route path="/financiamiento" element={<PlaceholderPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/mantenimiento" element={<PlaceholderPage />} />
        <Route path="/notificaciones" element={<PlaceholderPage />} />
        <Route path="/reportes" element={<ReportesDashboard />} />
      </Routes>
    </Suspense>
  );
};
