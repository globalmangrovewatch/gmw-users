'use client'

import { FormInput, FormSelect } from '@/components/form/FormInput'
import { currencies } from '@/data/currencies'
import type { RegistrationFormValues } from '@/forms/schemas'

export const currencyOptions = currencies.map(({ code }) => ({ label: code, value: code }))

type BreakdownOfCostRowProps = {
  index: number
  /** The cost type, e.g. "Monitoring". */
  label: string
}

/** One row of 7.5: the cost of one activity type and its currency. */
function BreakdownOfCostRow({ index, label }: BreakdownOfCostRowProps) {
  const name = `breakdownOfCost.${index}` as const

  return (
    <div className='mt-4 flex flex-col gap-2'>
      <span className='font-bold'>{label}</span>
      <div className='flex flex-wrap items-start gap-3'>
        <FormInput<RegistrationFormValues, `${typeof name}.cost`>
          name={`${name}.cost`}
          label={`${label}: cost`}
          labelClassName='sr-only'
          placeholder='cost'
          inputMode='decimal'
          className='w-52'
        />
        <FormSelect<RegistrationFormValues, `${typeof name}.currency`>
          name={`${name}.currency`}
          label={`${label}: currency`}
          labelClassName='sr-only'
          placeholder='currency'
          options={currencyOptions}
          className='w-32'
        />
      </div>
    </div>
  )
}

export default BreakdownOfCostRow
export type { BreakdownOfCostRowProps }
