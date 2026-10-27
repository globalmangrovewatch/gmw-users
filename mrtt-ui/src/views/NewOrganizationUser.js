import { ArrowBack } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

import { ButtonCancel, ButtonSubmit } from '@/styles/buttons'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/styles/containers'
import { Controller, useForm } from 'react-hook-form'
import { ErrorText, Link, PageTitle } from '@/styles/typography'
import { FormLayout } from '@/styles/forms'
import { FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import RequiredIndicator from '@/components/RequiredIndicator'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import { organizationQueries } from '@/queries/organizations'
import { useAddOrganizationUser } from '@/queries/users'

const pageLanguage = language.pages.newOrganizationUser

const validationSchema = z.object({
  email: z.email({
    error: (issue) => (issue.input ? 'email must be a valid email' : 'email is a required field')
  }),
  role: z.string({ error: 'role is a required field' }).min(1, 'role is a required field')
})

const formDefaultValues = { email: '', role: 'org-user' }

const NewOrganizationUser = () => {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { organizationId } = useParams()
  const navigate = useNavigate()

  const organizationQuery = useQuery(organizationQueries.detail(organizationId))
  const addUser = useAddOrganizationUser(organizationId)
  const organizationName = organizationQuery.data?.organization_name
  const isLoading = organizationQuery.isPending
  const isSubmitting = addUser.isPending
  useLoadErrorToast(organizationQuery.error)

  const {
    control: formControl,
    formState: { errors },
    handleSubmit: validateInputs,
    setError: setFormError
  } = useForm({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: formDefaultValues
  })

  const handleCancelClick = () => {
    navigate(-1)
  }
  const handleSubmit = (formData) => {
    setIsSubmitError(false)
    addUser.mutate(formData, {
      onSuccess: () => {
        toast.success(pageLanguage.getUserAdded({ userName: formData.email, organizationName }))
      },
      onError: (error) => {
        setIsSubmitError(true)
        if (error.body?.error === 'Record not found') {
          setFormError('email', {
            type: 'custom',
            message: pageLanguage.getUserDoesntExist(formData.email)
          })
        }
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
