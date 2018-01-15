import Paper from 'paper'
import tinycolor from 'tinycolor2'
import { getWindowSize } from './utils/common'
import searchlightSvg from './images/searchlight.svg'
import './scss/app.scss'

class SearchLight {
  constructor() {
    this.init()
    this.initEvents()
  }

  init() {
    const canvas = document.getElementById('app')
    Paper.setup(canvas)

    const circle = new Paper.Path.Circle({
      center: [getWindowSize().width / 2, getWindowSize().height - 50],
      radius: 35,
      fillColor: 'red'
    })

    Paper.project.importSVG(searchlightSvg, {
      expandShapes: false,
      onLoad: this.onSvgLoaded
    })

    Paper.view.draw()
  }

  initEvents() {
    Paper.view.onMouseMove = this.onMouseMove
  }

  onSvgLoaded = (svg) => {
    const svgHalf = svg.bounds.height / 2
    const svgOffset = svg.bounds.height / 4
    const winCenterH = getWindowSize().width / 2
    const winCenterV = getWindowSize().height / 2
    const hCount = Math.round(getWindowSize().width / svgHalf) + 2
    const vCount = Math.round(getWindowSize().height / svgHalf) + 2

    const paths = svg.children
    paths.forEach((path) => {
      if (path instanceof Paper.Path) {
        path.fillColor = {
          gradient: {
            stops: ['rgba(255, 255, 225, 1)', 'rgba(255, 255, 225, 0)'],
            radial: true
          },
          origin: svg.bounds.top,
          destination: svg.bounds.bottom - 150,
        }
      }
    })
    svg.blendMode = 'lighter'

    const group = new Paper.Group({ children: [svg] })
    group.applyMatrix = false
    group.position = new Paper.Point(winCenterH, winCenterV + (svg.bounds.height/2))
    group.pivot = new Paper.Point(svg.bounds.left + (svg.bounds.width/2) + 5, svg.bounds.top)

    this.searchlight = group

    // Delete first layer
    // Paper.project.clear()


  }

  onMouseMove = (e) => {
    const { searchlight } = this
    const radians = Math.atan2(e.point.x - (Paper.view.bounds.width/2), e.point.y - (Paper.view.bounds.height/2))
    const degree = (radians * (180 / Math.PI) * -1)
    searchlight.rotation = degree
  }
}

new SearchLight()