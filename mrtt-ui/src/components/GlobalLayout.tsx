'use client'

import type { ComponentProps } from 'react'

import Header from '@/components/Header/Header'
import MobileFooter from '@/components/MobileFooter/MobileFooter'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

type GlobalLayoutProps = ComponentProps<'div'> & {
  /** Set by the login pages' layout, which use the landing design. */
  isLanding?: boolean
}

function GlobalLayout({ children, isLanding = false, className, ...props }: GlobalLayoutProps) {
  const { isLoggedIn } = useAuth()

  if (isLanding) {
    return (
      <main>
        <Header isLanding />
        {children}
      </main>
    )
  }

  return (
    // The nav sits on the left from 599px (theme.layout.mediaQueryDesktop) up.
    <div className={cn('flex flex-col min-[599px]:ml-nav', className)} {...props}>
      <Header />
      <main className='mt-header mb-5'>{children}</main>
      {isLoggedIn && <MobileFooter />}
    </div>
  )
}

export default GlobalLayout
