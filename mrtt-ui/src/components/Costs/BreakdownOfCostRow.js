import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@mui/material'

import { TabularBox, TabularInputSection, TabularLabel } from '../../styles/forms'
const BreakdownOfCostRow = ({ label, cost, currency, index, updateItem }) => {
  const [initialCost, setInitialCost] = useState('')
  const [currentCost, setCurrentCost] = useState('')
  const [initialCurrency, setInitialCurrency] = useState('')
  const [currentCurrency, setCurrentCurrency] = useState('')

  const handleUpdate = () => {
    if (currentCost !== initialCost || currentCurrency || initialCurrency) {
      updateItem(index, currentCost, currentCurrency)
    }
  }

  const _setFormValues = useEffect(() => {
    if (cost) {
      setCurrentCost(cost)
      setInitialCost(cost)
    }
    if (currency) {
      setCurrentCurrency(currency)
      setInitialCurrency(currency)
    }
  }, [cost, currency])

  return (
    <TabularInputSection>
      <TabularLabel>{label}</TabularLabel>
      <TabularBox>
        <TextField
          sx={{ maxWidth: '7em', marginLeft: '0.5em' }}
          value={currentCost}
          label='cost'
          onBlur={handleUpdate}
          inputProps={{ maxLength: 3 }}
          onChange={(e) => setCurrentCost(e.target.value)}></TextField>
      </TabularBox>
      <TabularBox>
        <TextField
          sx={{ maxWidth: '7em', marginLeft: '0.5em' }}
          value={currentCurrency}
          label='currency'
          onBlur={handleUpdate}
          inputProps={{ maxLength: 3 }}
          onChange={(e) => setCurrentCurrency(e.target.value)}></TextField>
      </TabularBox>
    </TabularInputSection>
  )
}

BreakdownOfCostRow.propTypes = {
  label: PropTypes.string.isRequired,
  costType: PropTypes.string.isRequired,
  cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string.isRequired,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default BreakdownOfCostRow
