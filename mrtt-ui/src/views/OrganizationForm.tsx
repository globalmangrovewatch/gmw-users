'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ButtonSubmit from '@/components/ButtonSubmit'
import { FormInput } from '@/components/form/FormInput'
import { FormLayout } from '@/components/form/layout'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import LoadingIndicator from '@/components/LoadingIndicator'
import SubmitErrorWithExtraErrorContent from '@/components/SubmitErrorWithExtraErrorContent'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText, PageTitle } from '@/components/ui/typography'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { isApiError } from '@/lib/api'
import {
  organizationQueries,
  useCreateOrganization,
  useUpdateOrganization
} from '@/queries/organizations'

const pageLanguage = language.pages.organizationForm
const nameRequired = pageLanguage.validation.nameRequired

const validationSchema = z.object({
  organization_name: z.string({ error: nameRequired }).min(1, nameRequired)
})

type OrganizationFormValues = z.infer<typeof validationSchema>

/** Creates an organization (`/organizations/new`) or renames one (`/organizations/:id/edit`). */
function OrganizationForm() {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { organizationId } = useParams<{ organizationId?: string }>()
  const isNewOrganization = !organizationId
  const router = useRouter()

  const organizationQuery = useQuery({
    ...organizationQueries.detail(organizationId ?? ''),
    enabled: !isNewOrganization
  })
  const createOrganization = useCreateOrganization()
  const updateOrganization = useUpdateOrganization(organizationId ?? '')
  const isSubmitting = createOrganization.isPending || updateOrganization.isPending
  useLoadErrorToast(organizationQuery.error)

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: { organization_name: '' }
  })
  const { reset } = form

  useEffect(() => {
    if (organizationQuery.data) {
      reset({ organization_name: organizationQuery.data.organization_name })
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
        toast.error(
          <SubmitErrorWithExtraErrorContent
            extraErrorContent={isApiError(error) ? error.body?.error : undefined}
          />
        )
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
