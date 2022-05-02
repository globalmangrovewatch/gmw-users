import { createTheme } from '@material-ui/core/styles'
// import { black } from '@mui/material/colors'

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#000'
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
