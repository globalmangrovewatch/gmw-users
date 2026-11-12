'use client'

import { useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useFieldArray, useFormContext, useWatch, type FieldPath } from 'react-hook-form'

import CheckboxGroupWithLabelAndController from '@/components/CheckboxGroupWithLabelAndController'
import CheckboxWithLabel from '@/components/form/CheckboxWithLabel'
import { FormInput, FormSelect } from '@/components/form/FormInput'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  StickyFormLabel,
  stickyFormLabelClassName
} from '@/components/form/layout'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import LoadingIndicator from '@/components/LoadingIndicator'
import QuestionNav from '@/components/QuestionNav'
import { Button } from '@/components/ui/button'
import { ContentWrapper } from '@/components/ui/layout'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import { preRestorationAssessment as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import { findRegistationDataItem } from '@/library/findDataItems'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'
import organizeMangroveSpeciesList from '@/library/organizeMangroveSpeciesList'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '@/library/useSiteInfo'
import type { RegistrationAnswer } from '@/types/api'

import AddPhysicalMeasurementRow from './AddPhysicalMeasurementRow'
import PhysicalMeasurementRow from './PhysicalMeasurementRow'

type SelectQuestion =
  | 'mangrovesPreviouslyOccured'
  | 'mangroveRestorationAttempted'
  | 'siteAssessmentBeforeProject'
  | 'referenceSite'
  | 'naturalRegenerationAtSite'
  | 'pilotTestConducted'
  | 'guidanceForSiteRestoration'

type YearQuestion = 'lastRestorationAttemptYear' | 'lostMangrovesYear'

type SiteCountry = Parameters<typeof organizeMangroveSpeciesList>[0][number]

const defaultMeasurementsTaken = [
  'Tidal range (cm)',
  'Elevation to sea level (cm)',
  'Water salinity (ppt)',
  'Soil pore water salinity (ppt)',
  'Water PH',
  'Soil pore water PH',
  'Soil type',
  'Soil organic matter (%)'
].map((measurementType) => ({ measurementType }))

function PreRestorationAssessmentForm() {
  const form = useFormContext<RegistrationFormValues>()
  const { control } = form
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()

  const {
    fields: speciesCompositionFields,
    append: speciesCompositionAppend,
    remove: speciesCompositionRemove
  } = useFieldArray({ name: 'speciesComposition', control })
  const {
    fields: measurementFields,
    append: measurementAppend,
    remove: measurementRemove,
    replace: measurementReplace
  } = useFieldArray({ name: 'physicalMeasurementsTaken', control })

  const restorationAttempted = useWatch({ control, name: 'mangroveRestorationAttempted' })
  const siteAssessedBefore = useWatch({ control, name: 'siteAssessmentBeforeProject' })
  const speciesPresent = useWatch({ control, name: 'mangroveSpeciesPresent' }) ?? []
  const speciesComposition = useWatch({ control, name: 'speciesComposition' }) ?? []
  const [mangroveSpeciesList, setMangroveSpeciesList] = useState<string[]>([])
  const [showAddMeasurementRow, setShowAddMeasurementRow] = useState(false)

  // Species come from the countries answered in Site details (1.2).
  const loadServerData = useCallback(
    (answers: RegistrationAnswer[]) => {
      const countries = findRegistationDataItem(answers, '1.2')
      if (Array.isArray(countries) && countries.length) {
        setMangroveSpeciesList(organizeMangroveSpeciesList(countries as SiteCountry[]))
      }
      const measurements = findRegistationDataItem(answers, '5.3g')
      if (!Array.isArray(measurements) || !measurements.length) {
        measurementReplace(defaultMeasurementsTaken)
      }
    },
    [measurementReplace]
  )

  const { isLoading } = useInitializeQuestionMappedForm({
    key: 'preRestorationAssessment',
    siteId,
    form,
    successCallback: loadServerData
  })

  const toggleSpecies = (species: string, checked: boolean) => {
    const index = speciesCompositionFields.findIndex((f) => f.mangroveSpeciesType === species)
    if (checked && index === -1) {
      speciesCompositionAppend({ mangroveSpeciesType: species, percentageComposition: '' })
    }
    if (!checked && index !== -1) speciesCompositionRemove(index)

    const others = speciesPresent.filter((s) => s !== species)
    form.setValue('mangroveSpeciesPresent', checked ? [...others, species] : others, {
      shouldDirty: true
    })
  }

  const percentageTotal = speciesComposition.reduce(
    (total, species) => total + Number(species.percentageComposition ?? 0),
    0
  )

  const selectQuestion = (name: SelectQuestion) => (
    <FormQuestionDiv>
      <FormSelect<RegistrationFormValues, FieldPath<RegistrationFormValues>>
        name={name}
        label={questions[name].question}
        labelClassName={stickyFormLabelClassName}
        placeholder={language.form.selectLabel}
        options={getOptionsValuesAndLabels(questions[name].options)}
      />
    </FormQuestionDiv>
  )

  const yearQuestion = (name: YearQuestion, placeholder: string) => (
    <FormQuestionDiv>
      <FormInput<RegistrationFormValues, YearQuestion>
        name={name}
        label={questions[name].question}
        labelClassName={stickyFormLabelClassName}
        placeholder={placeholder}
        inputMode='numeric'
        className='max-w-80'
      />
    </FormQuestionDiv>
  )

  if (isLoading) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.preRestorationAssessment}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={false}
        currentSection='pre-restoration-assessment'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        {selectQuestion('mangrovesPreviouslyOccured')}
        {selectQuestion('mangroveRestorationAttempted')}
        {restorationAttempted === 'Yes' ? (
          <>
            {yearQuestion('lastRestorationAttemptYear', 'year')}
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='previousBiophysicalInterventions'
                control={control}
                options={[...questions.previousBiophysicalInterventions.options]}
                question={questions.previousBiophysicalInterventions.question}
                shouldAddOtherOptionWithClarification
              />
              <ErrorText>
                {errors.previousBiophysicalInterventions?.selectedValues?.message}
              </ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='whyUnsuccessfulRestorationAttempt'
                control={control}
                options={[...questions.whyUnsuccessfulRestorationAttempt.options]}
                question={questions.whyUnsuccessfulRestorationAttempt.question}
                shouldAddOtherOptionWithClarification
              />
              <ErrorText>
                {errors.whyUnsuccessfulRestorationAttempt?.selectedValues?.message}
              </ErrorText>
            </FormQuestionDiv>
          </>
        ) : null}

        {selectQuestion('siteAssessmentBeforeProject')}
        {siteAssessedBefore === 'Yes' ? (
          <>
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='siteAssessmentType'
                control={control}
                options={[...questions.siteAssessmentType.options]}
                question={questions.siteAssessmentType.question}
              />
              <ErrorText>{errors.siteAssessmentType?.selectedValues?.message}</ErrorText>
            </FormQuestionDiv>
            {selectQuestion('referenceSite')}
            {yearQuestion('lostMangrovesYear', 'enter year')}
            {selectQuestion('naturalRegenerationAtSite')}
            <FormQuestionDiv>
              <StickyFormLabel id='mangrove-species-present-label'>
                {questions.mangroveSpeciesPresent.question}
              </StickyFormLabel>
              {mangroveSpeciesList.length ? (
                <ul aria-labelledby='mangrove-species-present-label' className='m-0 list-none p-0'>
                  {mangroveSpeciesList.map((species) => (
                    <li key={species}>
                      <CheckboxWithLabel
                        label={species}
                        labelClassName='px-4 italic'
                        checked={speciesPresent.includes(species)}
                        onCheckedChange={(checked) => toggleSpecies(species, checked)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <ErrorText>
                  No items to display. Please select countries in Site Details and Location (1.2).
                </ErrorText>
              )}
            </FormQuestionDiv>
          </>
        ) : null}

        {speciesPresent.length > 0 ? (
          <FormQuestionDiv>
            <p className={stickyFormLabelClassName}>{questions.speciesComposition.question}</p>
            {speciesCompositionFields.map((species, index) => (
              <FormInput<
                RegistrationFormValues,
                `speciesComposition.${number}.percentageComposition`
              >
                key={species.id}
                name={`speciesComposition.${index}.percentageComposition`}
                label={species.mangroveSpeciesType}
                placeholder='% Number'
                inputMode='decimal'
                className='mb-4 max-w-60'
              />
            ))}
            {percentageTotal > 100 ? (
              <ErrorText>Percentage totals must not equal more than 100</ErrorText>
            ) : null}
            <ErrorText>{errors.mangroveSpeciesPresent?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}

        {siteAssessedBefore === 'Yes' ? (
          <FormQuestionDiv>
            <p className={stickyFormLabelClassName}>
              {questions.physicalMeasurementsTaken.question}
            </p>
            {measurementFields.map((measurement, index) => (
              <PhysicalMeasurementRow
                key={measurement.id}
                index={index}
                label={measurement.measurementType ?? ''}
                onDelete={measurementRemove}
              />
            ))}
            <ErrorText>
              {errors.physicalMeasurementsTaken?.root?.message ??
                errors.physicalMeasurementsTaken?.message}
            </ErrorText>
            {showAddMeasurementRow ? (
              <AddPhysicalMeasurementRow
                // The unit isn't stored: 5.3g rows only hold a type and a value.
                saveItem={(measurementType, measurementValue) =>
                  measurementAppend({ measurementType, measurementValue })
                }
                updateTabularInputDisplay={setShowAddMeasurementRow}
              />
            ) : (
              <Button
                type='button'
                variant='outline'
                className='mt-6 self-start'
                onClick={() => setShowAddMeasurementRow(true)}>
                + Add measurement row
              </Button>
            )}
          </FormQuestionDiv>
        ) : null}

        {selectQuestion('pilotTestConducted')}
        {selectQuestion('guidanceForSiteRestoration')}
      </FormLayout>
    </ContentWrapper>
  )
}

export default PreRestorationAssessmentForm
