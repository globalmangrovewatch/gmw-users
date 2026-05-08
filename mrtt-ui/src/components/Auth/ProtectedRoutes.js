import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from 'hooks/useAuth'
import LoadingIndicator from 'components/LoadingIndicator'

function ProtectedRoutes() {
  const { isLoggedIn, isChecking } = useAuth()

  if (isChecking) return <LoadingIndicator />

  if (!isLoggedIn) {
    return <Navigate to='/auth/login' replace />
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default ProtectedRoutes
