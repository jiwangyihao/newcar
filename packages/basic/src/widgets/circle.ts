import type { FromCreate } from '@newcar/core'
import { changed, def, defineWidgetBuilder } from '@newcar/core'
import type { ArcOptions } from './arc'
import { createArc } from './arc'

export function createCircle(radius: number, options?: ArcOptions) {
  return defineWidgetBuilder((ck) => {
    options ??= {}
    options.style ??= {}
    const arc = createArc(radius, 0, 360, options)(ck)
    const radiusProp = def(radius)

    changed(radiusProp, (v) => {
      arc.radius.value = v.value
    })

    return {
      ...arc,
      radius: radiusProp,
    }
  })
}

export type Circle = FromCreate<typeof createCircle>
