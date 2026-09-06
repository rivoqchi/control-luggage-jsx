import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { GuestRoute, ProtectedRoute } from '../auth/ProtectedRoute'
import { RoleRoute } from '../auth/RoleRoute'
import { AppLayout } from '../layout/AppLayout'
import { AuthLayout } from '../layout/AuthLayout'

const LoginPage = lazy(() => import('../pages/LoginPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const UsersPage = lazy(() => import('../pages/UsersPage'))
const PlanPage = lazy(() => import('../pages/PlanPage'))
const WorkflowPage = lazy(() => import('../pages/WorkflowPage'))
const HistoryPage = lazy(() => import('../pages/HistoryPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const LuggageListPage = lazy(() => import('../pages/LuggageListPage'))
const LuggageCreatePage = lazy(() => import('../pages/LuggageCreatePage'))
const LuggageDetailPage = lazy(() => import('../pages/LuggageDetailPage'))
const WarehousePage = lazy(() => import('../pages/WarehousePage'))
const WarehouseMinePage = lazy(() =>
  import('../pages/WarehousePage').then((m) => ({ default: m.WarehouseMinePage })),
)
const WarehouseTodayPage = lazy(() =>
  import('../pages/WarehousePage').then((m) => ({ default: m.WarehouseTodayPage })),
)
const DriverPage = lazy(() => import('../pages/DriverPage'))
const DriverMinePage = lazy(() =>
  import('../pages/DriverPage').then((m) => ({ default: m.DriverMinePage })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route element={<RoleRoute roles={['admin']} />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>
            <Route path="/plan" element={<PlanPage />} />
            <Route element={<RoleRoute roles={['admin', 'staff']} />}>
              <Route path="/workflow" element={<WorkflowPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/warehouse" element={<WarehousePage />} />
              <Route path="/warehouse/mine" element={<WarehouseMinePage />} />
              <Route path="/warehouse/today" element={<WarehouseTodayPage />} />
              <Route path="/driver" element={<DriverPage />} />
              <Route path="/driver/mine" element={<DriverMinePage />} />
            </Route>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/luggage" element={<LuggageListPage />} />
            <Route element={<RoleRoute roles={['admin', 'staff']} />}>
              <Route path="/luggage/new" element={<LuggageCreatePage />} />
            </Route>
            <Route path="/luggage/:id" element={<LuggageDetailPage />} />
          </Route>
        </Route>

        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
