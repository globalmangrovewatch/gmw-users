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
    }
  }
})

export default theme
