import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import PropTypes from 'prop-types'

import { Alert, FormLabel, TextField } from '@mui/material'
import { ButtonCancel, ButtonSubmit } from '../../styles/buttons'
import { ButtonContainer, PagePadding, RowFlexEnd } from '../../styles/containers'
import { ErrorText, LinkLooksLikeButtonSecondary, PageTitle } from '../../styles/typography'
import { Form, MainFormDiv } from '../../styles/forms'
import { useAuth } from '../../hooks/useAuth'
import language from '../../language'
import LoadingIndicator from '../../components/LoadingIndicator'
import RequiredIndicator from '../../components/RequiredIndicator'

const validationSchema = yup.object({
  email: yup.string().required('Email required'),
  password: yup.string().required('Password required')
})

const formDefaultValues = { email: '', password: '' }

const pageLanguage = language.pages.login

const LoginForm = ({ isUserNew }) => {
  const [isLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const authUrl = `${process.env.REACT_APP_AUTH_URL}/users/sign_in`

  const { login } = useAuth()

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: formDefaultValues })

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  const signIn = (formData) => {
    axios
      .post(authUrl, { user: formData }, options)
      .then(({ data }) => {
        setIsSubmitting(false)
        if (data.token) {
          login(data.token)
          navigate('/sites')
        }
      })
      .catch((error) => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(error.response.data.error)
      })
  }

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    signIn(formData)
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  const form = (
    <MainFormDiv>
      <PagePadding>
        <PageTitle>{pageLanguage.title}</PageTitle>
        {isUserNew ? (
          <Alert variant='outlined' severity='success'>
            {language.success.signup}
          </Alert>
        ) : null}
        <RowFlexEnd>
          <LinkLooksLikeButtonSecondary to='/auth/password/forgot-password'>
            {pageLanguage.forgotPassowrd}
          </LinkLooksLikeButtonSecondary>
        </RowFlexEnd>
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
          <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
          <ButtonContainer>
            <LinkLooksLikeButtonSecondary to='/auth/signup'>
              {pageLanguage.signUp}
            </LinkLooksLikeButtonSecondary>
            <ButtonCancel onClick={handleCancelClick} />
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </Form>
      </PagePadding>
    </MainFormDiv>
  )

  return isLoading ? <LoadingIndicator /> : form
}

LoginForm.propTypes = {
  isUserNew: PropTypes.bool
}

LoginForm.defaultValues = {
  isUserNew: false
}

export default LoginForm
