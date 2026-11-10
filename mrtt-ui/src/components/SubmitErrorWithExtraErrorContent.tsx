import type { ReactNode } from 'react'

import language from '@/language'

type SubmitErrorWithExtraErrorContentProps = {
  extraErrorContent?: ReactNode
}

function SubmitErrorWithExtraErrorContent({
  extraErrorContent
}: SubmitErrorWithExtraErrorContentProps) {
  return (
    <>
      <p>{language.error.submit}</p>
      <p>{extraErrorContent}</p>
    </>
  )
}

export default SubmitErrorWithExtraErrorContent
