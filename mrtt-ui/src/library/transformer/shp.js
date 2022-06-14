import { parseZip } from 'shpjs'

export default class Shp {
  constructor(zipContent) {
    this.zipContent = zipContent
  }

  geojson() {
    return parseZip(this.zipContent)
  }
}
