import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Delete } from '@mui/icons-material'

import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
import language from '../../language'

import {
  HorizontalTabularBox,
  LeftColumnDiv,
  RowTextField,
  TabularInputSection,
  TabularLabel,
  VerticalTabularBox
} from '../../styles/forms'

const PhysicalMeasurementRow = ({ label, value, index, deleteItem, updateItem }) => {
  const [initialValue, setInitialValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)
  const handleDelete = () => {
    deleteItem(index)
    setIsDeleteConfirmPromptOpen(false)
  }

  const handleUpdate = () => {
    if (currentValue !== initialValue) {
      updateItem(index, currentValue)
    }
  }

  const _setFormValues = useEffect(() => {
    if (value) {
      setCurrentValue(value)
      setInitialValue(value)
    }
  }, [value])

  const handleDeleteClick = () => {
    setIsDeleteConfirmPromptOpen(true)
  }

  return (
    <TabularInputSection>
      <VerticalTabularBox>
        <LeftColumnDiv>
          <TabularLabel>{label}</TabularLabel>
          <Delete onClick={handleDeleteClick}></Delete>
          <ConfirmPrompt
            isOpen={isDeleteConfirmPromptOpen}
            setIsOpen={setIsDeleteConfirmPromptOpen}
            title={`${language.form.tabularDeletePrompt.title}${label}`}
            promptText={language.form.tabularDeletePrompt.promptText}
            confirmButtonText={language.form.tabularDeletePrompt.buttonText}
            onConfirm={handleDelete}
          />
        </LeftColumnDiv>
        <HorizontalTabularBox>
          <RowTextField
            value={currentValue}
            label='value'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentValue(e.target.value)}></RowTextField>
        </HorizontalTabularBox>
      </VerticalTabularBox>
    </TabularInputSection>
  )
}

PhysicalMeasurementRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default PhysicalMeasurementRow
