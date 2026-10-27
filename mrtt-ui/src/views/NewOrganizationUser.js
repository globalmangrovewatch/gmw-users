import { ArrowBack } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { ButtonCancel, ButtonSubmit } from '@/styles/buttons'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/styles/containers'
import { Controller, useForm } from 'react-hook-form'
import { ErrorText, Link, PageTitle } from '@/styles/typography'
import { FormLayout } from '@/styles/forms'
import { FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import RequiredIndicator from '@/components/RequiredIndicator'
import { env } from '@/lib/env'

const pageLanguage = language.pages.newOrganizationUser

const validationSchema = z.object({
  email: z.email({
    error: (issue) => (issue.input ? 'email must be a valid email' : 'email is a required field')
  }),
  role: z.string({ error: 'role is a required field' }).min(1, 'role is a required field')
})

const formDefaultValues = { email: '', role: 'org-user' }

const NewOrganizationUser = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organizationName, setOrganizationName] = useState()
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const organizationUrl = `${env.API_URL}/organizations/${organizationId}`
  const organizationUsersUrl = `${organizationUrl}/users`

  const {
    control: formControl,
    formState: { errors },
    handleSubmit: validateInputs,
    setError: setFormError
  } = useForm({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: formDefaultValues
  })

  useEffect(
    function loadApiData() {
      axios
        .get(organizationUrl)
        .then(({ data: { organization_name } }) => {
          setOrganizationName(organization_name)
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
          toast.error(language.error.apiLoad)
        })
    },
    [organizationUrl]
  )
  const handleCancelClick = () => {
    navigate(-1)
  }
  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    axios
      .post(organizationUsersUrl, formData)
      .then(() => {
        setIsSubmitting(false)
        toast.success(pageLanguage.getUserAdded({ userName: formData.email, organizationName }))
      })
      .catch((error) => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        if (error.response.data.error === 'Record not found') {
          setFormError('email', {
            type: 'custom',
            message: pageLanguage.getUserDoesntExist(formData.email)
          })
        }
      })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <PageTitle>{pageLanguage.getTitle(organizationName)}</PageTitle>
      <Link to={-1}>
        <ArrowBack />
        {pageLanguage.backToUsers}
      </Link>
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
        <FormLabel id={'role-label'}>
          {pageLanguage.role}
          <RequiredIndicator />
        </FormLabel>
        <Controller
          name='role'
          control={formControl}
          render={({ field }) => (
            <RadioGroup {...field} aria-labelledby='role-label' name='radio-buttons-group'>
              <FormControlLabel
                value={'org-user'}
                control={<Radio />}
                label={pageLanguage.orgUser}
              />
              <FormControlLabel
                value={'org-admin'}
                control={<Radio />}
                label={pageLanguage.orgAdmin}
              />
            </RadioGroup>
          )}
        />
        <ErrorText>{errors?.role?.role}</ErrorText>
        <div>{pageLanguage.description}</div>
        <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>

        <ButtonContainer>
          <ButtonCancel onClick={handleCancelClick} />
          <ButtonSubmit isSubmitting={isSubmitting} />
        </ButtonContainer>
      </FormLayout>
    </ContentWrapper>
  )
}

export default NewOrganizationUser
