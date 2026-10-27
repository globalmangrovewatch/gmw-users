'use client'

import { Controller, useForm } from 'react-hook-form'
import { FormLabel, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { useRouter, useParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

import { ButtonCancel, ButtonSubmit } from '@/styles/buttons'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '@/styles/containers'
import { ErrorText, PageTitle } from '@/styles/typography'
import { FormLayout } from '@/styles/forms'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import RequiredIndicator from '@/components/RequiredIndicator'
import SubmitErrorWithExtraErrorContent from '@/components/SubmitErrorWithExtraErrorContent'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import {
  organizationQueries,
  useCreateOrganization,
  useUpdateOrganization
} from '@/queries/organizations'

const nameRequired = language.pages.organizationForm.validation.nameRequired

const validationSchema = z.object({
  organization_name: z.string({ error: nameRequired }).min(1, nameRequired)
})

const formDefaultValues = { organization_name: '' }

const OrganizationForm = ({ isNewOrganization }) => {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { organizationId } = useParams()
  const router = useRouter()

  const organizationQuery = useQuery({
    ...organizationQueries.detail(organizationId),
    enabled: !isNewOrganization && !!organizationId
  })
  const createOrganization = useCreateOrganization()
  const updateOrganization = useUpdateOrganization(organizationId)
  const isLoading = organizationQuery.isLoading
  const isSubmitting = createOrganization.isPending || updateOrganization.isPending
  const doesOrganizationExist = !isNotFound(organizationQuery.error)
  useLoadErrorToast(organizationQuery.error)

  const {
    control: formControl,
    formState: { errors },
    handleSubmit: validateInputs,
    reset: resetForm
  } = useForm({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: formDefaultValues
  })

  useEffect(
    function loadOrganizationIntoForm() {
      if (organizationQuery.data) resetForm(organizationQuery.data)
    },
    [organizationQuery.data, resetForm]
  )

  const handleSubmitSuccess =
    (getMessage) =>
    ({ organization_name }) => {
      toast.success(getMessage(organization_name))
      router.push('/organizations')
    }

  const handleSubmitError = (error) => {
    setIsSubmitError(true)
    toast.error(<SubmitErrorWithExtraErrorContent extraErrorContent={error.body?.error} />)
  }

  const handleSubmit = (formData) => {
    setIsSubmitError(false)
    const mutation = isNewOrganization ? createOrganization : updateOrganization
    mutation.mutate(formData, {
      onSuccess: handleSubmitSuccess(
        isNewOrganization
          ? language.success.getCreateThingSuccessMessage
          : language.success.getEditThingSuccessMessage
      ),
      onError: handleSubmitError
    })
  }

  const handleCancelClick = () => {
    router.push('/organizations')
  }

  const form = !doesOrganizationExist ? (
    <ItemDoesntExist item={language.pages.organizationForm.organization} />
  ) : (
    <>
      <ContentWrapper>
        <PageTitle>
          {isNewOrganization
            ? language.pages.organizationForm.titleNew
            : language.pages.organizationForm.titleEdit}
        </PageTitle>
        <FormLayout onSubmit={validateInputs(handleSubmit)}>
          <FormLabel htmlFor='name'>
            {language.pages.organizationForm.labelName}
            <RequiredIndicator />
          </FormLabel>
          <Controller
            name='organization_name'
            control={formControl}
            render={({ field }) => <TextField {...field} id='name' />}
          />
          <ErrorText>{errors?.organization_name?.message}</ErrorText>
          <FormLabel htmlFor='organizations'>
            {language.pages.organizationForm.labelOrganizations}
          </FormLabel>

          <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
          <ButtonContainer>
            <ButtonCancel onClick={handleCancelClick} />
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </FormLayout>
      </ContentWrapper>
    </>
  )

  return isLoading ? <LoadingIndicator /> : form
}

OrganizationForm.propTypes = { isNewOrganization: PropTypes.bool.isRequired }

export default OrganizationForm
