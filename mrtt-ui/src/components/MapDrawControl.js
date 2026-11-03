'use client'

import MapboxDraw from '@mapbox/mapbox-gl-draw'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useControl } from 'react-map-gl'

const MapDrawControl = (props) => {
  const { drawRef, onCreate, onUpdate, onDelete, position, ...drawOptions } = props
  const draw = useControl(
    ({ map }) => {
      map.on('draw.create', (features) => onCreate(features))
      map.on('draw.update', (features) => onUpdate(features))
      map.on('draw.delete', (features) => onDelete(features))
      return new MapboxDraw(drawOptions)
    },
    ({ map }) => {
      map.off('draw.create', (features) => onCreate(features))
      map.off('draw.update', (features) => onUpdate(features))
      map.off('draw.delete', (features) => onDelete(features))
    },
    {
      position: position
    }
  )

  // Hands the draw instance to the parent, as described here: https://stackoverflow.com/a/72023298
  useEffect(() => {
    drawRef.current = draw
  }, [draw, drawRef])

  return null
}

MapDrawControl.propTypes = {
  drawRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  position: PropTypes.string.isRequired
}

export default MapDrawControl
