import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#009B93'
    },
    secondary: {
      main: '#02B1A8'
    }
  },
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
            fontSize: '0.8rem'
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#000',
          marginBottom: '0.5em'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#000'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginTop: '1em'
        }
      }
    }
  }
})

export default theme
