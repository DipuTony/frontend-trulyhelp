import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (!isAuthenticated || !token) {
    console.debug('[ProtectedRoute] Blocked: not authenticated or token missing', { isAuthenticated, hasToken: !!token })
    return <Navigate to="/login" replace />
  }
  // Only check role if authenticated to prevent issues with stale user data after logout
  // Treat SUPER_ADMIN as admin for access
  const normalizedUserRole = (user.role || '').toLowerCase() === 'super_admin' ? 'admin' : (user.role || '').toLowerCase()
  if (role && normalizedUserRole !== role.toLowerCase()) {
    // Redirect based on actual user role
    const actualRole = normalizedUserRole
    console.debug('[ProtectedRoute] Role mismatch', { expected: role, actual: actualRole })
    if (actualRole === "admin") {
      return <Navigate to="/admin/profile" replace />
    } else if (actualRole === "volunteer") {
      return <Navigate to="/volunteer/profile" replace />
    } else if (actualRole === "donor") {
      return <Navigate to="/donor/profile" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }
  return children
}

export default ProtectedRoute
