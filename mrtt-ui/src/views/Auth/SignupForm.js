import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ButtonCancel, ButtonSubmit } from '../../styles/buttons'
import { ButtonContainer, PagePadding, RowFlexEnd } from '../../styles/containers'
import { ErrorText, PageTitle } from '../../styles/typography'
import { Form, MainFormDiv } from '../../styles/forms'
import { Checkbox, Link, FormControlLabel, FormLabel, TextField } from '@mui/material'
import language from '../../language'
import LoadingIndicator from '../../components/LoadingIndicator'
import RequiredIndicator from '../../components/RequiredIndicator'

const signUpFormLanguage = language.pages.userSignUp

const validationSchema = yup.object({
  email: yup
    .string()
    .required(language.form.required)
    .email(signUpFormLanguage.validation.emailValid),
  password: yup
    .string()
    .required(language.form.required)
    .min(8, signUpFormLanguage.validation.passwordMinimumCharacters),
  confirmationPassword: yup
    .string()
    .required(language.form.required)
    .oneOf([yup.ref('password')], signUpFormLanguage.validation.passwordsMustMatch),
  termsAndConditions: yup
    .boolean()
    .required(signUpFormLanguage.validation.termsAndConditions)
    .oneOf([true], signUpFormLanguage.validation.termsAndConditions)
})

const formDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmationPassword: '',
  termsAndConditions: false
}

const SignupForm = () => {
  const [isLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const authUrl = `${process.env.REACT_APP_AUTH_URL}/users`

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: formDefaultValues })

  const handleSubmit = ({ email, name, password }) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    axios
      .post(authUrl, { user: { email, name, password } })
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.signup)
        navigate('/auth/login/newUser')
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.generic)
      })
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  const form = (
    <MainFormDiv>
      <PagePadding>
        <PageTitle>{signUpFormLanguage.title}</PageTitle>
        <Form onSubmit={validateInputs(handleSubmit)}>
          <FormLabel htmlFor='name'>{signUpFormLanguage.name}</FormLabel>
          <Controller
            name='name'
            control={formControl}
            render={({ field }) => <TextField {...field} id='name' />}
          />

          <FormLabel htmlFor='email'>
            {signUpFormLanguage.email}
            <RequiredIndicator />
          </FormLabel>
          <Controller
            name='email'
            control={formControl}
            render={({ field }) => <TextField {...field} id='email' />}
          />
          <ErrorText>{errors?.email?.message}</ErrorText>

          <FormLabel htmlFor='password'>
            {signUpFormLanguage.password}
            <RequiredIndicator />
          </FormLabel>
          <Controller
            name='password'
            control={formControl}
            render={({ field }) => <TextField {...field} id='password' type='password' />}
          />
          <ErrorText>{errors?.password?.message}</ErrorText>

          <FormLabel htmlFor='confirmation-password'>
            {signUpFormLanguage.confirmPassword}
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

          <FormControlLabel
            control={
              <Controller
                name='termsAndConditions'
                control={formControl}
                render={({ field }) => {
                  return <Checkbox {...field} id='terms-and-conditions' />
                }}
              />
            }
            label={
              <>
                I have read and accept the terms of the{' '}
                <Link
                  href='/mrtt-general-usage-terms-and-conditions.pdf'
                  target='_blank'
                  rel='noopener'>
                  MRTT- general (usage) terms and conditions
                </Link>{' '}
                applicable to the use of this account and the Mangrove Restoration Tracker Tool
                <RequiredIndicator />
              </>
            }
          />
          <ErrorText>{errors?.termsAndConditions?.message}</ErrorText>
          <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
          <ButtonContainer>
            <ButtonCancel onClick={handleCancelClick} />
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </Form>
      </PagePadding>
    </MainFormDiv>
  )

  return isLoading ? <LoadingIndicator /> : form
}

export default SignupForm
