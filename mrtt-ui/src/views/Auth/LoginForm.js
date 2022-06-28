import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ButtonCancel, ButtonSubmit } from '../../styles/buttons'
import { ButtonContainer, RowFlexEnd } from '../../styles/containers'
import { ErrorText } from '../../styles/typography'
import { Form, MainFormDiv, SectionFormTitle } from '../../styles/forms'
import { FormLabel, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import language from '../../language'
import LoadingIndicator from '../../components/LoadingIndicator'
import getBaseUrl from '../../library/auth/getBaseUrl'

const validationSchema = yup.object({
  email: yup.string().required('Email required'),
  password: yup.string().required('Password required')
})

const formDefaultValues = { email: '', password: '' }

const LoginForm = () => {
  const [isLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const authUrl = `${getBaseUrl(process.env.REACT_APP_API_URL)}/users/sign_in`

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

  const signUp = (formData) => {
    axios
      .post(authUrl, { user: formData }, options)
      .then(({ data }) => {
        setIsSubmitting(false)
        if (data.token) {
          localStorage.setItem('token', data.token)
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
    signUp(formData)
    setIsSubmitting(false)
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  const handleSignUpOnClick = () => {
    navigate('/auth/signup')
  }

  const form = (
    <MainFormDiv>
      <SectionFormTitle>Login</SectionFormTitle>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <FormLabel htmlFor='email'>Email* </FormLabel>
        <Controller
          name='email'
          control={formControl}
          render={({ field }) => <TextField {...field} id='email' />}
        />
        <ErrorText>{errors?.email?.message}</ErrorText>

        <FormLabel htmlFor='password'>Password* </FormLabel>
        <Controller
          name='password'
          control={formControl}
          render={({ field }) => <TextField {...field} id='password' type='password' />}
        />
        <ErrorText>{errors?.password?.message}</ErrorText>
        <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
        <ButtonContainer>
          <Button variant='text' onClick={handleSignUpOnClick}>
            Sign Up
          </Button>
          <ButtonCancel onClick={handleCancelClick} />
          <ButtonSubmit isSubmitting={isSubmitting} />
        </ButtonContainer>
      </Form>
    </MainFormDiv>
  )

  return isLoading ? <LoadingIndicator /> : form
}

export default LoginForm
