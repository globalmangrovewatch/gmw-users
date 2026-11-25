'use client'

import { useState, type ComponentProps } from 'react'

import AboutDialog, { USER_GUIDE_URL } from '@/components/about'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import language from '@/language'
import { cn } from '@/lib/cn'
import { setTrainingMode, useTrainingMode } from '@/lib/trainingMode'

const dialogLanguage = language.trainingEnvironment.dialog

type TrainingEnvironmentDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

function SectionTitle({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'border-b border-[#009b93] py-3.75 text-base leading-[23px] font-bold text-text',
        className
      )}
      {...props}
    />
  )
}

/**
 * Explains the training environment and lets the user enter or leave it. Opened from the
 * sidebar's training switch, so the mode only changes once the user confirms here.
 */
function TrainingEnvironmentDialog({ isOpen, setIsOpen }: TrainingEnvironmentDialogProps) {
  const isTraining = useTrainingMode()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const handleToggle = () => {
    setTrainingMode(!isTraining)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='max-w-130 gap-2 p-7.5 sm:p-7.5'>
        <DialogTitle className='pr-8 text-3xl leading-[45px] font-normal tracking-[2px] text-text uppercase'>
          {language.trainingEnvironment.title}
        </DialogTitle>

        <div className='relative min-h-0'>
          <div className='flex max-h-89 flex-col gap-2 overflow-y-auto pb-15.5 text-sm leading-[20.02px] text-text'>
            <SectionTitle>{dialogLanguage.purposeTitle}</SectionTitle>
            <DialogDescription className='text-sm leading-[20.02px] text-text'>
              {dialogLanguage.purpose}
            </DialogDescription>

            <SectionTitle>{dialogLanguage.documentationTitle}</SectionTitle>
            <div className='flex flex-col items-start gap-4'>
              <p>
                <strong>{dialogLanguage.userGuidesTitle}</strong> {dialogLanguage.userGuides}
              </p>
              <Button
                variant='outline'
                render={<a href={USER_GUIDE_URL} target='_blank' rel='noreferrer' />}>
                {dialogLanguage.userGuideButton}
              </Button>
              <p>
                <strong>{dialogLanguage.aboutTitle}</strong> {dialogLanguage.about}
              </p>
              <Button variant='outline' onClick={() => setIsAboutOpen(true)}>
                {dialogLanguage.aboutButton}
              </Button>
            </div>
          </div>
          {/* Fades the list out above the button, hinting there is more to scroll. */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 bottom-0 h-15.5 bg-linear-to-t from-white to-white/0'
          />
        </div>

        <Button className='self-start py-3 pr-4 pl-3' onClick={handleToggle}>
          {/* Shows the mode the button switches from; the button itself is the control. */}
          <Switch
            checked={isTraining}
            readOnly
            tabIndex={-1}
            aria-hidden='true'
            className='pointer-events-none border-2 border-white data-checked:bg-white/40 data-unchecked:bg-transparent [&>[data-slot=switch-thumb]]:size-4.5'
          />
          {isTraining ? dialogLanguage.leave : dialogLanguage.access}
        </Button>
        {/* Nested in the popup so Base UI stacks it over this dialog. */}
        <AboutDialog isOpen={isAboutOpen} setIsOpen={setIsAboutOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default TrainingEnvironmentDialog
