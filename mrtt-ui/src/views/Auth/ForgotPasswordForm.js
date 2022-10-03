import { Controller, useForm } from 'react-hook-form'
import { FormLabel, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ButtonContainer, ContentWrapper, RowFlexEnd } from '../../styles/containers'
import { ButtonSubmit } from '../../styles/buttons'
import { ErrorText, LinkLooksLikeButtonSecondary, PageTitle } from '../../styles/typography'
import { Form } from '../../styles/forms'
import language from '../../language'
import RequiredIndicator from '../../components/RequiredIndicator'

const validationSchema = yup.object({
  email: yup.string().email().required(language.form.required)
})

const formDefaultValues = { email: '' }

const passwordUrl = `${process.env.REACT_APP_AUTH_URL}/users/password`

const pageLanguage = language.pages.forgotPassword

const ForgotPasswordForm = () => {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: formDefaultValues })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .post(passwordUrl, { user: formData })
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
      <Form onSubmit={validateInputs(handleSubmit)}>
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
          <LinkLooksLikeButtonSecondary to={-1}>
            {language.buttons.cancel}
          </LinkLooksLikeButtonSecondary>
          <ButtonSubmit isSubmitting={isSubmitting} />
        </ButtonContainer>
      </Form>
    </ContentWrapper>
  )
}

export default ForgotPasswordForm
