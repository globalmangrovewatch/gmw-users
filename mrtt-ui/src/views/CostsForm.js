import React from 'react'

import { FormPageHeader, SectionFormSubtitle, SectionFormTitle } from '../styles/forms'
import QuestionNav from '../components/QuestionNav'
import useSiteInfo from '../library/useSiteInfo'
import language from '../language'
import { ContentWrapper } from '../styles/containers'

const CostsForm = () => {
  const { site_name } = useSiteInfo()

  return (
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>{language.pages.siteQuestionsOverview.formName.costs}</SectionFormTitle>
        <SectionFormSubtitle>{site_name}</SectionFormSubtitle>
      </FormPageHeader>
      <QuestionNav isSaving={true} isSaveError={true} onSave={() => {}} currentSection='costs' />
      Costs Form Placeholder
    </ContentWrapper>
  )
}

CostsForm.propTypes = {}

export default CostsForm
