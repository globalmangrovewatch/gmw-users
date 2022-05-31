import * as React from 'react'
import PropTypes from 'prop-types'
import area from '@turf/area'
import { Typography } from '@mui/material'
import language from '../language'

const MapDrawInfo = ({ polygons, lineCount, pointCount }) => {
  let polygonAreaSqKm = 0
  for (const polygon of polygons) {
    polygonAreaSqKm += area(polygon) / 1000000
  }
  return (
    <>
      {polygonAreaSqKm > 0 && (
        <Typography variant='body2'>
          {language.projectAreaMap.siteArea}: {(Math.round(polygonAreaSqKm) * 100) / 100} km
          {'\u00b2'}
        </Typography>
      )}
      {!!(lineCount || pointCount) && (
        <Typography variant='body2'>
          {language.projectAreaMap.getLineAndPointCounts(lineCount, pointCount)}
        </Typography>
      )}
    </>
  )
}

MapDrawInfo.propTypes = {
  polygons: PropTypes.array.isRequired,
  lineCount: PropTypes.number.isRequired,
  pointCount: PropTypes.number.isRequired
}

export default React.memo(MapDrawInfo)
