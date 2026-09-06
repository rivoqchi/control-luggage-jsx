import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './AuthProvider'

export function ProtectedRoute() {
  const { user, ready } = useAuth()

  if (!ready) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { user, ready } = useAuth()

  if (!ready) {
    return null
  }

  if (user) {
    return <Navigate to={user.role === 'customer' ? '/luggage' : '/dashboard'} replace />
  }

  return <Outlet />
}
