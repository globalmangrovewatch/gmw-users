import getStringFromFile from './getStringFromFile'

export type DataType = 'geojson' | 'shp' | 'kml'

function verifyJsonFormat(file: File): Promise<DataType | ''> {
  return getStringFromFile(file)
    .then((): DataType => 'geojson')
    .catch(() => '' as const)
}

/** Picks the parser for an uploaded site area file from its extension (case sensitive). */
export async function determineDataType(file: File | undefined): Promise<DataType | ''> {
  if (!file) throw new Error('Unknown file format')

  const extension = file.name.split('.').slice(-1)[0]
  switch (extension) {
    case 'geojson':
      return 'geojson'
    case 'json':
      return verifyJsonFormat(file)
    case 'zip':
      return 'shp'
    case 'shp':
      throw new Error('Only zipped shapefiles are accepted')
    case 'kml':
      return 'kml'
    default:
      throw new Error('Unknown file format')
  }
}

export default determineDataType
