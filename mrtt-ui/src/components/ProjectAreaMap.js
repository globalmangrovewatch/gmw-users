import { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import Map from 'react-map-gl'
import { DropzoneArea } from 'react-mui-dropzone'
import GeoPropTypes from 'geojson-prop-types'

import MapDrawControl from './MapDrawControl'
// import MapDrawControlPanel from './MapDrawControlPanel'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

const acceptedFileMimeTypes = [
  'application/json',
  'application/geo+json',
  'application/vnd.google-earth.kml+xml', // .kml
  'application/vnd.google-earth.kmz', // .kmz
  'application/geopackage+vnd.sqlite3', // geopackage
  // Shapefile
  'application/octet-stream', // .shp
  'application/x-dbf', // .dbf
  'application/octet-stream' // .shx
]

// function getStringFromFile(file) {
//   return new Promise((resolve, reject) => {
//     const fr = new FileReader()
//     fr.onerror = reject
//     fr.onload = function (e) {
//       resolve(e.target.result)
//     }
//     fr.readAsText(file)
//   })
// }

const ProjectAreaMap = ({ height, extent /*drawMode*/ }) => {
  const [features, setFeatures] = useState({})
  const [geometryFile, setGeometryFile] = useState(false) // eslint-disable-line

  console.log('features', features)

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

  // // When draw mode changes
  // useEffect(() => {
  //   if (!drawControlRef) return

  //   drawControlRef.changeMode(drawMode)
  // }, [drawMode])

  const onAddGeomFile = (files) => {
    const reader = new FileReader()
    files.forEach((file) => {
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        // var uint8array = new TextEncoder('utf-8').encode(binaryStr)
        // var string = new TextDecoder().decode(uint8array)
        // const test = JSON.stringify(
        //   Array.from(new Uint8Array(JSON.stringify(Array.from(new Uint8Array(binaryStr)))))
        // )

        // console.log('parsed', JSON.parse(binaryStr))
        console.log('bin str', binaryStr)
      }
      // reader.readAsArrayBuffer(file)
      reader.readAsText(file)
    })

    console.log(files)
    setGeometryFile(files)
  }

  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures }
      for (const f of e.features) {
        newFeatures[f.id] = f
      }

      return newFeatures
    })
  }, [])

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures }
      for (const f of e.features) {
        delete newFeatures[f.id]
      }
      return newFeatures
    })
  }, [])

  const mapRef = useRef()

  return (
    <>
      <Typography variant='body2'>Draw a polygon or the map or upload from .shp or .kml</Typography>
      {/* <DownloadButtonGroup variant='outlined' aria-label='outlined primary button group'> */}
      {/* <Button onClick={() => setSiteAreaDrawMode('draw_polygon')}>Draw Polygon</Button> */}
      {/* <Button>Upload Polygon</Button> */}
      <DropzoneArea
        sx={'margin-top: 20px'}
        onChange={onAddGeomFile}
        filesLimit={1}
        acceptedFiles={acceptedFileMimeTypes}
      />
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: height || '400px' }}
        mapStyle='mapbox://styles/mapbox/streets-v9'>
        <MapDrawControl
          position='top-left'
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true
          }}
          // defaultMode={'static'}
          defaultMode={'draw_polygon'}
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </Map>
    </>
  )
}

ProjectAreaMap.defaultProps = {
  extent: undefined,
  height: undefined,
  // drawMode: 'static',
  polygon: undefined
}

ProjectAreaMap.propTypes = {
  extent: PropTypes.arrayOf(PropTypes.number),
  height: PropTypes.string,
  // drawMode: PropTypes.string,
  // setDrawMode: PropTypes.func.isRequired,
  polygon: GeoPropTypes.Polygon,
  setPolygon: PropTypes.func.isRequired
}

export default ProjectAreaMap
