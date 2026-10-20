import type { FeatureCollection, Geometry } from 'geojson'

import { KML, Shp } from './transformer'
import type { ShpFeatureCollection } from 'shpjs'
import determineDataType from './determineDataType'
import getStringFromFile from './getStringFromFile'
import getArrayBufferFromFile from './getArrayBufferFromFile'

async function handleKML(data: File) {
  const parsedData = await getStringFromFile(data)
  const geojson = new KML(parsedData).geojson()
  return geojson
}

async function handleShp(data: File) {
  const parsedData = await getArrayBufferFromFile(data)
  const geojson = await new Shp(parsedData).geojson()
  return geojson
}

async function handleGeojson(data: File) {
  const stringData = await getStringFromFile(data)
  // Not validated here: ProjectAreaMap keeps the polygons and reports what it drops.
  const geojson: FeatureCollection<Geometry | null> = JSON.parse(stringData)
  return geojson
}

const handleFileLoadEvent = async (
  files: File[]
): Promise<FeatureCollection<Geometry | null> | ShpFeatureCollection[] | undefined> => {
  const type = await determineDataType(files[0])

  switch (type) {
    case 'kml':
      return handleKML(files[0])
    case 'shp':
      return handleShp(files[0])
    case 'geojson':
      return handleGeojson(files[0])
  }
}

export default handleFileLoadEvent
