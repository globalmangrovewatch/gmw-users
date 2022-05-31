import MapboxDraw from '@mapbox/mapbox-gl-draw'
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode'
import PropTypes from 'prop-types'
import { useControl } from 'react-map-gl'

const modes = MapboxDraw.modes
modes.static = StaticMode

// Allows access to draw control elsewhere as described here: https://stackoverflow.com/a/72023298
export let drawControlRef = null

const MapDrawControl = (props) => {
  const { onCreate, onUpdate, onDelete, position } = props
  drawControlRef = useControl(
    ({ map }) => {
      map.on('draw.create', (features) => onCreate(features))
      map.on('draw.update', (features) => onUpdate(features))
      map.on('draw.delete', (features) => onDelete(features))
      return new MapboxDraw({ modes, ...props })
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

  return null
}

MapDrawControl.defaultProps = {
  onCreate: undefined,
  onUpdate: undefined,
  onDelete: undefined
}

MapDrawControl.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  position: PropTypes.string.isRequired
}

export default MapDrawControl
