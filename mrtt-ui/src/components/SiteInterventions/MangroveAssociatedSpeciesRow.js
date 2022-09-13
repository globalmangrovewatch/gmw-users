import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MenuItem } from '@mui/material'
import { Delete } from '@mui/icons-material'
import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
import language from '../../language'

import {
  LeftColumnDiv,
  RowTextField,
  TabularInputSection,
  TabularLabel,
  VerticalTabularBox
} from '../../styles/forms'
import { purposeOptions, sourceOptions } from '../../data/siteInterventionOptions'

const MangroveAssociatedSpeciesRow = ({
  type,
  count,
  source,
  purpose,
  other,
  index,
  deleteItem,
  updateItem
}) => {
  const [initialCount, setInitialCount] = useState('')
  const [currentCount, setCurrentCount] = useState('')
  const [initialSource, setInitialSource] = useState('')
  const [currentSource, setCurrentSource] = useState('')
  const [initialPurpose, setInitialPurpose] = useState('')
  const [currentPurpose, setCurrentPurpose] = useState('')
  const [initialOther, setInitialOther] = useState('')
  const [currentOther, setCurrentOther] = useState('')
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  const handleDelete = () => {
    deleteItem(index)
    setIsDeleteConfirmPromptOpen(false)
  }

  const handleUpdate = () => {
    if (
      currentCount !== initialCount ||
      currentSource !== initialSource ||
      currentPurpose !== initialPurpose ||
      currentOther !== initialOther
    ) {
      updateItem(index, currentCount, currentSource, currentPurpose, currentOther)
    }
  }

  const _setFormValues = useEffect(() => {
    if (count) {
      setCurrentCount(count)
      setInitialCount(count)
    }
    if (source) {
      setCurrentSource(source)
      setInitialSource(source)
    }
    if (purpose) {
      setCurrentPurpose(purpose)
      setInitialPurpose(purpose)
    }
    if (other) {
      setCurrentOther(other)
      setInitialOther(other)
    }
  }, [count, source, purpose, other])

  const handleDeleteClick = () => {
    setIsDeleteConfirmPromptOpen(true)
  }

  return (
    <TabularInputSection>
      <LeftColumnDiv>
        <TabularLabel>{type}</TabularLabel>
        <Delete
          onClick={handleDeleteClick}
          sx={{ marginLeft: '0.5em', cursor: 'pointer' }}></Delete>
        <ConfirmPrompt
          isOpen={isDeleteConfirmPromptOpen}
          setIsOpen={setIsDeleteConfirmPromptOpen}
          title={`${language.form.tabularDeletePrompt.title}${type}`}
          promptText={language.form.tabularDeletePrompt.promptText}
          confirmButtonText={language.form.tabularDeletePrompt.buttonText}
          onConfirm={handleDelete}
        />
      </LeftColumnDiv>
      <VerticalTabularBox>
        <RowTextField
          value={currentCount}
          label='Count'
          onBlur={handleUpdate}
          onChange={(e) => setCurrentCount(e.target.value)}></RowTextField>
        <RowTextField
          select
          value={currentSource}
          label='Source'
          onBlur={handleUpdate}
          onChange={(e) => setCurrentSource(e.target.value)}>
          {sourceOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </RowTextField>
        <RowTextField
          select
          value={currentPurpose}
          label='Purpose'
          onBlur={handleUpdate}
          onChange={(e) => setCurrentPurpose(e.target.value)}>
          {purposeOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </RowTextField>
        {currentPurpose === 'Other' ? (
          <RowTextField
            value={currentOther}
            label='Other purpose'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentOther(e.target.value)}></RowTextField>
        ) : null}
      </VerticalTabularBox>
    </TabularInputSection>
  )
}

MangroveAssociatedSpeciesRow.propTypes = {
  type: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  source: PropTypes.string.isRequired,
  purpose: PropTypes.string.isRequired,
  other: PropTypes.string.isRequired,
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default MangroveAssociatedSpeciesRow
