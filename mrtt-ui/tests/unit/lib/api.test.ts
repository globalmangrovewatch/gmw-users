import { ApiError, api, authApi, createClient, onUnauthorized } from '@/lib/api'
import { setAuthToken } from '@/lib/auth/token'

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
  setAuthToken(null)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const lastRequest = () => {
  const [url, init] = fetchMock.mock.calls.at(-1) ?? []
  return {
    url,
    init: init as RequestInit,
    headers: (init?.headers ?? {}) as Record<string, string>
  }
}

describe('api client', () => {
  it('prefixes the base URL and parses JSON', async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ id: 1 }]))

    await expect(api.get('/sites')).resolves.toEqual([{ id: 1 }])
    expect(lastRequest().url).toBe('http://api.test/sites')
    expect(lastRequest().init.method).toBe('GET')
  })

  it('sends the bearer token only from the authenticated client', async () => {
    setAuthToken('secret')
    fetchMock.mockImplementation(async () => jsonResponse({}))

    await api.get('/sites')
    expect(lastRequest().headers.Authorization).toBe('Bearer secret')

    await authApi.post('/users/sign_in', { user: {} })
    expect(lastRequest().headers.Authorization).toBeUndefined()
  })

  it('sends a JSON body', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 2 }))

    await api.patch('/sites/2', { site_name: 'Bay' })
    expect(lastRequest().init.method).toBe('PATCH')
    expect(lastRequest().init.body).toBe('{"site_name":"Bay"}')
    expect(lastRequest().headers['Content-Type']).toBe('application/json')
  })

  it('resolves to undefined for a 204', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

    await expect(api.delete('/sites/2')).resolves.toBeUndefined()
  })

  it('throws an ApiError with the parsed error body', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'Invalid email or password.' }, 401))

    const error = await authApi.post('/users/sign_in', {}).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 401, body: { error: 'Invalid email or password.' } })
  })

  it('keeps a non-JSON error body as text', async () => {
    fetchMock.mockResolvedValue(new Response('Bad gateway', { status: 502 }))

    await expect(api.get('/sites')).rejects.toMatchObject({ status: 502, body: 'Bad gateway' })
  })

  it('reports a 401 from the authenticated client to onUnauthorized', async () => {
    const listener = vi.fn<() => void>()
    const unsubscribe = onUnauthorized(listener)
    fetchMock.mockImplementation(async () => jsonResponse({ error: 'Unauthorized' }, 401))

    await api.get('/sites').catch(() => {})
    await authApi.post('/users/sign_in', {}).catch(() => {})
    unsubscribe()
    await api.get('/sites').catch(() => {})

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('downloads a blob', async () => {
    fetchMock.mockResolvedValue(new Response('xlsx-bytes', { status: 200 }))

    const blob = await api.blob('/report/answers_as_xlsx?public_only=true')
    await expect(blob.text()).resolves.toBe('xlsx-bytes')
  })

  it('passes credentials through', async () => {
    const client = createClient({ baseUrl: () => 'https://gmw.test', credentials: 'include' })
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

    await client.post('/api/auth/sso/logout', {})
    expect(lastRequest().init.credentials).toBe('include')
  })
})
