'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ButtonSubmit from '@/components/ButtonSubmit'
import { FormInput } from '@/components/form/FormInput'
import { FormLayout } from '@/components/form/layout'
import { Form } from '@/components/ui/form'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText, PageTitle } from '@/components/ui/typography'
import language from '@/language'
import { authApi } from '@/lib/api'

const pageLanguage = language.pages.resetPassword

const required = z.string({ error: language.form.required }).min(1, language.form.required)

const validationSchema = z
  .object({
    password: required.min(8, pageLanguage.validation.passwordMinimumCharacters),
    confirmationPassword: required
  })
  .refine(({ password, confirmationPassword }) => password === confirmationPassword, {
    error: pageLanguage.validation.passwordsMustMatch,
    path: ['confirmationPassword'],
    when: () => true
  })

type ResetPasswordValues = z.infer<typeof validationSchema>

/** Sets a new password with the token from the reset email link (`?token=`). */
function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: { password: '', confirmationPassword: '' }
  })

  const handleSubmit = ({ password, confirmationPassword }: ResetPasswordValues) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    authApi
      .put<{ message?: string }>('/users/password', {
        user: {
          password,
          password_confirmation: confirmationPassword,
          reset_password_token: searchParams.get('token')
        }
      })
      .then((data) => {
        if (data?.message !== 'The password was reset successfully') {
          throw new Error('This didnt work. Your token probably expired.')
        }
        setIsSubmitting(false)
        toast.success(pageLanguage.success)
        router.push('/auth/login')
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.generic)
      })
  }

  return (
    <ContentWrapper>
      <PageTitle>{pageLanguage.title}</PageTitle>
      <Form {...form}>
        <FormLayout onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <FormInput<ResetPasswordValues, 'password'>
            name='password'
            type='password'
            label={pageLanguage.password}
            autoComplete='new-password'
            required
          />
          <FormInput<ResetPasswordValues, 'confirmationPassword'>
            name='confirmationPassword'
            type='password'
            label={pageLanguage.confirmPassword}
            autoComplete='new-password'
            required
          />
          <RowFlexEnd>
            {isSubmitError ? <ErrorText>{language.error.submit}</ErrorText> : null}
          </RowFlexEnd>
          <ButtonContainer>
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </FormLayout>
      </Form>
    </ContentWrapper>
  )
}

export default ResetPasswordForm
