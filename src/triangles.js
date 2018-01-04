import Triangulr from 'triangulr'
import { chain, tween, easing } from 'popmotion'
import svg from 'stylefire/svg'
import './scss/app.scss'

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

class Triangle {

  constructor() {
    this.size = 10
    this.paths = {}
    this.aList = []
    this.bList = []
    this.cList = []
    this.a = 0
    this.b = 0
    this.c = 0

    this.getRandomInt = this.getRandomInt.bind(this)
    this.handleOrientation = this.handleOrientation.bind(this)
  }

  attachEventsToPaths() {
    Object.keys(paths).forEach((i) => {
      const pathRenderer = svg(paths[i])
      pathRenderer.set({
        opacity: 1,
      })
      paths[i].addEventListener('mouseover', () => {
        tween({
          to: 0,
          transform: opacity,
          duration: 1000,
          ease: easing.easeInOut,
          loop: 1,
          onUpdate: (opacity) => pathRenderer.set('opacity', opacity)
        }).start()
      }, false)
      paths[i].addEventListener('mouseout', () => {
        tween({
          to: 1,
          duration: 1000,
          ease: easing.easeInOut,
          loop: 1,
          onUpdate: (opacity) => pathRenderer.set('opacity', opacity)
        }).start()
      }, false)
    })
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  animatePath(path) {
    const pathRenderer = svg(path)
    pathRenderer.set({
      opacity: 1,
    })
    chain([
      tween({
        to: 0,
        duration: 500,
        ease: easing.easeInOut,
        onUpdate: (opacity) => pathRenderer.set('opacity', opacity)
      }),
      tween({
        to: 1,
        duration: 500,
        ease: easing.easeInOut,
        onUpdate: (opacity) => pathRenderer.set('opacity', opacity)
      })
    ]).start()
  }

  average(list = []) {
    return Math.round(list.reduce((total = 0, num) => {
      return total + num
    }, 0) / list.length)
  }

  handleOrientation(e) {
    this.aList.push(e.alpha)
    this.bList.push(e.beta)
    this.cList.push(e.gamma)

    const aVal = this.aList.length === this.size ? this.average(this.aList) : this.a
    const bVal = this.bList.length === this.size ? this.average(this.bList) : this.b
    const cVal = this.cList.length === this.size ? this.average(this.cList) : this.c

    if (this.aList.length === this.size) {
      this.aList = []
    }
    if (this.bList.length === this.size) {
      this.bList = []
    }
    if (this.cList.length === this.size) {
      this.cList = []
    }

    const max = this.paths.length

    if (aVal !== this.a) {
      this.a = aVal
      const a = this.getRandomInt(this.a < 0 ? 0 : this.a, max)
      const pathA = this.paths[a]
      this.animatePath(pathA)
    }

    if (bVal !== this.b) {
      this.b = bVal
      const b = this.getRandomInt(this.b < 0 ? 0 : this.b, max)
      const pathB = this.paths[b]
      this.animatePath(pathB)
    }

    if (cVal !== this.c) {
      this.c = cVal
      const c = this.getRandomInt(this.c < 0 ? 0 : this.c, max)
      const pathC = this.paths[c]
      this.animatePath(pathC)
    }

    window.requestAnimationFrame(() => {
      document.getElementById('value').innerText = `${this.a}, ${this.b}, ${this.c}`
    })
  }

  init() {
    const colorGenerator = function(path) {
      const random = 32;
      const ratio = (path.x * path.y) / (path.cols * path.lines)
      const code = Math.floor(255 - (ratio * (255-random)) - Math.random()*random).toString(16)
      return '#'+code+code+code;
    }
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height

    const svg = new Triangulr(width, height, 80, 40, colorGenerator)
    document.getElementById('app').appendChild(svg)

    this.paths = svg.getElementsByTagName('path')
    console.log(typeof this.paths)

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.handleOrientation, true)
      document.getElementById('doeSupported').innerText = 'Supported!'
    }

    // console.log('PATHS', paths)

  }
}

const app = new Triangle()
app.init()