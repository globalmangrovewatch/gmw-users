'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'

import ButtonSubmit from '@/components/ButtonSubmit'
import { FormInput, FormSelect } from '@/components/form/FormInput'
import { FormLayout } from '@/components/form/layout'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import LoadingIndicator from '@/components/LoadingIndicator'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  ButtonContainer,
  ContentWrapper,
  QuestionWrapper,
  RowFlexEnd
} from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText, PageTitle } from '@/components/ui/typography'
import PRIVACY_VALUES from '@/constants/privacyValues'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { landscapeQueries } from '@/queries/landscapes'
import { siteQueries, useCreateSite, useUpdateSite } from '@/queries/sites'
import type { Privacy } from '@/types/api'

const pageLanguage = language.pages.siteform
const { nameRequired, landscapeRequired } = pageLanguage.validation

const validationSchema = z.object({
  site_name: z.string({ error: nameRequired }).min(1, nameRequired),
  // The landscape's id, as a string for the select; '' until one is picked.
  landscape_id: z.string({ error: landscapeRequired }).min(1, landscapeRequired),
  // Only asked for a new site; the select always holds a value.
  defaultSectionPrivacy: z.enum([PRIVACY_VALUES.public, PRIVACY_VALUES.private])
})

type SiteFormValues = z.infer<typeof validationSchema>

const formDefaultValues: SiteFormValues = {
  site_name: '',
  landscape_id: '',
  defaultSectionPrivacy: PRIVACY_VALUES.public
}

const privacyOptions = [
  { value: PRIVACY_VALUES.private, label: language.sectionPrivacy.private },
  { value: PRIVACY_VALUES.public, label: language.sectionPrivacy.public }
]

// Section 1 (site details) is always public; the others start with the chosen default.
const sectionVisibility = (defaultSectionPrivacy: Privacy) => ({
  1: PRIVACY_VALUES.public,
  ...Object.fromEntries(
    [2, 3, 4, 5, 6, 7, 8, 9, 10].map((section) => [section, defaultSectionPrivacy])
  )
})

/** Creates a site (`/sites/new`) or edits its name and landscape (`/sites/:id/edit`). */
function SiteForm() {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { siteId } = useParams<{ siteId?: string }>()
  const isNewSite = !siteId
  const router = useRouter()
  // The site's registration answers form, cleared once a new site is created.
  const registrationForm = useFormContext()

  const landscapesQuery = useQuery(landscapeQueries.list())
  const siteQuery = useQuery({ ...siteQueries.detail(siteId ?? ''), enabled: !isNewSite })
  const createSite = useCreateSite()
  const updateSite = useUpdateSite(siteId ?? '')
  const isSubmitting = createSite.isPending || updateSite.isPending
  useLoadErrorToast(landscapesQuery.error, siteQuery.error)

  const landscapeOptions = (landscapesQuery.data ?? []).map(({ id, landscape_name }) => ({
    value: String(id),
    label: landscape_name
  }))

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: formDefaultValues
  })
  const { reset } = form

  useEffect(() => {
    if (isNewSite) reset(formDefaultValues)
    else if (siteQuery.data) {
      reset({
        ...formDefaultValues,
        site_name: siteQuery.data.site_name,
        landscape_id: siteQuery.data.landscape_id ? String(siteQuery.data.landscape_id) : ''
      })
    }
  }, [isNewSite, siteQuery.data, reset])

  const handleSubmitError = () => {
    setIsSubmitError(true)
    toast.error(language.error.submit)
  }

  const handleSubmit = ({ site_name, landscape_id, defaultSectionPrivacy }: SiteFormValues) => {
    setIsSubmitError(false)
    const site = { site_name, landscape_id: Number(landscape_id) }

    if (isNewSite) {
      createSite.mutate(
        { ...site, section_data_visibility: sectionVisibility(defaultSectionPrivacy) },
        {
          onSuccess: (created) => {
            toast.success(language.success.getCreateThingSuccessMessage(created.site_name))
            registrationForm.reset()
            router.push('/sites')
          },
          onError: handleSubmitError
        }
      )
      return
    }

    updateSite.mutate(site, {
      onSuccess: (updated) => {
        toast.success(language.success.getEditThingSuccessMessage(updated.site_name))
        router.push('/sites')
      },
      onError: handleSubmitError
    })
  }

  if (landscapesQuery.isLoading || siteQuery.isLoading) return <LoadingIndicator />
  if (isNotFound(siteQuery.error)) return <ItemDoesntExist item={pageLanguage.site} />

  return (
    <ContentWrapper>
      <PageTitle>{isNewSite ? pageLanguage.titleNewSite : pageLanguage.titleEditSite}</PageTitle>
      <Form {...form}>
        <FormLayout onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <QuestionWrapper>
            <FormInput<SiteFormValues, 'site_name'>
              name='site_name'
              label={pageLanguage.labelName}
              required
            />
          </QuestionWrapper>
          <QuestionWrapper>
            <FormSelect<SiteFormValues, 'landscape_id'>
              name='landscape_id'
              label={pageLanguage.labelLandscape}
              placeholder={language.form.selectLabel}
              options={landscapeOptions}
              required
            />
          </QuestionWrapper>
          {isNewSite ? (
            <QuestionWrapper>
              <FormSelect<SiteFormValues, 'defaultSectionPrivacy'>
                name='defaultSectionPrivacy'
                label={pageLanguage.labelDefaultSectionPrivacy}
                description={pageLanguage.defaultSectionPrivacyDescription}
                options={privacyOptions}
                required
              />
            </QuestionWrapper>
          ) : null}
          <RowFlexEnd>
            {isSubmitError ? <ErrorText>{language.error.submit}</ErrorText> : null}
          </RowFlexEnd>
          <ButtonContainer>
            <Button type='button' variant='outline' onClick={() => router.push('/sites')}>
              {language.buttons.cancel}
            </Button>
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </FormLayout>
      </Form>
    </ContentWrapper>
  )
}

export default SiteForm
