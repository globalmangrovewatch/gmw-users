'use client'

import { useFormContext, useWatch } from 'react-hook-form'

import { FormInput, FormSelect } from '@/components/form/FormInput'
import LinkedAimsCheckboxes from '@/components/MonitoringForm/LinkedAimsCheckboxes'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ComparisonOptions, TrendOptions, TypeOptions } from '@/data/socioeconomicOutcomesOptions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

const typeOptions = getOptionsValuesAndLabels(TypeOptions)
const trendOptions = getOptionsValuesAndLabels(TrendOptions)
const comparisonOptions = getOptionsValuesAndLabels(ComparisonOptions)

type SocioeconomicOutcomesRowProps = {
  index: number
  /** The outcome indicator, e.g. "Employment rates". */
  outcome: string
  /** The site's socioeconomic aims (3.2) the outcome can be linked to. */
  aims: string[]
}

/** One row of 9.4a: how an outcome was assessed, its result and the aims it relates to. */
function SocioeconomicOutcomesRow({ index, outcome, aims }: SocioeconomicOutcomesRowProps) {
  const { control } = useFormContext<RegistrationFormValues>()
  const name = `socioeconomicOutcomes.${index}` as const
  const type = useWatch({ control, name: `${name}.type` })

  return (
    <div className='mt-8 flex max-w-80 flex-col gap-3'>
      <span className='font-bold'>{outcome}</span>
      <FormSelect<RegistrationFormValues, `${typeof name}.type`>
        name={`${name}.type`}
        label='Type'
        placeholder='Type'
        options={typeOptions}
      />
      {type === 'Observed' ? (
        <FormSelect<RegistrationFormValues, `${typeof name}.trend`>
          name={`${name}.trend`}
          label='Trend'
          placeholder='Trend'
          options={trendOptions}
        />
      ) : null}
      {type === 'Quantitative' ? (
        <>
          <FormInput<RegistrationFormValues, `${typeof name}.measurement`>
            name={`${name}.measurement`}
            label='Measurement'
            placeholder='Measurement'
          />
          <FormInput<RegistrationFormValues, `${typeof name}.unit`>
            name={`${name}.unit`}
            label='Unit'
            placeholder='unit'
          />
          <FormSelect<RegistrationFormValues, `${typeof name}.comparison`>
            name={`${name}.comparison`}
            label='Comparison'
            placeholder='Comparison'
            options={comparisonOptions}
          />
          <FormInput<RegistrationFormValues, `${typeof name}.value`>
            name={`${name}.value`}
            label='Value'
            placeholder='Value'
            inputMode='decimal'
          />
        </>
      ) : null}
      {aims.length ? (
        <LinkedAimsCheckboxes name={`${name}.linkedAims`} aims={aims} />
      ) : (
        <Alert variant='info'>
          <AlertDescription>
            {language.pages.socioeconomicGovernanceStatusOutcomes.missingSocioeconomicAims}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default SocioeconomicOutcomesRow
export type { SocioeconomicOutcomesRowProps }
