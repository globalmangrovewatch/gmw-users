'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import language from '@/language'

type ConfirmPromptProps = {
  title: string
  promptText: string
  confirmButtonText: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onConfirm: () => void
}

/** Confirmation dialog for destructive actions (e.g. deleting a form or a row). */
function ConfirmPrompt({
  title,
  promptText,
  confirmButtonText,
  isOpen,
  setIsOpen,
  onConfirm
}: ConfirmPromptProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{promptText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{language.buttons.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmButtonText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmPrompt
