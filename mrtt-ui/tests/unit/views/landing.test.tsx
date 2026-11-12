import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

import ContactForm from '@/components/contact'
import LandingHeader from '@/components/landing/LandingHeader'
import language from '@/language'
import LoginForm from '@/views/Auth/LoginForm'

const { router, authApi, syncSession, login, toast } = vi.hoisted(() => ({
  router: {
    push: vi.fn<(href: string) => void>(),
    replace: vi.fn<(href: string) => void>()
  },
  authApi: { post: vi.fn<(path: string, body?: unknown) => Promise<unknown>>() },
  syncSession: vi.fn<(token: string) => Promise<void>>(),
  login: vi.fn<(token: string, user?: unknown) => void>(),
  toast: { success: vi.fn<(message: string) => void>(), error: vi.fn<(message: string) => void>() }
}))
let auth = { isLoggedIn: false, isChecking: false, login }

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/lib/api', () => ({ authApi }))
vi.mock('@/hooks/sso', () => ({ syncSession }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => auth }))
vi.mock('@/components/ui/toast', () => ({ toast }))

function QueryWrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

const loginLanguage = language.pages.login
const logInButton = () => screen.getByRole('button', { name: loginLanguage.title })

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
  auth = { isLoggedIn: false, isChecking: false, login }
})

describe('LoginForm', () => {
  it('asks for both fields before signing in', async () => {
    const user = userEvent.setup()
    render(<LoginForm />, { wrapper: QueryWrapper })

    await user.click(logInButton())

    expect(await screen.findByText('Email required')).toBeInTheDocument()
    expect(screen.getByText('Password required')).toBeInTheDocument()
    expect(authApi.post).not.toHaveBeenCalled()
  })

  it('signs in, syncs the GMW session and opens the sites', async () => {
    const user = userEvent.setup()
    authApi.post.mockResolvedValue({ token: 'jwt', username: 'Ana', organization: 'Org' })
    syncSession.mockResolvedValue()
    render(<LoginForm />, { wrapper: QueryWrapper })

    await user.type(screen.getByLabelText(loginLanguage.email), 'ana@example.org')
    await user.type(screen.getByLabelText(loginLanguage.password), 'secret')
    await user.click(logInButton())

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/sites'))
    expect(authApi.post).toHaveBeenCalledWith('/users/sign_in', {
      user: { email: 'ana@example.org', password: 'secret' }
    })
    expect(syncSession).toHaveBeenCalledWith('jwt')
    expect(login).toHaveBeenCalledWith('jwt', {
      email: 'ana@example.org',
      name: 'Ana',
      organization: 'Org'
    })
  })

  it('shows the API error when the credentials are wrong', async () => {
    const user = userEvent.setup()
    authApi.post.mockRejectedValue({ status: 401, body: { error: 'Invalid Email or password.' } })
    render(<LoginForm />, { wrapper: QueryWrapper })

    await user.type(screen.getByLabelText(loginLanguage.email), 'ana@example.org')
    await user.type(screen.getByLabelText(loginLanguage.password), 'wrong')
    await user.click(logInButton())

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid Email or password.'))
    expect(screen.getByText(language.error.submit)).toBeInTheDocument()
    expect(router.push).not.toHaveBeenCalled()
  })

  it('tells a new user to check their email', () => {
    render(<LoginForm isUserNew />, { wrapper: QueryWrapper })

    expect(screen.getByRole('alert')).toHaveTextContent(language.success.signup)
  })

  it('sends a signed-in user to the sites', () => {
    auth = { ...auth, isLoggedIn: true }
    render(<LoginForm />, { wrapper: QueryWrapper })

    expect(router.replace).toHaveBeenCalledWith('/sites')
  })
})

describe('LandingHeader', () => {
  it('opens the about dialog', async () => {
    const user = userEvent.setup()
    render(<LandingHeader />)

    const desktopMenu = screen.getAllByRole('navigation', { name: 'Main' })[0]
    await user.click(within(desktopMenu).getByRole('button', { name: 'About' }))

    expect(
      await screen.findByRole('dialog', {
        name: 'About the Mangrove Restoration Tracker Tool (MRTT)'
      })
    ).toBeInTheDocument()
  })

  it('opens the contact form from the mobile menu', async () => {
    const user = userEvent.setup()
    render(<LandingHeader />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const menu = await screen.findByRole('dialog', { name: 'Menu' })
    await user.click(within(menu).getByRole('button', { name: 'Contact us' }))

    expect(await screen.findByRole('dialog', { name: 'Contact Us' })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull())
  })
})

describe('ContactForm', () => {
  it('lists what is missing, including the topic', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactForm isOpen setIsOpen={vi.fn<(isOpen: boolean) => void>()} />)

    await user.click(await screen.findByRole('button', { name: 'Send' }))

    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Topic is required')).toBeInTheDocument()
    expect(screen.getByText('Message is required')).toBeInTheDocument()
    expect(screen.getByText('You must accept the Privacy Notice')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends the message', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}'))
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactForm isOpen setIsOpen={vi.fn<(isOpen: boolean) => void>()} />)

    await user.type(await screen.findByLabelText(/^Name/), 'Ana')
    await user.type(screen.getByLabelText(/^Email/), 'ana@example.org')
    await user.click(screen.getByRole('combobox', { name: /^Topic/ }))
    await user.click(await screen.findByRole('option', { name: 'Datasets' }))
    await user.type(screen.getByLabelText(/^Message/), 'Hello there')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByText('Email sent successfully!')).toBeInTheDocument()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://www.globalmangrovewatch.org/api/send')
    expect(JSON.parse(String(init?.body))).toEqual({
      name: 'Ana',
      organization: '',
      email: 'ana@example.org',
      topic: 'datasets',
      message: 'Hello there',
      privacyPolicy: true
    })
  })
})
