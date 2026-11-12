'use client'

import type { ComponentProps } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/cn'

const USER_GUIDE_URL = 'https://tnc.app.box.com/s/pspea7mm2m2uldrqvhahmvp9dck6mc06'

type AboutDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

function AboutParagraph({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('pb-5 text-md tracking-[1px] text-grey-400', className)} {...props} />
}

/** What the MRTT is for, opened from the landing header. */
function AboutDialog({ isOpen, setIsOpen }: AboutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='max-w-100'>
        <DialogHeader>
          <DialogTitle className='pr-8'>
            About the Mangrove Restoration Tracker Tool (MRTT)
          </DialogTitle>
        </DialogHeader>
        <div>
          <AboutParagraph>
            The MRTT is an open-access resource to support restoration practitioners. It provides a
            secure location to hold information across restoration planning, intervention and
            monitoring.
          </AboutParagraph>
          <AboutParagraph>
            Users are guided into recording key variables and supported to use a common language and
            definitions, helping to improve data coverage and consistency in restoration work
            world-wide.
          </AboutParagraph>
          <AboutParagraph>
            Once you’ve registered and logged into the MRTT, the portal will provide a series of
            questions to record information through the lifetime of a mangrove restoration project,
            covering:
          </AboutParagraph>
          <ol className='list-decimal px-5 py-3.75 text-md tracking-[1px] text-grey-400'>
            <li className='pb-2.5'>Site background and pre-restoration baseline.</li>
            <li className='pb-2.5'>The restoration interventions and project costs.</li>
            <li className='pb-2.5'>
              Post-restoration monitoring that incorporates both socio-economic and ecological
              factors.
            </li>
          </ol>
          <AboutParagraph>
            The MRTT can record both historical and current restoration projects.
          </AboutParagraph>
          <AboutParagraph>
            For support on how to enter data into the MRTT please see the{' '}
            <a
              href={USER_GUIDE_URL}
              rel='noreferrer'
              target='_blank'
              className='text-[#009b93] hover:text-brand-hover'>
              user guide
            </a>{' '}
            (also available in English, French, Spanish, Bahasa Indonesia, Portuguese, Swahili, and
            Arabic), which provides step-by-step instructions. The user guide also describes the
            different question types and provides an overview of each question.
          </AboutParagraph>
          <AboutParagraph className='pb-0'>
            For questions and potential training opportunities please email:{' '}
            <span className='text-[#009b93]'>contact@globalmangrovewatch.org</span>
          </AboutParagraph>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { USER_GUIDE_URL }
export default AboutDialog
