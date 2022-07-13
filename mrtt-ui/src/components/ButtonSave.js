import React from 'react'
import PropTypes from 'prop-types'
import { ButtonPrimary } from '../styles/buttons'
import language from '../language'

const ButtonSave = ({ isSaving, component, ...restOfProps }) => {
  const ComponentToUse = component ? component : ButtonPrimary
  return (
    <ComponentToUse disabled={isSaving} {...restOfProps}>
      {isSaving ? language.buttons.saving : language.buttons.save}
    </ComponentToUse>
  )
}

ButtonSave.propTypes = {
  isSaving: PropTypes.bool.isRequired,
  component: PropTypes.any
}

ButtonSave.defaultProps = {
  component: undefined
}

export default ButtonSave
