import { kml } from '@tmcw/togeojson'
import type { FeatureCollection, Geometry } from 'geojson'

export default class KML {
  private readonly content: string

  constructor(content: string) {
    this.content = content
  }

  geojson(): FeatureCollection<Geometry | null> {
    const parsedDoc = new DOMParser().parseFromString(this.content, 'text/xml')
    const errorNode = parsedDoc.querySelector('parsererror')

    if (errorNode) {
      // Chrome wraps the parser message in a <div>; Firefox puts it straight in <parsererror>.
      throw new Error(
        errorNode.querySelector<HTMLElement>('div')?.innerText ?? errorNode.textContent ?? ''
      )
    }
    return kml(parsedDoc)
  }
}
