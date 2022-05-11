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
  marginbottom: '0.5em';
`
SectionFormTitle.defaultProps = { variant: 'h4' }
