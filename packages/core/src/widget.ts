import type { Canvas, CanvasKit } from 'canvaskit-wasm'

export type WidgetBuilder<T>
  = (T extends (ck: CanvasKit) => Widget ? T : never) extends (ck: CanvasKit) => infer R ? (ck: CanvasKit) => R : never

export function defineWidgetBuilder<T extends WidgetBuilder<T>>(builder: T): T {
  return builder
}

export interface Widget {
  update: (canvas: Canvas, elapsed: number, renderFunction: (canvas: Canvas) => any) => void
  render: (canvas: Canvas) => void
}

export type FromCreate<T> = T extends ((...args: any) => (ck: CanvasKit) => infer R) ? R : never
