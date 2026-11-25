'use client'

import { useId } from 'react'

import LanguagePicker from '@/components/language-selector'
import { Switch } from '@/components/ui/switch'
import language from '@/language'
import { setTrainingMode, useTrainingMode } from '@/lib/trainingMode'

const labelClassName = 'text-xs leading-6 font-bold tracking-[1px] text-black/85 uppercase'

/** The sidebar's footer: training environment switch and language. Desktop only. */
function SidebarSettings() {
  const isTraining = useTrainingMode()
  const switchId = useId()

  return (
    <div className='hidden w-full flex-col gap-2 min-[599px]:flex'>
      <div className='flex items-center justify-between pr-2 pl-4'>
        <label htmlFor={switchId} className={`${labelClassName} cursor-pointer`}>
          {language.sidebar.trainingEnvironment}
        </label>
        <Switch id={switchId} checked={isTraining} onCheckedChange={setTrainingMode} />
      </div>
      <LanguagePicker
        className={`${labelClassName} h-auto min-w-0 rounded-none border-0 bg-transparent pr-2 pl-4 hover:border-0 focus:shadow-none data-popup-open:shadow-none`}
        icon={
          <span className='flex size-7.5 items-center justify-center rounded-full border-2 border-brand-800/20'>
            <img src='/images/icon-play.svg' alt='' width={12} height={12} />
          </span>
        }
      />
    </div>
  )
}

export default SidebarSettings
