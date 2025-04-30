import { Autocomplete, FormLabel, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { ButtonCancel, ButtonCaution, ButtonSubmit } from '../styles/buttons'
import { ButtonContainer, PaddedSection, RowFlexEnd, ContentWrapper } from '../styles/containers'
import { ErrorText, PageTitle } from '../styles/typography'
import { FormLayout } from '../styles/forms'
import ConfirmPrompt from '../components/ConfirmPrompt/ConfirmPrompt'
import ItemDoesntExist from '../components/ItemDoesntExist'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import RequiredIndicator from '../components/RequiredIndicator'
import SubmitErrorWithExtraErrorContent from '../components/SubmitErrorWithExtraErrorContent'

const validationSchema = yup.object({
  landscape_name: yup.string().required(language.pages.landscapeForm.validation.nameRequired),
  selectedOrganizations: yup
    .array()
    .min(1, language.pages.landscapeForm.validation.organizationRequired)
})

const formDefaultValues = { landscape_name: '', selectedOrganizations: [] }

const getOrgsUserBelongsTo = (organizations) =>
  organizations.filter(({ role }) => role === 'org-admin' || role === 'org-user')

const LandscapeForm = ({ isNewLandscape }) => {
  const [doesLandscapeExist, setDoesLandscapeExist] = useState(true)
  const [isAssociatedSites, setIsAssociatedSites] = useState(false)
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [landscapeName, setLandscapeName] = useState()
  const [organizationOptions, setOrganizationOptions] = useState([])
  const { landscapeId } = useParams()
  const landscapesUrl = `${process.env.REACT_APP_API_URL}/landscapes`
  const landscapeUrl = `${landscapesUrl}/${landscapeId}`
  const navigate = useNavigate()
  const organizationsUrl = `${process.env.REACT_APP_API_URL}/organizations`

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: formDefaultValues })

  useEffect(
    function loadApiData() {
      const serverDataPromises = [axios.get(organizationsUrl)]
      if (!isNewLandscape && landscapeId) {
        serverDataPromises.push(axios.get(landscapeUrl))
      }

      Promise.all(serverDataPromises)
        .then(([{ data: organizationsData }, landscapeResponse]) => {
          if (!isNewLandscape && landscapeId && landscapeResponse) {
            setIsLoading(true)
            const {
              landscape_name,
              organizations: selectedOrganizations,
              sites
            } = landscapeResponse.data
            const landscapeDataFormattedForForm = {
              landscape_name,
              selectedOrganizations
            }
            resetForm(landscapeDataFormattedForForm)
            setIsAssociatedSites(!!sites.length)
            setLandscapeName(landscape_name)
          }
          setOrganizationOptions(getOrgsUserBelongsTo(organizationsData))
          setIsLoading(false)
        })
        .catch((error) => {
          setIsLoading(false)
          if (error?.response?.status === 404) {
            setDoesLandscapeExist(false)
          } else {
            toast.error(language.error.apiLoad)
          }
        })
    },
    [landscapeUrl, resetForm, isNewLandscape, landscapeId, organizationsUrl]
  )

  const formatDataForSubmit = ({ landscape_name, selectedOrganizations }) => {
    const organizationIds = selectedOrganizations.map((organizationObject) => organizationObject.id)

    return { landscape_name, organizations: organizationIds }
  }

  const postNewLandscape = (formData) => {
    axios
      .post(landscapesUrl, formatDataForSubmit(formData))
      .then(({ data: { landscape_name } }) => {
        setIsSubmitting(false)
        toast.success(language.success.getCreateThingSuccessMessage(landscape_name))
        navigate('/landscapes')
      })
      .catch((error) => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(
          <SubmitErrorWithExtraErrorContent extraErrorContent={error.response.data.error} />
        )
      })
  }

  const editLandscape = (formData) => {
    axios
      .patch(landscapeUrl, formatDataForSubmit(formData))
      .then(({ data: { landscape_name } }) => {
        setIsSubmitting(false)
        toast.success(language.success.getEditThingSuccessMessage(landscape_name))
        navigate('/landscapes')
      })
      .catch((error) => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(
          <SubmitErrorWithExtraErrorContent extraErrorContent={error.response.data.error} />
        )
      })
  }
  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    if (isNewLandscape) {
      postNewLandscape(formData)
    }
    if (!isNewLandscape) {
      editLandscape(formData)
    }
  }

  const handleCancelClick = () => {
    navigate('/landscapes')
  }

  const handleDeleteConfirm = () => {
    setIsDeleting(true)
    axios
      .delete(landscapeUrl)
      .then(() => {
        setIsDeleting(false)
        toast.success(language.success.getDeleteThingSuccessMessage(landscapeName))
        navigate('/landscapes')
      })
      .catch(() => {
        setIsDeleting(false)
        toast.error(language.error.delete)
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
