import { FormLabel } from '@mui/material'
import { styled } from '@mui/material/styles'
import themeMui from './themeMui'
import theme from '../styles/theme'

export const FormPageHeader = styled('div')`
  padding: ${themeMui.spacing(2)};
`
export const MainFormDiv = styled('div')`
  display: flex;
  flex-direction: column;
`

export const SectionFormTitle = styled('h1')`
  font-weight: 400;
  margin-bottom: 0;
`
export const FormQuestionDiv = styled('div')`
  padding: ${themeMui.spacing(3)};
  display: flex;
  flex-direction: column;
  z-index: 1;
  background: ${theme.color.rowEven};
  &:nth-of-type(odd) {
    background: ${theme.color.rowOdd};
  }
`
export const StickyFormLabel = styled(FormLabel)`
  position: sticky;
  top: ${theme.layout.headerHeight};
  background: inherit;
  padding-block: ${themeMui.spacing(3)};
  font-weight: 700;
  z-index: 2;
  border-bottom: solid 1px ${theme.color.primary};
`

export const Form = styled('form')`
  display: flex;
  flex-direction: column;
  padding-bottom: ${theme.layout.footerHeight};
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    padding-bottom: 0;
  }
`

export const SubTitle = styled('label')`
  text-transform: uppercase;
  font-weight: 700;
`
export const SubTitle2 = styled('label')`
  margin-top: 0.75em;
  text-transform: uppercase;
`
export const NestedQuestion = styled('div')`
  padding: ${themeMui.spacing(1)};
  padding-left: ${themeMui.spacing(2)};
`
