import { useAtom } from 'jotai'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authAtom } from '../../store/authStore'

function ProtectedRoute() {
  const [auth] = useAtom(authAtom)
  const location = useLocation()

  if (!auth.isAuthenticated) {
    // Redirect to login but save the attempted URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute