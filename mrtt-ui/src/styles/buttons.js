import { Button } from '@mui/material'
import { styled } from '@mui/system'

import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import ButtonSecondaryWithLoader from '@/components/ButtonSecondaryWithLoader'
import language from '@/language'
import theme from './theme'

// Defaults are set here, not with `defaultProps`: React 19 ignores those on function components.
const ButtonPrimary = forwardRef(function ButtonPrimary(props, ref) {
  return <Button variant='contained' ref={ref} {...props} />
})

const ButtonSecondary = forwardRef(function ButtonSecondary(props, ref) {
  return <Button variant='outlined' ref={ref} {...props} />
})

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
