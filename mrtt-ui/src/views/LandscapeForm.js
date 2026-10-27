import { Autocomplete, FormLabel, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

import { ButtonCancel, ButtonCaution, ButtonSubmit } from '@/styles/buttons'
import { ButtonContainer, PaddedSection, RowFlexEnd, ContentWrapper } from '@/styles/containers'
import { ErrorText, PageTitle } from '@/styles/typography'
import { FormLayout } from '@/styles/forms'
import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import RequiredIndicator from '@/components/RequiredIndicator'
import SubmitErrorWithExtraErrorContent from '@/components/SubmitErrorWithExtraErrorContent'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import {
  landscapeQueries,
  useCreateLandscape,
  useDeleteLandscape,
  useUpdateLandscape
} from '@/queries/landscapes'
import { organizationQueries } from '@/queries/organizations'

const nameRequired = language.pages.landscapeForm.validation.nameRequired

const validationSchema = z.object({
  landscape_name: z.string({ error: nameRequired }).min(1, nameRequired),
  selectedOrganizations: z
    .array(z.unknown())
    .min(1, language.pages.landscapeForm.validation.organizationRequired)
    .optional()
})

const formDefaultValues = { landscape_name: '', selectedOrganizations: [] }

const getOrgsUserBelongsTo = (organizations) =>
  organizations.filter(({ role }) => role === 'org-admin' || role === 'org-user')

const LandscapeForm = ({ isNewLandscape }) => {
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { landscapeId } = useParams()
  const navigate = useNavigate()

  const organizationsQuery = useQuery(organizationQueries.list())
  const landscapeQuery = useQuery({
    ...landscapeQueries.detail(landscapeId),
    enabled: !isNewLandscape && !!landscapeId
  })
  const createLandscape = useCreateLandscape()
  const updateLandscape = useUpdateLandscape(landscapeId)
  const deleteLandscape = useDeleteLandscape(landscapeId)

  const landscape = landscapeQuery.data
  const landscapeName = landscape?.landscape_name
  const isAssociatedSites = !!landscape?.sites.length
  const organizationOptions = getOrgsUserBelongsTo(organizationsQuery.data ?? [])
  const isLoading = organizationsQuery.isLoading || landscapeQuery.isLoading
  const isSubmitting = createLandscape.isPending || updateLandscape.isPending
  const isDeleting = deleteLandscape.isPending
  const doesLandscapeExist = !isNotFound(landscapeQuery.error)
  useLoadErrorToast(organizationsQuery.error, landscapeQuery.error)

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm
  } = useForm({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: formDefaultValues
  })

  useEffect(
    function loadLandscapeIntoForm() {
      if (landscape) {
        resetForm({
          landscape_name: landscape.landscape_name,
          selectedOrganizations: landscape.organizations
        })
      }
    },
    [landscape, resetForm]
  )

  const formatDataForSubmit = ({ landscape_name, selectedOrganizations }) => {
    const organizationIds = selectedOrganizations.map((organizationObject) => organizationObject.id)

    return { landscape_name, organizations: organizationIds }
  }

  const handleSubmit = (formData) => {
    setIsSubmitError(false)
    const mutation = isNewLandscape ? createLandscape : updateLandscape
    const getSuccessMessage = isNewLandscape
      ? language.success.getCreateThingSuccessMessage
      : language.success.getEditThingSuccessMessage

    mutation.mutate(formatDataForSubmit(formData), {
      onSuccess: ({ landscape_name }) => {
        toast.success(getSuccessMessage(landscape_name))
        navigate('/landscapes')
      },
      onError: (error) => {
        setIsSubmitError(true)
        toast.error(<SubmitErrorWithExtraErrorContent extraErrorContent={error.body?.error} />)
      }
    })
  }

  const handleCancelClick = () => {
    navigate('/landscapes')
  }

  const handleDeleteConfirm = () => {
    deleteLandscape.mutate(undefined, {
      onSuccess: () => {
        toast.success(language.success.getDeleteThingSuccessMessage(landscapeName))
        navigate('/landscapes')
      },
      onError: () => toast.error(language.error.delete)
    })
  }

  const handleDeleteClick = () => {
    setIsDeleteConfirmPromptOpen(true)
  }

  const form = !doesLandscapeExist ? (
    <ItemDoesntExist item={language.pages.landscapeForm.landscape} />
  ) : (
    <>
      <ContentWrapper>
        <PageTitle>
          {isNewLandscape
            ? language.pages.landscapeForm.titleNew
            : language.pages.landscapeForm.titleEdit}
        </PageTitle>
        <FormLayout onSubmit={validateInputs(handleSubmit)}>
          <FormLabel htmlFor='name'>
            {language.pages.landscapeForm.labelName}
            <RequiredIndicator />
          </FormLabel>
          <Controller
            name='landscape_name'
            control={formControl}
            render={({ field }) => <TextField {...field} id='name' />}
          />
          <ErrorText>{errors?.landscape_name?.message}</ErrorText>
          <FormLabel htmlFor='organizations'>
            {language.pages.landscapeForm.labelOrganizations}
            <RequiredIndicator />
          </FormLabel>
          <Controller
            name='selectedOrganizations'
            control={formControl}
            render={({ field }) => (
              <Autocomplete
                {...field}
                disablePortal
                multiple
                options={organizationOptions}
                getOptionLabel={(option) => (option ? option.organization_name : '')}
                renderInput={(params) => <TextField {...params} id='organizations' />}
                onChange={(event, values) => {
                  field.onChange(values)
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            )}
          />
          <ErrorText>{errors?.selectedOrganizations?.message}</ErrorText>
          <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
          <ButtonContainer>
            <ButtonCancel onClick={handleCancelClick} />
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </FormLayout>
      </ContentWrapper>
    </>
  )

  const deleteLandscapeSection = !isNewLandscape ? (
    <>
      <PaddedSection>
        {isAssociatedSites ? (
          <p>{language.pages.landscapeForm.isAssociatedSites}</p>
        ) : (
          <p>{language.pages.landscapeForm.noAssociatedSites}</p>
        )}
        <div>
          <ButtonCaution
            disabled={isAssociatedSites}
            onClick={handleDeleteClick}
            isHolding={isDeleting}
            holdingContent={language.buttons.deleting}>
            {language.pages.landscapeForm.delete}
          </ButtonCaution>
        </div>
      </PaddedSection>
      <ConfirmPrompt
        isOpen={isDeleteConfirmPromptOpen}
        setIsOpen={setIsDeleteConfirmPromptOpen}
        title={language.pages.landscapeForm.deletePrompt.title}
        promptText={language.pages.landscapeForm.deletePrompt.promptText}
        confirmButtonText={language.pages.landscapeForm.deletePrompt.buttonText}
        onConfirm={handleDeleteConfirm}
      />
    </>
  ) : null

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      {form}
      {deleteLandscapeSection}
    </>
  )
}

LandscapeForm.propTypes = { isNewLandscape: PropTypes.bool.isRequired }

export default LandscapeForm
