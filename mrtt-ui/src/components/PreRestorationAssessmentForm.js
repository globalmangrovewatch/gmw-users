import { useState } from 'react'
import axios from 'axios'
import {
  useForm,
  // useFieldArray,
  Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, FormLabel, MenuItem, TextField } from '@mui/material'

import {
  Form,
  FormQuestionDiv,
  MainFormDiv,
  SectionFormTitle,
  TabularInputSection,
  TabularLabel
} from '../styles/forms'
// import { questionMapping } from '../data/questionMapping'
import { preRestorationAssessment as questions } from '../data/questions'
import { mapDataForApi } from '../library/mapDataForApi'
import { ButtonSubmit } from '../styles/buttons'
import { ErrorText } from '../styles/typography'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidation } from '../validation/multiSelectWithOther'

function PreRestorationAssessmentForm() {
  const validationSchema = yup.object().shape({
    mangrovesPreviouslyOccured: yup.string().required('This field is required'),
    mangroveRestorationAttempted: yup.string().required('This field is required'),
    lastRestorationAttemptYear: yup.mixed().when(' mangroveRestorationAttempted', {
      is: (val) => val && val === 'Yes',
      then: yup
        .number()
        .typeError('You must specify a year')
        .min(1900, 'Year must be higher than 1900')
        .max(new Date().getFullYear(), 'Year must less than or equal to the current year')
    }),
    previousBiophysicalInterventions: multiselectWithOtherValidation,
    whyUnsuccessfulRestorationAttempt: multiselectWithOtherValidation,
    siteAssessmentBeforeProject: yup.string().required('This field is required'),
    siteAssessmentType: multiselectWithOtherValidation,
    referenceCite: yup.string().required('This field is required'),
    lostMangrovesYear: yup.mixed().when('siteAssessmentBeforeProject', {
      is: (val) => val && val === 'Yes',
      then: yup
        .number()
        .typeError('You must specify a year')
        .min(1900, 'Year must be higher than 1900')
        .max(new Date().getFullYear(), 'Year must less than or equal to the current year')
    }),
    naturalRegenerationAtSite: yup.string(),
    // add proper validation for mangrovesSpeciesPresent 5.3e
    mangroveSpeciesPresent: yup.array().default([]),
    // add proper validation for speciesComposition 5.3f
    speciesComposition: yup.array().default([]),
    physicalMeasurementsTaken: yup.object().shape({
      tidalRange: yup.mixed(),
      elevationToSeaLevel: yup.mixed(),
      waterSalinity: yup.mixed(),
      soilPoreWaterSalinity: yup.mixed(),
      waterPH: yup.mixed(),
      soilPoreWaterPH: yup.mixed(),
      soilType: yup.mixed(),
      soilOrganicMatter: yup.mixed()
    }),
    pilotTestConducted: yup.string(),
    guidanceForSiteRestoration: yup.string()
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      previousBiophysicalInterventions: { selectedValues: [], otherValue: undefined },
      whyUnsuccessfulRestorationAttempt: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })
  const {
    handleSubmit: validateInputs,
    formState: { errors },
    control,
    watch
  } = reactHookFormInstance
  const mangroveRestorationAttemptedWatcher = watch('mangroveRestorationAttempted')
  const siteAssessmentBeforeProjectWatcher = watch('siteAssessmentBeforeProject')
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)

    console.log('data: ', data)
    const url = `${process.env.REACT_APP_API_URL}/sites/1/registration_answers`

    if (!data) return

    axios
      .put(url, mapDataForApi('siteBackground', data))
      .then(() => {
        setisSubmitting(false)
      })
      .catch(() => {
        setIsError(true)
        setisSubmitting(false)
      })
  }

  return (
    <MainFormDiv>
      <SectionFormTitle>Pre-restoration Assessment</SectionFormTitle>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <FormQuestionDiv>
          <FormLabel>{questions.mangrovesPreviouslyOccured.question}</FormLabel>
          <Controller
            name='mangrovesPreviouslyOccured'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangrovesPreviouslyOccured.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangrovesPreviouslyOccured?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <FormLabel>{questions.mangroveRestorationAttempted.question}</FormLabel>
          <Controller
            name='mangroveRestorationAttempted'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangroveRestorationAttempted.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangroveRestorationAttempted?.message}</ErrorText>
        </FormQuestionDiv>
        {mangroveRestorationAttemptedWatcher === 'Yes' ? (
          <FormQuestionDiv>
            <FormLabel>{questions.lastRestorationAttemptYear.question}</FormLabel>
            <Controller
              name='lastRestorationAttemptYear'
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <TextField {...field} value={field.value} label='enter year'></TextField>
              )}
            />
            <ErrorText>{errors.lastRestorationAttemptYear?.message}</ErrorText>
            <CheckboxGroupWithLabelAndController
              fieldName='previousBiophysicalInterventions'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.previousBiophysicalInterventions.options}
              question={questions.previousBiophysicalInterventions.question}
              shouldAddOtherOptionWithClarification={true}
            />
            <ErrorText>
              {errors.previousBiophysicalInterventions?.selectedValues?.message}
            </ErrorText>
            <CheckboxGroupWithLabelAndController
              fieldName='whyUnsuccessfulRestorationAttempt'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.whyUnsuccessfulRestorationAttempt.options}
              question={questions.whyUnsuccessfulRestorationAttempt.question}
              shouldAddOtherOptionWithClarification={true}
            />
            <ErrorText>
              {errors.whyUnsuccessfulRestorationAttempt?.selectedValues?.message}
            </ErrorText>
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <FormLabel>{questions.siteAssessmentBeforeProject.question}</FormLabel>
          <Controller
            name='siteAssessmentBeforeProject'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.siteAssessmentBeforeProject.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.siteAssessmentBeforeProject?.message}</ErrorText>
        </FormQuestionDiv>
        {siteAssessmentBeforeProjectWatcher === 'Yes' ? (
          <div>
            <CheckboxGroupWithLabelAndController
              fieldName='siteAssessmentType'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.siteAssessmentType.options}
              question={questions.siteAssessmentType.question}
              shouldAddOtherOptionWithClarification={false}
            />
            <ErrorText>{errors.siteAssessmentType?.selectedValues?.message}</ErrorText>
            <FormQuestionDiv>
              <FormLabel>{questions.referenceCite.question}</FormLabel>
              <Controller
                name='referenceCite'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} select value={field.value} label='select'>
                    {questions.referenceCite.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <ErrorText>{errors.referenceCite?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <FormLabel>{questions.lostMangrovesYear.question}</FormLabel>
              <Controller
                name='lostMangrovesYear'
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='enter year'></TextField>
                )}
              />
              <ErrorText>{errors.lostMangrovesYear?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <FormLabel>{questions.naturalRegenerationAtSite.question}</FormLabel>
              <Controller
                name='naturalRegenerationAtSite'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} select value={field.value} label='select'>
                    {questions.naturalRegenerationAtSite.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <ErrorText>{errors.naturalRegenerationAtSite?.message}</ErrorText>
            </FormQuestionDiv>
          </div>
        ) : null}
        <FormQuestionDiv>
          <FormLabel>{questions.mangroveSpeciesPresent.question}</FormLabel>
          {/* add in 5.3e - mangrove species list from section 1*/}
          <ErrorText>{errors.mangroveSpeciesPresent?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <FormLabel>{questions.speciesComposition.question}</FormLabel>
          {/* add in 5.3f - estimate species compositon percentage from previous q*/}
          <ErrorText>{errors.speciesComposition?.message}</ErrorText>
        </FormQuestionDiv>
        {siteAssessmentBeforeProjectWatcher === 'Yes' ? (
          <FormQuestionDiv>
            <TabularLabel>{questions.physicalMeasurementsTaken.question}</TabularLabel>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[0]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.tidalRange`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[1]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.elevationToSeaLevel`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[2]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.waterSalinity`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[3]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.soilPoreWaterSalinity`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[4]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.waterPH`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[5]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.soilPoreWaterPH`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[6]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.soilType`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[7]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.soilOrganicMatter`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <ErrorText>{errors.physicalMeasurementsTaken?.message}</ErrorText>
            <Button>+ Add measurement row</Button>
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <FormLabel>{questions.pilotTestConducted.question}</FormLabel>
          <Controller
            name='pilotTestConducted'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.pilotTestConducted.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.pilotTestConducted?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <FormLabel>{questions.guidanceForSiteRestoration.question}</FormLabel>
          <Controller
            name='guidanceForSiteRestoration'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.guidanceForSiteRestoration.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.guidanceForSiteRestoration?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          {isError && <ErrorText>Submit failed, please try again</ErrorText>}
          <ButtonSubmit isSubmitting={isSubmitting}></ButtonSubmit>
        </FormQuestionDiv>
      </Form>
    </MainFormDiv>
  )
}

export default PreRestorationAssessmentForm