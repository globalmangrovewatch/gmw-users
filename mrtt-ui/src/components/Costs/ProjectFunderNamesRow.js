import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MenuItem, TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'
import { costs as questions } from '../../data/questions'

const ProjectFunderNamesRow = ({ label, type, percentage, index, deleteItem, updateItem }) => {
  const [initialType, setInitialType] = useState('')
  const [currentType, setCurrentType] = useState('')
  const [initialPercentage, setInitialPercentage] = useState('')
  const [currentPercentage, setCurrentPercentage] = useState('')

  const handleDelete = () => {
    deleteItem(index)
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
        <Delete onClick={handleDelete} sx={{ marginLeft: '0.5em' }}></Delete>
      </TabularBox>
    </TabularInputSection>
  )
}

ProjectFunderNamesRow.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
