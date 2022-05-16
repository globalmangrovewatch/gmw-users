import { Button } from '@mui/material'
import PropTypes from 'prop-types'

const ButtonSubmit = ({ isSubmitting }) => {
  return (
    <Button sx={{ marginTop: '1em' }} variant='contained' type='submit' disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  )
}

ButtonSubmit.propTypes = {
  isSubmitting: PropTypes.bool.isRequired
}

export default ButtonSubmit
