import { isExpired } from 'react-jwt'

const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const expired = isExpired(token)
  return token != null && !expired
}

export default isAuthenticated
