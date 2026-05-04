import { Navigate } from 'react-router-dom'

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem('token')
    return <Navigate to="/login" replace />
  }

  return children
}