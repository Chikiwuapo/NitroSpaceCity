import { Navigate, useLocation } from 'react-router-dom'
import { PERMISSIONS } from '../roles'

export const RoleRoute = ({ children }) => {
  const location = useLocation()
  let user = null
  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch (error) {
    // Invalid user data, redirect to login
    return <Navigate to="/login" />
  }

  if (!user) return <Navigate to="/login" />

  const role = user.role
  const allowedRoutes = PERMISSIONS[role] || []

  if (!allowedRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}