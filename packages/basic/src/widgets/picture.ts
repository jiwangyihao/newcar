import type { BaseOptions, FromCreate } from '@newcar/core'
import { changed, createBase, def, defineWidgetBuilder } from '@newcar/core'
import type { Canvas } from 'canvaskit-wasm'

export function createPicture(source: ArrayBuffer, options?: BaseOptions) {
  return defineWidgetBuilder((ck) => {
    options ??= {}
    const base = createBase(options)(ck)
    const sourceProp = def(source)

    let image = ck.MakeImageFromEncoded(sourceProp.value)

    function render(canvas: Canvas) {
      canvas.drawImage(image, 0, 0)
    }

    changed(sourceProp, (v) => {
      image = ck.MakeImageFromEncoded(v.value)
    })

    return {
      ...base,
      source: sourceProp,
      render,
    }
  })
}

export type Picture = FromCreate<typeof createPicture>
