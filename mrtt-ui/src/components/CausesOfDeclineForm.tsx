'use client'

import { useParams } from 'next/navigation'
import { useFieldArray, useFormContext, useWatch, type FieldPath } from 'react-hook-form'

import CheckboxWithLabel from '@/components/form/CheckboxWithLabel'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  StickyFormLabel,
  stickyFormLabelClassName
} from '@/components/form/layout'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import QuestionNav from '@/components/QuestionNav'
import RequiredIndicator from '@/components/RequiredIndicator'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ContentWrapper } from '@/components/ui/layout'
import { RadioGroup } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import { causesOfDeclineOptions } from '@/data/causesOfDeclineOptions'
import { causesOfDecline as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import { isTrue } from '@/forms/schemas/fields'
import language from '@/language'
import {
  causeOptionKey,
  checkedCauseKeys,
  toggleCause,
  type CauseOption
} from '@/library/causesOfDecline'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '@/library/useSiteInfo'

const yesNoOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
]
const levelOptions = getOptionsValuesAndLabels(questions.levelsOfDegredation.options)

const nestedLabel1 = 'block font-bold uppercase'
const nestedLabel2 = 'mt-3 block uppercase'

/** "Magnitude of impact" for one checked cause (4.3). The section shows one message for all. */
function LevelOfDegradationSelect({
  name,
  label
}: {
  name: FieldPath<RegistrationFormValues>
  label: string | undefined
}) {
  const { control } = useFormContext<RegistrationFormValues>()

  return (
    <FormField
      control={control}
      name={name}
      defaultValue=''
      render={({ field }) => (
        <FormItem className='mb-4 ml-2 gap-1'>
          <FormLabel className='mb-0 ml-1 text-sm'>{label}</FormLabel>
          <Select<string>
            items={levelOptions}
            name={field.name}
            value={(field.value as string | undefined) || null}
            onValueChange={(value) => field.onChange(value ?? '')}>
            <FormControl>
              <SelectTrigger ref={field.ref} onBlur={field.onBlur} className='w-52'>
                <SelectValue placeholder='Magnitude of impact *' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {levelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  )
}

function CausesOfDeclineForm() {
  const form = useFormContext<RegistrationFormValues>()
  const { control } = form
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()

  const { fields: causes, replace: replaceCauses } = useFieldArray({
    name: 'causesOfDecline',
    control
  })
  const lossKnown = useWatch({ control, name: 'lossKnown' })
  const watchedCauses = useWatch({ control, name: 'causesOfDecline' })
  const checkedKeys = checkedCauseKeys(watchedCauses)

  useInitializeQuestionMappedForm({ key: 'causesOfDecline', siteId, form })

  const onCauseChange = (option: CauseOption, checked: boolean) =>
    replaceCauses(toggleCause(form.getValues('causesOfDecline'), option, checked))

  const causeCheckbox = (option: CauseOption) => (
    <li key={option.answer}>
      <CheckboxWithLabel
        label={option.answer}
        labelClassName='px-4 text-sm'
        checked={checkedKeys.has(causeOptionKey(option))}
        onCheckedChange={(checked) => onCauseChange(option, checked)}
      />
    </li>
  )

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.causesOfDecline}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={false}
        currentSection='causes-of-decline'
      />
      <FormValidationMessageIfErrors formErrors={errors} />
      <FormLayout>
        <FormQuestionDiv>
          <FormField
            control={control}
            name='lossKnown'
            render={({ field }) => (
              <FormItem>
                <FormLabel id='loss-known-label' className={stickyFormLabelClassName}>
                  {questions.lossKnown.question}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    aria-labelledby='loss-known-label'
                    options={yesNoOptions}
                    name={field.name}
                    inputRef={field.ref}
                    // Stored as 'true' / 'false', as the API returns it.
                    value={field.value === undefined ? null : String(field.value)}
                    onValueChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormQuestionDiv>

        {isTrue(lossKnown) ? (
          <FormQuestionDiv>
            <StickyFormLabel id='causes-of-decline-label'>
              {questions.causesOfDecline.question} <RequiredIndicator />
            </StickyFormLabel>
            <div role='group' aria-labelledby='causes-of-decline-label'>
              {causesOfDeclineOptions.map((mainCause) => (
                <div key={mainCause.label} className='mt-3 mb-6'>
                  <span className={nestedLabel1}>{mainCause.label}</span>
                  <ul className='m-0 list-none p-0'>
                    {mainCause.children.map((child) =>
                      typeof child === 'string' ? (
                        causeCheckbox({ mainCauseLabel: mainCause.label, answer: child })
                      ) : (
                        <li key={child.secondaryLabel} className='mt-3 ml-4'>
                          <span className={nestedLabel2}>{child.secondaryLabel}</span>
                          <ul className='m-0 list-none p-0'>
                            {child.secondaryChildren.map((answer) =>
                              causeCheckbox({
                                mainCauseLabel: mainCause.label,
                                subCauseLabel: child.secondaryLabel,
                                answer
                              })
                            )}
                          </ul>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
            <ErrorText>{errors.causesOfDecline?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}

        {causes.length ? (
          <FormQuestionDiv>
            <p className={stickyFormLabelClassName}>{questions.levelsOfDegredation.question}</p>
            {causes.map((cause, causeIndex) => (
              <div key={cause.id}>
                <span className={nestedLabel1}>{cause.mainCauseLabel}</span>
                {cause.mainCauseAnswers?.map((answer, answerIndex) => (
                  <LevelOfDegradationSelect
                    key={answer.mainCauseAnswer}
                    name={`causesOfDecline.${causeIndex}.mainCauseAnswers.${answerIndex}.levelOfDegradation`}
                    label={answer.mainCauseAnswer}
                  />
                ))}
                {cause.subCauses?.map((subCause, subCauseIndex) => (
                  <div key={subCause.subCauseLabel}>
                    <span className={nestedLabel2}>{subCause.subCauseLabel}</span>
                    {subCause.subCauseAnswers?.map((answer, answerIndex) => (
                      <LevelOfDegradationSelect
                        key={answer.subCauseAnswer}
                        name={`causesOfDecline.${causeIndex}.subCauses.${subCauseIndex}.subCauseAnswers.${answerIndex}.levelOfDegradation`}
                        label={answer.subCauseAnswer}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
            {/* Any error inside the list is a missing magnitude of impact. */}
            <ErrorText>
              {Array.isArray(errors.causesOfDecline)
                ? 'Please select magnitude of impact for each item'
                : null}
            </ErrorText>
          </FormQuestionDiv>
        ) : null}
      </FormLayout>
    </ContentWrapper>
  )
}

export default CausesOfDeclineForm
