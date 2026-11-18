'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import ButtonDeleteForm from '@/components/ButtonDeleteForm'
import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import { toast } from '@/components/ui/toast'
import language from '@/language'
import { useDeleteMonitor } from '@/queries/sites'

type DeleteMonitoringFormProps = {
  siteId: string
  monitoringFormId: string
}

/** Delete button of a saved monitoring form: asks first, then goes back to the site overview. */
function DeleteMonitoringForm({ siteId, monitoringFormId }: DeleteMonitoringFormProps) {
  const router = useRouter()
  const deleteMonitor = useDeleteMonitor(siteId)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleConfirm = () => {
    deleteMonitor.mutate(monitoringFormId, {
      onSuccess: () => {
        toast.success(language.success.getDeleteThingSuccessMessage('That form'))
        router.push(`/sites/${siteId}/overview`)
      },
      onError: () => toast.error(language.error.delete)
    })
  }

  return (
    <>
      <ButtonDeleteForm
        type='button'
        onClick={() => setIsConfirmOpen(true)}
        isDeleting={deleteMonitor.isPending}
      />
      <ConfirmPrompt
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title={language.form.deletePrompt.title}
        promptText={language.form.deletePrompt.promptText}
        confirmButtonText={language.form.deletePrompt.buttonText}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default DeleteMonitoringForm
export type { DeleteMonitoringFormProps }
