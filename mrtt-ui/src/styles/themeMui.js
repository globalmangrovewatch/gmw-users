import { createTheme } from '@mui/material/styles'
import theme from './theme'

const themeMui = createTheme({
  typography: {
    fontFamily: theme.typography.fontStack.join(','),
    htmlFontSize: 10,
    'text-sm': {
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '21px',
      fontFeatureSettings: "'liga' off, 'clig' off"
    },
    'text-sm-semibold': {
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '21px',
      fontFeatureSettings: "'liga' off, 'clig' off"
    }
  },
  palette: {
    primary: {
      main: '#00857f'
    },
    secondary: {
      main: theme.color.secondary
    },
    error: {
      main: '#D00000'
    },
    common: {
      white: '#ffffff',
      beige: '#EFEEEE'
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
