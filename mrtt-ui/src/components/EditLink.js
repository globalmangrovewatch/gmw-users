import { Edit } from '@mui/icons-material'
import React from 'react'

import language from '../language'
import { LinkLooksLikeButtonSecondary } from '../styles/typography'

const EditLink = (props) => {
  return (
    <LinkLooksLikeButtonSecondary {...props}>
      <Edit /> {language.buttons.edit}
    </LinkLooksLikeButtonSecondary>
  )
}

EditLink.propTypes = {}

export default EditLink
