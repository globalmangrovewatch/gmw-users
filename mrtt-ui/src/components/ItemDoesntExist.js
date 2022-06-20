import React from 'react'
import PropTypes from 'prop-types'
import { RowCenterCenter } from '../styles/containers'
import language from '../language'

const ItemDoesntExist = ({ item }) => {
  return <RowCenterCenter>{language.error.getItemDoesntExistMessage(item)}</RowCenterCenter>
}

ItemDoesntExist.propTypes = { item: PropTypes.string.isRequired }

export default ItemDoesntExist
