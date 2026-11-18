'use client'

import { useFormContext, useWatch } from 'react-hook-form'

import { NestedQuestion } from '@/components/form/layout'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { restorationAims as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'
import { makeValidClassName } from '@/library/strings/makeValidClassName'

import type { AimFieldName, AimValue, Stakeholder } from './types'

const rankingOptions = getOptionsValuesAndLabels(questions.nestedStakeholderBenefitsRanking.options)

type StakeholderBenefitsInputsProps = {
  optionId: string
  /** The checked aim the rankings belong to. */
  optionValue: string
  parentQuestionFieldName: AimFieldName
  stakeholders: Stakeholder[]
}

/** Under a checked aim: how much each stakeholder benefits from it. */
function StakeholderBenefitsInputs({
  optionId,
  optionValue,
  parentQuestionFieldName,
  stakeholders
}: StakeholderBenefitsInputsProps) {
  const { control, getValues, setValue } = useFormContext<RegistrationFormValues>()
  const parentValue = useWatch({ control, name: parentQuestionFieldName }) as AimValue | undefined
  const questionLabelId = `${optionId}-question-label`

  if (!stakeholders.length) return null

  const setRanking = (stakeholderType: string, ranking: string) => {
    const previous = getValues(parentQuestionFieldName) as AimValue | undefined
    const benefits = previous?.aimStakeholderBenefits

    setValue(parentQuestionFieldName, {
      ...previous,
      aimStakeholderBenefits: {
        ...benefits,
        [optionValue]: { ...benefits?.[optionValue], [stakeholderType]: ranking }
      }
    } as RegistrationFormValues[AimFieldName])
  }

  return (
    <NestedQuestion>
      <p id={questionLabelId} className='mb-2'>
        {questions.nestedStakeholderBenefitsRanking.question}
      </p>
      <div role='group' aria-labelledby={questionLabelId} className='flex flex-col gap-3'>
        {stakeholders.map(({ stakeholderType, stakeholderName }) => {
          if (!stakeholderType) return null
          const selectId = makeValidClassName(`${optionId}${stakeholderType}-input`)
          const value = parentValue?.aimStakeholderBenefits?.[optionValue]?.[stakeholderType]

          return (
            <div key={stakeholderType} className='flex flex-col gap-1'>
              <Label htmlFor={selectId}>
                {stakeholderType}
                {stakeholderName ? <> ({stakeholderName})</> : null}
              </Label>
              <Select<string>
                items={rankingOptions}
                value={value || null}
                onValueChange={(ranking) => setRanking(stakeholderType, ranking ?? '')}>
                <SelectTrigger id={selectId} className='max-w-80'>
                  <SelectValue placeholder={language.form.selectLabel} />
                </SelectTrigger>
                <SelectContent>
                  {rankingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        })}
      </div>
    </NestedQuestion>
  )
}

export default StakeholderBenefitsInputs
export type { StakeholderBenefitsInputsProps }
