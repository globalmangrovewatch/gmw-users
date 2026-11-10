'use client'

import type { ComponentProps } from 'react'

import HeaderMenu from '@/components/Header/HeaderMenu'
import { cn } from '@/lib/cn'

type HeaderProps = Omit<ComponentProps<'header'>, 'children'> & {
  /** The landing pages draw their own header inside the page. */
  isLanding?: boolean
}

function Header({ isLanding = false, className, ...props }: HeaderProps) {
  if (isLanding) {
    return <div className='flex items-center justify-between' />
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-3 flex h-header w-screen items-center justify-between bg-secondary text-white',
        className
      )}
      {...props}>
      <img src='/images/gmw-logo.svg' alt='Global Mangrove Watch' className='h-full w-auto' />
      <HeaderMenu />
    </header>
  )
}

export default Header
