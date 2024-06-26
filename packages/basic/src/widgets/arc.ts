import type { FromCreate, Prop } from '@newcar/core'
import { changed, def, defineWidgetBuilder } from '@newcar/core'
import type { PathOptions, PathStyle } from './path'
import { createPath } from './path'

export interface ArcOptions extends PathOptions {
  style?: ArcStyle
}

export interface ArcStyle extends PathStyle {
}

export function createArc(radius: number, from: number, to: number, options?: ArcOptions) {
  return defineWidgetBuilder((ck) => {
    options ??= {}
    options.style ??= {}
    const path = createPath(options)(ck)
    const rect = ck.LTRBRect(
      -radius,
      -radius,
      radius,
      radius,
    )
    path.path.addArc(rect, from, to * path.progress.value)

    const radiusProp = def(radius)
    const fromProp = def(from)
    const toProp = def(to)

    changed(radiusProp, (v: Prop<number>) => {
      rect.set([-v.value, -v.value, v.value, v.value])
    })
    changed(fromProp, (v: Prop<number>) => {
      path.path.rewind()
      path.path.addArc(rect, v.value, toProp.value * path.progress.value)
    })
    changed(toProp, (v: Prop<number>) => {
      path.path.rewind()
      path.path.addArc(rect, fromProp.value, v.value * path.progress.value)
    })
    changed(path.progress, (v: Prop<number>) => {
      path.path.rewind()
      path.path.addArc(rect, fromProp.value, v.value * toProp.value)
    })

    return {
      ...path,
      from: fromProp,
      to: toProp,
      radius: radiusProp,
    }
  })
}

export type Arc = FromCreate<typeof createArc>
