import { parseZip, type ShpFeatureCollection } from 'shpjs'

export default class Shp {
  private readonly zipContent: ArrayBuffer

  constructor(zipContent: ArrayBuffer) {
    this.zipContent = zipContent
  }

  /** One FeatureCollection, or one per layer when the zip holds several shapefiles. */
  geojson(): Promise<ShpFeatureCollection | ShpFeatureCollection[]> {
    return parseZip(this.zipContent)
  }
}
