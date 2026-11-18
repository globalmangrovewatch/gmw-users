'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ButtonSubmit from '@/components/ButtonSubmit'
import { FormInput } from '@/components/form/FormInput'
import { FormLayout } from '@/components/form/layout'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import LoadingIndicator from '@/components/LoadingIndicator'
import SubmitErrorWithExtraErrorContent from '@/components/SubmitErrorWithExtraErrorContent'
import { Button } from '@/components/ui/button'
import { MultiCombobox } from '@/components/ui/combobox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText, PageTitle } from '@/components/ui/typography'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { isApiError } from '@/lib/api'
import {
  countryQueries,
  organizationQueries,
  useCreateOrganization,
  useUpdateOrganization
} from '@/queries/organizations'

const pageLanguage = language.pages.organizationForm
const { nameRequired, countriesRequired } = pageLanguage.validation

const validationSchema = z.object({
  organization_name: z.string({ error: nameRequired }).min(1, nameRequired),
  // The API requires at least one country (`location_id`s from /countries).
  country_location_ids: z.array(z.string()).min(1, countriesRequired)
})

type OrganizationFormValues = z.infer<typeof validationSchema>

type OrganizationErrorBody = { error?: string; errors?: Record<string, string[]> }

/** The API's reason: `{ error }`, or Rails validation `{ errors: { field: [messages] } }`. */
const apiErrorMessage = (error: unknown) => {
  if (!isApiError<OrganizationErrorBody>(error)) return undefined
  const { error: message, errors } = error.body ?? {}
  if (message) return message
  if (!errors) return undefined
  return Object.entries(errors)
    .map(([field, messages]) => `${field.replaceAll('_', ' ')} ${messages.join(', ')}`)
    .join('. ')
}

/** Creates an organization (`/organizations/new`) or edits one (`/organizations/:id/edit`). */
function OrganizationForm() {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { organizationId } = useParams<{ organizationId?: string }>()
  const isNewOrganization = !organizationId
  const router = useRouter()

  const organizationQuery = useQuery({
    ...organizationQueries.detail(organizationId ?? ''),
    enabled: !isNewOrganization
  })
  const countriesQuery = useQuery(countryQueries.list())
  const createOrganization = useCreateOrganization()
  const updateOrganization = useUpdateOrganization(organizationId ?? '')
  const isSubmitting = createOrganization.isPending || updateOrganization.isPending
  useLoadErrorToast(organizationQuery.error, countriesQuery.error)

  const countryOptions = useMemo(
    () =>
      (countriesQuery.data ?? []).map(({ location_id, name }) => ({
        value: location_id,
        label: name
      })),
    [countriesQuery.data]
  )

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: { organization_name: '', country_location_ids: [] }
  })
  const { reset } = form

  useEffect(() => {
    if (organizationQuery.data) {
      const { organization_name, countries = [] } = organizationQuery.data
      reset({
        organization_name,
        country_location_ids: countries.map(({ location_id }) => location_id)
      })
    }
  }, [organizationQuery.data, reset])

  const handleSubmit = (formData: OrganizationFormValues) => {
    setIsSubmitError(false)
    const mutation = isNewOrganization ? createOrganization : updateOrganization
    const getSuccessMessage = isNewOrganization
      ? language.success.getCreateThingSuccessMessage
      : language.success.getEditThingSuccessMessage
    mutation.mutate(formData, {
      onSuccess: ({ organization_name }) => {
        toast.success(getSuccessMessage(organization_name))
        router.push('/organizations')
      },
      onError: (error) => {
        setIsSubmitError(true)
        toast.error(<SubmitErrorWithExtraErrorContent extraErrorContent={apiErrorMessage(error)} />)
      }
    })
  }

  if (organizationQuery.isLoading) return <LoadingIndicator />
  if (isNotFound(organizationQuery.error)) {
    return <ItemDoesntExist item={pageLanguage.organization} />
  }

  return (
    <ContentWrapper>
      <PageTitle>{isNewOrganization ? pageLanguage.titleNew : pageLanguage.titleEdit}</PageTitle>
      <Form {...form}>
        <FormLayout onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <FormInput<OrganizationFormValues, 'organization_name'>
            name='organization_name'
            label={pageLanguage.labelName}
            required
          />
          <FormField
            control={form.control}
            name='country_location_ids'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{pageLanguage.labelCountries}</FormLabel>
                <FormControl>
                  <MultiCombobox
                    options={countryOptions}
                    placeholder='Country'
                    inputRef={field.ref}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <RowFlexEnd>
            {isSubmitError ? <ErrorText>{language.error.submit}</ErrorText> : null}
          </RowFlexEnd>
          <ButtonContainer>
            <Button type='button' variant='outline' onClick={() => router.push('/organizations')}>
              {language.buttons.cancel}
            </Button>
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </FormLayout>
      </Form>
    </ContentWrapper>
  )
}

export default OrganizationForm
