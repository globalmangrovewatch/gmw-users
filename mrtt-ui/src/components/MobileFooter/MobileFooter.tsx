'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import type { IconType } from 'react-icons'
import { LuGlobe, LuMap, LuUsers } from 'react-icons/lu'

import { cn } from '@/lib/cn'

const links: { href: string; label: string; Icon: IconType }[] = [
  { href: '/sites', label: 'Sites', Icon: LuMap },
  { href: '/landscapes', label: 'Landscapes', Icon: LuGlobe },
  { href: '/organizations', label: 'Organizations', Icon: LuUsers }
]

/** Main navigation: a bottom bar on mobile, a left sidebar from 599px up. */
function MobileFooter({ className, ...props }: Omit<ComponentProps<'footer'>, 'children'>) {
  const pathname = usePathname()

  return (
    <footer
      className={cn(
        'fixed bottom-0 z-2 flex w-full justify-around border-t border-[#009b93] bg-white py-0.5 uppercase min-[599px]:top-header min-[599px]:left-0 min-[599px]:w-nav min-[599px]:flex-col min-[599px]:justify-start min-[599px]:border-t-0 min-[599px]:border-r',
        className
      )}
      {...props}>
      <nav aria-label='Main' className='contents'>
        {links.map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center no-underline hover:text-brand-hover min-[599px]:flex-row min-[599px]:gap-2.5 min-[599px]:px-2.5 min-[599px]:py-1.25',
                isActive ? 'text-[#009b93]' : 'text-text'
              )}>
              <Icon className='size-6' aria-hidden='true' />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}

export default MobileFooter
