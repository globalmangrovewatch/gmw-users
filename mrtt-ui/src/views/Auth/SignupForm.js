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
import language from '../../language'
import LoadingIndicator from '../../components/LoadingIndicator'

const validationSchema = yup.object({
  email: yup.string().required('Email required'),
  password: yup.string().required('Password required')
})

const formDefaultValues = { email: '', password: '' }

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

  const signUp = (formData) => {
    axios
      .post(authUrl, { user: formData })
      .then(({ data }) => {
        setIsSubmitting(false)
        toast.success(data.message)
        navigate('/auth/login')
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

  const form = (
    <MainFormDiv>
      <SectionFormTitle>Sign-up</SectionFormTitle>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <FormLabel htmlFor='name'>Name </FormLabel>
        <Controller
          name='name'
          control={formControl}
          render={({ field }) => <TextField {...field} id='name' />}
        />
        <ErrorText>{errors?.email?.message}</ErrorText>

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
          <ButtonCancel onClick={handleCancelClick} />
          <ButtonSubmit isSubmitting={isSubmitting} />
        </ButtonContainer>
      </Form>
    </MainFormDiv>
  )

  return isLoading ? <LoadingIndicator /> : form
}

export default SignupForm
