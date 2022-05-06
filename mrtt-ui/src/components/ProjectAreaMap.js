import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Map from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
const ProjectAreaMap = ({ height, extent }) => {
  const mapRef = useRef()
  useEffect(() => {
    if (!mapRef.current) return
    const animationProps = { padding: 40, duration: 1000 }
    if (extent) {
      mapRef.current.fitBounds(
        [
          [extent[0], extent[1]],
          [extent[2], extent[3]]
        ],
        animationProps
      )
    } else {
      mapRef.current.zoomTo(0, animationProps)
    }
  }, [extent])

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: '100%', height: height || '400px' }}
      mapStyle='mapbox://styles/mapbox/streets-v9'
    />
  )
}

ProjectAreaMap.defaultProps = {
  extent: undefined,
  height: undefined
}

ProjectAreaMap.propTypes = {
  extent: PropTypes.arrayOf(PropTypes.number),
  height: PropTypes.string
}

export default ProjectAreaMap
