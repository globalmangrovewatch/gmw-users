import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'

const CustomTabularInputRow = ({
  type,
  label1,
  label2,
  label3,
  rowValue1,
  rowValue2,
  rowValue3,
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

  const handleDelete = () => {
    deleteMeasurementItem(index)
  }

  const handleUpdate = () => {
    if (currentVal1 !== initialVal1 || currentVal2 !== initialVal2 || currentVal3 !== initialVal3) {
      updateMeasurementItem(index, currentVal1, currentVal2, currentVal3)
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
  }, [rowValue1, rowValue2, rowValue3])

  return (
    <TabularInputSection>
      <TabularLabel>{type}</TabularLabel>
      <Delete onClick={handleDelete} sx={{ marginLeft: '0.5em' }}></Delete>
      <TabularBox>
        <RowTextField
          value={currentVal1}
          label={label1}
          onBlur={handleUpdate}
          onChange={(e) => setCurrentVal1(e.target.value)}></RowTextField>
        <RowTextField
          value={currentVal2}
          label={label2}
          onBlur={handleUpdate}
          onChange={(e) => setCurrentVal2(e.target.value)}></RowTextField>
        <RowTextField
          value={currentVal3}
          label={label3}
          onBlur={handleUpdate}
          onChange={(e) => setCurrentVal3(e.target.value)}></RowTextField>
      </TabularBox>
    </TabularInputSection>
  )
}

CustomTabularInputRow.propTypes = {
  type: PropTypes.string.isRequired,
  label1: PropTypes.string.isRequired,
  label2: PropTypes.string.isRequired,
  label3: PropTypes.string.isRequired,
  rowValue1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowValue2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowValue3: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
