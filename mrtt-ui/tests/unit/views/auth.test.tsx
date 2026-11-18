import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ProtectedRoutes from '@/components/Auth/ProtectedRoutes'
import language from '@/language'
import ForgotPasswordForm from '@/views/Auth/ForgotPasswordForm'
import ResetPasswordForm from '@/views/Auth/ResetPasswordForm'
import SignupForm from '@/views/Auth/SignupForm'

const { router, authApi } = vi.hoisted(() => ({
  router: {
    push: vi.fn<(href: string) => void>(),
    replace: vi.fn<(href: string) => void>(),
    back: vi.fn<() => void>()
  },
  authApi: {
    post: vi.fn<(path: string, body?: unknown) => Promise<unknown>>(),
    put: vi.fn<(path: string, body?: unknown) => Promise<unknown>>()
  }
}))
let auth = { isLoggedIn: false, isChecking: false }

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams('token=reset-token')
}))
vi.mock('@/lib/api', () => ({ authApi }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => auth }))
vi.mock('@/components/ui/toast', () => ({
  toast: { success: vi.fn<(message: string) => void>(), error: vi.fn<(message: string) => void>() }
}))

const submit = () => screen.getByRole('button', { name: language.buttons.submit })

afterEach(() => {
  vi.clearAllMocks()
  auth = { isLoggedIn: false, isChecking: false }
})

describe('SignupForm', () => {
  const signUp = language.pages.userSignUp

  it('explains what is missing before sending anything', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText(new RegExp(`^${signUp.password}`)), 'longenough')
    await user.type(screen.getByLabelText(new RegExp(`^${signUp.confirmPassword}`)), 'different')
    await user.click(submit())

    expect(await screen.findByText(language.form.required)).toBeInTheDocument()
    expect(screen.getByText(signUp.validation.passwordsMustMatch)).toBeInTheDocument()
    expect(screen.getByText(signUp.validation.termsAndConditions)).toBeInTheDocument()
    expect(authApi.post).not.toHaveBeenCalled()
  })

  it('creates the account and sends the user to log in', async () => {
    const user = userEvent.setup()
    authApi.post.mockResolvedValue({})
    render(<SignupForm />)

    await user.type(screen.getByLabelText(signUp.name), 'Ana')
    await user.type(screen.getByLabelText(new RegExp(`^${signUp.email}`)), 'ana@example.org')
    await user.type(screen.getByLabelText(new RegExp(`^${signUp.password}`)), 'longenough')
    await user.type(screen.getByLabelText(new RegExp(`^${signUp.confirmPassword}`)), 'longenough')
    await user.click(screen.getByRole('checkbox'))
    await user.click(submit())

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/auth/login/newUser'))
    expect(authApi.post).toHaveBeenCalledWith('/users', {
      user: { email: 'ana@example.org', name: 'Ana', password: 'longenough' }
    })
  })
})

describe('ForgotPasswordForm', () => {
  it('sends the reset email for a valid address only', async () => {
    const user = userEvent.setup()
    authApi.post.mockResolvedValue({})
    render(<ForgotPasswordForm />)

    const email = screen.getByLabelText(/^Email/)
    await user.type(email, 'not-an-email')
    await user.click(submit())
    expect(await screen.findByText('email must be a valid email')).toBeInTheDocument()
    expect(authApi.post).not.toHaveBeenCalled()

    await user.clear(email)
    await user.type(email, 'ana@example.org')
    await user.click(submit())
    await waitFor(() =>
      expect(authApi.post).toHaveBeenCalledWith('/users/password', {
        user: { email: 'ana@example.org' }
      })
    )
    expect(screen.getByRole('link', { name: language.buttons.cancel })).toHaveAttribute(
      'href',
      '/auth/login'
    )
  })
})

describe('ResetPasswordForm', () => {
  const reset = language.pages.resetPassword

  const fillAndSubmit = async () => {
    const user = userEvent.setup()
    render(<ResetPasswordForm />)
    await user.type(screen.getByLabelText(new RegExp(`^${reset.password.trim()}`)), 'longenough')
    await user.type(
      screen.getByLabelText(new RegExp(`^${reset.confirmPassword.replace(/\s+/g, '\\s+')}`)),
      'longenough'
    )
    await user.click(submit())
  }

  it('resets the password with the token from the link, then goes to log in', async () => {
    authApi.put.mockResolvedValue({ message: 'The password was reset successfully' })
    await fillAndSubmit()

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/auth/login'))
    expect(authApi.put).toHaveBeenCalledWith('/users/password', {
      user: {
        password: 'longenough',
        password_confirmation: 'longenough',
        reset_password_token: 'reset-token'
      }
    })
  })

  it('shows the submit error when the API does not confirm the reset', async () => {
    authApi.put.mockResolvedValue({})
    await fillAndSubmit()

    expect(await screen.findByText(language.error.submit)).toBeInTheDocument()
    expect(router.push).not.toHaveBeenCalled()
  })
})

describe('ProtectedRoutes', () => {
  it('sends signed-out users to the login page', async () => {
    render(<ProtectedRoutes>secret</ProtectedRoutes>)

    expect(screen.queryByText('secret')).not.toBeInTheDocument()
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/auth/login'))
  })

  it('shows the page to signed-in users', () => {
    auth = { isLoggedIn: true, isChecking: false }
    render(<ProtectedRoutes>secret</ProtectedRoutes>)

    expect(screen.getByText('secret')).toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })
})
