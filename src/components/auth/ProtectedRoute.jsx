import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  // Only check role if authenticated to prevent issues with stale user data after logout
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    // Redirect based on actual user role
    const actualRole = user.role.toLowerCase()
    if (actualRole === "admin") {
      return <Navigate to="/admin" replace />
    } else if (actualRole === "volunteer") {
      return <Navigate to="/volunteer" replace />
    } else if (actualRole === "donor") {
      return <Navigate to="/donor" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }
  return children
}

export default ProtectedRoute
