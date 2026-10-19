import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import axios from 'axios'
import PropTypes from 'prop-types'

import SiteBackgroundForm from './SiteBackgroundForm'
import FormWrapperProvider from './FormWrapper/FormWrapperProvider'

vi.mock('axios')
vi.mock('./QuestionNav', () => ({ default: () => null }))

const API_URL = 'http://api.test'
const SITE_ID = '42'
const ANSWERS_URL = `${API_URL}/sites/${SITE_ID}/registration_intervention_answers`

const FormWrapper = ({ children }) => {
  const form = useForm()
  return <FormProvider {...form}>{children}</FormProvider>
}

FormWrapper.propTypes = { children: PropTypes.node.isRequired }

const renderSiteBackgroundForm = ({ Provider = FormWrapper } = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/sites/${SITE_ID}/site-background`]}>
        <Provider>
          <Routes>
            <Route path='/sites/:siteId/site-background' element={<SiteBackgroundForm />} />
          </Routes>
        </Provider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SiteBackgroundForm', () => {
  beforeEach(() => {
    process.env.REACT_APP_API_URL = API_URL
    axios.get.mockImplementation((url) => {
      if (url === ANSWERS_URL) {
        return Promise.resolve({
          data: [
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
          ]
        })
      }
      return Promise.resolve({ data: { site_name: 'Test site' } })
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads saved stakeholders (2.1) from the API into the form on mount', async () => {
    renderSiteBackgroundForm()

    expect(await screen.findByDisplayValue('Jane Doe')).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox')
    const checkedTypes = checkboxes.filter((c) => c.checked).map((c) => c.value)
    expect(checkedTypes).toEqual(expect.arrayContaining(['Local leaders', 'Unknown']))
    expect(checkedTypes).not.toContain('Local community representatives')

    // 2.2 (managementStatus) is a MUI Select: its value lives in a hidden input
    expect(screen.getByDisplayValue('Protected informally at a local level')).toBeInTheDocument()

    expect(axios.get).toHaveBeenCalledWith(ANSWERS_URL)
  })

  it('marks the multi-select checkbox groups (2.5, 2.8) through the real FormWrapperProvider', async () => {
    renderSiteBackgroundForm({ Provider: FormWrapperProvider })

    await screen.findByDisplayValue('Jane Doe')

    // CheckboxGroup mirrors the controller value into local state in an
    // effect, so the checked state lands one render after the form value.
    await waitFor(() => {
      const checkedValues = screen
        .getAllByRole('checkbox')
        .filter((c) => c.checked)
        .map((c) => c.value)

      expect(checkedValues).toEqual(
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
