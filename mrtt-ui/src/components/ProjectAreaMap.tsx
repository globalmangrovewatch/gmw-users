'use client'

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import type MapboxDraw from '@mapbox/mapbox-gl-draw'
import turfBbox from '@turf/bbox'
import type { BBox, Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'
import { LngLat } from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState, type ComponentProps } from 'react'
import { useDropzone, type Accept, type FileRejection } from 'react-dropzone'
import { LuUpload, LuX } from 'react-icons/lu'
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
  type MapRef
} from 'react-map-gl/mapbox'

import MapDrawControl from '@/components/MapDrawControl'
import MapDrawInfo from '@/components/MapDrawInfo'
import emptyFeatureCollection from '@/data/emptyFeatureCollection'
import language from '@/language'
import { cn } from '@/lib/cn'
import { env } from '@/lib/env'
import handleFileLoadEvent from '@/library/handleFileLoadEvent'

const MAPBOX_TOKEN = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// GeoJSON, KML and zipped shapefiles. Browsers often report no or a generic type for these,
// so the extensions are listed too.
const acceptedFiles: Accept = {
  'application/json': ['.json', '.geojson'],
  'application/geo+json': ['.geojson'],
  'application/vnd.geo+json': ['.geojson'],
  'application/vnd.google-earth.kml+xml': ['.kml'],
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  'multipart/x-zip': ['.zip'],
  'application/octet-stream': ['.zip', '.geojson', '.kml']
}

const lineTypes = ['LineString', 'MultiLineString']
const pointTypes = ['Point', 'MultiPoint']
const polygonTypes = ['Polygon', 'MultiPolygon']

type SiteAreaFeatureCollection = FeatureCollection<Geometry | null>

const isPolygon = (feature: Feature<Geometry | null>): feature is Feature<Polygon | MultiPolygon> =>
  !!feature.geometry && polygonTypes.includes(feature.geometry.type)

const countOfType = (features: Feature<Geometry | null>[], types: string[]) =>
  features.filter((feature) => !!feature.geometry && types.includes(feature.geometry.type)).length

type ProjectAreaMapProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** [west, south, east, north] to fit the map to; undefined zooms out. */
  extent?: BBox | number[]
  setExtent: (extent: BBox | undefined) => void
  height?: string
  siteAreaFeatureCollection?: SiteAreaFeatureCollection
  setSiteAreaFeatureCollection: (featureCollection: SiteAreaFeatureCollection) => void
}

/** Draw the site area on a map, or upload it from a GeoJSON, KML or zipped shapefile. */
function ProjectAreaMap({
  extent,
  setExtent,
  height = '400px',
  siteAreaFeatureCollection = emptyFeatureCollection as unknown as SiteAreaFeatureCollection,
  setSiteAreaFeatureCollection,
  className,
  ...props
}: ProjectAreaMapProps) {
  const mapRef = useRef<MapRef>(null)
  // The MapboxDraw instance, set by MapDrawControl once the map has created it.
  const drawControlRef = useRef<MapboxDraw | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>()
  const [uploadLineCount, setUploadLineCount] = useState(0)
  const [uploadPointCount, setUploadPointCount] = useState(0)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const animationProps = { padding: 40, duration: 1000 }

    try {
      if (extent) {
        map.fitBounds(
          [new LngLat(extent[0]!, extent[1]!).wrap(), new LngLat(extent[2]!, extent[3]!).wrap()],
          animationProps
        )
      } else {
        map.zoomTo(0, animationProps)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [extent])

  const onMapLoad = () => {
    if (siteAreaFeatureCollection.features.length && drawControlRef.current) {
      // Saved site areas only hold drawn polygons, so every feature has a geometry.
      const saved = siteAreaFeatureCollection as FeatureCollection
      drawControlRef.current.add(saved)
      setExtent(turfBbox(saved))
    }
  }

  const onDrop = async (files: File[], rejections: FileRejection[]) => {
    const draw = drawControlRef.current
    if (rejections.length) {
      setError(`${language.projectAreaMap.uploadErrorPrefix}: ${rejections[0]!.errors[0]?.message}`)
      return
    }
    if (!draw || !files.length) return

    try {
      const result = await handleFileLoadEvent(files)
      if (!result) throw new Error('Unsupported file')
      // A zip with several shapefiles gives one collection per shapefile.
      const features = (Array.isArray(result) ? result : [result]).flatMap(
        (collection) => collection.features as Feature<Geometry | null>[]
      )

      setUploadLineCount(countOfType(features, lineTypes))
      setUploadPointCount(countOfType(features, pointTypes))

      draw.deleteAll()
      draw.add({ type: 'FeatureCollection', features: features.filter(isPolygon) })
      setUploadedFileName(files[0]!.name)
      setError(undefined)
    } catch (e) {
      setError(`${language.projectAreaMap.uploadErrorPrefix}: ${e}`)
    }
    setSiteAreaFeatureCollection(draw.getAll())
  }

  const onRemoveUpload = () => {
    drawControlRef.current?.deleteAll()
    setUploadedFileName(undefined)
    setUploadLineCount(0)
    setUploadPointCount(0)
    setSiteAreaFeatureCollection(emptyFeatureCollection as unknown as SiteAreaFeatureCollection)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    maxFiles: 1,
    multiple: false
  })

  const syncFromDraw = useCallback(() => {
    if (drawControlRef.current) setSiteAreaFeatureCollection(drawControlRef.current.getAll())
  }, [setSiteAreaFeatureCollection])

  return (
    <div className={cn('flex flex-col gap-2.5', className)} {...props}>
      <p className='text-sm'>{language.projectAreaMap.siteAreaInstructions}</p>
      <div
        {...getRootProps({
          className: cn(
            'relative z-1 my-2.5 flex min-h-25 cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-black/25 bg-white p-5 text-center text-[10px] text-text transition-colors hover:border-brand-800 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:outline-none',
            isDragActive && 'border-brand-800 bg-brand-100'
          )
        })}>
        <input {...getInputProps()} aria-label={language.projectAreaMap.dropzoneText} />
        <LuUpload className='size-6 text-brand-800' aria-hidden='true' />
        <span>{language.projectAreaMap.dropzoneText}</span>
      </div>
      {uploadedFileName ? (
        <div className='flex items-center gap-2 text-sm'>
          <span>{uploadedFileName}</span>
          <button
            type='button'
            onClick={onRemoveUpload}
            aria-label={`Remove ${uploadedFileName}`}
            className='flex size-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-text hover:bg-brand-100'>
            <LuX className='size-4' aria-hidden='true' />
          </button>
        </div>
      ) : null}
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height }}
        initialViewState={{ longitude: 0, latitude: 0, zoom: 0.5 }}
        mapStyle='mapbox://styles/mapbox/satellite-streets-v11'
        onLoad={onMapLoad}>
        <MapDrawControl
          drawRef={drawControlRef}
          position='top-left'
          displayControlsDefault={false}
          controls={{ polygon: true, trash: true }}
          defaultMode='draw_polygon'
          onCreate={syncFromDraw}
          onUpdate={syncFromDraw}
          onDelete={syncFromDraw}
        />
        <GeolocateControl position='top-right' />
        <FullscreenControl position='top-right' />
        <NavigationControl position='top-right' />
        <ScaleControl />
      </Map>
      <MapDrawInfo
        polygons={siteAreaFeatureCollection.features.filter(isPolygon)}
        lineCount={uploadLineCount}
        pointCount={uploadPointCount}
        error={error}
      />
    </div>
  )
}

export default ProjectAreaMap
export type { ProjectAreaMapProps }
