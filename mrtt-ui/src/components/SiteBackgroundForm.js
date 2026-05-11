import { Box, Checkbox, List, ListItem, MenuItem, TextField, Typography } from '@mui/material'
// import { toast } from 'react-toastify'
import { useFieldArray, Controller, useFormContext } from 'react-hook-form'

import { ContentWrapper } from '../styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '../styles/typography'
import { FormLayout, FormPageHeader, FormQuestionDiv, StickyFormLabel } from '../styles/forms'
// import { mapDataForApi } from '../library/mapDataForApi'

import { siteBackground } from '../data/questions'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import FormValidationMessageIfErrors from './FormValidationMessageIfErrors'
import language from '../language'
import QuestionNav from './QuestionNav'
import RequiredIndicator from './RequiredIndicator'
// import {
//   useInitializeQuestionMappedForm,
//    useSaveRegistrationSection
// } from '../library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '../library/useSiteInfo'

import { useWatch } from 'react-hook-form'

const SiteBackgroundForm = () => {
  const form = useFormContext()

  // const [stakeholderTypesChecked, setStakeholderTypesChecked] = useState(
  //   form.getValues('stakeholders')?.map((s) => s.stakeholderType) || []
  // )
  const { site_name } = useSiteInfo()

  const {
    fields: stakeholdersFields,
    append: stakeholdersAppend,
    remove: stakeholdersRemove
  } = useFieldArray({ name: 'stakeholders', control: form.control })

  // const setInitialStakeholderTypesFromServerData = useCallback((serverResponse) => {
  //   const initialStakeholders =
  //     serverResponse?.data.find((dataItem) => dataItem.question_id === '2.1')?.answer_value ?? []

  //   const initialStakeholderTypesChecked = initialStakeholders?.map(
  //     (stakeholder) => stakeholder.stakeholderType
  //   )
  //   setStakeholderTypesChecked(initialStakeholderTypesChecked)
  // }, [])

  // const { data, isLoading } = useInitializeQuestionMappedForm({
  //   key: 'siteBackground',
  //   apiUrl: apiAnswersUrl,
  //   form,
  //   questionMapping
  //   // successCallback: setInitialStakeholderTypesFromServerData
  // })

  // const saveMutation = useSaveRegistrationSection(siteId)

  // const handleSubmit = async (formData) => {
  //   const fields = Object.keys(questionMapping['siteBackground'])

  //   const ok = await form.trigger(fields, { shouldFocus: true })
  //   if (!ok) {
  //     setIsError(true)
  //     toast.error(language.error.validation)
  //     return
  //   }
  //   setIsSubmitting(true)
  //   setIsError(false)

  //   if (!formData) return

  //   axios
  //     .patch(apiAnswersUrl, mapDataForApi('siteBackground', formData))
  //     .then(() => {
  //       setIsError(false)
  //       setIsSubmitting(false)
  //       toast.success(language.success.submit)
  //     })
  //     .catch(() => {
  //       setIsError(true)
  //       setIsSubmitting(false)
  //       toast.error(language.error.submit)
  //     })
  // }

  // const handleStakeholdersOnChange = (_event, stakeholder) => {
  //   setStakeholderTypesChecked((prev) => {
  //     const isChecked = prev.includes(stakeholder)
  //     const next = isChecked ? prev.filter((t) => t !== stakeholder) : [...prev, stakeholder]

  //     if (isChecked) {
  //       const fieldIndex = stakeholdersFields.findIndex(
  //         (field) => field.stakeholderType === stakeholder
  //       )
  //       if (fieldIndex !== -1) stakeholdersRemove(fieldIndex)
  //     } else {
  //       const exists = stakeholdersFields.some((f) => f.stakeholderType === stakeholder)
  //       if (!exists) stakeholdersAppend({ stakeholderType: stakeholder })
  //     }

  //     return next
  //   })
  // }

  const handleStakeholdersOnChange = (_event, stakeholder) => {
    const isChecked = stakeholderTypesChecked.includes(stakeholder)

    if (isChecked) {
      const idx = stakeholdersFields.findIndex((f) => f.stakeholderType === stakeholder)
      if (idx !== -1) stakeholdersRemove(idx)
    } else {
      const exists = stakeholdersFields.some((f) => f.stakeholderType === stakeholder)
      if (!exists) stakeholdersAppend({ stakeholderType: stakeholder })
    }
  }

  const watchedStakeholders = useWatch({ control: form.control, name: 'stakeholders' }) ?? []
  const stakeholderTypesChecked = watchedStakeholders.map((s) => s.stakeholderType)

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteBackground}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav isFormSaving={false} isFormSaveError={false} currentSection='site-background' />
      <FormValidationMessageIfErrors formErrors={form.errors} />

      {/* Select Stakeholders */}
      <FormLayout>
        <FormQuestionDiv>
          <StickyFormLabel>
            {siteBackground.stakeholders.question} <RequiredIndicator />
          </StickyFormLabel>
          <List>
            {siteBackground.stakeholders.options?.map((stakeholder, index) => {
              const stakeholderIndex = watchedStakeholders.findIndex(
                (s) => s.stakeholderType === stakeholder
              )

              return (
                <ListItem key={index}>
                  <Box>
                    <Box>
                      <Checkbox
                        value={stakeholder}
                        checked={stakeholderTypesChecked.includes(stakeholder)}
                        onChange={(event) => {
                          handleStakeholdersOnChange(event, stakeholder)
                        }}></Checkbox>
                      <Typography variant='subtitle'>{stakeholder}</Typography>
                    </Box>
                    <Box>
                      {stakeholderIndex !== -1 && stakeholder !== 'Unknown' ? (
                        <Controller
                          name={`stakeholders.${stakeholderIndex}.stakeholderName`}
                          control={form.control}
                          defaultValue=''
                          render={({ field }) => (
                            <TextField
                              sx={{ marginTop: '1em' }}
                              label='Name'
                              variant='outlined'
                              {...field}
                            />
                          )}
                        />
                      ) : null}
                    </Box>
                  </Box>
                </ListItem>
              )
            })}
          </List>
          <ErrorText>{form.errors?.stakeholders?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Select Management Status*/}
        <FormQuestionDiv>
          <StickyFormLabel>{siteBackground.managementStatus.question}</StickyFormLabel>
          <Controller
            name='managementStatus'
            control={form.control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label={language.form.selectLabel}>
                {siteBackground.managementStatus.options?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{form.errors?.managementStatus?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Law recognition */}
        <FormQuestionDiv>
          <StickyFormLabel>{siteBackground.lawStatus.question}</StickyFormLabel>
          <Controller
            name='lawStatus'
            control={form.control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label={language.form.selectLabel}>
                {siteBackground.lawStatus.options?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{form.errors?.lawStatus?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Management Area*/}
        <FormQuestionDiv>
          <StickyFormLabel>{siteBackground.managementArea.question}</StickyFormLabel>
          <Controller
            name='managementArea'
            control={form.control}
            defaultValue=''
            render={({ field }) => <TextField {...field} value={field.value}></TextField>}
          />
          <ErrorText>{form.errors?.managementArea?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Protection Status*/}
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='protectionStatus'
            control={form.control}
            options={siteBackground.protectionStatus.options}
            question={siteBackground.protectionStatus.question}
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{form.errors?.protectionStatus?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        {/* areStakeholdersInvolved */}
        <FormQuestionDiv>
          <StickyFormLabel>{siteBackground.areStakeholdersInvolved.question}</StickyFormLabel>
          <Controller
            name='areStakeholdersInvolved'
            control={form.control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label={language.form.selectLabel}>
                {siteBackground.areStakeholdersInvolved.options?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText variant='subtitle' sx={{ color: 'red' }}>
            {form.errors?.areStakeholdersInvolved?.message}
          </ErrorText>
        </FormQuestionDiv>
        {/* Government Arrangement */}
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='governmentArrangement'
            control={form.control}
            options={siteBackground.governmentArrangement.options}
            question={<>{siteBackground.governmentArrangement.question}</>}
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{form.errors?.governmentArrangement?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Land Tenure */}
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='landTenure'
            control={form.control}
            options={siteBackground.landTenure.options}
            question={<>{siteBackground.landTenure.question}</>}
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{form.errors?.landTenure?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        {/* customaryRights */}
        <FormQuestionDiv>
          <StickyFormLabel>{siteBackground.customaryRights.question}</StickyFormLabel>
          <Controller
            name='customaryRights'
            control={form.control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label={language.form.selectLabel}>
                {siteBackground.customaryRights.options?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{form.errors?.customaryRights?.message}</ErrorText>
        </FormQuestionDiv>
      </FormLayout>
    </ContentWrapper>
  )
}

export default SiteBackgroundForm
