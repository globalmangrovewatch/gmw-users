'use client'

import { useState, type ComponentProps } from 'react'

import AboutDialog, { USER_GUIDE_URL } from '@/components/about'
import ContactForm from '@/components/contact'
import LanguagePicker from '@/components/language-selector'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/cn'

type LandingMenuProps = {
  onAboutClick: () => void
  onContactClick: () => void
  /** Classes for each item (button or link). */
  itemClassName: string
}

/** About, contact, user guide and privacy notice, shared by the desktop bar and mobile menu. */
function LandingMenuItems({ onAboutClick, onContactClick, itemClassName }: LandingMenuProps) {
  const buttonClassName = cn(itemClassName, 'cursor-pointer border-0 bg-transparent text-left')

  return (
    <>
      <button type='button' onClick={onAboutClick} className={buttonClassName}>
        About
      </button>
      <button type='button' onClick={onContactClick} className={buttonClassName}>
        Contact us
      </button>
      <a href={USER_GUIDE_URL} rel='noreferrer' target='_blank' className={itemClassName}>
        User guide
      </a>
      <a href='/privacy-notice.pdf' download className={itemClassName}>
        Privacy Notice
      </a>
    </>
  )
}

/** Props go to the <header>. */
type LandingHeaderProps = Omit<ComponentProps<'header'>, 'children'>

/**
 * The login page's header: the GMW logo, then the menu as a row from md (768px) up, or behind a
 * burger button that opens a full-screen menu below that.
 */
function LandingHeader({ className, ...props }: LandingHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  // From the mobile menu, swap the menu for the dialog.
  const openAbout = () => {
    setIsMenuOpen(false)
    setIsAboutOpen(true)
  }
  const openContact = () => {
    setIsMenuOpen(false)
    setIsContactOpen(true)
  }

  return (
    <header
      className={cn(
        'absolute top-0 left-0 z-10 flex w-full justify-center lg:z-20 lg:h-25',
        className
      )}
      {...props}>
      <div className='absolute top-0 left-0 z-10' draggable='false'>
        <a href='https://www.globalmangrovewatch.org/' target='_blank' rel='noreferrer'>
          <img
            src='/images/landing/logo.webp'
            alt='Global Mangrove Watch'
            className='h-auto w-[55%] shrink-0 lg:w-[281px]'
          />
        </a>
      </div>

      <nav
        aria-label='Main'
        className='absolute top-2.5 right-2.5 z-10 hidden items-center gap-5 md:flex'>
        <LandingMenuItems
          onAboutClick={openAbout}
          onContactClick={openContact}
          itemClassName='flex rounded px-2 py-1.5 text-md capitalize text-white no-underline hover:bg-brand-800/5 hover:text-brand-hover min-[1025px]:text-[#0f2b3b]'
        />
        <LanguagePicker />
      </nav>

      <button
        type='button'
        aria-label='Menu'
        onClick={() => setIsMenuOpen(true)}
        className='absolute top-4 right-4 z-1000 flex size-13.5 cursor-pointer flex-col justify-center rounded-full border-0 bg-brand-800 px-3 shadow-[0px_4px_12px_0px_#003C3926] md:hidden'>
        <span className='my-1 h-0.5 w-full rounded-xs bg-white' />
        <span className='my-1 h-0.5 w-full rounded-xs bg-white' />
      </button>
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className='inset-0 top-0 left-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none bg-[#009b93] pt-14'>
          <DialogTitle className='sr-only'>Menu</DialogTitle>
          <nav aria-label='Main' className='flex flex-col items-start gap-2.5'>
            <LandingMenuItems
              onAboutClick={openAbout}
              onContactClick={openContact}
              itemClassName='p-0 text-2xl font-semibold text-white no-underline hover:text-brand-hover'
            />
          </nav>
          <div className='absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 justify-center'>
            <LanguagePicker />
          </div>
        </DialogContent>
      </Dialog>

      <AboutDialog isOpen={isAboutOpen} setIsOpen={setIsAboutOpen} />
      <ContactForm isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </header>
  )
}

export default LandingHeader
