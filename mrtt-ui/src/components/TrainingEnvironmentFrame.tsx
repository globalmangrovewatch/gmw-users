'use client'

import type { ComponentProps } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import language from '@/language'
import { cn } from '@/lib/cn'
import { useTrainingMode } from '@/lib/trainingMode'

const pageLanguage = language.trainingEnvironment

/**
 * In training mode, frames the app in yellow with a "Training environment" banner, so it
 * can't be mistaken for the real one. Otherwise renders its children as they are.
 */
function TrainingEnvironmentFrame({ children, className, ...props }: ComponentProps<'div'>) {
  const isTraining = useTrainingMode()

  if (!isTraining) return children

  return (
    <div
      className={cn('fixed inset-0 flex flex-col items-center gap-2 bg-[#d7d367] p-2', className)}
      {...props}>
      <Popover>
        <PopoverTrigger className='flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[13px] font-bold text-black/85 uppercase'>
          {pageLanguage.title}
          <span className='flex size-7.5 items-center justify-center rounded-full border-2 border-[rgba(0,60,57,0.15)]'>
            <img src='/images/icon-info.svg' alt='' width={20} height={20} />
          </span>
        </PopoverTrigger>
        <PopoverContent className='max-w-xs p-3 text-sm'>{pageLanguage.description}</PopoverContent>
      </Popover>
      {/* The transform makes this card the containing block of the app's fixed header and
          sidebar, so they sit inside the frame instead of over it. */}
      <div className='relative w-full flex-1 transform-gpu overflow-hidden rounded-2xl bg-white'>
        <div className='h-full overflow-y-auto'>{children}</div>
      </div>
    </div>
  )
}

export default TrainingEnvironmentFrame
