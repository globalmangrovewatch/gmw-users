import React from 'react'
import { ContentWrapper } from '../styles/containers'
import { PageTitle } from '../styles/typography'
import language from '../language'

const PageNotFound = () => {
  return (
    <ContentWrapper>
      <PageTitle>{language.pages.pageNotFound.title}</PageTitle>
    </ContentWrapper>
  )
}

export default PageNotFound
