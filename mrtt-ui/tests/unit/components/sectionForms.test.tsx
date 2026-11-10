import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { FormProvider, useForm, useFormContext, type DefaultValues } from 'react-hook-form'

import ProjectDetailsForm from '@/components/ProjectDetailsForm'
import RestorationAimsForm from '@/components/RestorationAimsForm/RestorationAimsForm'
import { projectDetails, restorationAims } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'

vi.mock('@/components/QuestionNav', () => ({ default: () => null }))
vi.mock('next/navigation', () => ({ useParams: () => ({ siteId: '42' }) }))
// The site area map needs WebGL; these tests are about the questions around it.
vi.mock('next/dynamic', () => ({ default: () => () => null }))

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })

let formValues: () => RegistrationFormValues = () => {
  throw new Error('form not rendered')
}

function ExposeValues() {
  const form = useFormContext<RegistrationFormValues>()
  formValues = form.getValues
  return null
}

const renderSection = (
  section: ReactNode,
  defaultValues: DefaultValues<RegistrationFormValues> = {}
) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  function Wrapper({ children }: { children: ReactNode }) {
    const form = useForm<RegistrationFormValues>({ defaultValues })
    return (
      <FormProvider {...form}>
        <ExposeValues />
        {children}
      </FormProvider>
    )
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <Wrapper>{section}</Wrapper>
    </QueryClientProvider>
  )
}

describe('section forms', () => {
  const fetchMock = vi.fn<(url: string) => Promise<Response>>()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockImplementation(async (url) =>
      url.endsWith('/registration_intervention_answers')
        ? jsonResponse([])
        : jsonResponse({ site_name: 'Test site' })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  describe('ProjectDetailsForm', () => {
    it('asks for an end date only once "Yes" is picked, and stores a boolean', async () => {
      const user = userEvent.setup()
      renderSection(<ProjectDetailsForm />, { hasProjectEndDate: false })

      expect(screen.queryByText(projectDetails.projectEndDate.question)).not.toBeInTheDocument()

      await user.click(screen.getByRole('radio', { name: 'Yes' }))

      expect(await screen.findByText(projectDetails.projectEndDate.question)).toBeInTheDocument()
      expect(formValues().hasProjectEndDate).toBe(true)
    })

    it('stores the picked countries as their GeoJSON features', async () => {
      const user = userEvent.setup()
      renderSection(<ProjectDetailsForm />)

      const input = screen.getByRole('combobox', {
        name: new RegExp(projectDetails.countries.question.slice(0, 20))
      })
      await user.type(input, 'Indones')
      await user.click(await screen.findByRole('option', { name: 'Indonesia' }))

      expect(await screen.findByRole('button', { name: 'Remove Indonesia' })).toBeInTheDocument()
      await waitFor(() =>
        expect(formValues().countries?.map((c) => c.properties?.country)).toEqual(['Indonesia'])
      )
    })
  })

  describe('RestorationAimsForm', () => {
    it('warns once per question when Site background has no stakeholders', async () => {
      renderSection(<RestorationAimsForm />)

      expect(
        await screen.findAllByText(language.pages.restorationAims.missingStakeholdersWarning)
      ).toHaveLength(3)
    })

    it('asks each stakeholder how they benefit from a checked aim', async () => {
      const user = userEvent.setup()
      const aim = restorationAims.ecologicalAims.options[0]
      renderSection(<RestorationAimsForm />, {
        stakeholders: [{ stakeholderType: 'Local leaders', stakeholderName: 'Jane Doe' }]
      })

      await user.click(await screen.findByRole('checkbox', { name: aim }))

      expect(
        screen.queryByText(language.pages.restorationAims.missingStakeholdersWarning)
      ).not.toBeInTheDocument()
      expect(
        screen.getByText(restorationAims.nestedStakeholderBenefitsRanking.question)
      ).toBeInTheDocument()
      expect(screen.getByRole('combobox', { name: 'Local leaders (Jane Doe)' })).toBeInTheDocument()
      expect(formValues().ecologicalAims?.selectedValues).toEqual([aim])
    })
  })
})
