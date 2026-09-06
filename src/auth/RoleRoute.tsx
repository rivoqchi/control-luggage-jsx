import { Navigate, Outlet } from 'react-router-dom'

import type { Role } from '../api/types'
import { useAuth } from './AuthProvider'

export function RoleRoute({ roles }: { roles: Role[] }) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
