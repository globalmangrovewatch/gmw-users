import React from 'react'
import { Menu, MenuItem, Stack, styled } from '@mui/material'
import { ButtonPrimary } from '../../styles/buttons'
import language from '../../language'
import { ArrowDropDown } from '@mui/icons-material'
import { Link } from '../../styles/typography'
import PropTypes from 'prop-types'

const pageLanguage = language.pages.siteQuestionsOverview

const StackWithMarginBottom = styled(Stack)`
  margin-bottom: 1em;
`

const AddMonitoringSectionMenu = ({ siteId }) => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState(null)
  const isMenuOpen = Boolean(menuAnchorElement)
  const handleMenuButtonClick = (event) => {
    setMenuAnchorElement(event.currentTarget)
  }
  const handleMenuClose = () => {
    setMenuAnchorElement(null)
  }

  return (
    <StackWithMarginBottom>
      <ButtonPrimary
        id='add-monitoring-section-button'
        aria-controls={isMenuOpen ? 'add-monitoring-section-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={isMenuOpen ? 'true' : undefined}
        onClick={handleMenuButtonClick}>
        {language.pages.siteQuestionsOverview.addMonitoringSectionButton}
        <ArrowDropDown />
      </ButtonPrimary>
      <Menu
        id='add-monitoring-section-menu'
        anchorEl={menuAnchorElement}
        open={isMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'add-monitoring-section-button'
        }}>
        <MenuItem>
          <Link to={`/sites/${siteId}/form/management-status-and-effectiveness`}>
            {pageLanguage.formName.managementStatusAndEffectiveness}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to={`/sites/${siteId}/form/socioeconomic-and-governance-status`}>
            {pageLanguage.formName.socioeconomicGovernanceStatusOutcomes}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to={`/sites/${siteId}/form/ecological-status-and-outcomes`}>
            {pageLanguage.formName.ecologicalStatusOutcomes}
          </Link>
        </MenuItem>
      </Menu>
    </StackWithMarginBottom>
  )
}

AddMonitoringSectionMenu.propTypes = { siteId: PropTypes.string.isRequired }

export default AddMonitoringSectionMenu
