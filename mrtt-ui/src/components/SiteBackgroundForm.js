import { Box, Checkbox, List, ListItem, MenuItem, TextField, Typography } from '@mui/material'
import { useFieldArray, Controller, useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { ContentWrapper } from '@/styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '@/styles/typography'
import { FormLayout, FormPageHeader, FormQuestionDiv, StickyFormLabel } from '@/styles/forms'

import { questionMapping } from '@/data/questionMapping'
import { siteBackground } from '@/data/questions'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import FormValidationMessageIfErrors from './FormValidationMessageIfErrors'
import language from '@/language'
import QuestionNav from './QuestionNav'
import RequiredIndicator from './RequiredIndicator'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '@/library/useSiteInfo'

import { useWatch } from 'react-hook-form'
import { env } from '@/lib/env'

const SiteBackgroundForm = () => {
  const form = useFormContext()

  const { site_name } = useSiteInfo()
  const { siteId } = useParams()
  const apiAnswersUrl = `${env.API_URL}/sites/${siteId}/registration_intervention_answers`

  useInitializeQuestionMappedForm({
    siteId,
    key: 'siteBackground',
    apiUrl: apiAnswersUrl,
    form,
    questionMapping
  })

  const {
    fields: stakeholdersFields,
    append: stakeholdersAppend,
    remove: stakeholdersRemove
  } = useFieldArray({ name: 'stakeholders', control: form.control })

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
