import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, MenuItem, TextField } from '@mui/material'

import { TabularLabel, VerticalTabularBox, VerticalTabularInputSection } from '../../styles/forms'
import { currencies } from '../../data/currencies'

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
    <VerticalTabularInputSection>
      <VerticalTabularBox>
        <TabularLabel>{label}</TabularLabel>
        <Box>
          <TextField
            sx={{ marginTop: '1em', maxWidth: '13em' }}
            value={currentCost}
            label='cost'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentCost(e.target.value)}></TextField>
          <TextField
            sx={{ width: '8em', marginLeft: '1em', marginTop: '1em', marginBottom: '1em' }}
            value={currentCurrency}
            select
            label='currency'
            onBlur={handleUpdate}
            inputProps={{ maxLength: 3 }}
            onChange={(e) => setCurrentCurrency(e.target.value)}>
            {currencies.map((currency, index) => (
              <MenuItem key={index} value={currency.code}>
                {currency.code}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </VerticalTabularBox>
    </VerticalTabularInputSection>
  )
}

BreakdownOfCostRow.propTypes = {
  label: PropTypes.string.isRequired,
  cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default BreakdownOfCostRow
