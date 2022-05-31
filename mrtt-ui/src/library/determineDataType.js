import getStringFromFile from './getStringFromFile'

function verifyJsonFormat(file) {
  return getStringFromFile(file)
    .then(() => {
      return 'geojson'
    })
    .catch(() => {
      console.error('Unknown JSON format')
      return ''
    })
}

/**
 * Determines which file type is being used
 * @function
 * @param {Object} file - A file buffer
 * @returns {String} - The type of the file
 */

export async function determineDataType(file) {
  const extension = file?.name?.split('.').slice(-1)[0]
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
