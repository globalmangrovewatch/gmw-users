'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ComponentProps } from 'react'
import { LuX } from 'react-icons/lu'

import { cn } from '@/lib/cn'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-brand-600/70 bg-blend-multiply data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 md:bg-black/15',
        className
      )}
      {...props}
    />
  )
}

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  /** Render the top-right close button. */
  showClose?: boolean
}

function DialogContent({ className, children, showClose = true, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-135 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-3xl bg-white p-6 text-text shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:p-8',
          className
        )}
        {...props}>
        {children}
        {showClose && (
          <DialogPrimitive.Close
            data-slot='dialog-close'
            aria-label='Close dialog'
            className='absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-text hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:outline-none'>
            <LuX className='size-5' aria-hidden='true' />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-header'
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-footer'
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn('text-lg font-semibold text-brand-900', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn('text-sm text-black/60', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
}
