import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SidebarSettings from '@/components/MobileFooter/SidebarSettings'
import TrainingEnvironmentFrame from '@/components/TrainingEnvironmentFrame'
import language from '@/language'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { getQueryClient } from '@/lib/queryClient'
import { TRAINING_API_URL, isTrainingMode, setTrainingMode } from '@/lib/trainingMode'

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  setTrainingMode(false)
  fetchMock.mockReset()
  fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('training mode', () => {
  it('sends API requests to the training API while on', async () => {
    await api.get('/sites')
    expect(fetchMock.mock.calls.at(-1)?.[0]).toBe(`${env.NEXT_PUBLIC_API_URL}/sites`)

    setTrainingMode(true)
    await api.get('/sites')
    expect(fetchMock.mock.calls.at(-1)?.[0]).toBe(`${TRAINING_API_URL}/sites`)
  })

  it('remembers the choice and drops cached data from the other environment', () => {
    getQueryClient().setQueryData(['sites'], ['real site'])
    setTrainingMode(true)
    expect(window.localStorage.getItem('mrtt-training-mode')).toBe('true')
    expect(getQueryClient().getQueryData(['sites'])).toBeUndefined()
  })
})

describe('TrainingEnvironmentFrame', () => {
  it('frames the app with a banner only in training mode', async () => {
    const { rerender } = render(
      <TrainingEnvironmentFrame>
        <p>App</p>
      </TrainingEnvironmentFrame>
    )
    expect(screen.getByText('App')).toBeInTheDocument()
    expect(screen.queryByText(language.trainingEnvironment.title)).not.toBeInTheDocument()

    act(() => setTrainingMode(true))
    rerender(
      <TrainingEnvironmentFrame>
        <p>App</p>
      </TrainingEnvironmentFrame>
    )
    expect(screen.getByText('App')).toBeInTheDocument()
    await userEvent.setup().click(screen.getByText(language.trainingEnvironment.title))
    expect(await screen.findByText(language.trainingEnvironment.description)).toBeInTheDocument()
  })
})

describe('SidebarSettings', () => {
  const dialog = language.trainingEnvironment.dialog

  it('opens the training dialog from the switch and only changes mode from its button', async () => {
    const user = userEvent.setup()
    render(<SidebarSettings />)
    const toggle = screen.getByRole('switch', { name: language.sidebar.trainingEnvironment })

    expect(toggle).not.toBeChecked()
    await user.click(toggle)
    const dialogElement = await screen.findByRole('dialog', {
      name: language.trainingEnvironment.title
    })
    expect(within(dialogElement).getByText(dialog.purpose)).toBeInTheDocument()
    expect(
      within(dialogElement).getByRole('link', { name: dialog.userGuideButton })
    ).toHaveAttribute('target', '_blank')
    // Opening the dialog doesn't switch yet.
    expect(isTrainingMode()).toBe(false)
    expect(toggle).not.toBeChecked()

    await user.click(within(dialogElement).getByRole('button', { name: dialog.access }))
    expect(isTrainingMode()).toBe(true)
    expect(toggle).toBeChecked()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('leaves training mode from the dialog', async () => {
    const user = userEvent.setup()
    act(() => setTrainingMode(true))
    render(<SidebarSettings />)

    await user.click(screen.getByRole('switch', { name: language.sidebar.trainingEnvironment }))
    await user.click(await screen.findByRole('button', { name: dialog.leave }))
    expect(isTrainingMode()).toBe(false)
  })

  it('closes without changing mode', async () => {
    const user = userEvent.setup()
    render(<SidebarSettings />)

    await user.click(screen.getByRole('switch', { name: language.sidebar.trainingEnvironment }))
    await user.click(await screen.findByRole('button', { name: 'Close dialog' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(isTrainingMode()).toBe(false)
  })
})
