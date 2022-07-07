import { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import {
  useForm
  // useFieldArray,
  // Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'

import { ContentWrapper } from '../styles/containers'
import {
  //   StickyFormLabel,
  FormPageHeader,
  //   FormQuestionDiv,
  SectionFormTitle,
  Form
} from '../styles/forms'
import { ErrorText, Link } from '../styles/typography'
import language from '../language'
import { questionMapping } from '../data/questionMapping'
import { siteInterventions as questions } from '../data/questions'
import { mapDataForApi } from '../library/mapDataForApi'
import { ButtonSubmit } from '../styles/buttons'
import { multiselectWithOtherValidation } from '../validation/multiSelectWithOther'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import LoadingIndicator from './LoadingIndicator'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'

function SiteInterventionsForm() {
  const validationSchema = yup.object({
    whichStakeholdersInvolved: multiselectWithOtherValidation
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      whichStakeholdersInvolved: { selectedValues: [], otherValue: undefined },
      biophysicalInterventionsUsed: { selectedValues: [], otherValue: undefined },
      organizationsProvidingTraining: { selectedValues: [], otherValue: undefined },
      otherActivitiesImplemented: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm
  } = reactHookFormInstance

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.siteInterventions,
    resetForm,
    setIsLoading
    // successCallback: loadStakeholdersFromServerData
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .patch(apiAnswersUrl, mapDataForApi('siteInterventions', formData))
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }
  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>Site Interventions</SectionFormTitle>
        <Link to={-1}>&larr; {language.form.navigateBackToSiteOverview}</Link>
      </FormPageHeader>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <CheckboxGroupWithLabelAndController
          fieldName='whichStakeholdersInvolved'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.whichStakeholdersInvolved.options}
          question={questions.whichStakeholdersInvolved.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.whichStakeholdersInvolved?.selectedValues?.message}</ErrorText>
        <CheckboxGroupWithLabelAndController
          fieldName='biophysicalInterventionsUsed'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.biophysicalInterventionsUsed.options}
          question={questions.biophysicalInterventionsUsed.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.biophysicalInterventionsUsed?.selectedValues?.message}</ErrorText>

        <CheckboxGroupWithLabelAndController
          fieldName='organizationsProvidingTraining'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.organizationsProvidingTraining.options}
          question={questions.organizationsProvidingTraining.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.organizationsProvidingTraining?.selectedValues?.message}</ErrorText>
        <CheckboxGroupWithLabelAndController
          fieldName='otherActivitiesImplemented'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.otherActivitiesImplemented.options}
          question={questions.otherActivitiesImplemented.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.otherActivitiesImplemented?.selectedValues?.message}</ErrorText>

        {isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}
        <ButtonSubmit isSubmitting={isSubmitting} />
      </Form>
    </ContentWrapper>
  )
}

export default SiteInterventionsForm
