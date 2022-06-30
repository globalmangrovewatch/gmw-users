import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const MainFormDiv = styled('div')`
  display: 'flex',
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 1.5em;
  width: 100%;
  box-sizing: border-box;
`

export const FormQuestionDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1em',
  marginTop: '2em'
}))

export const SectionFormTitle = styled(Typography)`
  margin-bottom: '0.5em';
`
SectionFormTitle.defaultProps = { variant: 'h4' }

export const Form = styled('form')`
  display: flex;
  flex-direction: column;
`

export const SubTitle = styled(Typography)`
  font-weight: bold;
`
export const SubTitle2 = styled(Typography)`
  font-weight: bold;
  margin-top: '0.75em';
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
export const NestedQuestion = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2)
}))

export const SelectedInputSection = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`
