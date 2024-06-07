import type { FromCreate } from '@newcar/core'
import { changed, def, defineWidgetBuilder } from '@newcar/core'
import type { Vector2 } from '../utils/vector2'
import type { PathOptions, PathStyle } from './path'
import { createPath } from './path'

export interface PolygonOptions extends PathOptions {
  style?: PolygonStyle
}

export interface PolygonStyle extends PathStyle {
}

export function createPolygon(points: Vector2[], options?: PolygonOptions) {
  return defineWidgetBuilder((ck) => {
    options ??= {}
    options.style ??= {}
    const pointsProp = points.map(point => def(point))

    const path = createPath(options)(ck)
    let index = 0

    function reset(points: Vector2[]) {
      path.path.rewind()
      for (const point of points) {
        if (index === 0)
          path.path.moveTo(...point)
        else
          path.path.lineTo(...point)
        index += 1
      }
    }

    for (const point of pointsProp) {
      changed(point, _v => reset(pointsProp.map(p => p.value)))
    }

    reset(pointsProp.map(p => p.value))

    return {
      ...path,
      points: pointsProp,
    }
  })
}

export type Polygon = FromCreate<typeof createPolygon>
