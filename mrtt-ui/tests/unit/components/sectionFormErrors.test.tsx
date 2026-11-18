import { zodResolver } from '@hookform/resolvers/zod'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen } from '@testing-library/react'
import type { ComponentType, ReactNode } from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'

import CausesOfDeclineForm from '@/components/CausesOfDeclineForm'
import CostsForm from '@/components/Costs/CostsForm'
import EcologicalStatusAndOutcomesForm from '@/components/EcologicalStatusAndOutcomes/EcologicalStatusAndOutcomesForm'
import ManagementStatusAndEffectivenessForm from '@/components/ManagementStatusAndEffectiveness/ManagementStatusAndEffectivenessForm'
import PreRestorationAssessmentForm from '@/components/PreRestorationAssessment/PreRestorationAssessmentForm'
import ProjectDetailsForm from '@/components/ProjectDetailsForm'
import RestorationAimsForm from '@/components/RestorationAimsForm/RestorationAimsForm'
import SiteBackgroundForm from '@/components/SiteBackgroundForm'
import SiteInterventionsForm from '@/components/SiteInterventions/SiteInterventionsForm'
import SocioeconomicGovernanceStatusAndOutcomesForm from '@/components/SocioeconomicAndGovernance/SocioeconomicGovernanceStatusAndOutcomesForm'
import { questionMapping, type SectionKey } from '@/data/questionMapping'
import { defaultValues, registrationSchema, type RegistrationFormValues } from '@/forms/schemas'

// The QuestionNav stub hands the form out, so the test can validate the way Save does.
const formRef = { current: null as UseFormReturn<RegistrationFormValues> | null }
vi.mock('@/components/QuestionNav', async () => {
  const { useFormContext: useContext } = await import('react-hook-form')
  return {
    default: function QuestionNavStub() {
      formRef.current = useContext<RegistrationFormValues>()
      return null
    }
  }
})
vi.mock('next/navigation', () => ({
  useParams: () => ({ siteId: '42' }),
  useRouter: () => ({ push: vi.fn<(href: string) => void>() })
}))
// The site area map needs WebGL.
vi.mock('next/dynamic', () => ({ default: () => () => null }))
vi.mock('@/library/organizeMangroveSpeciesList', () => ({ default: () => ['Avicennia marina'] }))

const forms: [SectionKey, ComponentType][] = [
  ['projectDetails', ProjectDetailsForm],
  ['siteBackground', SiteBackgroundForm],
  ['restorationAims', RestorationAimsForm],
  ['causesOfDecline', CausesOfDeclineForm],
  ['preRestorationAssessment', PreRestorationAssessmentForm],
  ['siteInterventions', SiteInterventionsForm],
  ['costs', CostsForm],
  ['managementStatusAndEffectiveness', ManagementStatusAndEffectivenessForm],
  ['socioeconomicGovernanceStatusAndOutcomes', SocioeconomicGovernanceStatusAndOutcomesForm],
  ['ecologicalStatusAndOutcomes', EcologicalStatusAndOutcomesForm]
]

/** Top-level fields of `fields` that the schema reports an error for. */
const fieldsWithSchemaErrors = (fields: string[]) => {
  const issues = registrationSchema.safeParse(defaultValues).error?.issues ?? []
  return [...new Set(issues.map((issue) => String(issue.path[0])))]
    .filter((field) => fields.includes(field))
    .sort()
}

function Wrapper({ children }: { children: ReactNode }) {
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues
  })
  return <FormProvider {...form}>{children}</FormProvider>
}

describe('section form errors', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        Response.json(url.includes('answers') ? [] : { site_name: 'Test site' })
      )
    )
  })

  afterEach(() => vi.unstubAllGlobals())

  // Saving validates only the section's fields with `trigger(fields)`. react-hook-form drops an
  // error nested under a field that registers no sub-fields, which left Save failing with
  // nothing shown on the form.
  it.each(forms)('%s keeps every error that saving finds', async (section, Form) => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Wrapper>
          <Form />
        </Wrapper>
      </QueryClientProvider>
    )
    await screen.findByText('Test site')

    const fields = Object.keys(questionMapping[section])
    await act(async () => {
      await formRef.current?.trigger(fields as never)
    })

    const shown = Object.keys(formRef.current?.formState.errors ?? {})
      .filter((field) => fields.includes(field))
      .sort()
    expect(shown).toEqual(fieldsWithSchemaErrors(fields))
  })
})
