import type { ComponentProps } from 'react'
import { LuPencil } from 'react-icons/lu'

import { LinkLooksLikeButtonSecondary } from '@/components/ui/typography'
import language from '@/language'

function EditLink(props: Omit<ComponentProps<typeof LinkLooksLikeButtonSecondary>, 'children'>) {
  return (
    <LinkLooksLikeButtonSecondary {...props}>
      <LuPencil className='size-4' aria-hidden='true' /> {language.buttons.edit}
    </LinkLooksLikeButtonSecondary>
  )
}

export default EditLink
