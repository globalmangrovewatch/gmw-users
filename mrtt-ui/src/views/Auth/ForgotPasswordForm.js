'use client'

import { Controller, useForm } from 'react-hook-form'
import { FormLabel, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/styles/containers'
import { ButtonSubmit } from '@/styles/buttons'
import { ErrorText, LinkLooksLikeButtonSecondary, PageTitle } from '@/styles/typography'
import { FormLayout } from '@/styles/forms'
import language from '@/language'
import RequiredIndicator from '@/components/RequiredIndicator'
import { authApi } from '@/lib/api'

const validationSchema = z.object({
  email: z.email({
    error: (issue) => (issue.input ? 'email must be a valid email' : language.form.required)
  })
})

const formDefaultValues = { email: '' }

const pageLanguage = language.pages.forgotPassword

const ForgotPasswordForm = () => {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: formDefaultValues
  })

  const handleSubmit = (formData) => {
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
      <FormLayout onSubmit={validateInputs(handleSubmit)}>
        <FormLabel htmlFor='email'>
          {pageLanguage.email}
          <RequiredIndicator />
        </FormLabel>
        <Controller
          name='email'
          control={formControl}
          render={({ field }) => <TextField {...field} id='email' />}
        />
        <ErrorText>{errors?.email?.message}</ErrorText>
        <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
        <ButtonContainer>
          <LinkLooksLikeButtonSecondary href='/auth/login'>
            {language.buttons.cancel}
          </LinkLooksLikeButtonSecondary>
          <ButtonSubmit isSubmitting={isSubmitting} />
        </ButtonContainer>
      </FormLayout>
    </ContentWrapper>
  )
}

export default ForgotPasswordForm
