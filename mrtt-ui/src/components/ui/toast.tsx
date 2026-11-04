'use client'

import type { CSSProperties } from 'react'
import { LuCircleCheck, LuCircleX, LuInfo, LuLoaderCircle, LuTriangleAlert } from 'react-icons/lu'
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner'

const icons: ToasterProps['icons'] = {
  success: <LuCircleCheck className='size-4 text-brand-800' aria-hidden='true' />,
  info: <LuInfo className='size-4 text-brand-800' aria-hidden='true' />,
  warning: <LuTriangleAlert className='size-4 text-danger' aria-hidden='true' />,
  error: <LuCircleX className='size-4 text-error' aria-hidden='true' />,
  loading: <LuLoaderCircle className='size-4 animate-spin text-brand-800' aria-hidden='true' />
}

function Toaster(props: ToasterProps) {
  return (
    // The app has no dark mode: force light so the text colour always matches the white
    // background (GMW-1043 on mangrove-atlas: "system" gave near-white text on white).
    <Sonner
      theme='light'
      className='toaster group font-sans text-sm'
      icons={icons}
      style={
        {
          '--normal-bg': '#ffffff',
          '--normal-text': 'var(--color-brand-900)',
          '--normal-border': 'rgb(0 0 0 / 0.15)',
          '--border-radius': 'var(--radius-xl)'
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster, toast }
