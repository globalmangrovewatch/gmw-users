import type { ComponentProps, ElementType } from 'react'

import { Button } from '@/components/ui/button'
import language from '@/language'

type ButtonSaveProps = Omit<ComponentProps<'button'>, 'children'> & {
  isSaving: boolean
  /** Render with another button component instead of ui/Button. */
  component?: ElementType
}

function ButtonSave({ isSaving, component: Component = Button, ...props }: ButtonSaveProps) {
  return (
    <Component disabled={isSaving} {...props}>
      {isSaving ? language.buttons.saving : language.buttons.save}
    </Component>
  )
}

export default ButtonSave
