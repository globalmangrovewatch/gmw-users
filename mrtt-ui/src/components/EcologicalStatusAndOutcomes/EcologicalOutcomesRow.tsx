'use client'

import { FormInput, FormSelect } from '@/components/form/FormInput'
import LinkedAimsCheckboxes from '@/components/MonitoringForm/LinkedAimsCheckboxes'
import { ErrorText } from '@/components/ui/typography'
import { comparisonOptions } from '@/data/ecologicalOptions'
import type { RegistrationFormValues } from '@/forms/schemas'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

const comparisonSelectOptions = getOptionsValuesAndLabels(comparisonOptions)

type EcologicalOutcomesRowProps = {
  index: number
  /** Category and sub-category, e.g. "Absence Of Threats: Pollution". */
  groupLabel: string
  /** Indicator and metric, e.g. "Macroalgae: Macroalgae Cover". */
  indicatorLabel: string
  /** The site's ecological aims (3.1) the outcome can be linked to. */
  aims: string[]
}

/** One row of 10.7a: the measurement of an indicator, its comparison and the aims it relates to. */
function EcologicalOutcomesRow({
  index,
  groupLabel,
  indicatorLabel,
  aims
}: EcologicalOutcomesRowProps) {
  const name = `monitoringIndicators.${index}` as const

  return (
    <div className='mt-8 flex max-w-80 flex-col gap-3'>
      <span className='font-bold uppercase'>{groupLabel}</span>
      <span className='uppercase'>{indicatorLabel}</span>
      <FormInput<RegistrationFormValues, `${typeof name}.measurement`>
        name={`${name}.measurement`}
        label='Measurement'
        placeholder='Measurement'
        inputMode='decimal'
      />
      <FormInput<RegistrationFormValues, `${typeof name}.unit`>
        name={`${name}.unit`}
        label='Unit'
        placeholder='Unit'
      />
      <FormSelect<RegistrationFormValues, `${typeof name}.comparison`>
        name={`${name}.comparison`}
        label='Comparison'
        placeholder='Select'
        options={comparisonSelectOptions}
      />
      <FormInput<RegistrationFormValues, `${typeof name}.measurementComparison`>
        name={`${name}.measurementComparison`}
        label='Measurement - Comparison'
        placeholder='Value'
        inputMode='decimal'
      />
      {aims.length ? (
        <LinkedAimsCheckboxes name={`${name}.linkedAims`} aims={aims} />
      ) : (
        <ErrorText>Please select aims in 3.1</ErrorText>
      )}
    </div>
  )
}

export default EcologicalOutcomesRow
export type { EcologicalOutcomesRowProps }
