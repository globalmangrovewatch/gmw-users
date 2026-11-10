import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, type ReactNode } from 'react'
import { FormProvider, useForm, useFormContext, type DefaultValues } from 'react-hook-form'

import CausesOfDeclineForm from '@/components/CausesOfDeclineForm'
import PreRestorationAssessmentForm from '@/components/PreRestorationAssessment/PreRestorationAssessmentForm'
import ProjectDetailsForm from '@/components/ProjectDetailsForm'
import RestorationAimsForm from '@/components/RestorationAimsForm/RestorationAimsForm'
import {
  causesOfDecline,
  preRestorationAssessment,
  projectDetails,
  restorationAims
} from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import organizeMangroveSpeciesList from '@/library/organizeMangroveSpeciesList'

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
  const { getValues } = useFormContext<RegistrationFormValues>()
  useEffect(() => {
    formValues = getValues
  }, [getValues])
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
  // Registration answers the API returns for the site.
  let answers: { question_id: string; answer_value: unknown }[] = []

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockImplementation(async (url) =>
      url.endsWith('/registration_intervention_answers')
        ? jsonResponse(answers)
        : jsonResponse({ site_name: 'Test site' })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
    answers = []
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
  describe('CausesOfDeclineForm', () => {
    it('shows saved causes as checked and asks their magnitude of impact', async () => {
      answers = [
        { question_id: '4.1', answer_value: 'true' },
        {
          question_id: '4.2',
          answer_value: [
            {
              mainCauseLabel: 'Residential & commercial development',
              mainCauseAnswers: [{ mainCauseAnswer: 'Land reclamation', levelOfDegradation: '' }]
            }
          ]
        }
      ]
      renderSection(<CausesOfDeclineForm />)

      expect(await screen.findByRole('checkbox', { name: 'Land reclamation' })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Housing & urban areas' })).not.toBeChecked()
      expect(screen.getByText(causesOfDecline.levelsOfDegredation.question)).toBeInTheDocument()
      expect(screen.getByRole('combobox', { name: 'Land reclamation' })).toBeInTheDocument()
    })

    it('adds and removes a sub cause answer when its checkbox changes', async () => {
      const user = userEvent.setup()
      renderSection(<CausesOfDeclineForm />, { lossKnown: 'false' })

      await user.click(screen.getByRole('radio', { name: 'Yes' }))
      const rice = await screen.findByRole('checkbox', { name: 'Rice' })
      await user.click(rice)

      expect(rice).toBeChecked()
      expect(formValues().causesOfDecline).toEqual([
        {
          mainCauseLabel: 'Agriculture & aquaculture',
          subCauses: [
            {
              subCauseLabel: 'Annual & perennial non-timber crops',
              subCauseAnswers: [{ subCauseAnswer: 'Rice', levelOfDegradation: '' }]
            }
          ]
        }
      ])

      await user.click(rice)
      expect(formValues().causesOfDecline).toEqual([])
      expect(
        screen.queryByText(causesOfDecline.levelsOfDegredation.question)
      ).not.toBeInTheDocument()
    })
  })

  describe('PreRestorationAssessmentForm', () => {
    it('lists the default measurements and the site countries’ species once assessed', async () => {
      const user = userEvent.setup()
      answers = [
        { question_id: '1.2', answer_value: [{ properties: { country: 'Indonesia' } }] },
        { question_id: '5.3', answer_value: 'Yes' }
      ]
      renderSection(<PreRestorationAssessmentForm />)

      expect(await screen.findByLabelText('Tidal range (cm)')).toBeInTheDocument()
      expect(formValues().physicalMeasurementsTaken).toHaveLength(8)

      const speciesName = organizeMangroveSpeciesList([
        { properties: { country: 'Indonesia' } }
      ])[0]!
      await user.click(screen.getByRole('checkbox', { name: speciesName }))

      expect(formValues().mangroveSpeciesPresent).toEqual([speciesName])
      expect(
        screen.getByText(preRestorationAssessment.speciesComposition.question)
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText(speciesName, { selector: 'input:not([type=checkbox])' })
      ).toBeInTheDocument()
    })

    it('removes a measurement row after confirming', async () => {
      const user = userEvent.setup()
      answers = [{ question_id: '5.3', answer_value: 'Yes' }]
      renderSection(<PreRestorationAssessmentForm />)

      await user.click(await screen.findByRole('button', { name: /Tidal range \(cm\)/ }))
      await user.click(
        await screen.findByRole('button', { name: language.form.tabularDeletePrompt.buttonText })
      )

      await waitFor(() =>
        expect(screen.queryByLabelText('Tidal range (cm)')).not.toBeInTheDocument()
      )
      expect(formValues().physicalMeasurementsTaken).toHaveLength(7)
    })
  })
})
