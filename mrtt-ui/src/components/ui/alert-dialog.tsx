'use client'

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import type { ComponentProps } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

function AlertDialogOverlay({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Backdrop>) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot='alert-dialog-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/30 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0',
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Popup>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot='alert-dialog-content'
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-3xl bg-white p-6 text-text shadow-lg duration-200 outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-header'
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function AlertDialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-footer'
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot='alert-dialog-title'
      className={cn('text-lg font-semibold text-brand-900', className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot='alert-dialog-description'
      className={cn('text-sm text-black/60', className)}
      {...props}
    />
  )
}

// Base UI has a single Close part: Action runs its onClick and then closes, like Radix's Action.
function AlertDialogAction({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Close>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot='alert-dialog-action'
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Close>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot='alert-dialog-cancel'
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
}
