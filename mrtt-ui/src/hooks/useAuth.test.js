import '@testing-library/jest-dom'
import { StrictMode } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { AuthProvider, useAuth } from './useAuth'
import { exchangeCode, readAndStripCode, silentSsoCheck } from 'hooks/sso'

jest.mock('hooks/sso', () => ({
  exchangeCode: jest.fn(),
  readAndStripCode: jest.fn(),
  silentSsoCheck: jest.fn()
}))

const STORAGE_KEY = 'mrtt-session'

// Minimal unsigned JWT with the given exp (seconds since epoch)
const makeJwt = (exp) => {
  const encode = (obj) =>
    window.btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${encode({ alg: 'none' })}.${encode({ exp })}.sig`
}
const inOneHour = () => Math.floor(Date.now() / 1000) + 3600
const oneHourAgo = () => Math.floor(Date.now() / 1000) - 3600

const AuthStatus = () => {
  const { isChecking, isLoggedIn, currentUser, login, logout } = useAuth()
  if (isChecking) return <span>checking</span>
  return (
    <>
      <span>{isLoggedIn ? `logged in as ${currentUser?.email}` : 'logged out'}</span>
      <button onClick={() => login(makeJwt(inOneHour()), { email: 'new@example.com' })}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </>
  )
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
    window.localStorage.clear()
    readAndStripCode.mockReturnValue(null)
    silentSsoCheck.mockResolvedValue(null)
    exchangeCode.mockReset()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('restores a persisted session on reload without waiting for silent SSO', async () => {
    const token = makeJwt(inOneHour())
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token, user: { email: 'stored@example.com' } })
    )

    renderInStrictMode()

    expect(await screen.findByText('logged in as stored@example.com')).toBeInTheDocument()
    expect(silentSsoCheck).not.toHaveBeenCalled()
    expect(exchangeCode).not.toHaveBeenCalled()
  })

  it('discards an expired persisted session and falls back to silent SSO', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: makeJwt(oneHourAgo()), user: { email: 'old@example.com' } })
    )

    renderInStrictMode()

    expect(await screen.findByText('logged out')).toBeInTheDocument()
    expect(silentSsoCheck).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('persists the session on login and clears it on logout', async () => {
    renderInStrictMode()
    await screen.findByText('logged out')

    fireEvent.click(screen.getByText('login'))
    expect(await screen.findByText('logged in as new@example.com')).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toMatchObject({
      user: { email: 'new@example.com' }
    })

    fireEvent.click(screen.getByText('logout'))
    expect(await screen.findByText('logged out')).toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('persists the session obtained through SSO code exchange', async () => {
    silentSsoCheck.mockResolvedValue('sso-code')
    exchangeCode.mockResolvedValue({
      token: makeJwt(inOneHour()),
      user: { email: 'sso@example.com' }
    })

    renderInStrictMode()

    expect(await screen.findByText('logged in as sso@example.com')).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toMatchObject({
      user: { email: 'sso@example.com' }
    })
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
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    silentSsoCheck.mockRejectedValue(new Error('REACT_APP_GMW_URL is not set'))

    renderInStrictMode()

    expect(await screen.findByText('logged out')).toBeInTheDocument()
  })
})
