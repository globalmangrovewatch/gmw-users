import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import axios from 'axios'
import PropTypes from 'prop-types'

import SiteBackgroundForm from './SiteBackgroundForm'

jest.mock('axios')
jest.mock('./QuestionNav', () => () => null)

const API_URL = 'http://api.test'
const SITE_ID = '42'
const ANSWERS_URL = `${API_URL}/sites/${SITE_ID}/registration_intervention_answers`

const FormWrapper = ({ children }) => {
  const form = useForm()
  return <FormProvider {...form}>{children}</FormProvider>
}

FormWrapper.propTypes = { children: PropTypes.node.isRequired }

const renderSiteBackgroundForm = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/sites/${SITE_ID}/site-background`]}>
        <Routes>
          <Route
            path='/sites/:siteId/site-background'
            element={
              <FormWrapper>
                <SiteBackgroundForm />
              </FormWrapper>
            }
          />
        </Routes>
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
            { question_id: '2.2', answer_value: 'Protected informally at a local level' }
          ]
        })
      }
      return Promise.resolve({ data: { site_name: 'Test site' } })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('loads saved stakeholders (2.1) from the API into the form on mount', async () => {
    renderSiteBackgroundForm()

    expect(await screen.findByDisplayValue('Jane Doe')).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox')
    const checkedTypes = checkboxes.filter((c) => c.checked).map((c) => c.value)
    expect(checkedTypes).toEqual(['Local leaders', 'Unknown'])

    // 2.2 (managementStatus) is a MUI Select: its value lives in a hidden input
    expect(screen.getByDisplayValue('Protected informally at a local level')).toBeInTheDocument()

    expect(axios.get).toHaveBeenCalledWith(ANSWERS_URL)
  })
})
