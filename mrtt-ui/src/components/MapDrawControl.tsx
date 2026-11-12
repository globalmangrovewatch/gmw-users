'use client'

import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { useControl, type ControlPosition, type IControl } from 'react-map-gl/mapbox'

type MapDrawControlProps = MapboxDraw.MapboxDrawOptions & {
  /** Receives the MapboxDraw instance once the map has created it. */
  drawRef: RefObject<MapboxDraw | null>
  position?: ControlPosition
  onCreate?: (event: MapboxDraw.DrawCreateEvent) => void
  onUpdate?: (event: MapboxDraw.DrawUpdateEvent) => void
  onDelete?: (event: MapboxDraw.DrawDeleteEvent) => void
}

/** Adds Mapbox GL Draw to the surrounding react-map-gl Map. */
function MapDrawControl({
  drawRef,
  position,
  onCreate,
  onUpdate,
  onDelete,
  ...drawOptions
}: MapDrawControlProps) {
  // The map listeners are added once; they call the latest handlers through this ref.
  const handlers = useRef({ onCreate, onUpdate, onDelete })
  useEffect(() => {
    handlers.current = { onCreate, onUpdate, onDelete }
  }, [onCreate, onUpdate, onDelete])

  // Stable listener functions, so map.off removes exactly what map.on added.
  const [listeners] = useState(() => ({
    create: (event: MapboxDraw.DrawCreateEvent) => handlers.current.onCreate?.(event),
    update: (event: MapboxDraw.DrawUpdateEvent) => handlers.current.onUpdate?.(event),
    delete: (event: MapboxDraw.DrawDeleteEvent) => handlers.current.onDelete?.(event)
  }))

  // Listeners go on in onAdd, not in the create callback: StrictMode adds, removes and re-adds the
  // control, and the create callback runs only once, so listeners added there would be lost.
  const draw = useControl<IControl>(
    () => new MapboxDraw(drawOptions) as unknown as IControl,
    ({ map }) => {
      map.on('draw.create', listeners.create)
      map.on('draw.update', listeners.update)
      map.on('draw.delete', listeners.delete)
    },
    ({ map }) => {
      map.off('draw.create', listeners.create)
      map.off('draw.update', listeners.update)
      map.off('draw.delete', listeners.delete)
    },
    { position }
  ) as unknown as MapboxDraw

  useEffect(() => {
    drawRef.current = draw
  }, [draw, drawRef])

  return null
}

export default MapDrawControl
export type { MapDrawControlProps }
