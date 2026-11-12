'use client'

import { ContentWrapper } from '@/components/ui/layout'
import { PageTitle } from '@/components/ui/typography'
import language from '@/language'

function PageNotFound() {
  return (
    <ContentWrapper>
      <PageTitle>{language.pages.pageNotFound.title}</PageTitle>
    </ContentWrapper>
  )
}

export default PageNotFound
