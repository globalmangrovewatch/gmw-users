'use client'

import { useParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import CheckboxGroupWithLabelAndController from '@/components/CheckboxGroupWithLabelAndController'
import DatePickerUtc from '@/components/DatePickerUtc'
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
import { MultiCombobox } from '@/components/ui/combobox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ContentWrapper } from '@/components/ui/layout'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import { siteInterventions as questions } from '@/data/questions'
import { propaguleOptions, seedlingOptions } from '@/data/siteInterventionOptions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'
import organizeMangroveSpeciesList from '@/library/organizeMangroveSpeciesList'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '@/library/useSiteInfo'

import AddMangroveAssociatedSpeciesRow from './AddMangroveAssociatedSpeciesRow'
import MangroveAssociatedSpeciesRow from './MangroveAssociatedSpeciesRow'

type SiteCountry = Parameters<typeof organizeMangroveSpeciesList>[0][number]
type Material = 'seed' | 'propagule'

const stakeholderTypeOptions = getOptionsValuesAndLabels(['Paid', 'Voluntary'])

// 6.3 and 6.4 only apply to interventions that put mangroves in the ground.
const plantingInterventions = [
  'Planting',
  'Broadcast collected propagules onto an incoming tide',
  'Large scale broadcasting of propagules from the air or boats'
]

const materials: { material: Material; label: string; options: readonly string[] }[] = [
  { material: 'seed', label: 'Seedling', options: seedlingOptions },
  { material: 'propagule', label: 'Propagule', options: propaguleOptions }
]

/** Seedling or propagule under a species used (6.3): checked, sources and count. */
function PlantingMaterial({
  index,
  material,
  label,
  options
}: {
  index: number
  material: Material
  label: string
  options: readonly string[]
}) {
  const { control, setValue } = useFormContext<RegistrationFormValues>()
  const checked = useWatch({ control, name: `mangroveSpeciesUsed.${index}.${material}.checked` })
  const sourceOptions = useMemo(() => getOptionsValuesAndLabels(options), [options])

  return (
    <div className='mt-2 ml-11'>
      <CheckboxWithLabel
        label={label}
        checked={!!checked}
        onCheckedChange={(next) =>
          setValue(`mangroveSpeciesUsed.${index}.${material}.checked`, next, { shouldDirty: true })
        }
      />
      <div className='ml-11 flex max-w-80 flex-col gap-3'>
        <FormField
          control={control}
          name={`mangroveSpeciesUsed.${index}.${material}.source`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>{`${label} source`}</FormLabel>
              <FormControl>
                <MultiCombobox
                  options={sourceOptions}
                  placeholder='Source'
                  inputRef={field.ref}
                  value={field.value ?? []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormInput<RegistrationFormValues, `mangroveSpeciesUsed.${number}.${Material}.count`>
          name={`mangroveSpeciesUsed.${index}.${material}.count`}
          label={`${label} count`}
          placeholder='Count'
          inputMode='numeric'
          className='max-w-40'
        />
      </div>
    </div>
  )
}

function SiteInterventionsForm() {
  const form = useFormContext<RegistrationFormValues>()
  const { control } = form
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()
  const [showAddAssociatedSpeciesRow, setShowAddAssociatedSpeciesRow] = useState(false)

  const {
    fields: stakeholderFields,
    append: stakeholderAppend,
    remove: stakeholderRemove,
    replace: stakeholderReplace
  } = useFieldArray({ name: 'whichStakeholdersInvolved', control })
  const {
    fields: speciesUsedFields,
    append: speciesUsedAppend,
    remove: speciesUsedRemove,
    replace: speciesUsedReplace
  } = useFieldArray({ name: 'mangroveSpeciesUsed', control })
  const {
    fields: associatedSpeciesFields,
    append: associatedSpeciesAppend,
    remove: associatedSpeciesRemove,
    replace: associatedSpeciesReplace
  } = useFieldArray({ name: 'mangroveAssociatedSpecies', control })

  const biophysicalInterventions = useWatch({ control, name: 'biophysicalInterventionsUsed' })
  const localParticipantTraining = useWatch({ control, name: 'localParticipantTraining' })
  const countries = useWatch({ control, name: 'countries' })

  // Species come from the countries answered in Site details (1.2).
  const speciesForCountries = useMemo(() => {
    const siteCountries = (countries ?? []).filter((c): c is SiteCountry => !!c.properties?.country)
    return siteCountries.length ? organizeMangroveSpeciesList(siteCountries) : []
  }, [countries])

  const onLoaded = useCallback(
    (
      _answers: unknown,
      sectionData: Record<string, unknown>,
      allSections: Record<string, Record<string, unknown>>
    ) => {
      const sectionValues = sectionData as Partial<RegistrationFormValues>
      const projectDetails = allSections.projectDetails as
        | Partial<RegistrationFormValues>
        | undefined
      // Load the rows through the field arrays so their `fields` match the saved answers.
      queueMicrotask(() => {
        stakeholderReplace(sectionValues.whichStakeholdersInvolved ?? [])
        speciesUsedReplace(sectionValues.mangroveSpeciesUsed ?? [])
        associatedSpeciesReplace(sectionValues.mangroveAssociatedSpecies ?? [])
      })
      const savedCountries = projectDetails?.countries
      if (savedCountries?.length) form.setValue('countries', savedCountries, { shouldDirty: false })
    },
    [form, stakeholderReplace, speciesUsedReplace, associatedSpeciesReplace]
  )

  const { isLoading } = useInitializeQuestionMappedForm({
    key: 'siteInterventions',
    siteId,
    form,
    successCallback: onLoaded
  })

  const toggleStakeholder = (stakeholder: string, checked: boolean) => {
    const index = stakeholderFields.findIndex((f) => f.stakeholder === stakeholder)
    if (checked && index === -1) stakeholderAppend({ stakeholder, stakeholderType: '' })
    if (!checked && index !== -1) stakeholderRemove(index)
  }

  const toggleSpeciesUsed = (type: string, checked: boolean) => {
    const index = speciesUsedFields.findIndex((f) => f.type === type)
    if (checked && index === -1) {
      speciesUsedAppend({
        type,
        seed: { checked: false, source: [], count: 0 },
        propagule: { checked: false, source: [], count: 0 }
      })
    }
    if (!checked && index !== -1) speciesUsedRemove(index)
  }

  const selectedInterventions = biophysicalInterventions?.selectedValues ?? []
  const showDuration = !selectedInterventions.includes('None')
  const showSpeciesQuestions = plantingInterventions.some((i) => selectedInterventions.includes(i))

  if (isLoading) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteInterventions}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={false}
        currentSection='site-interventions'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <StickyFormLabel id='which-stakeholders-involved-label'>
            {questions.whichStakeholdersInvolved.question}
          </StickyFormLabel>
          <ul aria-labelledby='which-stakeholders-involved-label' className='m-0 list-none p-0'>
            {questions.whichStakeholdersInvolved.options.map((stakeholder) => {
              const index = stakeholderFields.findIndex((f) => f.stakeholder === stakeholder)
              return (
                <li key={stakeholder} className='px-4'>
                  <CheckboxWithLabel
                    label={stakeholder}
                    checked={index !== -1}
                    onCheckedChange={(checked) => toggleStakeholder(stakeholder, checked)}
                  />
                  {index !== -1 ? (
                    <FormSelect<
                      RegistrationFormValues,
                      `whichStakeholdersInvolved.${number}.stakeholderType`
                    >
                      name={`whichStakeholdersInvolved.${index}.stakeholderType`}
                      label={`${stakeholder}: paid or voluntary`}
                      labelClassName='sr-only'
                      placeholder={language.form.selectLabel}
                      options={stakeholderTypeOptions}
                      className='mb-2 ml-8 max-w-48'
                    />
                  ) : null}
                </li>
              )
            })}
          </ul>
          <ErrorText>{errors.whichStakeholdersInvolved?.message}</ErrorText>
        </FormQuestionDiv>

        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='biophysicalInterventionsUsed'
            control={control}
            options={[...questions.biophysicalInterventionsUsed.options]}
            question={questions.biophysicalInterventionsUsed.question}
            shouldAddOtherOptionWithClarification
            required
          />
          <ErrorText>{errors.biophysicalInterventionsUsed?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>

        {showDuration ? (
          <FormQuestionDiv>
            <p className={stickyFormLabelClassName}>
              {questions.biophysicalInterventionDuration.question}
            </p>
            <div className='flex max-w-80 flex-col gap-4'>
              {(['startDate', 'endDate'] as const).map((key) => (
                <FormField
                  key={key}
                  control={control}
                  name={`biophysicalInterventionDuration.${key}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DatePickerUtc
                          label={`Intervention ${key === 'startDate' ? 'start' : 'end'} date`}
                          field={field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </FormQuestionDiv>
        ) : null}

        {showSpeciesQuestions ? (
          <FormQuestionDiv>
            <StickyFormLabel id='mangrove-species-used-label'>
              {questions.mangroveSpeciesUsed.question}
            </StickyFormLabel>
            {speciesForCountries.length ? (
              <ul aria-labelledby='mangrove-species-used-label' className='m-0 list-none p-0'>
                {speciesForCountries.map((species) => {
                  const index = speciesUsedFields.findIndex((f) => f.type === species)
                  return (
                    <li key={species} className='px-4'>
                      <CheckboxWithLabel
                        label={species}
                        checked={index !== -1}
                        onCheckedChange={(checked) => toggleSpeciesUsed(species, checked)}
                      />
                      {index !== -1 ? (
                        <div className='mb-4'>
                          <p className='mt-2 ml-11'>{questions.sourceOfMangroves.question}</p>
                          {materials.map((m) => (
                            <PlantingMaterial key={m.material} index={index} {...m} />
                          ))}
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <ErrorText>
                No items to display. Please select countries in Site Details and Location (1.2).
              </ErrorText>
            )}
            <ErrorText>
              {errors.mangroveSpeciesUsed?.root?.message ?? errors.mangroveSpeciesUsed?.message}
            </ErrorText>
          </FormQuestionDiv>
        ) : null}

        {showSpeciesQuestions ? (
          <FormQuestionDiv>
            <p className={stickyFormLabelClassName}>
              {questions.mangroveAssociatedSpecies.question}
            </p>
            {associatedSpeciesFields.map((item, index) => (
              <MangroveAssociatedSpeciesRow
                key={item.id}
                index={index}
                type={item.type ?? ''}
                onDelete={associatedSpeciesRemove}
              />
            ))}
            <ErrorText>
              {errors.mangroveAssociatedSpecies?.root?.message ??
                errors.mangroveAssociatedSpecies?.message}
            </ErrorText>
            {showAddAssociatedSpeciesRow ? (
              <AddMangroveAssociatedSpeciesRow
                saveItem={associatedSpeciesAppend}
                updateTabularInputDisplay={setShowAddAssociatedSpeciesRow}
              />
            ) : (
              <Button
                type='button'
                variant='outline'
                className='mt-6 self-start'
                onClick={() => setShowAddAssociatedSpeciesRow(true)}>
                + Add measurement row
              </Button>
            )}
          </FormQuestionDiv>
        ) : null}

        <FormQuestionDiv>
          <FormSelect<RegistrationFormValues, 'localParticipantTraining'>
            name='localParticipantTraining'
            label={questions.localParticipantTraining.question}
            labelClassName={stickyFormLabelClassName}
            placeholder={language.form.selectLabel}
            options={getOptionsValuesAndLabels(questions.localParticipantTraining.options)}
          />
        </FormQuestionDiv>

        {localParticipantTraining === 'Yes' ? (
          <FormQuestionDiv>
            <CheckboxGroupWithLabelAndController
              fieldName='organizationsProvidingTraining'
              control={control}
              options={[...questions.organizationsProvidingTraining.options]}
              question={questions.organizationsProvidingTraining.question}
              shouldAddOtherOptionWithClarification
            />
            <ErrorText>{errors.organizationsProvidingTraining?.selectedValues?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}

        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='otherActivitiesImplemented'
            control={control}
            options={[...questions.otherActivitiesImplemented.options]}
            question={questions.otherActivitiesImplemented.question}
            shouldAddOtherOptionWithClarification
            required
          />
          <ErrorText>{errors.otherActivitiesImplemented?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
      </FormLayout>
    </ContentWrapper>
  )
}

export default SiteInterventionsForm
