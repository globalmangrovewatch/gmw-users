import { Edit } from '@mui/icons-material'
import { Link as LinkReactRouter } from 'react-router-dom'
import { styled } from '@mui/system'
import React from 'react'

import language from '../language'
import theme from '../styles/theme'

export const CustomLink = styled(LinkReactRouter)`
  color: ${theme.color.text};
  text-decoration: none;
  display: flex;
  text-transform: uppercase;
`

const EditLink = (props) => {
  return (
    <CustomLink {...props}>
      <Edit /> {language.buttons.edit}
    </CustomLink>
  )
}

EditLink.propTypes = {}

export default EditLink
