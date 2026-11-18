'use client'

import type { ReactNode } from 'react'
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseControllerProps
} from 'react-hook-form'

import CheckboxGroup, { type CheckboxGroupProps } from '@/components/CheckboxGroup/CheckboxGroup'
import { StickyFormLabel } from '@/components/form/layout'
import RequiredIndicator from '@/components/RequiredIndicator'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

type CheckboxGroupWithLabelAndControllerProps<
  T extends FieldValues,
  TName extends FieldPath<T>
> = Pick<UseControllerProps<T, TName>, 'control' | 'rules'> &
  Pick<CheckboxGroupProps, 'shouldAddOtherOptionWithClarification'> & {
    // `fieldName` rather than `name`: the JS forms pass it under that name.
    fieldName: TName
    options: string[]
    question: ReactNode
    required?: boolean
  }

function CheckboxGroupWithLabelAndController<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>
>({
  fieldName,
  control,
  rules,
  options,
  question,
  shouldAddOtherOptionWithClarification = false,
  required = false
}: CheckboxGroupWithLabelAndControllerProps<T, TName>) {
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
        rules={rules}
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
