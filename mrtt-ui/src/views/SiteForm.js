import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import PropTypes from 'prop-types'

import { ButtonCancel, ButtonSubmit } from '../styles/buttons'
import { ButtonContainer, RowFlexEnd } from '../styles/containers'
import { ErrorText } from '../styles/typography'
import { Form, MainFormDiv, SectionFormTitle } from '../styles/forms'
import { FormLabel, MenuItem, Select, TextField } from '@mui/material'
import ItemDoesntExist from '../components/ItemDoesntExist'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'

const validationSchema = yup.object({
  site_name: yup.string().required(language.pages.siteform.validation.nameRequired),
  landscape_id: yup.number().required(language.pages.siteform.validation.landscapeRequired)
})

const formDefaultValues = { site_name: '', landscape_id: '' }

const SiteForm = ({ isNewSite }) => {
  const [doesItemExist, setDoesItemExist] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [landscapes, setLandscapes] = useState([])
  const { siteId } = useParams()
  const landscapesUrl = `${process.env.REACT_APP_API_URL}/landscapes`
  const navigate = useNavigate()
  const sitesUrl = `${process.env.REACT_APP_API_URL}/sites`
  const siteUrl = `${sitesUrl}/${siteId}`

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: formDefaultValues })

  useEffect(
    function loadApiData() {
      if (resetForm && sitesUrl && landscapesUrl) {
        setIsLoading(true)

        const serverDataPromises = [axios.get(landscapesUrl)]
        if (!isNewSite && siteId) {
          serverDataPromises.push(axios.get(siteUrl))
        }

        Promise.all(serverDataPromises)
          .then(([{ data: landscapesData }, siteResponse]) => {
            setIsLoading(false)

            setLandscapes(landscapesData)
            if (!isNewSite) {
              resetForm(siteResponse?.data)
            }
          })
          .catch((err) => {
            setIsLoading(false)
            if (err?.response?.status === 404) {
              setDoesItemExist(false)
            } else {
              toast.error(language.error.apiLoad)
            }
          })
      }
    },
    [siteId, resetForm, sitesUrl, isNewSite, landscapesUrl, siteUrl]
  )

  const postNewSite = (formData) => {
    axios
      .post(sitesUrl, formData)
      .then(({ data: { site_name } }) => {
        setIsSubmitting(false)
        toast.success(language.pages.siteform.getNewSiteSuccessMessage(site_name))
        navigate('/sites')
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }

  const editSite = (formData) => {
    axios
      .patch(siteUrl, formData)
      .then(({ data: { site_name } }) => {
        setIsSubmitting(false)
        toast.success(language.pages.siteform.getEditSiteSuccessMessage(site_name))
        navigate('/sites')
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    if (isNewSite) {
      postNewSite(formData)
    }
    if (!isNewSite) {
      editSite(formData)
    }
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  const form = !doesItemExist ? (
    <ItemDoesntExist item='site' />
  ) : (
    <MainFormDiv>
      <SectionFormTitle>
        {isNewSite ? language.pages.siteform.titleNewSite : 'placeholder name'}
      </SectionFormTitle>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <FormLabel htmlFor='name'>{language.pages.siteform.labelName}* </FormLabel>
        <Controller
          name='site_name'
          control={formControl}
          render={({ field }) => (
            <TextField {...field} id='name' label={language.pages.siteform.labelName} />
          )}
        />
        <ErrorText>{errors?.site_name?.message}</ErrorText>
        <FormLabel htmlFor='landscape'>{language.pages.siteform.labelLandscape}* </FormLabel>
        <Controller
          name='landscape_id'
          control={formControl}
          render={({ field }) => (
            <Select {...field} id='landscape' label={language.pages.siteform.labelLandscape}>
              {landscapes.map((landscape) => (
                <MenuItem key={landscape.id} value={landscape.id}>
                  {landscape.landscape_name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <ErrorText>{errors?.landscape?.message}</ErrorText>
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

SiteForm.propTypes = { isNewSite: PropTypes.bool.isRequired }

export default SiteForm
