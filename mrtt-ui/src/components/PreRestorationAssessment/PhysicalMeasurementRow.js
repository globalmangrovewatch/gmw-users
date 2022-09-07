import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Delete } from '@mui/icons-material'

import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
import language from '../../language'

import {
  LeftColumnDiv,
  RowTextField,
  TabularLabel,
  VerticalTabularBox,
  VerticalTabularInputSection
} from '../../styles/forms'

const PhysicalMeasurementRow = ({ label, value, unit, index, deleteItem, updateItem }) => {
  const [initialValue, setInitialValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [initialUnit, setInitialUnit] = useState('')
  const [currentUnit, setCurrentUnit] = useState('')
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)
  const handleDelete = () => {
    deleteItem(index)
    setIsDeleteConfirmPromptOpen(false)
  }

  const handleUpdate = () => {
    if (currentValue !== initialValue || currentUnit !== initialUnit) {
      updateItem(index, currentValue, currentUnit)
    }
  }

  const _setFormValues = useEffect(() => {
    if (value) {
      setCurrentValue(value)
      setInitialValue(value)
    }
    if (unit) {
      setCurrentUnit(unit)
      setInitialUnit(unit)
    }
  }, [value, unit])

  return (
    <VerticalTabularInputSection>
      <VerticalTabularBox>
        <LeftColumnDiv>
          <TabularLabel>{label}</TabularLabel>
          <Delete onClick={handleDelete}></Delete>
          <ConfirmPrompt
            isOpen={isDeleteConfirmPromptOpen}
            setIsOpen={setIsDeleteConfirmPromptOpen}
            title={`${language.form.tabularDeletePrompt.title}${TabularLabel}`}
            promptText={language.form.tabularDeletePrompt.promptText}
            confirmButtonText={language.form.tabularDeletePrompt.buttonText}
            onConfirm={handleDelete}
          />
        </LeftColumnDiv>
        <VerticalTabularBox>
          <RowTextField
            value={currentValue}
            label='value'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentValue(e.target.value)}></RowTextField>
          <RowTextField
            value={currentUnit}
            label='unit'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentUnit(e.target.value)}></RowTextField>
        </VerticalTabularBox>
      </VerticalTabularBox>
    </VerticalTabularInputSection>
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
