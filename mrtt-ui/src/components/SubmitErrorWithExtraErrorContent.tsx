import type { ComponentProps, ReactNode } from 'react'

import language from '@/language'

type SubmitErrorWithExtraErrorContentProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Shown under the generic submit error, e.g. the API's error message. */
  extraErrorContent?: ReactNode
}

function SubmitErrorWithExtraErrorContent({
  extraErrorContent,
  ...props
}: SubmitErrorWithExtraErrorContentProps) {
  return (
    <div {...props}>
      <p>{language.error.submit}</p>
      <p>{extraErrorContent}</p>
    </div>
  )
}

export default SubmitErrorWithExtraErrorContent
