'use client'

import { useState } from 'react'
import { LuTrash2 } from 'react-icons/lu'

import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'

type PhysicalMeasurementRowProps = {
  index: number
  /** The measurement type, e.g. "Tidal range (cm)". */
  label: string
  onDelete: (index: number) => void
}

/** One row of 5.3g: its value, plus a delete button that asks first. */
function PhysicalMeasurementRow({ index, label, onDelete }: PhysicalMeasurementRowProps) {
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  return (
    <div className='mt-8 flex items-end gap-2'>
      <FormInput<RegistrationFormValues, `physicalMeasurementsTaken.${number}.measurementValue`>
        name={`physicalMeasurementsTaken.${index}.measurementValue`}
        label={label}
        placeholder='value'
        className='max-w-60'
      />
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='bg-transparent'
        aria-label={`${language.form.tabularDeletePrompt.title}${label}`}
        onClick={() => setIsDeleteConfirmPromptOpen(true)}>
        <LuTrash2 className='size-5' aria-hidden='true' />
      </Button>
      <ConfirmPrompt
        isOpen={isDeleteConfirmPromptOpen}
        setIsOpen={setIsDeleteConfirmPromptOpen}
        title={`${language.form.tabularDeletePrompt.title}${label}`}
        promptText={language.form.tabularDeletePrompt.promptText}
        confirmButtonText={language.form.tabularDeletePrompt.buttonText}
        onConfirm={() => {
          onDelete(index)
          setIsDeleteConfirmPromptOpen(false)
        }}
      />
    </div>
  )
}

export default PhysicalMeasurementRow
export type { PhysicalMeasurementRowProps }
