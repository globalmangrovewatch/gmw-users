import * as React from 'react'
import PropTypes from 'prop-types'
import area from '@turf/area'

const MapDrawControlPanel = ({ polygons }) => {
  let polygonArea = 0
  for (const polygon of polygons) {
    polygonArea += area(polygon)
  }

  console.log(polygons)

  return (
    <div className='control-panel'>
      <h3>Draw Polygon</h3>
      {polygonArea > 0 && (
        <p>
          {Math.round(polygonArea * 100) / 100} <br />
          square meters
        </p>
      )}
      <div className='source-link'>
        <a
          href='https://github.com/visgl/react-map-gl/tree/7.0-release/examples/draw-polygon'
          target='_new'>
          View Code ↗
        </a>
      </div>
    </div>
  )
}

MapDrawControlPanel.propTypes = {
  polygons: PropTypes.array.isRequired
}

export default React.memo(MapDrawControlPanel)
