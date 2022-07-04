import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

const LandscapeForm = ({ isNewLandscape }) => {
  const { landscapeId } = useParams()
  return (
    <>
      Placeholder landscape form for id: {landscapeId}. In new: {isNewLandscape?.toString()}
    </>
  )
}

LandscapeForm.propTypes = { isNewLandscape: PropTypes.bool.isRequired }

export default LandscapeForm
