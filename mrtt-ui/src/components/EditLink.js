import { Edit } from '@mui/icons-material'
import React from 'react'

import language from '../language'
import { ButtonSecondary } from '../styles/buttons'

const EditLink = (props) => {
  return (
    <ButtonSecondary {...props}>
      <Edit /> {language.buttons.edit}
    </ButtonSecondary>
  )
}

EditLink.propTypes = {}

export default EditLink
