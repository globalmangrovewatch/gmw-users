import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MenuItem, TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'
import { costs as questions } from '../../data/questions'
import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
import language from '../../language'

const ProjectFunderNamesRow = ({ label, type, percentage, index, deleteItem, updateItem }) => {
  const [initialType, setInitialType] = useState('')
  const [currentType, setCurrentType] = useState('')
  const [initialPercentage, setInitialPercentage] = useState('')
  const [currentPercentage, setCurrentPercentage] = useState('')
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  const handleDelete = () => {
    deleteItem(index)
    setIsDeleteConfirmPromptOpen(false)
  }

  const handleUpdate = () => {
    if (currentType !== initialType || currentPercentage !== initialPercentage) {
      updateItem(index, currentType, currentPercentage)
    }
  }

  const _setFormValues = useEffect(() => {
    if (type) {
      setCurrentType(type)
      setInitialType(type)
    }
    if (percentage) {
      setCurrentPercentage(percentage)
      setInitialPercentage(percentage)
    }
  }, [type, percentage])

  const handleDeleteClick = () => {
    setIsDeleteConfirmPromptOpen(true)
  }

  return (
    <TabularInputSection>
      <TabularLabel>{label}</TabularLabel>
      <TabularBox>
        <TextField
          select
          value={currentType}
          label='type'
          onBlur={handleUpdate}
          sx={{ width: '12.9em' }}
          onChange={(e) => setCurrentType(e.target.value)}>
          {questions.projectFunderNames.options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          sx={{ maxWidth: '7em', marginLeft: '0.5em' }}
          value={currentPercentage}
          required
          label='percentage'
          onBlur={handleUpdate}
          inputProps={{ maxLength: 3 }}
          onChange={(e) => setCurrentPercentage(e.target.value)}></TextField>
        <Delete onClick={handleDeleteClick} sx={{ marginLeft: '0.5em' }}></Delete>
        <ConfirmPrompt
          isOpen={isDeleteConfirmPromptOpen}
          setIsOpen={setIsDeleteConfirmPromptOpen}
          title={`${language.form.tabularDeletePrompt.title}${type}`}
          promptText={language.form.tabularDeletePrompt.promptText}
          confirmButtonText={language.form.tabularDeletePrompt.buttonText}
          onConfirm={handleDelete}
        />
      </TabularBox>
    </TabularInputSection>
  )
}

ProjectFunderNamesRow.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export const TabularBox = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export default ProjectFunderNamesRow
