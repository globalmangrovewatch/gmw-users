import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { onUnauthorized } from '@/lib/api'
import { setAuthToken } from '@/lib/auth/token'
import { exchangeCode, readAndStripCode, silentSsoCheck, type SSOUser } from '@/hooks/sso'

export type AuthUser = SSOUser

type AuthContextValue = {
  token: string | null
  currentUser: AuthUser | null
  isLoggedIn: boolean
  isChecking: boolean
  login: (token: string, user?: AuthUser | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const bootstrappedRef = useRef(false)

  const applySession = useCallback((nextToken: string, nextUser?: AuthUser | null) => {
    setAuthToken(nextToken)
    setTokenState(nextToken)
    setCurrentUser(nextUser ?? null)
  }, [])

  const clearSession = useCallback(() => {
    setAuthToken(null)
    setTokenState(null)
    setCurrentUser(null)
  }, [])

  // The API rejected the token (e.g. it expired): sign out so the protected routes send the
  // user back to the login page.
  useEffect(() => onUnauthorized(clearSession), [clearSession])

  useEffect(() => {
    // Run the bootstrap exactly once for the lifetime of the provider.
    // React 18 StrictMode mounts, unmounts and re-mounts effects in dev; the
    // ref guard makes the second run a no-op. The first run must therefore
    // always be allowed to finish and clear `isChecking`, which is why there
    // is deliberately no "cancelled" flag here (a previous version had one and
    // left the app on the loading spinner forever in development).
    if (bootstrappedRef.current) return
    bootstrappedRef.current = true

    const tryExchange = async (code: string) => {
      try {
        const data = await exchangeCode(code)
        applySession(data.token, data.user)
      } catch (error) {
        console.warn('SSO code exchange failed', error)
      }
    }

    const bootstrap = async () => {
      try {
        // Inside the silent-SSO iframe, skip bootstrap entirely (the callback
        // page only needs to postMessage to its parent window).
        if (window.top !== window.self) return

        const codeFromUrl = readAndStripCode()
        if (codeFromUrl) {
          await tryExchange(codeFromUrl)
        } else {
          const silentCode = await silentSsoCheck()
          if (silentCode) await tryExchange(silentCode)
        }
      } catch (error) {
        // e.g. REACT_APP_GMW_URL missing: fall back to the regular login form.
        console.warn('SSO bootstrap failed', error)
      } finally {
        setIsChecking(false)
      }
    }

    bootstrap()
  }, [applySession])

  const value = useMemo<AuthContextValue>(
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

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
