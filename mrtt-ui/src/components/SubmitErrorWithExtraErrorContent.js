import React from 'react'
import PropTypes from 'prop-types'
import language from '../language'

const SubmitErrorWithExtraErrorContent = ({ extraErrorContent }) => {
  return (
    <>
      <p>{language.error.submit}</p>
      <p>{extraErrorContent}</p>
    </>
  )
}

SubmitErrorWithExtraErrorContent.propTypes = { extraErrorContent: PropTypes.node.isRequired }

export default SubmitErrorWithExtraErrorContent
