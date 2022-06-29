import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import PropTypes from 'prop-types'
import { isExpired } from 'react-jwt'
import { useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('token', null)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return false
  })
  const value = useMemo(() => {
    const login = async (token) => {
      setToken(token)
      setIsLoggedIn(!isExpired(token))
    }
    const logout = () => {
      setToken(null)
      setIsLoggedIn(false)
    }
    return {
      token,
      isLoggedIn,
      login,
      logout
    }
  }, [token, isLoggedIn, setToken, setIsLoggedIn])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAuth = () => {
  return useContext(AuthContext)
}
