import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AppRoutes } from './app/routes'
import { LoginPage, RoleRoute } from './logueo'
import { PrivateRoute } from './app/PrivateRoute'

function App() {
  const token = localStorage.getItem('token')

  return (
   <BrowserRouter>
  <Routes>

    {/* Redirección inicial */}
    <Route
      path="/"
      element={
        token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      }
    />

    {/* Login */}
    <Route path="/login" element={<LoginPage />} />

    {/* Privadas */}
    <Route
  path="/*"
  element={
    <PrivateRoute>
      <RoleRoute>
        <DashboardLayout>
          <AppRoutes />
        </DashboardLayout>
      </RoleRoute>
    </PrivateRoute>
  }
/>
  </Routes>
</BrowserRouter>
  )
}

export default App