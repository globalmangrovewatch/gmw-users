import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import determineDataType from '@/library/determineDataType'
import handleFileLoadEvent from '@/library/handleFileLoadEvent'
import { KML, Shp } from '@/library/transformer'

// Vitest runs from the project root; import.meta.url is not a file URL under jsdom.
const fixture = (name: string) => readFileSync(resolve(process.cwd(), 'tests/fixtures', name))

const toArrayBuffer = (buffer: Buffer): ArrayBuffer => new Uint8Array(buffer).buffer

// The loaders can return several layers; these fixtures hold exactly one.
const single = <T>(result: T | T[] | undefined): T => {
  if (result === undefined || Array.isArray(result))
    throw new Error('Expected one FeatureCollection')
  return result
}

const square = [
  [100, 1],
  [101, 1],
  [101, 2],
  [100, 2],
  [100, 1]
]

// KML coordinates carry an altitude, and togeojson keeps it.
const squareWithAltitude = square.map(([x, y]) => [x, y, 0])

// The shapefile ring is stored clockwise, as the format requires.
const squareClockwise = [
  [100, 1],
  [100, 2],
  [101, 2],
  [101, 1],
  [100, 1]
]

const geojsonContent = JSON.stringify({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Test site' },
      geometry: { type: 'Polygon', coordinates: [square] }
    }
  ]
})

describe('KML transformer', () => {
  it('turns a KML placemark into a GeoJSON FeatureCollection', () => {
    const geojson = new KML(fixture('site-area.kml').toString('utf-8')).geojson()

    expect(geojson.type).toBe('FeatureCollection')
    expect(geojson.features).toHaveLength(1)
    expect(geojson.features[0].properties).toMatchObject({ name: 'Test site' })
    expect(geojson.features[0].geometry).toEqual({
      type: 'Polygon',
      coordinates: [squareWithAltitude]
    })
  })

  it('throws on malformed XML', () => {
    // Which error depends on the DOMParser: browsers give the parser message, jsdom has no
    // message element, so only check that it fails instead of returning GeoJSON.
    expect(() => new KML('<kml><Document><Placemark></Document></kml>').geojson()).toThrow(Error)
  })
})

describe('Shapefile transformer', () => {
  it('turns a zipped shapefile into a GeoJSON FeatureCollection of polygons', async () => {
    const geojson = single(await new Shp(toArrayBuffer(fixture('site-area.zip'))).geojson())

    expect(geojson.type).toBe('FeatureCollection')
    expect(geojson.features).toHaveLength(1)
    expect(geojson.features[0].properties).toEqual({ name: 'Test site' })
    expect(geojson.features[0].geometry).toMatchObject({
      type: 'Polygon',
      coordinates: [squareClockwise]
    })
  })
})

describe('determineDataType', () => {
  it.each([
    ['site.geojson', 'geojson'],
    ['site.zip', 'shp'],
    ['site.kml', 'kml'],
    ['site.with.dots.kml', 'kml']
  ])('detects %s as %s from the extension', async (name, type) => {
    await expect(determineDataType(new File(['x'], name))).resolves.toBe(type)
  })

  it('reads a .json file and treats it as GeoJSON', async () => {
    await expect(determineDataType(new File([geojsonContent], 'site.json'))).resolves.toBe(
      'geojson'
    )
  })

  it('rejects an unzipped shapefile', async () => {
    await expect(determineDataType(new File(['x'], 'site.shp'))).rejects.toThrow(
      'Only zipped shapefiles are accepted'
    )
  })

  it('rejects unknown extensions', async () => {
    await expect(determineDataType(new File(['x'], 'site.txt'))).rejects.toThrow(
      'Unknown file format'
    )
  })

  it('ignores the MIME type: only the extension counts', async () => {
    const file = new File([geojsonContent], 'site.txt', { type: 'application/geo+json' })

    await expect(determineDataType(file)).rejects.toThrow('Unknown file format')
  })

  it('is case sensitive about the extension', async () => {
    await expect(determineDataType(new File(['x'], 'site.KML'))).rejects.toThrow(
      'Unknown file format'
    )
  })

  it('rejects a missing file', async () => {
    await expect(determineDataType(undefined)).rejects.toThrow('Unknown file format')
  })
})

describe('handleFileLoadEvent', () => {
  it('reads a KML file into GeoJSON', async () => {
    const file = new File([fixture('site-area.kml')], 'site-area.kml')

    const geojson = single(await handleFileLoadEvent([file]))

    expect(geojson.features[0].geometry).toEqual({
      type: 'Polygon',
      coordinates: [squareWithAltitude]
    })
  })

  it('reads a zipped shapefile into GeoJSON', async () => {
    const file = new File([fixture('site-area.zip')], 'site-area.zip')

    const geojson = single(await handleFileLoadEvent([file]))

    expect(geojson.features[0].geometry).toMatchObject({
      type: 'Polygon',
      coordinates: [squareClockwise]
    })
  })

  it.each(['site-area.geojson', 'site-area.json'])('parses %s as JSON', async (name) => {
    const geojson = await handleFileLoadEvent([new File([geojsonContent], name)])

    expect(geojson).toEqual(JSON.parse(geojsonContent))
  })

  it('rejects a .json file that is not valid JSON', async () => {
    await expect(handleFileLoadEvent([new File(['not json'], 'site.json')])).rejects.toThrow(
      SyntaxError
    )
  })

  it('rejects an unsupported file', async () => {
    await expect(handleFileLoadEvent([new File(['x'], 'site.csv')])).rejects.toThrow(
      'Unknown file format'
    )
  })
})
