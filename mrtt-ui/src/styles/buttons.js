import { Button } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import ButtonSecondaryWithLoader from '../components/ButtonSecondaryWithLoader'
import language from '../language'
import theme from './theme'

const ButtonPrimary = styled(Button)``
ButtonPrimary.defaultProps = { variant: 'contained' }

const ButtonSecondary = styled(Button)``
ButtonSecondary.defaultProps = { variant: 'outlined' }

const ButtonSubmit = ({ isSubmitting }) => {
  return (
    <Button variant='contained' type='submit' disabled={isSubmitting}>
      {isSubmitting ? language.buttons.submitting : language.buttons.submit}
    </Button>
  )
}

const ButtonCaution = styled(ButtonSecondaryWithLoader)`
  background-color: ${theme.color.red};
  &:hover {
    background-color: ${theme.color.lightRed};
  }
`
ButtonSubmit.propTypes = {
  isSubmitting: PropTypes.bool.isRequired
}

const ButtonCancel = (props) => (
  <ButtonSecondary {...props}>{language.buttons.cancel}</ButtonSecondary>
)

export { ButtonPrimary, ButtonSubmit, ButtonSecondary, ButtonCancel, ButtonCaution }
