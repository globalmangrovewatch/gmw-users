'use client'

import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { LuTrash2 } from 'react-icons/lu'

import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import { FormInput, FormSelect } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { purposeOptions, sourceOptions } from '@/data/siteInterventionOptions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

const sourceSelectOptions = getOptionsValuesAndLabels(sourceOptions)
const purposeSelectOptions = getOptionsValuesAndLabels(purposeOptions)

type MangroveAssociatedSpeciesRowProps = {
  index: number
  /** The species name. */
  type: string
  onDelete: (index: number) => void
}

/** One row of 6.4: count, source and purpose of an associated species, plus delete. */
function MangroveAssociatedSpeciesRow({
  index,
  type,
  onDelete
}: MangroveAssociatedSpeciesRowProps) {
  const { control } = useFormContext<RegistrationFormValues>()
  const purpose = useWatch({ control, name: `mangroveAssociatedSpecies.${index}.purpose.purpose` })
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)
  const name = `mangroveAssociatedSpecies.${index}` as const

  return (
    <div className='mt-8 flex flex-col gap-3'>
      <div className='flex items-center gap-2'>
        <span className='font-bold'>{type}</span>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='bg-transparent'
          aria-label={`${language.form.tabularDeletePrompt.title}${type}`}
          onClick={() => setIsDeleteConfirmPromptOpen(true)}>
          <LuTrash2 className='size-5' aria-hidden='true' />
        </Button>
        <ConfirmPrompt
          isOpen={isDeleteConfirmPromptOpen}
          setIsOpen={setIsDeleteConfirmPromptOpen}
          title={`${language.form.tabularDeletePrompt.title}${type}`}
          promptText={language.form.tabularDeletePrompt.promptText}
          confirmButtonText={language.form.tabularDeletePrompt.buttonText}
          onConfirm={() => {
            onDelete(index)
            setIsDeleteConfirmPromptOpen(false)
          }}
        />
      </div>
      <FormInput<RegistrationFormValues, `${typeof name}.count`>
        name={`${name}.count`}
        label='Count'
        inputMode='numeric'
        className='max-w-60'
      />
      <FormSelect<RegistrationFormValues, `${typeof name}.source`>
        name={`${name}.source`}
        label='Source'
        options={sourceSelectOptions}
        className='max-w-60'
      />
      <FormSelect<RegistrationFormValues, `${typeof name}.purpose.purpose`>
        name={`${name}.purpose.purpose`}
        label='Purpose'
        options={purposeSelectOptions}
        className='max-w-60'
      />
      {purpose === 'Other' ? (
        <FormInput<RegistrationFormValues, `${typeof name}.purpose.other`>
          name={`${name}.purpose.other`}
          label='Other purpose'
          className='max-w-60'
        />
      ) : null}
    </div>
  )
}

export default MangroveAssociatedSpeciesRow
export type { MangroveAssociatedSpeciesRowProps }
