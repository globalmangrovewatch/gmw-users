'use client'

import type { ComponentProps } from 'react'

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

type ConfirmPromptProps = Omit<
  ComponentProps<typeof AlertDialog>,
  'open' | 'onOpenChange' | 'children'
> & {
  title: string
  promptText: string
  confirmButtonText: string
  // `isOpen` / `setIsOpen` instead of AlertDialog's open / onOpenChange: the JS forms use these.
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
  onConfirm,
  ...props
}: ConfirmPromptProps) {
  return (
    <AlertDialog {...props} open={isOpen} onOpenChange={setIsOpen}>
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
