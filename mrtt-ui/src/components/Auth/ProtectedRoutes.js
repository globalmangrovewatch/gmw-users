import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function ProtectedRoutes() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to='/auth/login' />
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default ProtectedRoutes
