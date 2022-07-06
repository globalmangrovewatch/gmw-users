import { Autocomplete, FormLabel, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { styled } from '@mui/system'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import {
  ButtonContainer,
  PaddedSection,
  PaddedPageTopSection,
  RowFlexEnd
} from '../styles/containers'
import { ButtonCancel, ButtonSubmit } from '../styles/buttons'
import { ErrorText } from '../styles/typography'
import { Form, SectionFormTitle } from '../styles/forms'
import ItemDoesntExist from '../components/ItemDoesntExist'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import SubmitErrorWithExtraErrorContent from '../components/SubmitErrorWithExtraErrorContent'

import themeMui from '../styles/themeMui'
import ButtonSecondaryWithLoader from '../components/ButtonSecondaryWithLoader'

const DeleteSectionWrapper = styled('div')`
  margin-top: ${themeMui.spacing(2)};
`

const validationSchema = yup.object({
  landscape_name: yup.string().required(language.pages.landscapeForm.validation.nameRequired),
  organizations: yup.array()
})

const formDefaultValues = { landscape_name: '', selectedOrganizations: [] }

const LandscapeForm = ({ isNewLandscape }) => {
  const [doesLandscapeExist, setDoesLandscapeExist] = useState(true)
  const [isAssociatedSites, setIsAssociatedSites] = useState(false)
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

          setOrganizationOptions(organizationsData)
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

  const handleDeleteClick = () => {
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

  const form = !doesLandscapeExist ? (
    <ItemDoesntExist item={language.pages.landscapeForm.landscape} />
  ) : (
    <>
      <PaddedPageTopSection>
        <SectionFormTitle>
          {isNewLandscape
            ? language.pages.landscapeForm.titleNew
            : language.pages.landscapeForm.titleEdit}
        </SectionFormTitle>
      </PaddedPageTopSection>
      <PaddedSection>
        <Form onSubmit={validateInputs(handleSubmit)}>
          <FormLabel htmlFor='name'>{language.pages.landscapeForm.labelName}* </FormLabel>
          <Controller
            name='landscape_name'
            control={formControl}
            render={({ field }) => (
              <TextField {...field} id='name' label={language.pages.landscapeForm.labelName} />
            )}
          />
          <ErrorText>{errors?.landscape_name?.message}</ErrorText>
          <FormLabel htmlFor='organizations'>
            {language.pages.landscapeForm.labelOrganizations}
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
                renderInput={(params) => (
                  <TextField {...params} label='organizations' id='organizations' />
                )}
                onChange={(event, values) => {
                  field.onChange(values)
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            )}
          />
          <ErrorText>{errors?.organizations?.message}</ErrorText>
          <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
          <ButtonContainer>
            <ButtonCancel onClick={handleCancelClick} />
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </Form>
        <DeleteSectionWrapper>
          {isAssociatedSites ? (
            <p>{language.pages.landscapeForm.isAssociatedSites}</p>
          ) : (
            <p>{language.pages.landscapeForm.noAssociatedSites}</p>
          )}
          <ButtonSecondaryWithLoader
            disabled={isAssociatedSites}
            onClick={handleDeleteClick}
            isHolding={isDeleting}
            holdingContent={language.buttons.deleting}>
            {language.pages.landscapeForm.delete}
          </ButtonSecondaryWithLoader>
        </DeleteSectionWrapper>
      </PaddedSection>
    </>
  )

  return isLoading ? <LoadingIndicator /> : form
}

LandscapeForm.propTypes = { isNewLandscape: PropTypes.bool.isRequired }

export default LandscapeForm
