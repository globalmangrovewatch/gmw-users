'use client'

import { useId, useState } from 'react'

import TabularButtons from '@/components/TabularInput/TabularButtons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorText } from '@/components/ui/typography'

type AddPhysicalMeasurementRowProps = {
  saveItem: (measurementType: string, measurementValue: string, unit: string) => void
  /** Hides this row (on save and on cancel). */
  updateTabularInputDisplay: (isShown: boolean) => void
}

const fields = [
  { key: 'type', label: 'Measurement type', placeholder: 'type' },
  { key: 'value', label: 'Value', placeholder: 'value' },
  { key: 'unit', label: 'Unit', placeholder: 'unit' }
] as const

type FieldKey = (typeof fields)[number]['key']

/** A new 5.3g row: type, value and unit, all required. */
function AddPhysicalMeasurementRow({
  saveItem,
  updateTabularInputDisplay
}: AddPhysicalMeasurementRowProps) {
  const id = useId()
  const [values, setValues] = useState<Record<FieldKey, string>>({ type: '', value: '', unit: '' })
  const [error, setError] = useState<string>()

  const handleSave = () => {
    if (!values.type || !values.value || !values.unit) {
      setError('Please fill all fields.')
      return
    }
    saveItem(values.type, values.value, values.unit)
    updateTabularInputDisplay(false)
  }

  return (
    <div className='mt-8 flex w-full flex-col'>
      {fields.map(({ key, label, placeholder }) => (
        <div key={key} className='mt-4 flex items-baseline justify-between gap-10'>
          <Label htmlFor={`${id}-${key}`}>{label}</Label>
          <Input
            id={`${id}-${key}`}
            className='max-w-60'
            placeholder={placeholder}
            value={values[key]}
            onChange={(event) => setValues({ ...values, [key]: event.target.value })}
          />
        </div>
      ))}
      {error ? <ErrorText className='mt-2'>{error}</ErrorText> : null}
      <TabularButtons handleSave={handleSave} cancelItem={() => updateTabularInputDisplay(false)} />
    </div>
  )
}

export default AddPhysicalMeasurementRow
export type { AddPhysicalMeasurementRowProps }
