import area from '@turf/area'
import type { Feature, MultiPolygon, Polygon } from 'geojson'
import { memo, type ComponentProps } from 'react'

import { ErrorText } from '@/components/ui/typography'
import language from '@/language'
import { cn } from '@/lib/cn'

type MapDrawInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
  polygons: Feature<Polygon | MultiPolygon>[]
  /** Lines and points in the last uploaded file, which the site area leaves out. */
  lineCount: number
  pointCount: number
  error?: string
}

/** Site area in km² under the map, plus what an upload left out and any upload error. */
function MapDrawInfo({
  polygons,
  lineCount,
  pointCount,
  error,
  className,
  ...props
}: MapDrawInfoProps) {
  const polygonAreaSqKm = polygons.reduce((sum, polygon) => sum + area(polygon) / 1_000_000, 0)

  return (
    <div className={cn('flex flex-col gap-1 text-sm', className)} {...props}>
      {polygonAreaSqKm > 0 && (
        <p>
          {language.projectAreaMap.siteArea}: {Math.round(polygonAreaSqKm * 100) / 100} km²
        </p>
      )}
      {!!(lineCount || pointCount) && (
        <p>{language.projectAreaMap.getLineAndPointCounts(lineCount, pointCount)}</p>
      )}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  )
}

export default memo(MapDrawInfo)
export type { MapDrawInfoProps }
