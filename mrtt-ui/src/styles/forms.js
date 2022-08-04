import { FormLabel } from '@mui/material'
import { styled } from '@mui/material/styles'
import themeMui from './themeMui'
import theme from '../styles/theme'

export const FormPageHeader = styled('div')`
  padding: ${themeMui.spacing(2)} 0;
`
export const MainFormDiv = styled('div')`
  display: flex;
  flex-direction: column;
`

export const FormQuestionDiv = styled('div')`
  padding: ${themeMui.spacing(3)};
  display: flex;
  flex-direction: column;
  background: ${theme.color.rowEven};
  &:nth-of-type(odd) {
    background: ${theme.color.rowOdd};
  }
`
export const StickyFormLabel = styled(FormLabel)`
  position: sticky;
  top: calc(${theme.layout.headerHeight} + ${theme.layout.sectionNavHeight});
  background: inherit;
  padding-block: ${themeMui.spacing(3)};
  font-weight: 700;
  z-index: 2;
  border-bottom: solid 1px ${theme.color.primary};
  @media (max-width: ${theme.layout.mediaQueryDesktop}) {
    top: ${theme.layout.headerHeight};
  }
`

export const Form = styled('form')`
  display: flex;
  flex-direction: column;
  padding-bottom: ${theme.layout.footerHeight};
  gap: ${themeMui.spacing(3)};
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    padding-bottom: 0;
  }
`
export const RequiredIndicator = styled('span')`
  color: ${theme.form.requiredIndicatorColor};
  padding: 0 ${themeMui.spacing(1)};
`
export const NestedLabel1 = styled('label')`
  text-transform: uppercase;
  font-weight: 700;
`
export const NestedLabel2 = styled('label')`
  margin-top: 0.75em;
  text-transform: uppercase;
`
export const NestedQuestion = styled('div')`
  padding: ${themeMui.spacing(1)};
  padding-left: ${themeMui.spacing(2)};
`
export const TabularInputSection = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-top: 1em;
  justify-content: space-between;
`

export const TabularLabel = styled('label')`
  margin-right: 2.5em;
`

export const SelectedInputSection = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`

export const QuestionSubSection = styled('div')`
  margin-top: 1em;
`

export const TabularButtonsDiv = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5em;
`

export const TabularSectionDiv = styled('div')`
  margin-top: 2em;
`
export const HorizontalTabularBox = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const VerticalTabularBox = styled('div')`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`
