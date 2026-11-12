'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, usePathname, useRouter } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode
} from 'react'
import { useFormContext } from 'react-hook-form'
import { LuArrowLeft, LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import ButtonSave from '@/components/ButtonSave'
import LoadingIndicatorOverlay from '@/components/LoadingIndicatorOverlay'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { ErrorText, LinkLooksLikeButtonSecondary } from '@/components/ui/typography'
import PRIVACY_VALUES from '@/constants/privacyValues'
import SECTION_NAMES, {
  SECTION_NAMES_DICTIONARY_INTERVENTIONS,
  SECTION_NAMES_DICTIONARY_MONITORS
} from '@/constants/sectionNames'
import language from '@/language'
import { cn } from '@/lib/cn'
import { useGetMonitorsForms } from '@/library/question-mapped-form/monitors'
import { useGetSectionTarget } from '@/library/question-mapped-form/sections-hook'
import { useSaveRegistrationSection } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useMonitoringFormId from '@/library/useMonitoringFormId'
import { siteQueries, useUpdateSite } from '@/queries/sites'
import type { Privacy } from '@/types/api'

const componentLanguage = language.questionNav

type SectionName = (typeof SECTION_NAMES)[number]

const MONITOR_DATE_FIELDS: Partial<Record<string, string>> = {
  'management-status-and-effectiveness': 'dateOfAssessment',
  'socioeconomic-and-governance-status': 'dateOfOutcomesAssessment',
  'ecological-status-and-outcomes': 'dateOfEcologicalMonitoring'
}

const privacyItems = [
  { label: language.sectionPrivacy.private, value: PRIVACY_VALUES.private },
  { label: language.sectionPrivacy.public, value: PRIVACY_VALUES.public }
]

const isPrivacy = (value: string | null): value is Privacy =>
  value === PRIVACY_VALUES.private || value === PRIVACY_VALUES.public

const navLinkClassName = 'gap-1.25 px-3.75 text-[15px] [&_svg]:size-5'
const navButtonTextClassName = 'whitespace-nowrap max-[1080px]:hidden'

type QuestionNavProps = Omit<ComponentProps<'div'>, 'children'> & {
  currentSection: SectionName
  isFormSaving: boolean
  isFormSaveError: boolean
}

/** Sticky bar above a section form: back to the site, previous/next section, privacy and save. */
function QuestionNav({
  isFormSaving,
  isFormSaveError,
  currentSection,
  className,
  ...props
}: QuestionNavProps) {
  const [isPrivacySaveError, setIsPrivacySaveError] = useState(false)
  const { siteId } = useParams<{ siteId: string }>()
  const monitorIdUrl = useMonitoringFormId()
  const currentSectionNameIndex = SECTION_NAMES.indexOf(currentSection)
  const isFormPrivacyDisabled = currentSection === 'project-details'
  const nextSection = SECTION_NAMES[currentSectionNameIndex + 1]
  const previousSection = SECTION_NAMES[currentSectionNameIndex - 1]
  const sectionIdForApi = currentSectionNameIndex + 1
  const form = useFormContext()
  const router = useRouter()
  const pathname = usePathname()

  const pathParts = pathname.split('/').filter(Boolean)
  const sectionFromUrl = monitorIdUrl
    ? pathParts[pathParts.length - 2]
    : pathParts[pathParts.length - 1]
  const sectionTarget = useGetSectionTarget(sectionFromUrl, monitorIdUrl)
  const sectionPayload =
    sectionTarget === 'interventions'
      ? (SECTION_NAMES_DICTIONARY_INTERVENTIONS as Record<string, string | undefined>)[
          sectionFromUrl ?? ''
        ]
      : (SECTION_NAMES_DICTIONARY_MONITORS as Record<string, string | undefined>)[
          sectionFromUrl ?? ''
        ]

  const { save } = useSaveRegistrationSection({
    siteId,
    form,
    section: sectionPayload ?? '',
    // Only null on a URL that isn't a section page, where QuestionNav isn't rendered.
    sectionTarget: sectionTarget ?? 'interventions',
    monitorId: monitorIdUrl
  })

  const { data: monitorForms } = useGetMonitorsForms({
    siteId,
    enabled: sectionTarget === 'monitors'
  })

  useEffect(() => {
    if (sectionTarget !== 'monitors') return

    const dateField = MONITOR_DATE_FIELDS[sectionFromUrl ?? '']
    if (!dateField) return

    if (monitorIdUrl && monitorForms?.length) {
      // The URL id is a string, the API's a number.
      const monitor = monitorForms.find((m) => String(m.id) === monitorIdUrl)
      if (monitor?.monitoring_date) {
        form.setValue(dateField, monitor.monitoring_date, { shouldDirty: false })
      }
    } else if (!monitorIdUrl) {
      form.setValue(dateField, new Date().toISOString(), { shouldDirty: false })
    }
  }, [sectionTarget, sectionFromUrl, monitorIdUrl, monitorForms]) // eslint-disable-line react-hooks/exhaustive-deps

  // The API only takes section privacy as part of a PUT with the whole site, so the site is
  // loaded here and sent back in full.
  // https://github.com/globalmangrovewatch/gmw-users/issues/260
  const { data: siteFromApi } = useQuery({ ...siteQueries.detail(siteId), enabled: !!siteId })
  const updateSitePrivacy = useUpdateSite(siteId, { replace: true })
  const isPrivacySaving = updateSitePrivacy.isPending
  // While saving, show the value being saved; otherwise the one the API returned.
  const sectionPrivacy = isPrivacySaving
    ? updateSitePrivacy.variables?.section_data_visibility?.[sectionIdForApi]
    : siteFromApi?.section_data_visibility?.[sectionIdForApi]

  const handleOnPrivacyChange = (privacy: string | null) => {
    setIsPrivacySaveError(false)
    if (siteFromApi && isPrivacy(privacy) && !isFormPrivacyDisabled) {
      updateSitePrivacy.mutate(
        {
          ...siteFromApi,
          section_data_visibility: {
            ...siteFromApi.section_data_visibility,
            [sectionIdForApi]: privacy
          }
        },
        {
          onSuccess: () => toast.success(componentLanguage.privacySavingSuccess),
          onError: () => setIsPrivacySaveError(true)
        }
      )
    } else {
      setIsPrivacySaveError(true)
    }
  }

  const handleInterventionFormSave = async (event: MouseEvent) => {
    event.preventDefault()
    const saved = await save(sectionPayload ?? '')
    if (saved && sectionFromUrl === 'ecological-status-and-outcomes') router.push('/sites')
  }

  const handleNavigateWithSave = useCallback(
    (to: string, direction: 'previous' | 'next') => async (event: MouseEvent) => {
      event.preventDefault()
      const saved = await save(sectionPayload ?? '')
      if (!saved) return

      toast.success('Section saved')
      if (
        monitorIdUrl &&
        (sectionFromUrl !== 'ecological-status-and-outcomes' || direction === 'previous')
      ) {
        router.push(`${to}/${monitorIdUrl}`)
      } else {
        router.push(to)
      }
    },
    [router, save, sectionPayload, monitorIdUrl, sectionFromUrl]
  )

  const sectionLink = (
    section: SectionName | undefined,
    direction: 'previous' | 'next',
    content: ReactNode
  ) => {
    if (!section) {
      // A Next link can't be disabled: show the same look, not focusable or clickable.
      return (
        <span
          aria-disabled='true'
          className={cn(
            buttonVariants({ variant: 'outline' }),
            navLinkClassName,
            'pointer-events-none opacity-50'
          )}>
          {content}
        </span>
      )
    }
    const href = `/sites/${siteId}/form/${section}`
    return (
      <LinkLooksLikeButtonSecondary
        href={href}
        className={navLinkClassName}
        onClick={handleNavigateWithSave(href, direction)}>
        {content}
      </LinkLooksLikeButtonSecondary>
    )
  }

  return (
    <>
      <LoadingIndicatorOverlay isVisible={isPrivacySaving} />
      <div
        data-slot='question-nav'
        className={cn('sticky top-header z-3 flex flex-col bg-white', className)}
        {...props}>
        <div className='flex h-section-nav flex-nowrap justify-between gap-1.25 py-2.5 text-[15px] max-[599px]:h-auto max-[599px]:flex-col-reverse'>
          <div className='flex gap-2.5'>
            <LinkLooksLikeButtonSecondary
              href={`/sites/${siteId}/overview`}
              className={navLinkClassName}>
              <LuArrowLeft aria-hidden='true' />
              <span className={navButtonTextClassName}>{componentLanguage.returnToSite}</span>
            </LinkLooksLikeButtonSecondary>
            {sectionLink(
              previousSection,
              'previous',
              <>
                <LuChevronLeft aria-hidden='true' />
                <span className={navButtonTextClassName}>{componentLanguage.previousSection}</span>
              </>
            )}
            {sectionLink(
              nextSection,
              'next',
              <>
                <span className={navButtonTextClassName}>{componentLanguage.nextSection}</span>
                <LuChevronRight aria-hidden='true' />
              </>
            )}
          </div>
          <div className='flex gap-2.5'>
            <Select<string>
              items={privacyItems}
              value={sectionPrivacy ?? null}
              onValueChange={handleOnPrivacyChange}
              disabled={isFormPrivacyDisabled}>
              <SelectTrigger
                id='form-privacy'
                aria-label='Section privacy'
                className='h-full min-w-36 rounded border-[#009b93] text-[15px] text-[#009b93] uppercase hover:bg-[#009b93] hover:text-white data-disabled:border-[#AFC4C3] data-disabled:bg-page data-disabled:text-[#AFC4C3] data-disabled:opacity-100 data-disabled:hover:bg-page'>
                <SelectValue
                  placeholder={componentLanguage.privacySelectUndefined}
                  className='data-placeholder:text-current'
                />
              </SelectTrigger>
              <SelectContent>
                {privacyItems.map((item) => (
                  <SelectItem key={item.value} value={item.value} className='uppercase'>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ButtonSave isSaving={isFormSaving} onClick={handleInterventionFormSave} />
          </div>
        </div>
        {isFormSaveError ? <ErrorText>{language.error.submit}</ErrorText> : null}
        {isPrivacySaveError ? <ErrorText>{componentLanguage.privacySaveError}</ErrorText> : null}
      </div>
    </>
  )
}

export default QuestionNav
