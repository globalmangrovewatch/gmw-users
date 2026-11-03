import { getAuthToken } from '@/lib/auth/token'
import { env } from '@/lib/env'

// A non-2xx response. `body` is the parsed JSON error (e.g. `{ error: 'Record not found' }`),
// or the raw text when the response is not JSON.
export class ApiError<TBody = unknown> extends Error {
  readonly status: number
  readonly body: TBody

  constructor(status: number, body: TBody) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export const isApiError = <TBody = { error?: string }>(error: unknown): error is ApiError<TBody> =>
  error instanceof ApiError

type UnauthorizedListener = () => void
const unauthorizedListeners = new Set<UnauthorizedListener>()

// Called when the API rejects the bearer token. `AuthProvider` uses it to sign the user out.
// Returns a function that removes the listener.
export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.add(listener)
  return () => {
    unauthorizedListeners.delete(listener)
  }
}

type ClientConfig = {
  // Read on every request, so tests and env changes apply without recreating the client.
  baseUrl: () => string
  // Send the signed-in user's bearer token, and report 401s to `onUnauthorized`.
  auth?: boolean
  credentials?: RequestCredentials
}

type RequestOptions = { signal?: AbortSignal }

const parseBody = async (response: Response) => {
  if (response.status === 204) return undefined
  const text = await response.text()
  if (!text) return undefined
  const isJson = response.headers.get('Content-Type')?.includes('json')
  if (!isJson) return text
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export function createClient({ baseUrl, auth = false, credentials }: ClientConfig) {
  const send = async (method: string, path: string, body?: unknown, options?: RequestOptions) => {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    const token = auth ? getAuthToken() : null
    if (token) headers.Authorization = `Bearer ${token}`

    const response = await fetch(`${baseUrl()}${path}`, {
      method,
      headers,
      credentials,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: options?.signal
    })

    if (!response.ok) {
      if (auth && response.status === 401) unauthorizedListeners.forEach((listener) => listener())
      throw new ApiError(response.status, await parseBody(response))
    }
    return response
  }

  const json =
    (method: string) =>
    async <T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
      parseBody(await send(method, path, body, options))

  return {
    get: <T = unknown>(path: string, options?: RequestOptions): Promise<T> =>
      json('GET')<T>(path, undefined, options),
    post: json('POST'),
    put: json('PUT'),
    patch: json('PATCH'),
    delete: <T = unknown>(path: string, options?: RequestOptions): Promise<T> =>
      json('DELETE')<T>(path, undefined, options),
    // For file downloads such as the xlsx and pdf reports.
    blob: async (path: string, options?: RequestOptions): Promise<Blob> =>
      (await send('GET', path, undefined, options)).blob()
  }
}

export type ApiClient = ReturnType<typeof createClient>

// The MRTT API, with the signed-in user's token.
export const api = createClient({ baseUrl: () => env.NEXT_PUBLIC_API_URL, auth: true })

// The MRTT auth endpoints (sign in, sign up, password reset), which take no token.
export const authApi = createClient({ baseUrl: () => env.NEXT_PUBLIC_AUTH_URL })

// GMW's SSO endpoints, which rely on GMW's session cookie.
export const gmwApi = createClient({
  baseUrl: () => {
    if (!env.NEXT_PUBLIC_GMW_URL) throw new Error('NEXT_PUBLIC_GMW_URL is not set')
    return env.NEXT_PUBLIC_GMW_URL.replace(/\/$/, '')
  },
  credentials: 'include'
})
