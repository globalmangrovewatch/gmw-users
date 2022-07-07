import React from 'react'

import { ContentWrapper } from '../styles/containers'
import {
  //   StickyFormLabel,
  FormPageHeader,
  //   FormQuestionDiv,
  SectionFormTitle
  //   Form
} from '../styles/forms'
import { Link } from '../styles/typography'
import language from '../language'

function SiteInterventionsForm() {
  return (
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>Site Interventions</SectionFormTitle>
        <Link to={-1}>&larr; {language.form.navigateBackToSiteOverview}</Link>
      </FormPageHeader>
    </ContentWrapper>
  )
}

export default SiteInterventionsForm
