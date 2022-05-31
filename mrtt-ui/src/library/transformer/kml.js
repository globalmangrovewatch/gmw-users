import { kml } from '@tmcw/togeojson'

export default class KML {
  constructor(content) {
    this.content = content
  }

  geojson() {
    return kml(new DOMParser().parseFromString(this.content, 'text/xml'))
  }
}
