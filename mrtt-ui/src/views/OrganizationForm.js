import { Controller, useForm } from 'react-hook-form'
import { FormLabel, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { ButtonCancel, ButtonSubmit } from '../styles/buttons'
import { ButtonContainer, ContentWrapper, RowFlexEnd } from '../styles/containers'
import { ErrorText, PageTitle } from '../styles/typography'
import { FormLayout } from '../styles/forms'
import ItemDoesntExist from '../components/ItemDoesntExist'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import RequiredIndicator from '../components/RequiredIndicator'
import SubmitErrorWithExtraErrorContent from '../components/SubmitErrorWithExtraErrorContent'

const validationSchema = yup.object({
  organization_name: yup.string().required(language.pages.organizationForm.validation.nameRequired)
})

const formDefaultValues = { organization_name: '' }

const OrganizationForm = ({ isNewOrganization }) => {
  const [doesOrganizationExist, setDoesOrganizationExist] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const organizationsUrl = `${process.env.REACT_APP_API_URL}/organizations`
  const organizationUrl = `${organizationsUrl}/${organizationId}`

  const {
    control: formControl,
    formState: { errors },
    handleSubmit: validateInputs,
    reset: resetForm
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: formDefaultValues })

  useEffect(
    function loadApiData() {
      if (!isNewOrganization && organizationId) {
        setIsLoading(true)
        axios
          .get(organizationUrl)
          .then(({ data }) => {
            resetForm(data)
            setIsLoading(false)
          })
          .catch((error) => {
            setIsLoading(false)
            if (error?.response?.status === 404) {
              setDoesOrganizationExist(false)
            } else {
              toast.error(language.error.apiLoad)
            }
          })
      }
    },
    [isNewOrganization, organizationUrl, organizationId, resetForm]
  )
  const createOrganization = (formData) => {
    axios
      .post(organizationsUrl, formData)
      .then(({ data: { organization_name } }) => {
        setIsSubmitting(false)
        toast.success(language.success.getCreateThingSuccessMessage(organization_name))
        navigate('/organizations')
      })
      .catch((error) => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(
          <SubmitErrorWithExtraErrorContent extraErrorContent={error.response.data.error} />
        )
      })
  }
  const editOrganization = (formData) => {
    axios
      .patch(organizationUrl, formData)
      .then(({ data: { organization_name } }) => {
        setIsSubmitting(false)
        toast.success(language.success.getEditThingSuccessMessage(organization_name))
        navigate('/organizations')
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

    if (isNewOrganization) {
      createOrganization(formData)
    }
    if (!isNewOrganization) {
      editOrganization(formData)
    }
  }

  const handleCancelClick = () => {
    navigate('/organizations')
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
