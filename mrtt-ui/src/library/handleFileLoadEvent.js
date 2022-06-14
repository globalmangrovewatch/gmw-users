import { KML, Shp } from './transformer'
import determineDataType from './determineDataType'
import getStringFromFile from './getStringFromFile'
import getArrayBufferFromFile from './getArrayBufferFromFile'

async function handleKML(data) {
  const parsedData = await getStringFromFile(data)
  const geojson = new KML(parsedData).geojson()
  return geojson
}

async function handleShp(data) {
  const parsedData = await getArrayBufferFromFile(data)
  const geojson = await new Shp(parsedData).geojson()
  return geojson
}

async function handleGeojson(data) {
  const stringData = await getStringFromFile(data)
  const geojson = JSON.parse(stringData)
  return geojson
}

const handleFileLoadEvent = async (files) => {
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
