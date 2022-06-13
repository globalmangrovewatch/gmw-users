import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import Map, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl'
import { DropzoneArea } from 'react-mui-dropzone'
import GeoPropTypes from 'geojson-prop-types'

import language from '../language'
import MapDrawControl, { drawControlRef } from './MapDrawControl'
import MapDrawInfo from './MapDrawInfo'
import handleFileLoadEvent from '../library/handleFileLoadEvent'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

const acceptedFileMimeTypes = [
  'application/json',
  'application/geo+json',
  'application/vnd.geo+json',
  '.geojson',
  'application/vnd.google-earth.kml+xml', // .kml
  // Shapefile (zip)
  'application/zip',
  'application/octet-stream',
  'application/x-zip-compressed',
  'multipart/x-zip'
]
const lineTypes = ['Line', 'MultiLine', 'LineString']
const pointTypes = ['Point', 'MultiPoint']
const polygonTypes = ['Polygon', 'MultiPolygon']

const getPolygonOnlyFeatureCollection = (geojsonFeatureCollection) => {
  return {
    ...geojsonFeatureCollection,
    features: geojsonFeatureCollection.features.filter((feature) =>
      polygonTypes.includes(feature.geometry.type)
    )
  }
}

const ProjectAreaMap = ({
  height,
  extent,
  siteAreaFeatureCollection,
  setSiteAreaFeatureCollection
}) => {
  const [uploadLineCount, setUploadLineCount] = useState(0)
  const [uploadPointCount, setUploadPointCount] = useState(0)
  const [error, setError] = useState()

  // When extent changes
  useEffect(() => {
    if (!mapRef.current) return
    const animationProps = { padding: 40, duration: 1000 }

    try {
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
    } catch (e) {
      console.error(e)
      setError(e.message)
    }
  }, [extent])

  const onAddGeomFile = async (files) => {
    if (drawControlRef && files.length) {
      try {
        const fileJson = await handleFileLoadEvent(files)

        const polygonOnlyFeatureClass = getPolygonOnlyFeatureCollection(fileJson)

        setUploadLineCount(
          fileJson.features.filter((f) => lineTypes.includes(f.geometry.type)).length
        )
        setUploadPointCount(
          fileJson.features.filter((f) => pointTypes.includes(f.geometry.type)).length
        )

        drawControlRef.deleteAll()
        drawControlRef.add(polygonOnlyFeatureClass)
        setError()
      } catch (e) {
        setError(`${language.projectAreaMap.uploadErrorPrefix}: ${e}`)
      }
      setSiteAreaFeatureCollection(drawControlRef.getAll())
    }
  }

  const onDropzoneDelete = () => {
    drawControlRef.deleteAll()
    setSiteAreaFeatureCollection(ProjectAreaMap.defaultProps.siteAreaFeatureCollection)
  }

  const onUpdate = useCallback(() => {
    setSiteAreaFeatureCollection(drawControlRef.getAll())
  }, [setSiteAreaFeatureCollection])

  const onDelete = useCallback(() => {
    setSiteAreaFeatureCollection(drawControlRef.getAll())
  }, [setSiteAreaFeatureCollection])

  const mapRef = useRef()

  return (
    <>
      <Typography variant='body2'>{language.projectAreaMap.siteAreaInstructions}</Typography>
      <DropzoneArea
        sx={'margin-top: 20px'}
        onChange={onAddGeomFile}
        filesLimit={1}
        acceptedFiles={acceptedFileMimeTypes}
        showPreviews={false}
        showPreviewsInDropzone={false}
        dropzoneText={language.projectAreaMap.dropzoneText}
        onDelete={onDropzoneDelete}
      />
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: height || '400px' }}
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 0.5
        }}
        mapStyle='mapbox://styles/mapbox/satellite-streets-v11'>
        <MapDrawControl
          position='top-left'
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true
          }}
          defaultMode={'draw_polygon'}
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <GeolocateControl position='top-right' />
        <FullscreenControl position='top-right' />
        <NavigationControl position='top-right' />
        <ScaleControl />
      </Map>
      <MapDrawInfo
        polygons={siteAreaFeatureCollection.features.filter((f) =>
          polygonTypes.includes(f.geometry.type)
        )}
        lineCount={uploadLineCount}
        pointCount={uploadPointCount}
        error={error}
      />
    </>
  )
}

ProjectAreaMap.defaultProps = {
  extent: undefined,
  height: undefined,
  siteAreaFeatureCollection: {
    type: 'FeatureCollection',
    features: []
  }
}

ProjectAreaMap.propTypes = {
  extent: PropTypes.arrayOf(PropTypes.number),
  height: PropTypes.string,
  siteAreaFeatureCollection: GeoPropTypes.FeatureCollection,
  setSiteAreaFeatureCollection: PropTypes.func.isRequired
}

export default ProjectAreaMap
