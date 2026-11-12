import type MapboxDraw from '@mapbox/mapbox-gl-draw'
import { render } from '@testing-library/react'
import { StrictMode, useMemo, useEffect } from 'react'

import MapDrawControl from '@/components/MapDrawControl'

type Listener = (event: unknown) => void

// A map that only tracks controls and draw listeners.
const { map } = vi.hoisted(() => {
  const listeners = new Map<string, Set<Listener>>()
  const controls = new Set<unknown>()
  return {
    map: {
      listeners,
      controls,
      on: (type: string, listener: Listener) => {
        if (!listeners.has(type)) listeners.set(type, new Set())
        listeners.get(type)?.add(listener)
      },
      off: (type: string, listener: Listener) => listeners.get(type)?.delete(listener),
      fire: (type: string, event: unknown) => listeners.get(type)?.forEach((fn) => fn(event)),
      hasControl: (control: unknown) => controls.has(control),
      addControl: (control: unknown) => controls.add(control),
      removeControl: (control: unknown) => controls.delete(control)
    }
  }
})

vi.mock('@mapbox/mapbox-gl-draw', () => ({
  default: class {
    getAll = () => ({ type: 'FeatureCollection', features: [] })
  }
}))

// Same lifecycle as react-map-gl 8.1's useControl: the control is created once, then added in an
// effect (calling onAdd) and removed in its cleanup (calling onRemove).
vi.mock('react-map-gl/mapbox', () => ({
  useControl: (
    onCreate: (context: { map: typeof map }) => unknown,
    arg1?: unknown,
    arg2?: unknown
  ) => {
    const context = { map }
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- created once, like the library
    const control = useMemo(() => onCreate(context), [])
    useEffect(() => {
      const onAdd = typeof arg1 === 'function' && typeof arg2 === 'function' ? arg1 : null
      const onRemove = typeof arg2 === 'function' ? arg2 : typeof arg1 === 'function' ? arg1 : null
      if (!map.hasControl(control)) {
        map.addControl(control)
        onAdd?.(context)
      }
      return () => {
        onRemove?.(context)
        if (map.hasControl(control)) map.removeControl(control)
      }
      // oxlint-disable-next-line react-hooks/exhaustive-deps -- runs once, like the library
    }, [])
    return control
  }
}))

afterEach(() => {
  map.listeners.clear()
  map.controls.clear()
})

describe('MapDrawControl', () => {
  it('still hears draw events after a StrictMode remount', () => {
    const onCreate = vi.fn<(event: MapboxDraw.DrawCreateEvent) => void>()
    const drawRef = { current: null as MapboxDraw | null }

    render(
      <StrictMode>
        <MapDrawControl drawRef={drawRef} onCreate={onCreate} />
      </StrictMode>
    )

    const event = { type: 'draw.create', features: [] }
    map.fire('draw.create', event)

    expect(onCreate).toHaveBeenCalledExactlyOnceWith(event)
    expect(drawRef.current).not.toBeNull()
    expect(map.controls.size).toBe(1)
  })

  it('removes its listeners when unmounted', () => {
    const { unmount } = render(<MapDrawControl drawRef={{ current: null }} />)
    unmount()

    expect([...map.listeners.values()].every((set) => set.size === 0)).toBe(true)
    expect(map.controls.size).toBe(0)
  })
})
