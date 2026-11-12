'use client'

import { useId, useState } from 'react'

import TabularButtons from '@/components/TabularInput/TabularButtons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ErrorText } from '@/components/ui/typography'
import { purposeOptions, sourceOptions } from '@/data/siteInterventionOptions'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

type MangroveAssociatedSpecies = {
  type: string
  count: string
  source: string
  purpose: { purpose: string; other: string }
}

type AddMangroveAssociatedSpeciesRowProps = {
  saveItem: (item: MangroveAssociatedSpecies) => void
  /** Hides this row (on save and on cancel). */
  updateTabularInputDisplay: (isShown: boolean) => void
}

const sourceSelectOptions = getOptionsValuesAndLabels(sourceOptions)
const purposeSelectOptions = getOptionsValuesAndLabels(purposeOptions)

const rowClassName = 'mt-4 flex items-baseline justify-between gap-10'

/** A new 6.4 row: species name, number, source and purpose (all required). */
function AddMangroveAssociatedSpeciesRow({
  saveItem,
  updateTabularInputDisplay
}: AddMangroveAssociatedSpeciesRowProps) {
  const id = useId()
  const [type, setType] = useState('')
  const [count, setCount] = useState('')
  const [source, setSource] = useState('')
  const [purpose, setPurpose] = useState('')
  const [other, setOther] = useState('')
  const [error, setError] = useState<string>()

  const handleSave = () => {
    if (!type || !count || !source || !purpose) {
      setError('Please fill all fields.')
      return
    }
    saveItem({ type, count, source, purpose: { purpose, other } })
    updateTabularInputDisplay(false)
  }

  const select = (
    key: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: { label: string; value: string }[]
  ) => (
    <div className={rowClassName}>
      <Label htmlFor={`${id}-${key}`}>{label}</Label>
      <Select<string>
        items={options}
        value={value || null}
        onValueChange={(next) => onChange(next ?? '')}>
        <SelectTrigger id={`${id}-${key}`} className='max-w-60'>
          <SelectValue placeholder={label.toLowerCase()} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  const input = (key: string, label: string, value: string, onChange: (value: string) => void) => (
    <div className={rowClassName}>
      <Label htmlFor={`${id}-${key}`}>{label}</Label>
      <Input
        id={`${id}-${key}`}
        className='max-w-60'
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )

  return (
    <div className='mt-8 flex w-full flex-col'>
      {input('type', 'Species name', type, setType)}
      {input('count', 'Number', count, setCount)}
      {select('source', 'Source', source, setSource, sourceSelectOptions)}
      {select('purpose', 'Purpose', purpose, setPurpose, purposeSelectOptions)}
      {purpose === 'Other' ? input('other', 'Other purpose', other, setOther) : null}
      {error ? <ErrorText className='mt-2'>{error}</ErrorText> : null}
      <TabularButtons handleSave={handleSave} cancelItem={() => updateTabularInputDisplay(false)} />
    </div>
  )
}

export default AddMangroveAssociatedSpeciesRow
export type { AddMangroveAssociatedSpeciesRowProps, MangroveAssociatedSpecies }
