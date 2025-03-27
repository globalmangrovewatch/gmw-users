import { styled } from '@mui/material/styles'
import { Button as ButtonBase } from '@mui/base'

const Button = styled(ButtonBase)(({ theme }) => ({
  textTransform: 'none',
  padding: '8px 16px',
  fontWeight: 600,
  fontStyle: 'normal',
  fontSize: '14px',
  lineHeight: '20px',
  display: 'flex',
  width: '100%',
  minHeight: '36px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '100px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.beige,
  border: 'none',
  cursor: 'pointer',

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  },

  '&:focus-visible': {
    outline: '2px solid',
    outlineOffset: '2px',
    outlineColor: theme.palette.primary.main
  }
}))

export { Button }
