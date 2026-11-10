import { TabularButtonsDiv } from '@/components/form/layout'
import { Button } from '@/components/ui/button'
import language from '@/language'

type TabularButtonsProps = {
  handleSave: () => void
  cancelItem: () => void
}

/** Save / Cancel for a row being added in a tabular question. */
function TabularButtons({ handleSave, cancelItem }: TabularButtonsProps) {
  return (
    <TabularButtonsDiv className='gap-4'>
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
