// The signed-in user's bearer token for the MRTT API. Held in memory only: a reload starts
// signed out and the SSO bootstrap in `AuthProvider` signs the user back in.
let token: string | null = null

export function setAuthToken(next: string | null) {
  token = next
}

export function getAuthToken() {
  return token
}
