import {
  SILENT_CALLBACK_PATH,
  postSilentCallbackResult,
  readAndStripCode,
  silentSsoCheck
} from '@/hooks/sso'
import { env } from '@/lib/env'

const GMW_URL = 'https://gmw.test'

// `env` is parsed once at import; make it writable so each test can set NEXT_PUBLIC_GMW_URL.
vi.mock('@/lib/env', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/env')>()
  return { env: { ...actual.env } }
})
const setGmwUrl = (url: string | undefined) => {
  ;(env as { NEXT_PUBLIC_GMW_URL?: string }).NEXT_PUBLIC_GMW_URL = url
}
const MESSAGE_TYPE = 'mrtt-sso-code'
const TIMEOUT_MS = 4000

const setUrl = (url: string) => window.history.replaceState({}, '', url)
const currentUrl = () => window.location.pathname + window.location.search + window.location.hash

const postMessage = (data: unknown, origin = window.location.origin) =>
  window.dispatchEvent(new MessageEvent('message', { data, origin }))

type PostMessage = (message: unknown, targetOrigin: string) => void

const ssoIframes = () =>
  Array.from(document.querySelectorAll('iframe')).filter((iframe) => iframe.src.startsWith(GMW_URL))

describe('readAndStripCode', () => {
  afterEach(() => setUrl('/'))

  it('returns the code and removes only the code parameter', () => {
    setUrl('/sites?foo=1&code=abc123&bar=2#map')

    expect(readAndStripCode()).toBe('abc123')
    expect(currentUrl()).toBe('/sites?foo=1&bar=2#map')
  })

  it('drops the question mark when code was the only parameter', () => {
    setUrl('/sites?code=abc123')

    expect(readAndStripCode()).toBe('abc123')
    expect(currentUrl()).toBe('/sites')
  })

  it('returns null and leaves the URL alone when there is no code', () => {
    setUrl('/sites?foo=1#map')

    expect(readAndStripCode()).toBeNull()
    expect(currentUrl()).toBe('/sites?foo=1#map')
  })

  it('returns null for an empty code', () => {
    setUrl('/sites?code=')

    expect(readAndStripCode()).toBeNull()
  })
})

describe('postSilentCallbackResult', () => {
  afterEach(() => vi.restoreAllMocks())

  it('posts the code to the parent window, restricted to our own origin', () => {
    const parent = { postMessage: vi.fn<PostMessage>() }
    vi.spyOn(window, 'parent', 'get').mockReturnValue(parent as unknown as Window)

    postSilentCallbackResult('abc123')

    expect(parent.postMessage).toHaveBeenCalledWith(
      { type: MESSAGE_TYPE, code: 'abc123' },
      window.location.origin
    )
  })

  it('posts null when there is no code', () => {
    const parent = { postMessage: vi.fn<PostMessage>() }
    vi.spyOn(window, 'parent', 'get').mockReturnValue(parent as unknown as Window)

    postSilentCallbackResult(null)

    expect(parent.postMessage).toHaveBeenCalledWith(
      { type: MESSAGE_TYPE, code: null },
      window.location.origin
    )
  })

  it('does nothing outside an iframe', () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage')

    postSilentCallbackResult('abc123')

    expect(postMessageSpy).not.toHaveBeenCalled()
  })
})

describe('silentSsoCheck', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setGmwUrl(`${GMW_URL}/`)
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.replaceChildren()
  })

  it('loads the GMW authorize endpoint in a hidden iframe with our callback URL', () => {
    void silentSsoCheck()

    const [iframe] = ssoIframes()
    const src = new URL(iframe.src)
    expect(src.origin + src.pathname).toBe(`${GMW_URL}/api/auth/sso/authorize`)
    expect(src.searchParams.get('redirect_uri')).toBe(
      `${window.location.origin}${SILENT_CALLBACK_PATH}`
    )
    expect(iframe.style.display).toBe('none')
    expect(iframe.getAttribute('aria-hidden')).toBe('true')
  })

  it('resolves the code from a matching message and removes the iframe', async () => {
    const result = silentSsoCheck()

    postMessage({ type: MESSAGE_TYPE, code: 'abc123' })

    await expect(result).resolves.toBe('abc123')
    expect(ssoIframes()).toHaveLength(0)
  })

  it('resolves null when the matching message has an empty code', async () => {
    const result = silentSsoCheck()

    postMessage({ type: MESSAGE_TYPE, code: '' })

    await expect(result).resolves.toBeNull()
  })

  it('ignores messages from another origin and of another type', async () => {
    const result = silentSsoCheck()
    let settled = false
    void result.then(() => (settled = true))

    postMessage({ type: MESSAGE_TYPE, code: 'from-elsewhere' }, 'https://evil.test')
    postMessage({ type: 'something-else', code: 'wrong-type' })
    postMessage(null)
    await Promise.resolve()

    expect(settled).toBe(false)
    expect(ssoIframes()).toHaveLength(1)

    postMessage({ type: MESSAGE_TYPE, code: 'abc123' })
    await expect(result).resolves.toBe('abc123')
  })

  it('resolves null after the timeout and removes the iframe', async () => {
    const result = silentSsoCheck()

    vi.advanceTimersByTime(TIMEOUT_MS - 1)
    expect(ssoIframes()).toHaveLength(1)

    vi.advanceTimersByTime(1)
    await expect(result).resolves.toBeNull()
    expect(ssoIframes()).toHaveLength(0)
  })

  it('rejects when NEXT_PUBLIC_GMW_URL is not set, without adding an iframe', async () => {
    setGmwUrl(undefined)

    await expect(silentSsoCheck()).rejects.toThrow('NEXT_PUBLIC_GMW_URL is not set')
    expect(document.querySelectorAll('iframe')).toHaveLength(0)
  })
})
