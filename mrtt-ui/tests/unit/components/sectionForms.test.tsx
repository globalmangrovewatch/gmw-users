import { zodResolver } from '@hookform/resolvers/zod'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, type ReactNode } from 'react'
import { FormProvider, useForm, useFormContext, type DefaultValues } from 'react-hook-form'

import CausesOfDeclineForm from '@/components/CausesOfDeclineForm'
import PreRestorationAssessmentForm from '@/components/PreRestorationAssessment/PreRestorationAssessmentForm'
import ProjectDetailsForm from '@/components/ProjectDetailsForm'
import SiteInterventionsForm from '@/components/SiteInterventions/SiteInterventionsForm'
import RestorationAimsForm from '@/components/RestorationAimsForm/RestorationAimsForm'
import {
  causesOfDecline,
  preRestorationAssessment,
  projectDetails,
  restorationAims
} from '@/data/questions'
import { registrationSchema, type RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import organizeMangroveSpeciesList from '@/library/organizeMangroveSpeciesList'

vi.mock('@/components/QuestionNav', () => ({ default: () => null }))
vi.mock('next/navigation', () => ({ useParams: () => ({ siteId: '42' }) }))
// The site area map needs WebGL; these tests are about the questions around it.
vi.mock('next/dynamic', () => ({ default: () => () => null }))
// The real list holds every mangrove species (one checkbox each), too slow to render in CI.
vi.mock('@/library/organizeMangroveSpeciesList', () => ({
  default: () => ['Avicennia marina', 'Rhizophora apiculata', 'Sonneratia alba']
}))

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })

const notRendered = () => {
  throw new Error('form not rendered')
}
let formValues: () => RegistrationFormValues = notRendered
let validateForm: () => Promise<boolean> = notRendered

function ExposeValues() {
  const { getValues, trigger } = useFormContext<RegistrationFormValues>()
  useEffect(() => {
    formValues = getValues
    validateForm = () => trigger()
  }, [getValues, trigger])
  return null
}

const renderSection = (
  section: ReactNode,
  defaultValues: DefaultValues<RegistrationFormValues> = {},
  // Validate with the app's schema (as FormWrapperProvider does), for tests that check messages.
  { validate = false } = {}
) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  function Wrapper({ children }: { children: ReactNode }) {
    const form = useForm<RegistrationFormValues>({
      resolver: validate ? zodResolver(registrationSchema) : undefined,
      defaultValues
    })
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
  describe('SiteInterventionsForm', () => {
    const species = organizeMangroveSpeciesList([{ properties: { country: 'Indonesia' } }])[0]!

    it('loads saved stakeholders, species used and associated species', async () => {
      answers = [
        { question_id: '1.2', answer_value: [{ properties: { country: 'Indonesia' } }] },
        {
          question_id: '6.1',
          answer_value: [
            { stakeholder: 'Local community representatives', stakeholderType: 'Paid' }
          ]
        },
        { question_id: '6.2', answer_value: { selectedValues: ['Planting'] } },
        {
          question_id: '6.2b',
          answer_value: [
            {
              type: species,
              seed: { checked: true, source: ['From a nursery'], count: 40 },
              propagule: { checked: false, source: [], count: 0 }
            }
          ]
        },
        {
          question_id: '6.2c',
          answer_value: [
            { type: 'Nipa palm', count: 12, source: 'Wild', purpose: { purpose: 'Source of food' } }
          ]
        }
      ]
      renderSection(<SiteInterventionsForm />)

      expect(
        await screen.findByRole('checkbox', { name: 'Local community representatives' })
      ).toBeChecked()
      expect(screen.getByRole('checkbox', { name: species })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Seedling' })).toBeChecked()
      expect(screen.getByRole('button', { name: 'Remove From a nursery' })).toBeInTheDocument()
      expect(screen.getByLabelText('Seedling count')).toHaveValue('40')
      expect(screen.getByText('Nipa palm')).toBeInTheDocument()
      expect(screen.getByLabelText('Count')).toHaveValue('12')
    })

    it('adds a species used and an associated species row', async () => {
      const user = userEvent.setup()
      answers = [
        { question_id: '1.2', answer_value: [{ properties: { country: 'Indonesia' } }] },
        { question_id: '6.2', answer_value: { selectedValues: ['Planting'] } }
      ]
      renderSection(<SiteInterventionsForm />)

      await user.click(await screen.findByRole('checkbox', { name: species }))
      await user.click(screen.getByRole('checkbox', { name: 'Propagule' }))
      expect(formValues().mangroveSpeciesUsed).toEqual([
        {
          type: species,
          seed: { checked: false, source: [], count: 0 },
          propagule: { checked: true, source: [], count: 0 }
        }
      ])

      await user.click(screen.getByRole('button', { name: '+ Add measurement row' }))
      await user.type(screen.getByLabelText('Species name'), 'Nipa palm')
      await user.type(screen.getByLabelText('Number'), '3')
      await user.click(screen.getByRole('combobox', { name: 'Source' }))
      await user.click(await screen.findByRole('option', { name: 'Wild' }))
      await user.click(screen.getByRole('combobox', { name: 'Purpose' }))
      await user.click(await screen.findByRole('option', { name: 'Coastal defence' }))
      await user.click(screen.getByRole('button', { name: language.buttons.save }))

      expect(formValues().mangroveAssociatedSpecies).toEqual([
        {
          type: 'Nipa palm',
          count: '3',
          source: 'Wild',
          purpose: { purpose: 'Coastal defence', other: '' }
        }
      ])
      expect(await screen.findByText('Nipa palm')).toBeInTheDocument()
    })

    it('shows the associated species count error under the list', async () => {
      answers = [
        { question_id: '1.2', answer_value: [{ properties: { country: 'Indonesia' } }] },
        { question_id: '6.2', answer_value: { selectedValues: ['Planting'] } },
        {
          question_id: '6.2c',
          answer_value: [
            { type: 'Nipa palm', count: -1, source: 'Wild', purpose: { purpose: 'Source of food' } }
          ]
        }
      ]
      renderSection(<SiteInterventionsForm />, {}, { validate: true })
      await waitFor(() => expect(screen.getByLabelText('Count')).toHaveValue('-1'))

      await act(() => validateForm())

      expect(
        await screen.findByText(`Nipa palm: ${language.form.error.notNegative}`)
      ).toBeInTheDocument()
    })
  })
})
