import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

const OrganizationForm = ({ isNewOrganization }) => {
  const { organizationId } = useParams()
  return (
    <>
      Placeholder org form for id: {organizationId}. Is new: {isNewOrganization?.toString()}
    </>
  )
}

OrganizationForm.propTypes = { isNewOrganization: PropTypes.bool.isRequired }

export default OrganizationForm
