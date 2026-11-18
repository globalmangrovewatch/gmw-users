'use client'

import type { CSSProperties } from 'react'
import { LuLoaderCircle } from 'react-icons/lu'
import { MdCheckCircle, MdClose, MdError, MdInfo, MdWarning } from 'react-icons/md'
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner'

// Filled icons in react-toastify's colours, the toasts the app showed before sonner.
const icons: ToasterProps['icons'] = {
  success: <MdCheckCircle className='size-5 shrink-0 text-[#07bc0c]' aria-hidden='true' />,
  info: <MdInfo className='size-5 shrink-0 text-[#3498db]' aria-hidden='true' />,
  warning: <MdWarning className='size-5 shrink-0 text-[#f1c40f]' aria-hidden='true' />,
  error: <MdError className='size-5 shrink-0 text-[#e74c3c]' aria-hidden='true' />,
  loading: (
    <LuLoaderCircle className='size-5 shrink-0 animate-spin text-brand-800' aria-hidden='true' />
  ),
  close: <MdClose className='size-4' aria-hidden='true' />
}

// `!` beats sonner's own [data-sonner-toast][data-styled] selectors.
const classNames: NonNullable<ToasterProps['toastOptions']>['classNames'] = {
  toast: 'items-center! gap-3! py-4! pr-9! pl-4! shadow-[0_4px_12px_rgb(0_0_0/0.1)]!',
  title: 'text-base! leading-normal! font-normal!',
  icon: 'size-5! m-0!',
  closeButton:
    'top-1.5! right-1.5! left-auto! size-5! transform-none! border-0! bg-transparent! text-black/30! hover:text-black/60!'
}

function Toaster(props: ToasterProps) {
  return (
    // The app has no dark mode: force light so the text colour always matches the white
    // background (GMW-1043 on mangrove-atlas: "system" gave near-white text on white).
    <Sonner
      theme='light'
      className='toaster group font-sans'
      icons={icons}
      toastOptions={{ classNames }}
      style={
        {
          '--normal-bg': '#ffffff',
          '--normal-text': '#757575',
          '--normal-border': 'transparent',
          '--border-radius': '6px'
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster, toast }
