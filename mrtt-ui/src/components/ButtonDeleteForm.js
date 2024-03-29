import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import language from '../language'
import themeMui from '../styles/themeMui'
import { ButtonCaution } from '../styles/buttons'

const StyledButton = styled(ButtonCaution)`
  margin-top: ${themeMui.spacing(3)};
`

const ButtonDeleteForm = ({ isDeleting, ...restOfProps }) => {
  return (
    <StyledButton
      isHolding={isDeleting}
      holdingContent={language.buttons.deleting}
      {...restOfProps}>
      {language.form.deleteForm}
    </StyledButton>
  )
}

ButtonDeleteForm.propTypes = {
  isDeleting: PropTypes.bool
}

ButtonDeleteForm.defaultProps = {
  isDeleting: false
}

export default ButtonDeleteForm
