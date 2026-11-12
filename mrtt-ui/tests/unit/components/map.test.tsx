import area from '@turf/area'
import { render, screen } from '@testing-library/react'
import type { Feature, Polygon } from 'geojson'

import MapDrawInfo from '@/components/MapDrawInfo'

// About 0.11 km × 0.11 km at the equator.
const smallSquare: Feature<Polygon> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0.001, 0],
        [0.001, 0.001],
        [0, 0.001],
        [0, 0]
      ]
    ]
  }
}

describe('MapDrawInfo', () => {
  it('shows the site area in km² rounded to two decimals', () => {
    const expected = Math.round((area(smallSquare) / 1_000_000) * 100) / 100
    expect(expected).toBeGreaterThan(0)
    expect(expected).toBeLessThan(1)

    render(<MapDrawInfo polygons={[smallSquare]} lineCount={0} pointCount={0} />)
    expect(screen.getByText(`Site Area: ${expected} km²`)).toBeInTheDocument()
  })

  it('reports dropped lines and points and the upload error', () => {
    render(<MapDrawInfo polygons={[]} lineCount={2} pointCount={1} error='Bad file' />)
    expect(screen.queryByText(/Site Area/)).not.toBeInTheDocument()
    expect(screen.getByText(/Uploaded file contains/)).toBeInTheDocument()
    expect(screen.getByText('Bad file')).toBeInTheDocument()
  })
})
