// Persists the signed-in session so a page reload does not log the user out.
// Silent SSO against GMW is still attempted when nothing usable is stored.

const STORAGE_KEY = 'mrtt-session'

function decodeJwtExp(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const { exp } = JSON.parse(window.atob(padded))
    return typeof exp === 'number' ? exp : null
  } catch {
    return null
  }
}

export function isTokenExpired(token, now = Date.now()) {
  const exp = decodeJwtExp(token)
  // Tokens without a readable exp claim are left to the API to reject.
  if (exp === null) return false
  return now >= exp * 1000
}

export function loadStoredSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session || typeof session.token !== 'string' || isTokenExpired(session.token)) {
      clearStoredSession()
      return null
    }
    return { token: session.token, user: session.user ?? null }
  } catch {
    return null
  }
}

export function saveStoredSession({ token, user }) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: user ?? null }))
  } catch {
    // Storage unavailable (private mode, quota): session stays in memory only.
  }
}

export function clearStoredSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
