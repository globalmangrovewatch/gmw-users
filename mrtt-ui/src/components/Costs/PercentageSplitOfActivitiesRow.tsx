'use client'

import { FormInput } from '@/components/form/FormInput'
import type { RegistrationFormValues } from '@/forms/schemas'

type PercentageSplitOfActivitiesRowProps = {
  index: number
  /** The intervention or activity, from 6.2 / 6.4. */
  label: string
}

/** One row of 7.5a: the share of spending on one intervention. */
function PercentageSplitOfActivitiesRow({ index, label }: PercentageSplitOfActivitiesRowProps) {
  return (
    <FormInput<RegistrationFormValues, `percentageSplitOfActivities.${number}.percentage`>
      name={`percentageSplitOfActivities.${index}.percentage`}
      label={label}
      labelClassName='font-bold'
      placeholder='percentage'
      inputMode='decimal'
      className='mt-4 max-w-60'
    />
  )
}

export default PercentageSplitOfActivitiesRow
export type { PercentageSplitOfActivitiesRowProps }
