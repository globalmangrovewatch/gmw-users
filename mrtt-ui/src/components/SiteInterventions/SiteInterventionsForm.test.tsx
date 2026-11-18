import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFormContext, type UseFormReturn } from 'react-hook-form'

import FormWrapperProvider from '@/components/FormWrapper/FormWrapperProvider'
import type { RegistrationFormValues } from '@/forms/schemas'

import SiteInterventionsForm from './SiteInterventionsForm'

// QuestionNav holds the Save button; here it only hands the form out so the test can validate.
const formRef = { current: null as UseFormReturn<RegistrationFormValues> | null }
vi.mock('@/components/QuestionNav', () => ({
  default: function QuestionNavStub() {
    formRef.current = useFormContext<RegistrationFormValues>()
    return null
  }
}))
vi.mock('next/navigation', () => ({ useParams: () => ({ siteId: '42' }) }))

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })

describe('SiteInterventionsForm', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        jsonResponse(url.includes('answers') ? [] : { site_name: 'Test site' })
      )
    )
  })

  afterEach(() => vi.unstubAllGlobals())

  it('shows the banner and the inline error when a required checkbox group is empty', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <FormWrapperProvider>
          <SiteInterventionsForm />
        </FormWrapperProvider>
      </QueryClientProvider>
    )
    await screen.findByText(/^6\.2 /)

    // What Save does: validate only this section's questions.
    let isValid: boolean | undefined
    await act(async () => {
      isValid = await formRef.current?.trigger('biophysicalInterventionsUsed')
    })

    expect(isValid).toBe(false)
    expect(screen.getByText('The form was not saved')).toBeInTheDocument()
    expect(screen.getByText('Please select at least one item.')).toBeInTheDocument()
  })
})
