import PropTypes from 'prop-types'
import { Button } from '@mui/material'

import { TabularButtonsDiv } from '../../styles/forms'

// eslint-disable-next-line react/prop-types
const TabularButtons = ({ handleSave, cancelItem }) => {
  const handleSaveItem = () => {
    handleSave()
  }

  const handleCancelItem = () => {
    cancelItem()
  }

  return (
    <TabularButtonsDiv>
      <Button variant='outlined' onClick={handleSaveItem} sx={{ marginRight: '0.5em' }}>
        Save
      </Button>
      <Button
        variant='outlined'
        color='error'
        onClick={handleCancelItem}
        sx={{ marginLeft: '0.5em' }}>
        Cancel
      </Button>
    </TabularButtonsDiv>
  )
}

TabularButtons.proptypes = {
  handleSave: PropTypes.func.isRequired,
  cancelMeasurementItem: PropTypes.func.isRequired
}

export default TabularButtons
