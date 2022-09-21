import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, MenuItem, TextField } from '@mui/material'
// import { Delete } from '@mui/icons-material'
// import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
// import language from '../../language'

import { TabularSectionDiv, TabularLabel, TabularInputSection } from '../../styles/forms'
import { trendOptions, typeOptions } from '../../data/socioeconomicOutcomesOptions'

const SocioeconomicOutcomesRow = ({
  outcome,
  type,
  trend,
  index,
  // deleteItem,
  updateItem
}) => {
  const [initialType, setInitialType] = useState('')
  const [currentType, setCurrentType] = useState('')
  const [initialTrend, setInitialTrend] = useState('')
  const [currentTrend, setCurrentTrend] = useState('')

  // const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  // const handleDelete = () => {
  //   deleteItem(index)
  //   setIsDeleteConfirmPromptOpen(false)
  // }

  const handleUpdate = () => {
    if (currentType !== initialType) {
      updateItem({ index, currentType })
    }
    if (currentTrend !== initialTrend) {
      updateItem({ index, currentTrend })
    }
  }

  const _setFormValues = useEffect(() => {
    if (type) {
      setCurrentType(type)
      setInitialType(type)
    }
    if (trend) {
      setCurrentTrend(trend)
      setInitialTrend(trend)
    }
  }, [trend, type])

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
        </TabularInputSection>
        {currentType === 'Observed' ? (
          <TabularInputSection>
            <TabularLabel>Trend</TabularLabel>
            <TextField
              select
              sx={{ width: '12.9em' }}
              value={currentTrend}
              label='Trend'
              onBlur={handleUpdate}
              onChange={(e) => setCurrentTrend(e.target.value)}>
              {trendOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </TabularInputSection>
        ) : null}
      </Box>
    </TabularSectionDiv>
  )
}

SocioeconomicOutcomesRow.propTypes = {
  outcome: PropTypes.string.isRequired,
  type: PropTypes.string,
  trend: PropTypes.string,
  deleteItem: PropTypes.func,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default SocioeconomicOutcomesRow
