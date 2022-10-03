import { Controller, useForm } from 'react-hook-form'
import { FormLabel, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ButtonContainer, RowFlexEnd, ContentWrapper } from '../../styles/containers'
import { ButtonSubmit } from '../../styles/buttons'
import { ErrorText, PageTitle } from '../../styles/typography'
import { Form } from '../../styles/forms'
import language from '../../language'
import RequiredIndicator from '../../components/RequiredIndicator'

const pageLanguage = language.pages.resetPassword

const validationSchema = yup.object({
  password: yup
    .string()
    .required(language.form.required)
    .min(8, pageLanguage.validation.passwordMinimumCharacters),
  confirmationPassword: yup
    .string()
    .required(language.form.required)
    .oneOf([yup.ref('password')], pageLanguage.validation.passwordsMustMatch)
})

const formDefaultValues = { password: '', confirmationPassword: '' }

const passwordUrl = `${process.env.REACT_APP_AUTH_URL}/users/password`

const ResetPasswordForm = () => {
  let [searchParams] = useSearchParams()
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: formDefaultValues })

  const handleSubmit = ({ password, confirmationPassword }) => {
    axios
      .put(passwordUrl, {
        user: {
          password,
          password_confirmation: confirmationPassword,
          reset_password_token: searchParams.get('token')
        }
      })
      .then((response) => {
        if (response.data.message === 'The password was reset successfully') {
          setIsSubmitting(false)
          toast.success(pageLanguage.success)
          navigate('/auth/login')
        } else {
          throw new Error('This didnt work. Your token probably expired.')
        }
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
        <FormLabel htmlFor='password'>
          {pageLanguage.password}
          <RequiredIndicator />
        </FormLabel>
        <Controller
          name='password'
          control={formControl}
          render={({ field }) => <TextField {...field} id='password' type='password' />}
        />
        <ErrorText>{errors?.password?.message}</ErrorText>

        <FormLabel htmlFor='confirmation-password'>
          {pageLanguage.confirmPassword}
          <RequiredIndicator />
        </FormLabel>
        <Controller
          name='confirmationPassword'
          control={formControl}
          render={({ field }) => (
            <TextField {...field} id='confirmation-password' type='password' />
          )}
        />
        <ErrorText>{errors?.confirmationPassword?.message}</ErrorText>
        <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
        <ButtonContainer>
          <ButtonSubmit isSubmitting={isSubmitting} />
        </ButtonContainer>
      </Form>
    </ContentWrapper>
  )
}

export default ResetPasswordForm
