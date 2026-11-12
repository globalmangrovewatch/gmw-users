'use client'

import { useState } from 'react'
import { LuTrash2 } from 'react-icons/lu'

import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import { FormInput, FormSelect } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { costs as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'

const funderTypeOptions = getOptionsValuesAndLabels(questions.projectFunderNames.options)

type ProjectFunderNamesRowProps = {
  index: number
  /** The funder's name. */
  label: string
  onDelete: (index: number) => void
}

/** One row of 7.3: the funder's type and percentage, plus a delete button that asks first. */
function ProjectFunderNamesRow({ index, label, onDelete }: ProjectFunderNamesRowProps) {
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)
  const name = `projectFunderNames.${index}` as const

  return (
    <div className='mt-8 flex flex-col gap-3'>
      <div className='flex items-center gap-2'>
        <span className='font-bold'>{label}</span>
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
      <div className='flex flex-wrap items-start gap-3'>
        <FormSelect<RegistrationFormValues, `${typeof name}.funderType`>
          name={`${name}.funderType`}
          label={`${label}: funder type`}
          labelClassName='sr-only'
          placeholder='type'
          options={funderTypeOptions}
          className='w-60'
        />
        <FormInput<RegistrationFormValues, `${typeof name}.percentage`>
          name={`${name}.percentage`}
          label={`${label}: percentage`}
          labelClassName='sr-only'
          placeholder='%'
          inputMode='decimal'
          maxLength={3}
          className='w-28'
        />
      </div>
    </div>
  )
}

export default ProjectFunderNamesRow
export type { ProjectFunderNamesRowProps }
