import Paper from 'paper'
import tinycolor from 'tinycolor2'
import { getWindowSize } from './utils/common'
import targetSvg from './images/target.svg'
import { white, pink, rose } from './utils/colors'
import './scss/app.scss'

class App {
  constructor() {
    this.init()
    this.initEvents()
  }

  init() {
    const canvas = document.getElementById('app')
    Paper.setup(canvas)

    Paper.project.importSVG(targetSvg, {
      expandShapes: false,
      onLoad: this.onSvgLoaded
    })
    Paper.view.draw()
  }

  initEvents() {
    Paper.view.onMouseMove = this.onMouseMove
  }

  colorSvg = (svg, color) => {

    if (svg.hasChildren() && svg.children[1]) {
      const circles = svg.children[1].children
      const background = circles['background 1']
      background.fillColor = new Paper.Color(new tinycolor(white).toRgbString())

      const shapes = {
        center: circles['center 1'],
        ring1: circles['ring1 1'],
        ring2: circles['ring2 1'],
        ring3: circles['ring3 1'],
        ring4: circles['ring4 1']
      }
      Object.keys(shapes).forEach((key) => {
        shapes[key].fillColor = new Paper.Color(color)
      })
    }
  }

  onSvgLoaded = (svg) => {
    svg.visible = false

    const svgHalf = svg.bounds.height / 2
    const svgOffset = svg.bounds.height / 4
    const winCenterH = getWindowSize().width / 2
    const winCenterV = getWindowSize().height / 2
    const hCount = Math.round(getWindowSize().width / svgHalf) + 2
    const vCount = Math.round(getWindowSize().height / svgHalf) + 2

    // Delete first layer
    Paper.project.clear()

    for (let i = 0; i < vCount; i++) {
      const layerPaths = [...Array(hCount)].map((val, j) => {
        const copy = svg.clone()
        copy.visible = true
        copy.position.x += j * copy.bounds.width
        copy.onMouseEnter = this.onMouseEnter
        copy.onMouseLeave = this.onMouseLeave
        copy.data.tint = vCount-i
        const newColor = new tinycolor(pink).lighten(vCount-i).toRgbString()
        this.colorSvg(copy, newColor)
        return copy
      })

      const layer = new Paper.Layer(layerPaths)
      const hPos = i % 2 == 0 ? winCenterH - svgHalf : winCenterH
      const vPos = (svgOffset * i)
      const layerPos = new Paper.Point(hPos, vPos + winCenterV)

      layer.position = layerPos
      layer.data.originalPos = layerPos

      // Add layer
      Paper.project.addLayer(layer)
    }
  }

  onMouseMove = (e) => {
    // Get all layers
    const layers = Paper.project.layers
    const winCenterH = getWindowSize().width / 2
    const winCenterV = getWindowSize().height / 2

    layers.forEach((layer) => {
      const pos = layer.data.originalPos
      const distance = (pos.y - e.point.y) * .0005
      const mouseX = (e.point.x - winCenterH) * distance
      layer.position = new Paper.Point(pos.x + mouseX, pos.y)
    })
  }

  onMouseEnter = (e) => {
    const { target } = e
    const newColor = new tinycolor(rose).lighten(target.data.tint).toRgbString()
    this.colorSvg(target, newColor)
  }

  onMouseLeave = (e) => {
    const { target } = e
    const newColor = new tinycolor(pink).lighten(target.data.tint).toRgbString()
    this.colorSvg(target, newColor)
  }
}

new App()