import React from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@mui/material'
import { ButtonContainer, PaddedSection, RowFlexEnd } from '../../styles/containers'
import { H2 } from '../../styles/typography'
import { ButtonCancel, ButtonPrimary } from '../../styles/buttons'

const ConfirmPrompt = ({ title, promptText, confirmButtonText, isOpen, setIsOpen, onConfirm }) => {
  const handleCancelClick = () => {
    setIsOpen(false)
  }

  const handleConfirmClick = () => {
    setIsOpen(false)
    onConfirm()
  }
  return (
    <Dialog open={isOpen}>
      <PaddedSection>
        <H2>{title}</H2>
        <p>{promptText}</p>
        <RowFlexEnd>
          <ButtonContainer>
            <ButtonCancel onClick={handleCancelClick}>fsdjkl</ButtonCancel>
            <ButtonPrimary onClick={handleConfirmClick}>{confirmButtonText}</ButtonPrimary>
          </ButtonContainer>
        </RowFlexEnd>
      </PaddedSection>
    </Dialog>
  )
}

ConfirmPrompt.propTypes = {
  confirmButtonText: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  promptText: PropTypes.string.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default ConfirmPrompt
