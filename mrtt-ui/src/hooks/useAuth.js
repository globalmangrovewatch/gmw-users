import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import PropTypes from 'prop-types'
import { decodeToken, isExpired } from 'react-jwt'
import { useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('token', null)
  const [currentUser, setCurrentUser] = useState(decodeToken(token)?.meta)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !isExpired(token)
  })
  const value = useMemo(() => {
    const login = async (token) => {
      setToken(token)
      setIsLoggedIn(!isExpired(token))
      setCurrentUser(decodeToken(token)?.meta)
    }
    const logout = () => {
      setToken(null)
      setIsLoggedIn(false)
      setCurrentUser(null)
    }
    return {
      currentUser,
      isLoggedIn,
      login,
      logout,
      token
    }
  }, [token, isLoggedIn, setToken, setIsLoggedIn, currentUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAuth = () => {
  return useContext(AuthContext)
}
