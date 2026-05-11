import axios from 'axios'

type SSOExchangeResponse = {
  token: string
  user: {
    name?: string
    email: string
    organization?: string | null
  }
}

const gmwUrl = (): string => {
  const url = process.env.REACT_APP_GMW_URL
  if (!url) {
    throw new Error('REACT_APP_GMW_URL is not set')
  }
  return url.replace(/\/$/, '')
}

export const SSO_CODE_PARAM = 'code'
export const SILENT_CALLBACK_PATH = '/auth/sso-silent'
const SSO_MESSAGE_TYPE = 'mrtt-sso-code'
const SILENT_TIMEOUT_MS = 4000

export function redirectToAuthorize(returnUrl: string = window.location.href): void {
  const authorize = new URL(`${gmwUrl()}/api/auth/sso/authorize`)
  authorize.searchParams.set('redirect_uri', returnUrl)
  window.location.replace(authorize.toString())
}

export async function exchangeCode(code: string): Promise<SSOExchangeResponse> {
  const { data } = await axios.post<SSOExchangeResponse>(
    `${gmwUrl()}/api/auth/sso/exchange`,
    { code },
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    }
  )
  return data
}

export async function syncSession(token: string): Promise<void> {
  try {
    await axios.post(
      `${gmwUrl()}/api/auth/sso/sync`,
      { token },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      }
    )
  } catch (error) {
    console.warn('SSO sync failed; user logged in locally only', error)
  }
}

export async function ssoLogout(): Promise<void> {
  try {
    await axios.post(
      `${gmwUrl()}/api/auth/sso/logout`,
      {},
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      }
    )
  } catch (error) {
    console.warn('SSO logout request failed', error)
  }
}

export function readAndStripCode(): string | null {
  const params = new URLSearchParams(window.location.search)
  const code = params.get(SSO_CODE_PARAM)
  if (!code) return null
  params.delete(SSO_CODE_PARAM)
  const newSearch = params.toString()
  const newUrl =
    window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash
  window.history.replaceState({}, '', newUrl)
  return code
}

/**
 * Silently check whether the user has an active GMW session by loading the
 * authorize endpoint inside a hidden iframe. If GMW has a session it 302s back
 * to our silent-callback page, which postMessages the code to this window.
 * If GMW has no session it 302s to GMW signin (cross-origin) and we time out.
 */
export function silentSsoCheck(): Promise<string | null> {
  return new Promise((resolve) => {
    const expectedOrigin = window.location.origin
    const callbackUrl = `${expectedOrigin}${SILENT_CALLBACK_PATH}`
    const authorize = new URL(`${gmwUrl()}/api/auth/sso/authorize`)
    authorize.searchParams.set('redirect_uri', callbackUrl)

    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.setAttribute('aria-hidden', 'true')
    iframe.src = authorize.toString()

    let settled = false
    const cleanup = () => {
      if (settled) return
      settled = true
      window.removeEventListener('message', onMessage)
      clearTimeout(timer)
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== expectedOrigin) return
      const data = event.data
      if (!data || data.type !== SSO_MESSAGE_TYPE) return
      cleanup()
      resolve(typeof data.code === 'string' && data.code.length > 0 ? data.code : null)
    }

    window.addEventListener('message', onMessage)
    const timer = window.setTimeout(() => {
      cleanup()
      resolve(null)
    }, SILENT_TIMEOUT_MS)

    document.body.appendChild(iframe)
  })
}

/**
 * Called by the silent-callback page rendered inside the iframe.
 * Posts the code (or null) up to the parent window.
 */
export function postSilentCallbackResult(code: string | null): void {
  if (!window.parent || window.parent === window) return
  window.parent.postMessage({ type: SSO_MESSAGE_TYPE, code }, window.location.origin)
}
