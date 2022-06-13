import { Button } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const ButtonPrimary = styled(Button)``
ButtonPrimary.defaultProps = { variant: 'contained' }

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

export { ButtonPrimary, ButtonSubmit }
