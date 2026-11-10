'use client'

import { useRouter } from 'next/navigation'
import { useState, type ComponentProps } from 'react'
import { LuMenu } from 'react-icons/lu'

import ContactForm from '@/components/contact'
import LanguagePicker from '@/components/language-selector'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/hooks/useAuth'
import { ssoLogout } from '@/hooks/sso'
import language from '@/language'
import { cn } from '@/lib/cn'

const itemClassName =
  'flex items-start rounded-sm px-1 text-[15px] font-normal capitalize text-text no-underline transition-colors hover:bg-brand-800/5 hover:text-brand-hover min-[1025px]:text-[#0f2b3b]'

/** The header's menu: contact form, user guide, language and logout. */
/** Props go to the menu's popup. */
type HeaderMenuProps = Omit<ComponentProps<typeof PopoverContent>, 'children'>

function HeaderMenu({ className, align = 'end', ...contentProps }: HeaderMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()

  async function handleLogoutOnClick() {
    setIsMenuOpen(false)
    await ssoLogout()
    logout()
    router.push('/auth/login')
  }

  function handleContactUsClick() {
    setIsMenuOpen(false)
    setIsContactOpen(true)
  }

  return (
    <>
      <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <PopoverTrigger
          aria-label='Menu'
          className='mr-2 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none'>
          <LuMenu className='size-6' aria-hidden='true' />
        </PopoverTrigger>
        <PopoverContent
          align={align}
          className={cn('flex w-56 flex-col gap-5 rounded-md p-3.75', className)}
          {...contentProps}>
          <div className='flex flex-col gap-3.75'>
            <button
              type='button'
              onClick={handleContactUsClick}
              className={`${itemClassName} cursor-pointer border-0 bg-transparent p-0 text-left`}>
              Contact us
            </button>
            <a
              href='https://tnc.app.box.com/s/pspea7mm2m2uldrqvhahmvp9dck6mc06'
              rel='noreferrer'
              target='_blank'
              className={itemClassName}>
              User guide
            </a>
            <div className='flex flex-col gap-1.25'>
              <span className={itemClassName}>Language</span>
              <LanguagePicker />
            </div>
          </div>
          <div className='flex flex-col gap-1.25'>
            <span className={itemClassName}>Profile Placeholder</span>
            <div>
              <Button variant='outline' onClick={handleLogoutOnClick}>
                {language.header.logout}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {/* Outside the popover, so the dialog stays open after the menu closes. */}
      <ContactForm isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </>
  )
}

export default HeaderMenu
