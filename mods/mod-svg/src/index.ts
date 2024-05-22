import type { WidgetOptions, WidgetStyle } from '@newcar/core'
import { Widget } from '@newcar/core'
import { Circle, Rect } from '@newcar/basic'
import { Color, isUndefined } from '@newcar/utils'
import type { SVGItem } from './interfaces'
import { transform } from './transform'

export interface SVGOptions extends WidgetOptions {
  style?: SVGStyle
}

export interface SVGStyle extends WidgetStyle { }

export class SVG extends Widget {
  private tree: any

  constructor(public svg: string, options?: SVGOptions) {
    options ??= {}
    super(options)
    this.tree = transform(svg)
  }

  private processSVGItem(item: SVGItem) {
    switch (item.tag) {
      case 'circle':
        this.add(new Circle(item.props.r, {
          x: item.props.cx,
          y: item.props.cy,
          style: {
            fill: !isUndefined(item.props.fill),
            border: !isUndefined(item.props.stroke),
            fillColor: Color.parse(item.props.fill),
            borderColor: Color.parse(item.props.stroke),
            borderWidth: item.props.strokeWidth,
          },
        }))
        break
      case 'rect':
        this.add(new Rect([0, 0], [item.props.width, item.props.height], {
          x: item.props.x,
          y: item.props.y,
          style: {
            fill: !isUndefined(item.props.fill),
            border: !isUndefined(item.props.stroke),
          },
        }))
        break
    }
    for (const child of item.children)
      this.processSVGItem(child)
  }
}
