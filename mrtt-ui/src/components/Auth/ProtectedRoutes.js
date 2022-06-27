import { Navigate, Outlet } from 'react-router-dom'
import isAuthenticated from '../../library/auth/isAuthenticated'

function ProtectedRoutes() {
  const _isAuthenticated = isAuthenticated()
  if (!_isAuthenticated) {
    return <Navigate to='/auth/login' />
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default ProtectedRoutes
