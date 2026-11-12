'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuArrowLeft } from 'react-icons/lu'
import { z } from 'zod'

import ButtonSubmit from '@/components/ButtonSubmit'
import { FormInput, FormRadioGroup } from '@/components/form/FormInput'
import { FormLayout } from '@/components/form/layout'
import LoadingIndicator from '@/components/LoadingIndicator'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText, Link, PageTitle } from '@/components/ui/typography'
import USER_ROLES from '@/constants/userRoles'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { isApiError } from '@/lib/api'
import { organizationQueries } from '@/queries/organizations'
import { useAddOrganizationUser } from '@/queries/users'

const pageLanguage = language.pages.newOrganizationUser

const validationSchema = z.object({
  email: z.email({
    error: (issue) => (issue.input ? 'email must be a valid email' : 'email is a required field')
  }),
  role: z.enum([USER_ROLES.orgUser, USER_ROLES.orgAdmin], { error: 'role is a required field' })
})

type NewOrganizationUserValues = z.infer<typeof validationSchema>

const roleOptions = [
  { value: USER_ROLES.orgUser, label: pageLanguage.orgUser },
  { value: USER_ROLES.orgAdmin, label: pageLanguage.orgAdmin }
]

/** Adds an already signed-up user to an organization (`/organizations/:id/users/new`). */
function NewOrganizationUser() {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { organizationId } = useParams<{ organizationId: string }>()
  const router = useRouter()

  const organizationQuery = useQuery(organizationQueries.detail(organizationId))
  const addUser = useAddOrganizationUser(organizationId)
  const organizationName = organizationQuery.data?.organization_name ?? ''
  useLoadErrorToast(organizationQuery.error)

  const form = useForm<NewOrganizationUserValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: { email: '', role: USER_ROLES.orgUser }
  })

  const handleSubmit = (formData: NewOrganizationUserValues) => {
    setIsSubmitError(false)
    addUser.mutate(formData, {
      onSuccess: () => {
        toast.success(pageLanguage.getUserAdded({ userName: formData.email, organizationName }))
      },
      onError: (error) => {
        setIsSubmitError(true)
        if (isApiError(error) && error.body?.error === 'Record not found') {
          form.setError('email', {
            type: 'custom',
            message: pageLanguage.getUserDoesntExist(formData.email)
          })
        }
      }
    })
  }

  if (organizationQuery.isPending) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <PageTitle>{pageLanguage.getTitle(organizationName)}</PageTitle>
      <Link href={`/organizations/${organizationId}/users`} className='items-center gap-1'>
        <LuArrowLeft aria-hidden='true' />
        {pageLanguage.backToUsers}
      </Link>
      <Form {...form}>
        <FormLayout onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <FormInput<NewOrganizationUserValues, 'email'>
            name='email'
            type='email'
            label={pageLanguage.email}
            required
          />
          <FormRadioGroup<NewOrganizationUserValues, 'role'>
            name='role'
            label={pageLanguage.role}
            options={roleOptions}
            required
          />
          <div>{pageLanguage.description}</div>
          <RowFlexEnd>
            {isSubmitError ? <ErrorText>{language.error.submit}</ErrorText> : null}
          </RowFlexEnd>
          <ButtonContainer>
            <Button type='button' variant='outline' onClick={() => router.back()}>
              {language.buttons.cancel}
            </Button>
            <ButtonSubmit isSubmitting={addUser.isPending} />
          </ButtonContainer>
        </FormLayout>
      </Form>
    </ContentWrapper>
  )
}

export default NewOrganizationUser
