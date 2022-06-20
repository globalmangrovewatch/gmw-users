import { Button } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import language from '../language'

const ButtonPrimary = styled(Button)``
ButtonPrimary.defaultProps = { variant: 'contained' }

const ButtonSecondary = styled(Button)``
ButtonSecondary.defaultProps = { variant: 'outlined' }

const ButtonSubmit = ({ isSubmitting }) => {
  return (
    <Button sx={{ marginTop: '1em' }} variant='contained' type='submit' disabled={isSubmitting}>
      {isSubmitting ? language.buttons.submitting : language.buttons.submit}
    </Button>
  )
}

ButtonSubmit.propTypes = {
  isSubmitting: PropTypes.bool.isRequired
}

const ButtonCancel = (props) => (
  <ButtonSecondary {...props}>{language.buttons.cancel}</ButtonSecondary>
)

export { ButtonPrimary, ButtonSubmit, ButtonSecondary, ButtonCancel }
