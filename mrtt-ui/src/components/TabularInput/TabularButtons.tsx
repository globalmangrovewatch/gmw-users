import type { ComponentProps } from 'react'

import { TabularButtonsDiv } from '@/components/form/layout'
import { Button } from '@/components/ui/button'
import language from '@/language'
import { cn } from '@/lib/cn'

type TabularButtonsProps = Omit<ComponentProps<typeof TabularButtonsDiv>, 'children'> & {
  handleSave: () => void
  cancelItem: () => void
}

/** Save / Cancel for a row being added in a tabular question. */
function TabularButtons({ handleSave, cancelItem, className, ...props }: TabularButtonsProps) {
  return (
    <TabularButtonsDiv className={cn('gap-4', className)} {...props}>
      <Button type='button' variant='outline' onClick={() => handleSave()}>
        {language.buttons.save}
      </Button>
      <Button
        type='button'
        variant='outline'
        className='border-error/50 text-error hover:bg-error/5 hover:text-error'
        onClick={() => cancelItem()}>
        {language.buttons.cancel}
      </Button>
    </TabularButtonsDiv>
  )
}

export default TabularButtons
