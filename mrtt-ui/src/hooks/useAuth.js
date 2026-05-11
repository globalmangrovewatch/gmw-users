import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { setAuthToken } from 'library/auth/interceptor'
import { exchangeCode, readAndStripCode, silentSsoCheck } from 'hooks/sso'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isChecking, setIsChecking] = useState(true)
  const bootstrappedRef = useRef(false)

  const applySession = useCallback((nextToken, nextUser) => {
    setAuthToken(nextToken)
    setTokenState(nextToken)
    setCurrentUser(nextUser ?? null)
  }, [])

  const clearSession = useCallback(() => {
    setAuthToken(null)
    setTokenState(null)
    setCurrentUser(null)
  }, [])

  useEffect(() => {
    if (bootstrappedRef.current) return
    bootstrappedRef.current = true

    let cancelled = false

    const tryExchange = async (code) => {
      try {
        const data = await exchangeCode(code)
        if (!cancelled) applySession(data.token, data.user)
      } catch (error) {
        if (!cancelled) console.warn('SSO code exchange failed', error)
      }
    }

    const bootstrap = async () => {
      // Inside the silent-SSO iframe, skip bootstrap entirely (the callback
      // page only needs to postMessage to its parent window).
      if (window.top !== window.self) {
        if (!cancelled) setIsChecking(false)
        return
      }

      const codeFromUrl = readAndStripCode()
      if (codeFromUrl) {
        await tryExchange(codeFromUrl)
      } else {
        const silentCode = await silentSsoCheck()
        if (silentCode) await tryExchange(silentCode)
      }
      if (!cancelled) setIsChecking(false)
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [applySession])

  const value = useMemo(
    () => ({
      token,
      currentUser,
      isLoggedIn: Boolean(token),
      isChecking,
      login: applySession,
      logout: clearSession
    }),
    [token, currentUser, isChecking, applySession, clearSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
