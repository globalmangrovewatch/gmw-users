import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import SiteBackgroundForm from './SiteBackgroundForm'
import FormWrapperProvider from './FormWrapper/FormWrapperProvider'

vi.mock('./QuestionNav', () => ({ default: () => null }))
vi.mock('next/navigation', () => ({ useParams: () => ({ siteId: SITE_ID }) }))

const API_URL = 'http://api.test'
const SITE_ID = '42'
const ANSWERS_URL = `${API_URL}/sites/${SITE_ID}/registration_intervention_answers`

const FormWrapper = ({ children }: { children: ReactNode }) => {
  const form = useForm()
  return <FormProvider {...form}>{children}</FormProvider>
}

const renderSiteBackgroundForm = ({
  Provider = FormWrapper
}: { Provider?: (props: { children: ReactNode }) => ReactNode } = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider>
        <SiteBackgroundForm />
      </Provider>
    </QueryClientProvider>
  )
}

// Every checkbox is a Base UI role="checkbox" element with aria-checked; read them by label.
const checkedNames = () =>
  screen
    .getAllByRole('checkbox', { checked: true })
    .map((c) => c.closest('label')?.textContent?.trim())

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })

describe('SiteBackgroundForm', () => {
  const fetchMock = vi.fn<(url: string) => Promise<Response>>()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockImplementation(async (url: string) => {
      if (url === ANSWERS_URL) {
        return jsonResponse([
          {
            question_id: '2.1',
            answer_value: [
              { stakeholderType: 'Local leaders', stakeholderName: 'Jane Doe' },
              { stakeholderType: 'Unknown' }
            ]
          },
          { question_id: '2.2', answer_value: 'Protected informally at a local level' },
          {
            question_id: '2.5',
            answer_value: {
              selectedValues: ['Partial protection', 'Sustainable use'],
              isOtherChecked: true,
              otherValue: 'Seasonal closure'
            }
          },
          {
            question_id: '2.8',
            answer_value: { selectedValues: ['Communal'], isOtherChecked: false }
          }
        ])
      }
      return jsonResponse({ site_name: 'Test site' })
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('loads saved stakeholders (2.1) from the API into the form on mount', async () => {
    renderSiteBackgroundForm()

    expect(await screen.findByDisplayValue('Jane Doe')).toBeInTheDocument()

    const checkedTypes = checkedNames()
    expect(checkedTypes).toEqual(expect.arrayContaining(['Local leaders', 'Unknown']))
    expect(checkedTypes).not.toContain('Local community representatives')

    // 2.2 (managementStatus) is a Select: its value lives in a hidden input
    expect(screen.getByDisplayValue('Protected informally at a local level')).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(ANSWERS_URL, expect.anything())
  })

  it('marks the multi-select checkbox groups (2.5, 2.8) through the real FormWrapperProvider', async () => {
    renderSiteBackgroundForm({ Provider: FormWrapperProvider })

    await screen.findByDisplayValue('Jane Doe')

    await waitFor(() => {
      expect(checkedNames()).toEqual(
        expect.arrayContaining([
          'Local leaders',
          'Unknown',
          'Partial protection',
          'Sustainable use',
          'Communal'
        ])
      )
    })
    expect(screen.getByDisplayValue('Seasonal closure')).toBeInTheDocument()
  })
})
