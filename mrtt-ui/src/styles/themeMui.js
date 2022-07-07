import { createTheme } from '@mui/material/styles'
import theme from './theme'

const themeMui = createTheme({
  typography: {
    fontFamily: theme.typography.fontStack.join(','),
    htmlFontSize: 10
  },
  palette: {
    primary: {
      main: theme.color.primary
    },
    secondary: {
      main: theme.color.secondary
    }
  },
  spacing: (factor) => `${0.5 * factor}rem`,

  components: {
    MuiDropzoneArea: {
      styleOverrides: {
        root: {
          marginBottom: '1em',
          marginTop: '1em',
          minHeight: '2em'
        },
        text: {
          '&.MuiTypography-h5': {
            fontSize: '1rem'
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: theme.color.text,
          marginBottom: '0.5em'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.color.text
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {}
      }
    }
  }
})

export default themeMui
