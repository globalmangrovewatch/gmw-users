'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ButtonSubmit from '@/components/ButtonSubmit'
import { FormInput } from '@/components/form/FormInput'
import { FormLayout } from '@/components/form/layout'
import { Form } from '@/components/ui/form'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText, LinkLooksLikeButtonSecondary, PageTitle } from '@/components/ui/typography'
import language from '@/language'
import { authApi } from '@/lib/api'

const validationSchema = z.object({
  email: z.email({
    error: (issue) => (issue.input ? 'email must be a valid email' : language.form.required)
  })
})

type ForgotPasswordValues = z.infer<typeof validationSchema>

const pageLanguage = language.pages.forgotPassword

/** Asks for the account's email and sends it a password reset link. */
function ForgotPasswordForm() {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: { email: '' }
  })

  const handleSubmit = (formData: ForgotPasswordValues) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    authApi
      .post('/users/password', { user: formData })
      .then(() => {
        setIsSubmitting(false)
        toast.success(pageLanguage.success)
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
          <FormInput<ForgotPasswordValues, 'email'>
            name='email'
            type='email'
            label={pageLanguage.email}
            autoComplete='email'
            required
          />
          <RowFlexEnd>
            {isSubmitError ? <ErrorText>{language.error.submit}</ErrorText> : null}
          </RowFlexEnd>
          <ButtonContainer>
            <LinkLooksLikeButtonSecondary href='/auth/login'>
              {language.buttons.cancel}
            </LinkLooksLikeButtonSecondary>
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </FormLayout>
      </Form>
    </ContentWrapper>
  )
}

export default ForgotPasswordForm
