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

import MapDrawControl, { drawControlRef } from './MapDrawControl'
import MapDrawControlPanel from './MapDrawControlPanel'
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
  setSiteAreaFeatureCollection /*drawMode*/
}) => {
  const [uploadLineCount, setUploadLineCount] = useState(0)
  const [uploadPointCount, setUploadPointCount] = useState(0)

  const featureCollectionHasPolygons = siteAreaFeatureCollection.features.some((f) =>
    polygonTypes.includes(f.geometry.type)
  )

  // When extent changes
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

  useEffect(() => {
    console.log('useeffect', siteAreaFeatureCollection)
  }, [siteAreaFeatureCollection])

  const onAddGeomFile = async (files) => {
    if (drawControlRef) {
      if (files.length) {
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
      <Typography variant='body2'>Draw a polygon or the map or upload from file</Typography>
      <DropzoneArea
        sx={'margin-top: 20px'}
        onChange={onAddGeomFile}
        filesLimit={1}
        acceptedFiles={acceptedFileMimeTypes}
        showPreviews={false}
        showPreviewsInDropzone={true}
        showFileNames={true}
        dropzoneText={
          'Click or drag and drop a file here. Accepted formats are geojson, KML and shapefile (zipped as a .zip file).'
        }
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
          defaultMode={'static'}
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <GeolocateControl position='top-right' />
        <FullscreenControl position='top-right' />
        <NavigationControl position='top-right' />
        <ScaleControl />
      </Map>
      {featureCollectionHasPolygons && (
        <MapDrawControlPanel
          polygons={siteAreaFeatureCollection.features.filter((f) =>
            polygonTypes.includes(f.geometry.type)
          )}
          lineCount={uploadLineCount}
          pointCount={uploadPointCount}
        />
      )}
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
