import type { Canvas, EmbindEnumEntity, InputCommands, Path as skPath } from 'canvaskit-wasm'
import type { FromCreate } from '@newcar/core'
import { defineWidgetBuilder } from '@newcar/core'
import type { FigureOptions, FigureStyle } from './figure'
import { createFigure } from './figure'

export interface PathOptions extends FigureOptions {
  style?: PathStyle
}

export interface PathStyle extends FigureStyle {
}

export function createPath(options?: PathOptions) {
  return defineWidgetBuilder((ck) => {
    options ??= {}
    options.style ??= {}
    const figure = createFigure(options)(ck)

    const path = new ck.Path()

    function addPathFromPathString(pathString: string) {
      path.addPath(
        ck.Path.MakeFromSVGString(pathString),
      )
    }

    function addPathFromCmds(cmds: InputCommands) {
      path.addPath(
        ck.Path.MakeFromCmds(cmds),
      )
    }

    function addPathFromOp(one: skPath, two: skPath, op: EmbindEnumEntity) {
      path.addPath(
        ck.Path.MakeFromOp(one, two, op),
      )
    }

    function render(canvas: Canvas) {
      figure.render(canvas)
      if (figure.style.fill.value)
        canvas.drawPath(path, figure.fillPaint)
      if (figure.style.border.value)
        canvas.drawPath(path, figure.strokePaint)
    }

    return {
      ...figure,
      path,
      addPathFromPathString,
      addPathFromCmds,
      addPathFromOp,
      render,
    }
  })
}

export type Path = FromCreate<typeof createPath>
