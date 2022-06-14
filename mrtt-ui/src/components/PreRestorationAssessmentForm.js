import React from 'react'
import { FormLabel } from '@mui/material'

import {
  Form,
  FormQuestionDiv,
  MainFormDiv,
  //   NestedFormSectionDiv,
  SectionFormTitle
  //   SubTitle,
  //   SubTitle2
} from '../styles/forms'
// import { questionMapping } from '../data/questionMapping'
import { preRestorationAssessment } from '../data/questions'

function PreRestorationAssessmentForm() {
  return (
    <MainFormDiv>
      <SectionFormTitle>Pre-restoration Assessment</SectionFormTitle>
      <Form>
        <FormQuestionDiv>
          <FormLabel>{preRestorationAssessment.mangrovesPreviouslyOccured.question}</FormLabel>
        </FormQuestionDiv>
      </Form>
    </MainFormDiv>
  )
}

export default PreRestorationAssessmentForm
