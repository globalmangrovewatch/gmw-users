import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { mapDataForApi } from '@/library/mapDataForApi'
import { formatApiAnswersForFormByKey } from '@/library/formatApiAnswersForForm'
import { isSectionKey, questionMapping } from '@/data/questionMapping'
import { FORM_NAMES_DICTIONARY_INTERVENTIONS, type SectionTarget } from '@/constants/sectionNames'
import { toast } from 'react-toastify'

import { UseFormReturn, Path } from 'react-hook-form'
import { api } from '@/lib/api'
import { siteKeys, siteQueries } from '@/queries/sites'
import type { RegistrationFormValues } from '@/forms/schemas'
import type { MonitoringForm, RegistrationAnswer } from '@/types/api'

type SaveRegistrationSectionParams<TFormValues extends Record<string, unknown>> = {
  siteId: string
  form: UseFormReturn<TFormValues>
  section: string
  sectionTarget: SectionTarget
  monitorId?: string
}

type MutationPayload = Record<string, unknown>

type FormattedData = Record<string, Record<string, unknown>>

const formatAnswers = (answers: RegistrationAnswer[]): FormattedData =>
  formatApiAnswersForFormByKey({ apiAnswers: answers, questionMapping }) as FormattedData

// Module-level, so TanStack Query keeps the selected result between renders.
const selectRegistration = (answers: RegistrationAnswer[]) => ({
  answers,
  formattedData: formatAnswers(answers)
})

const selectMonitor = (monitor: MonitoringForm) => ({
  monitor,
  formattedData: formatAnswers(monitor.answers)
})

type Params<TData> = {
  key: string
  siteId?: string
  form: UseFormReturn
  successCallback?: (
    data: TData,
    sectionData: Record<string, unknown>,
    allSectionsData: FormattedData
  ) => void
  enabled?: boolean
}

// Copies the section's answers into the form each time they are (re)loaded.
function usePopulateForm<TData>(
  formattedData: FormattedData | undefined,
  callbackData: TData | undefined,
  dataUpdatedAt: number,
  { key, form, successCallback }: Pick<Params<TData>, 'key' | 'form' | 'successCallback'>
) {
  const lastPopulatedAt = useRef(0)

  useEffect(() => {
    if (!formattedData || callbackData === undefined) return
    if (dataUpdatedAt === lastPopulatedAt.current) return
    lastPopulatedAt.current = dataUpdatedAt

    const sectionData = formattedData[key] ?? {}
    Object.entries(sectionData).forEach(([fieldKey, value]) => {
      form.setValue(fieldKey, value, { shouldDirty: false })
    })

    successCallback?.(callbackData, sectionData, formattedData)
  }, [formattedData, dataUpdatedAt]) // eslint-disable-line react-hooks/exhaustive-deps
}

// Loads the site's registration answers, shared by every registration section, into the form.
export function useInitializeQuestionMappedForm({
  key,
  siteId,
  form,
  successCallback,
  enabled = true
}: Params<RegistrationAnswer[]>) {
  const query = useQuery({
    ...siteQueries.registration(siteId ?? ''),
    enabled: enabled && !!siteId,
    select: selectRegistration
  })

  usePopulateForm(query.data?.formattedData, query.data?.answers, query.dataUpdatedAt, {
    key,
    form,
    successCallback
  })

  return query
}

// Loads one monitoring form's answers into the form. Disabled until `monitorId` is known.
export function useInitializeQuestionMappedFormMonitors({
  key,
  siteId,
  monitorId,
  form,
  successCallback,
  enabled = true
}: Params<MonitoringForm> & { monitorId?: string }) {
  const query = useQuery({
    ...siteQueries.monitor(siteId ?? '', monitorId ?? ''),
    enabled: enabled && !!siteId && !!monitorId,
    select: selectMonitor
  })

  usePopulateForm(query.data?.formattedData, query.data?.monitor, query.dataUpdatedAt, {
    key,
    form,
    successCallback
  })

  return query
}

export function useSaveRegistrationSection<
  TFormValues extends Record<string, unknown> = RegistrationFormValues
>({ siteId, form, section, sectionTarget, monitorId }: SaveRegistrationSectionParams<TFormValues>) {
  const queryClient = useQueryClient()
  const answersPath = {
    interventions: `/sites/${siteId}/registration_intervention_answers`,
    monitors: `/sites/${siteId}/monitoring_answers${monitorId ? `/${monitorId}` : ''}`
  } satisfies Record<SectionTarget, string>

  const mutation = useMutation<unknown, Error, MutationPayload>({
    mutationKey: ['save-registration-section', siteId, section],
    mutationFn: async (formData) => {
      if (!siteId) throw new Error('Missing siteId')

      const payload = mapDataForApi(section, formData, sectionTarget)

      if (sectionTarget === 'interventions') {
        return api.patch(answersPath.interventions, payload)
      }

      if (sectionTarget === 'monitors' && monitorId) {
        return api.put(answersPath.monitors, payload)
      }

      return api.post(answersPath.monitors, payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: siteKeys.registration(siteId) })
      await queryClient.invalidateQueries({ queryKey: siteKeys.monitors(siteId) })
    }
  })

  const save = async (currentSection: string): Promise<boolean> => {
    const fields = (
      isSectionKey(currentSection) ? Object.keys(questionMapping[currentSection]) : []
    ) as Array<keyof TFormValues>

    const ok = await form.trigger(fields as Path<TFormValues>[], { shouldFocus: true })

    if (!ok) {
      toast.error(
        `Cannot save "${
          (FORM_NAMES_DICTIONARY_INTERVENTIONS as Record<string, string | undefined>)[
            currentSection
          ] || currentSection
        }". Please fix the errors indicated on the form.`
      )
      return false
    }

    const all = form.getValues()

    const sectionValues = Object.fromEntries(
      fields.map((key) => [key, all[key]])
    ) as MutationPayload

    await mutation.mutateAsync(sectionValues)

    return true
  }

  return { save, mutation }
}
