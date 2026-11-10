'use client'

import type { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import CheckboxGroup, { type CheckboxGroupProps } from '@/components/CheckboxGroup/CheckboxGroup'
import { StickyFormLabel } from '@/components/form/layout'
import RequiredIndicator from '@/components/RequiredIndicator'
import type { RegistrationFormValues } from '@/forms/schemas'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

import StakeholderBenefitsInputs from './StakeholderBenefitsInputs'
import type { AimFieldName, AimValue, Stakeholder } from './types'

type RestorationAimsCheckboxGroupWithLabelProps = {
  fieldName: AimFieldName
  options: readonly string[]
  question: ReactNode
  showAsterisk?: boolean
  stakeholders: Stakeholder[]
}

/** An aims question; each checked aim asks how it benefits each stakeholder. */
function RestorationAimsCheckboxGroupWithLabel({
  fieldName,
  options,
  question,
  showAsterisk = false,
  stakeholders
}: RestorationAimsCheckboxGroupWithLabelProps) {
  const { control, getValues, setValue } = useFormContext<RegistrationFormValues>()
  const labelId = `${fieldName}-label`

  // Unchecking an aim drops the stakeholder rankings given for it.
  const handleChange: CheckboxGroupProps['onChange'] = ({
    event,
    isOtherChecked,
    otherValue,
    selectedValues
  }) => {
    const benefits = (getValues(fieldName) as AimValue | undefined)?.aimStakeholderBenefits
    const aim = event?.target.value
    const keepBenefits = event?.target.checked || aim === undefined

    setValue(fieldName, {
      selectedValues,
      otherValue,
      isOtherChecked,
      aimStakeholderBenefits: keepBenefits ? benefits : { ...benefits, [aim]: undefined }
    } as RegistrationFormValues[AimFieldName])
  }

  return (
    <>
      <StickyFormLabel id={labelId}>
        {question}
        {showAsterisk ? <RequiredIndicator /> : null}
      </StickyFormLabel>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            name={field.name}
            onBlur={field.onBlur}
            value={field.value as AimValue | undefined}
            onChange={handleChange}
            options={getOptionsValuesAndLabels(options)}
            optionsExcludedFromShowingSelectedMarkup={['Unknown', 'None']}
            aria-labelledby={labelId}
            shouldAddOtherOptionWithClarification
            shouldReturnEvent
            id={fieldName}
            SelectedMarkup={({ optionId, optionValue }) => (
              <StakeholderBenefitsInputs
                stakeholders={stakeholders}
                parentQuestionFieldName={fieldName}
                optionId={optionId}
                optionValue={optionValue}
              />
            )}
          />
        )}
      />
    </>
  )
}

export default RestorationAimsCheckboxGroupWithLabel
export type { RestorationAimsCheckboxGroupWithLabelProps }
