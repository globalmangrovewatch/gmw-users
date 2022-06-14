import { kml } from '@tmcw/togeojson'

export default class KML {
  constructor(content) {
    this.content = content
  }

  geojson() {
    const parsedDoc = new DOMParser().parseFromString(this.content, 'text/xml')
    const errorNode = parsedDoc.querySelector('parsererror')

    if (errorNode) {
      throw new Error(parsedDoc.querySelector('parsererror').querySelector('div').innerText)
    } else {
      return kml(parsedDoc)
    }
  }
}
