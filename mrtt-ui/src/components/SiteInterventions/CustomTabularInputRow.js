import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, MenuItem, TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'
import { purposeOptions, sourceOptions } from '../../data/siteInterventionOptions'

const CustomTabularInputRow = ({
  type,
  label1,
  label2,
  label3,
  label4,
  rowValue1,
  rowValue2,
  rowValue3,
  rowValue4,
  index,
  deleteMeasurementItem,
  updateMeasurementItem
}) => {
  const [initialVal1, setInitialVal1] = useState('')
  const [currentVal1, setCurrentVal1] = useState('')
  const [initialVal2, setInitialVal2] = useState('')
  const [currentVal2, setCurrentVal2] = useState('')
  const [initialVal3, setInitialVal3] = useState('')
  const [currentVal3, setCurrentVal3] = useState('')
  const [initialVal4, setInitialVal4] = useState('')
  const [currentVal4, setCurrentVal4] = useState('')

  const handleDelete = () => {
    deleteMeasurementItem(index)
  }

  const handleUpdate = () => {
    if (
      currentVal1 !== initialVal1 ||
      currentVal2 !== initialVal2 ||
      currentVal3 !== initialVal3 ||
      currentVal4 !== initialVal4
    ) {
      updateMeasurementItem(index, currentVal1, currentVal2, currentVal3, currentVal4)
    }
  }

  const _setFormValues = useEffect(() => {
    if (rowValue1) {
      setCurrentVal1(rowValue1)
      setInitialVal1(rowValue1)
    }
    if (rowValue2) {
      setCurrentVal2(rowValue2)
      setInitialVal2(rowValue2)
    }
    if (rowValue3) {
      setCurrentVal3(rowValue3)
      setInitialVal3(rowValue3)
    }
    if (rowValue4) {
      setCurrentVal4(rowValue4)
      setInitialVal4(rowValue4)
    }
  }, [rowValue1, rowValue2, rowValue3, rowValue4])

  return (
    <TabularInputSection>
      <LeftColumnDiv>
        <TabularLabel>{type}</TabularLabel>
        <Delete onClick={handleDelete} sx={{ marginLeft: '0.5em', cursor: 'pointer' }}></Delete>
      </LeftColumnDiv>
      <TabularBox>
        <RowTextField
          value={currentVal1}
          label={label1}
          onBlur={handleUpdate}
          onChange={(e) => setCurrentVal1(e.target.value)}></RowTextField>
        <RowTextField
          select
          value={currentVal2}
          label={label2}
          onBlur={handleUpdate}
          onChange={(e) => setCurrentVal2(e.target.value)}>
          {sourceOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </RowTextField>
        <RowTextField
          select
          value={currentVal3}
          label={label3}
          onBlur={handleUpdate}
          onChange={(e) => setCurrentVal3(e.target.value)}>
          {purposeOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </RowTextField>
        {currentVal3 === 'Other' ? (
          <RowTextField
            value={currentVal4}
            label={label4}
            onBlur={handleUpdate}
            onChange={(e) => setCurrentVal4(e.target.value)}></RowTextField>
        ) : null}
      </TabularBox>
    </TabularInputSection>
  )
}

CustomTabularInputRow.propTypes = {
  type: PropTypes.string.isRequired,
  label1: PropTypes.string.isRequired,
  label2: PropTypes.string.isRequired,
  label3: PropTypes.string.isRequired,
  label4: PropTypes.string.isRequired,
  rowValue1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowValue2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowValue3: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowValue4: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  deleteMeasurementItem: PropTypes.func.isRequired,
  updateMeasurementItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export const TabularBox = styled('div')`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`

export default CustomTabularInputRow

const RowTextField = styled(TextField)`
  margin-top: 1em;
`

const LeftColumnDiv = styled(Box)`
  display: flex;
`
