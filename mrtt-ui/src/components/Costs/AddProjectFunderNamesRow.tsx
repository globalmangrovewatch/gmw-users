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
import { costs as questions } from '@/data/questions'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

type ProjectFunder = { funderName: string; funderType: string; percentage: string }

type AddProjectFunderNamesRowProps = {
  saveItem: (item: ProjectFunder) => void
  /** Hides this row (on save and on cancel). */
  updateTabularInputDisplay: (isShown: boolean) => void
}

const funderTypeOptions = getOptionsValuesAndLabels(questions.projectFunderNames.options)

const rowClassName = 'mt-4 flex items-baseline justify-between gap-10'

/** A new 7.3 row: funder name, type and percentage, all required. */
function AddProjectFunderNamesRow({
  saveItem,
  updateTabularInputDisplay
}: AddProjectFunderNamesRowProps) {
  const id = useId()
  const [funderName, setFunderName] = useState('')
  const [funderType, setFunderType] = useState('')
  const [percentage, setPercentage] = useState('')
  const [error, setError] = useState<string>()

  const handleSave = () => {
    if (!funderName || !funderType || !percentage) {
      setError('Please fill all fields.')
      return
    }
    saveItem({ funderName, funderType, percentage })
    updateTabularInputDisplay(false)
  }

  return (
    <div className='mt-8 flex w-full flex-col'>
      <div className={rowClassName}>
        <Label htmlFor={`${id}-name`}>Funder Name</Label>
        <Input
          id={`${id}-name`}
          className='max-w-60'
          placeholder='name'
          value={funderName}
          onChange={(event) => setFunderName(event.target.value)}
        />
      </div>
      <div className={rowClassName}>
        <Label htmlFor={`${id}-type`}>Funder Type</Label>
        <Select<string>
          items={funderTypeOptions}
          value={funderType || null}
          onValueChange={(next) => setFunderType(next ?? '')}>
          <SelectTrigger id={`${id}-type`} className='max-w-60'>
            <SelectValue placeholder='type' />
          </SelectTrigger>
          <SelectContent>
            {funderTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className={rowClassName}>
        <Label htmlFor={`${id}-percentage`}>Percentage</Label>
        <Input
          id={`${id}-percentage`}
          className='max-w-60'
          placeholder='%'
          inputMode='decimal'
          value={percentage}
          onChange={(event) => setPercentage(event.target.value)}
        />
      </div>
      {error ? <ErrorText className='mt-2'>{error}</ErrorText> : null}
      <TabularButtons handleSave={handleSave} cancelItem={() => updateTabularInputDisplay(false)} />
    </div>
  )
}

export default AddProjectFunderNamesRow
export type { AddProjectFunderNamesRowProps, ProjectFunder }
