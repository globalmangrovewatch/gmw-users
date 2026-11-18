import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, type ReactNode } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'

import EcologicalStatusAndOutcomesForm from '@/components/EcologicalStatusAndOutcomes/EcologicalStatusAndOutcomesForm'
import ManagementStatusAndEffectivenessForm from '@/components/ManagementStatusAndEffectiveness/ManagementStatusAndEffectivenessForm'
import SocioeconomicGovernanceStatusAndOutcomesForm from '@/components/SocioeconomicAndGovernance/SocioeconomicGovernanceStatusAndOutcomesForm'
import {
  ecologicalStatusOutcomes,
  managementStatusAndEffectiveness,
  socioeconomicGovernanceStatusOutcomes
} from '@/data/questions'
import { defaultValues, type RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import AddMonitoringSectionMenu from '@/views/SiteQuestionsOverview/AddMonitoringSectionMenu'

// Edit mode (`/form/<section>/7`) unless a test clears it.
let monitoringFormId: string[] | undefined = ['7']

vi.mock('@/components/QuestionNav', () => ({ default: () => null }))
// The real lists render one checkbox per indicator (~200 for ecology), too slow for CI.
vi.mock('@/data/monitoringIndicators', () => ({
  monitoringIndicators: [
    {
      category: 'Absence Of Threats',
      sub_category: 'Biological Threat',
      indicators: [
        { indicator: 'Invasive Species', metric: 'Height' },
        { indicator: 'Macroalgae', metric: 'Macroalgae Cover' }
      ]
    }
  ]
}))
vi.mock('@/data/socioIndicators', () => ({
  socioIndicators: [
    {
      label: 'Economic well-being',
      secondaryLabel: 'Income',
      children: ['Income', 'Wages']
    }
  ]
}))
vi.mock('next/navigation', () => ({
  useParams: () => ({ siteId: '42', monitoringFormId }),
  useRouter: () => ({ push: vi.fn<(href: string) => void>() })
}))

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

const renderForm = (section: ReactNode) => {
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

describe('monitoring forms', () => {
  const fetchMock = vi.fn<(url: string) => Promise<Response>>()
  // Answers the API returns for the site's registration and for monitoring form 7.
  let registrationAnswers: { question_id: string; answer_value: unknown }[] = []
  let monitorAnswers: { question_id: string; answer_value: unknown }[] = []

  beforeEach(() => {
    monitoringFormId = ['7']
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockImplementation(async (url) => {
      if (url.endsWith('/registration_intervention_answers')) {
        return jsonResponse(registrationAnswers)
      }
      if (url.endsWith('/monitoring_answers/7')) {
        return jsonResponse({
          id: 7,
          form_type: 'socioeconomicGovernanceStatusAndOutcomes',
          monitoring_date: '2026-01-01',
          answers: monitorAnswers
        })
      }
      return jsonResponse({ site_name: 'Test site' })
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
    registrationAnswers = []
    monitorAnswers = []
  })

  describe('ManagementStatusAndEffectivenessForm', () => {
    it('asks the follow-up questions only for the answers that need them', async () => {
      const user = userEvent.setup()
      monitoringFormId = undefined
      renderForm(<ManagementStatusAndEffectivenessForm />)

      const followUp = managementStatusAndEffectiveness.currentManagementStatus.question
      expect(screen.queryByText(followUp)).not.toBeInTheDocument()

      await user.click(
        await screen.findByRole('combobox', {
          name: managementStatusAndEffectiveness.managementStatusChanges.question
        })
      )
      await user.click(await screen.findByRole('option', { name: 'Yes' }))

      expect(screen.getByText(followUp)).toBeInTheDocument()
      expect(formValues().managementStatusChanges).toBe('Yes')
      // A new form has nothing to delete.
      expect(
        screen.queryByRole('button', { name: language.form.deleteForm })
      ).not.toBeInTheDocument()
    })

    it('loads a saved form and offers to delete it', async () => {
      monitorAnswers = [{ question_id: '8.3', answer_value: 'Partially' }]
      renderForm(<ManagementStatusAndEffectivenessForm />)

      expect(
        await screen.findByRole('button', { name: language.form.deleteForm })
      ).toBeInTheDocument()
      expect(formValues().stakeholderInfluence).toBe('Partially')
    })
  })

  describe('SocioeconomicGovernanceStatusAndOutcomesForm', () => {
    it('loads the saved outcomes, linked to the site’s socioeconomic aims', async () => {
      registrationAnswers = [{ question_id: '3.2', answer_value: { selectedValues: ['Jobs'] } }]
      monitorAnswers = [
        { question_id: '9.1', answer_value: '2026-03-01T00:00:00.000Z' },
        {
          question_id: '9.4',
          answer_value: [
            {
              mainLabel: 'Economic well-being',
              secondaryLabel: 'Income',
              child: 'Income',
              type: 'Quantitative',
              value: 5,
              linkedAims: ['Jobs']
            }
          ]
        }
      ]
      renderForm(<SocioeconomicGovernanceStatusAndOutcomesForm />)

      expect(await screen.findByRole('checkbox', { name: 'Income' })).toBeChecked()
      expect(screen.getByLabelText('Value')).toHaveValue('5')
      expect(screen.getByRole('checkbox', { name: 'Jobs' })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Not applicable' })).not.toBeChecked()
      expect(formValues().dateOfOutcomesAssessment).toBe('2026-03-01T00:00:00.000Z')
    })

    it('adds an outcome row when its indicator is checked, and links it to an aim', async () => {
      const user = userEvent.setup()
      monitoringFormId = undefined
      registrationAnswers = [{ question_id: '3.2', answer_value: { selectedValues: ['Jobs'] } }]
      renderForm(<SocioeconomicGovernanceStatusAndOutcomesForm />)

      expect(
        screen.queryByText(
          socioeconomicGovernanceStatusOutcomes.socioeconomicOutcomesAdditionalData.question
        )
      ).not.toBeInTheDocument()
      await user.click(await screen.findByRole('checkbox', { name: 'Income' }))
      await user.click(screen.getByRole('checkbox', { name: 'Jobs' }))

      expect(formValues().socioeconomicOutcomes).toEqual([
        expect.objectContaining({ child: 'Income', linkedAims: ['Jobs'] })
      ])

      await user.click(screen.getByRole('checkbox', { name: 'Income' }))
      expect(formValues().socioeconomicOutcomes).toEqual([])
    })
  })

  describe('EcologicalStatusAndOutcomesForm', () => {
    it('loads saved stakeholders and indicators, and asks about survival after planting', async () => {
      registrationAnswers = [
        { question_id: '3.1', answer_value: { selectedValues: ['More mangroves'] } },
        { question_id: '6.2', answer_value: { selectedValues: ['Planting'] } }
      ]
      monitorAnswers = [
        {
          question_id: '10.2',
          answer_value: [
            { stakeholder: 'Local community representatives', stakeholderType: 'Paid' }
          ]
        },
        {
          question_id: '10.7',
          answer_value: [
            {
              mainLabel: 'Absence Of Threats',
              secondaryLabel: 'Biological Threat',
              indicator: 'Macroalgae',
              metric: 'Macroalgae Cover',
              measurement: 12,
              linkedAims: ['More mangroves']
            }
          ]
        }
      ]
      renderForm(<EcologicalStatusAndOutcomesForm />)

      expect(
        await screen.findByRole('checkbox', { name: 'Local community representatives' })
      ).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Macroalgae: Macroalgae Cover' })).toBeChecked()
      expect(screen.getByLabelText('Measurement')).toHaveValue('12')
      expect(screen.getByRole('checkbox', { name: 'More mangroves' })).toBeChecked()
      await waitFor(() =>
        expect(
          screen.getByLabelText(ecologicalStatusOutcomes.percentageSurvival.question)
        ).toBeInTheDocument()
      )
    })

    it('asks for the other unit only when "other" is picked', async () => {
      const user = userEvent.setup()
      monitoringFormId = undefined
      renderForm(<EcologicalStatusAndOutcomesForm />)

      await user.click(
        await screen.findByRole('combobox', {
          name: ecologicalStatusOutcomes.mangroveAreaIncrease.question
        })
      )
      await user.click(await screen.findByRole('option', { name: 'Yes' }))
      await user.click(screen.getByRole('combobox', { name: 'Unit pre-intervention' }))
      await user.click(await screen.findByRole('option', { name: 'other' }))

      expect(screen.getByLabelText('Other unit pre-intervention')).toBeInTheDocument()
      expect(screen.queryByLabelText('Other unit post-intervention')).not.toBeInTheDocument()
    })
  })

  describe('AddMonitoringSectionMenu', () => {
    it('links to the three monitoring forms of the site', async () => {
      const user = userEvent.setup()
      render(<AddMonitoringSectionMenu siteId='42' />)

      await user.click(
        screen.getByRole('button', {
          name: language.pages.siteQuestionsOverview.addMonitoringSectionButton
        })
      )
      const menu = await screen.findByRole('menu')
      expect(
        within(menu)
          .getAllByRole('menuitem')
          .map((item) => item.getAttribute('href'))
      ).toEqual([
        '/sites/42/form/management-status-and-effectiveness',
        '/sites/42/form/socioeconomic-and-governance-status',
        '/sites/42/form/ecological-status-and-outcomes'
      ])
    })
  })
})
