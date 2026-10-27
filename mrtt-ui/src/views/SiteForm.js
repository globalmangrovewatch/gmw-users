import { Controller, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'

import { ButtonCancel, ButtonSubmit } from '@/styles/buttons'
import { ErrorText, PageTitle } from '@/styles/typography'
import { FormLayout } from '@/styles/forms'
import { FormLabel, MenuItem, Select, TextField } from '@mui/material'
import { QuestionWrapper, ButtonContainer, ContentWrapper, RowFlexEnd } from '@/styles/containers'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import RequiredIndicator from '@/components/RequiredIndicator'
import PRIVACY_VALUES from '@/constants/privacyValues'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import { landscapeQueries } from '@/queries/landscapes'
import { siteQueries, useCreateSite, useUpdateSite } from '@/queries/sites'

const { nameRequired, landscapeRequired } = language.pages.siteform.validation

const validationSchema = z.object({
  site_name: z.string({ error: nameRequired }).min(1, nameRequired),
  // The landscape select holds the landscape's numeric id; '' until one is picked.
  landscape_id: z.union([z.number(), z.string().min(1, landscapeRequired)], {
    error: landscapeRequired
  }),
  defaultSectionPrivacy: z.string().optional() // skipping requiring this since input hidden for when isNewSite = false / its a select with an initial value / time constraints
})

const formDefaultValues = { site_name: '', landscape_id: '', defaultSectionPrivacy: 'public' }

const SiteForm = ({ isNewSite }) => {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { siteId } = useParams()
  const navigate = useNavigate()

  const siteForm = useFormContext()
  const { reset: resetSiteForm } = siteForm

  const landscapesQuery = useQuery(landscapeQueries.list())
  const siteQuery = useQuery({ ...siteQueries.detail(siteId), enabled: !isNewSite && !!siteId })
  const createSite = useCreateSite()
  const updateSite = useUpdateSite(siteId)
  const landscapes = landscapesQuery.data ?? []
  const isLoading = landscapesQuery.isLoading || siteQuery.isLoading
  const isSubmitting = createSite.isPending || updateSite.isPending
  const doesItemExist = !isNotFound(siteQuery.error)
  useLoadErrorToast(landscapesQuery.error, siteQuery.error)

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
    function loadSiteIntoForm() {
      if (isNewSite) resetForm()
      else if (siteQuery.data) resetForm(siteQuery.data)
    },
    [isNewSite, siteQuery.data, resetForm]
  )

  const handleSubmitError = () => {
    setIsSubmitError(true)
    toast.error(language.error.submit)
  }

  const postNewSite = ({ site_name, landscape_id, defaultSectionPrivacy }) => {
    const siteDataToSubmit = {
      site_name,
      landscape_id,
      section_data_visibility: {
        1: PRIVACY_VALUES.public,
        2: defaultSectionPrivacy,
        3: defaultSectionPrivacy,
        4: defaultSectionPrivacy,
        5: defaultSectionPrivacy,
        6: defaultSectionPrivacy,
        7: defaultSectionPrivacy,
        8: defaultSectionPrivacy,
        9: defaultSectionPrivacy,
        10: defaultSectionPrivacy
      }
    }

    createSite.mutate(siteDataToSubmit, {
      onSuccess: ({ site_name }) => {
        toast.success(language.success.getCreateThingSuccessMessage(site_name))
        resetSiteForm()
        navigate('/sites')
      },
      onError: handleSubmitError
    })
  }

  const editSite = (formData) => {
    updateSite.mutate(formData, {
      onSuccess: ({ site_name }) => {
        toast.success(language.success.getEditThingSuccessMessage(site_name))
        navigate('/sites')
      },
      onError: handleSubmitError
    })
  }

  const handleSubmit = (formData) => {
    setIsSubmitError(false)
    if (isNewSite) {
      postNewSite(formData)
    }
    if (!isNewSite) {
      editSite(formData)
    }
  }

  const handleCancelClick = () => {
    navigate('/sites')
  }

  const form = !doesItemExist ? (
    <ItemDoesntExist item={language.pages.siteform.site} />
  ) : (
    <ContentWrapper>
      <PageTitle>{isNewSite ? language.pages.siteform.titleNewSite : 'placeholder name'}</PageTitle>
      <FormLayout onSubmit={validateInputs(handleSubmit)}>
        <QuestionWrapper>
          <FormLabel htmlFor='name'>
            {language.pages.siteform.labelName}
            <RequiredIndicator />
          </FormLabel>
          <Controller
            name='site_name'
            required='true'
            control={formControl}
            render={({ field }) => <TextField {...field} id='name' />}
          />
          <ErrorText>{errors?.site_name?.message}</ErrorText>
        </QuestionWrapper>
        <QuestionWrapper>
          <FormLabel htmlFor='landscape'>
            {language.pages.siteform.labelLandscape}
            <RequiredIndicator />
          </FormLabel>
          <Controller
            name='landscape_id'
            required='true'
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
          <ErrorText>{errors?.landscape_id?.message}</ErrorText>
        </QuestionWrapper>
        {isNewSite ? (
          <QuestionWrapper>
            <FormLabel htmlFor='defaultSectionPrivacy'>
              {language.pages.siteform.labelDefaultSectionPrivacy}
              <RequiredIndicator />
            </FormLabel>
            <Controller
              name='defaultSectionPrivacy'
              required='true'
              control={formControl}
              render={({ field }) => (
                <Select
                  {...field}
                  id='defaultSectionPrivacy'
                  label={language.pages.siteform.labelDefaultSectionPrivacy}>
                  <MenuItem value={PRIVACY_VALUES.private}>
                    {language.sectionPrivacy.private}
                  </MenuItem>
                  <MenuItem value={PRIVACY_VALUES.public}>
                    {language.sectionPrivacy.public}
                  </MenuItem>
                </Select>
              )}
            />
            <p>{language.pages.siteform.defaultSectionPrivacyDescription}</p>
            <ErrorText>{errors?.landscape_id?.message}</ErrorText>
          </QuestionWrapper>
        ) : null}

        <RowFlexEnd>{isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}</RowFlexEnd>
        <ButtonContainer>
          <ButtonCancel onClick={handleCancelClick} />
          <ButtonSubmit isSubmitting={isSubmitting} />
        </ButtonContainer>
      </FormLayout>
    </ContentWrapper>
  )

  return isLoading ? <LoadingIndicator /> : form
}

SiteForm.propTypes = { isNewSite: PropTypes.bool.isRequired }

export default SiteForm
