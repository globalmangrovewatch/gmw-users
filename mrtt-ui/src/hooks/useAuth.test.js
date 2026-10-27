import '@testing-library/jest-dom'
import { StrictMode } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import { AuthProvider, useAuth } from './useAuth'
import { exchangeCode, readAndStripCode, silentSsoCheck } from '@/hooks/sso'
import { api } from '@/lib/api'
import { getAuthToken, setAuthToken } from '@/lib/auth/token'
import { getQueryClient } from '@/lib/queryClient'

vi.mock('@/hooks/sso', () => ({
  exchangeCode: vi.fn(),
  readAndStripCode: vi.fn(),
  silentSsoCheck: vi.fn()
}))

const AuthStatus = () => {
  const { isChecking, isLoggedIn, currentUser } = useAuth()
  if (isChecking) return <span>checking</span>
  return <span>{isLoggedIn ? `logged in as ${currentUser?.email}` : 'logged out'}</span>
}

const renderInStrictMode = () =>
  render(
    <StrictMode>
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    </StrictMode>
  )

describe('AuthProvider bootstrap', () => {
  beforeEach(() => {
    readAndStripCode.mockReturnValue(null)
    silentSsoCheck.mockResolvedValue(null)
    exchangeCode.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('clears the checking state under StrictMode when there is no SSO session', async () => {
    renderInStrictMode()

    expect(screen.getByText('checking')).toBeInTheDocument()
    expect(await screen.findByText('logged out')).toBeInTheDocument()
    // StrictMode double-invokes effects; the bootstrap must still run only once
    expect(silentSsoCheck).toHaveBeenCalledTimes(1)
  })

  it('logs the user in when the silent SSO check returns a code', async () => {
    silentSsoCheck.mockResolvedValue('sso-code')
    exchangeCode.mockResolvedValue({ token: 'jwt', user: { email: 'maria@example.com' } })

    renderInStrictMode()

    expect(await screen.findByText('logged in as maria@example.com')).toBeInTheDocument()
    expect(exchangeCode).toHaveBeenCalledWith('sso-code')
    expect(exchangeCode).toHaveBeenCalledTimes(1)
  })

  it('falls back to logged out when the SSO bootstrap throws', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    silentSsoCheck.mockRejectedValue(new Error('REACT_APP_GMW_URL is not set'))

    renderInStrictMode()

    expect(await screen.findByText('logged out')).toBeInTheDocument()
  })
})

describe('AuthProvider session changes', () => {
  beforeEach(() => {
    readAndStripCode.mockReturnValue(null)
    silentSsoCheck.mockResolvedValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const SessionButtons = () => {
    const { isChecking, login, logout } = useAuth()
    if (isChecking) return <span>checking</span>
    return (
      <>
        <button onClick={() => login('jwt', { email: 'next@example.com' })}>log in</button>
        <button onClick={logout}>log out</button>
      </>
    )
  }

  it.each(['log in', 'log out'])(
    'drops cached API data on %s, so the next user never sees it',
    async (action) => {
      const queryClient = getQueryClient()
      queryClient.setQueryData(['sites'], [{ id: 1, site_name: 'Previous user site' }])

      render(
        <AuthProvider>
          <SessionButtons />
        </AuthProvider>
      )
      fireEvent.click(await screen.findByText(action))

      expect(queryClient.getQueryData(['sites'])).toBeUndefined()
    }
  )

  it('signs out when the API rejects the token', async () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    )
    await screen.findByText('logged out')
    act(() => {
      setAuthToken('expired')
    })

    const fetchMock = vi.fn(async () => new Response('{}', { status: 401 }))
    vi.stubGlobal('fetch', fetchMock)
    await api.get('/sites').catch(() => {})
    vi.unstubAllGlobals()

    expect(getAuthToken()).toBeNull()
  })
})
