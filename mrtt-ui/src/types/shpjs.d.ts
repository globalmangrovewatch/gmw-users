// shpjs 6 ships no types, and @types/shpjs describes v3. Only what the app uses.
declare module 'shpjs' {
  import type { FeatureCollection, Geometry } from 'geojson'

  /** A layer of the zip; shpjs adds the shapefile's name. */
  export type ShpFeatureCollection = FeatureCollection<Geometry | null> & { fileName?: string }

  export function parseZip(
    buffer: ArrayBuffer | ArrayBufferView,
    whiteList?: string[]
  ): Promise<ShpFeatureCollection | ShpFeatureCollection[]>
}
