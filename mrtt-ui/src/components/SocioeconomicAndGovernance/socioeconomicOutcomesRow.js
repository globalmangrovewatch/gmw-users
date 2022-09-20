import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, MenuItem, TextField } from '@mui/material'
// import { Delete } from '@mui/icons-material'
// import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
// import language from '../../language'

import { TabularSectionDiv, TabularLabel, TabularInputSection } from '../../styles/forms'
import { typeOptions } from '../../data/socioeconomicOutcomesOptions'

const SocioeconomicOutcomesRow = ({
  outcome,
  type,
  index,
  // deleteItem,
  updateItem
}) => {
  const [initialType, setInitialType] = useState('')
  const [currentType, setCurrentType] = useState('')

  // const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  // const handleDelete = () => {
  //   deleteItem(index)
  //   setIsDeleteConfirmPromptOpen(false)
  // }

  const handleUpdate = () => {
    if (currentType !== initialType) {
      updateItem(index, currentType)
    }
  }

  const _setFormValues = useEffect(() => {
    if (type) {
      setCurrentType(type)
      setInitialType(type)
    }
  }, [type])

  // const handleDeleteClick = () => {
  //   setIsDeleteConfirmPromptOpen(true)
  // }

  return (
    <TabularSectionDiv>
      <Box sx={{ width: '100%' }}>
        <TabularInputSection>
          <TabularLabel>{outcome}</TabularLabel>
          {/* <Delete
          onClick={handleDeleteClick}
          sx={{ marginLeft: '0.5em', cursor: 'pointer' }}></Delete>
        <ConfirmPrompt
          isOpen={isDeleteConfirmPromptOpen}
          setIsOpen={setIsDeleteConfirmPromptOpen}
          title={`${language.form.tabularDeletePrompt.title}${type}`}
          promptText={language.form.tabularDeletePrompt.promptText}
          confirmButtonText={language.form.tabularDeletePrompt.buttonText}
          onConfirm={handleDelete}
        /> */}
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Type</TabularLabel>
          <TextField
            select
            sx={{ width: '12.9em' }}
            value={currentType}
            label='Type'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentType(e.target.value)}>
            {typeOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {/* <RowTextField
          value={currentType}
          label='Type'
          onBlur={handleUpdate}
          onChange={(e) => setCurrentType(e.target.value)}></RowTextField> */}
        </TabularInputSection>
      </Box>
    </TabularSectionDiv>
  )
}

SocioeconomicOutcomesRow.propTypes = {
  outcome: PropTypes.string.isRequired,
  type: PropTypes.string,
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default SocioeconomicOutcomesRow
