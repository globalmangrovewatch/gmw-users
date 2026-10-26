import '@testing-library/jest-dom'
import { StrictMode } from 'react'
import { render, screen } from '@testing-library/react'

import { AuthProvider, useAuth } from './useAuth'
import { exchangeCode, readAndStripCode, silentSsoCheck } from '@/hooks/sso'

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
