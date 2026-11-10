'use client'

import type { ReactNode } from 'react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'

import CheckboxGroup from '@/components/CheckboxGroup/CheckboxGroup'
import { StickyFormLabel } from '@/components/form/layout'
import RequiredIndicator from '@/components/RequiredIndicator'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

type CheckboxGroupWithLabelAndControllerProps<T extends FieldValues> = {
  fieldName: Path<T>
  options: string[]
  question: ReactNode
  control: Control<T>
  shouldAddOtherOptionWithClarification?: boolean
  required?: boolean
}

function CheckboxGroupWithLabelAndController<T extends FieldValues = FieldValues>({
  fieldName,
  options,
  question,
  control,
  shouldAddOtherOptionWithClarification = false,
  required = false
}: CheckboxGroupWithLabelAndControllerProps<T>) {
  const labelId = `${fieldName}-label`
  const optionsValueLabels = getOptionsValuesAndLabels(options)

  return (
    <>
      <StickyFormLabel id={labelId}>
        {question}
        {required && <RequiredIndicator />}
      </StickyFormLabel>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            {...field}
            options={optionsValueLabels}
            aria-labelledby={labelId}
            shouldAddOtherOptionWithClarification={shouldAddOtherOptionWithClarification}
            id={fieldName}
          />
        )}
      />
    </>
  )
}

export default CheckboxGroupWithLabelAndController
