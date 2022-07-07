import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'

const ButtonSecondaryWithLoader = ({ children, isHolding, disabled, holdingContent, ...props }) => {
  return (
    <Button variant='contained' {...props} disabled={isHolding || disabled}>
      {isHolding ? holdingContent : children}
    </Button>
  )
}

ButtonSecondaryWithLoader.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  holdingContent: PropTypes.node.isRequired,
  isHolding: PropTypes.bool
}
ButtonSecondaryWithLoader.defaultProps = { isHolding: false, disabled: false }

export default ButtonSecondaryWithLoader
