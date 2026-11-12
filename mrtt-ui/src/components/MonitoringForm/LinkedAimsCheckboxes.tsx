'use client'

import { useId } from 'react'
import { useFormContext, useWatch, type FieldPath } from 'react-hook-form'

import CheckboxWithLabel from '@/components/form/CheckboxWithLabel'
import type { RegistrationFormValues } from '@/forms/schemas'

type LinkedAimsName =
  | `socioeconomicOutcomes.${number}.linkedAims`
  | `monitoringIndicators.${number}.linkedAims`

type LinkedAimsCheckboxesProps = {
  name: LinkedAimsName & FieldPath<RegistrationFormValues>
  /** The site's aims (3.1 or 3.2) an outcome can be linked to. */
  aims: string[]
}

/** "Link outcome to aims": one checkbox per aim, stored as the list of checked aims. */
function LinkedAimsCheckboxes({ name, aims }: LinkedAimsCheckboxesProps) {
  const labelId = useId()
  const { control, setValue } = useFormContext<RegistrationFormValues>()
  const linkedAims = (useWatch({ control, name }) as string[] | undefined) ?? []

  const toggle = (aim: string, checked: boolean) => {
    const others = linkedAims.filter((linked) => linked !== aim)
    setValue(name, checked ? [...others, aim] : others, { shouldDirty: true })
  }

  return (
    <div>
      <p id={labelId} className='font-semibold'>
        Link outcome to aims
      </p>
      <ul aria-labelledby={labelId} className='m-0 list-none p-0'>
        {aims.map((aim) => (
          <li key={aim} className='px-4'>
            <CheckboxWithLabel
              label={aim}
              checked={linkedAims.includes(aim)}
              onCheckedChange={(checked) => toggle(aim, checked)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LinkedAimsCheckboxes
export type { LinkedAimsCheckboxesProps }
