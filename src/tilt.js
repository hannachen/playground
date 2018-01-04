import { chain, tween, easing } from 'popmotion'
import svg from 'stylefire/svg'
import './scss/app.scss'
import { average, getRandomInt } from './common'

class TiltApp {

  constructor() {

    this.init()
    this.initEvents()
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

  handleTilt = (e) => {
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
      const a = getRandomInt(this.a < 0 ? 0 : this.a, max)
      const pathA = this.paths[a]
      this.animatePath(pathA)
    }

    if (bVal !== this.b) {
      this.b = bVal
      const b = getRandomInt(this.b < 0 ? 0 : this.b, max)
      const pathB = this.paths[b]
      this.animatePath(pathB)
    }

    if (cVal !== this.c) {
      this.c = cVal
      const c = getRandomInt(this.c < 0 ? 0 : this.c, max)
      const pathC = this.paths[c]
      this.animatePath(pathC)
    }

    window.requestAnimationFrame(() => {
      document.getElementById('value').innerText = `${this.a}, ${this.b}, ${this.c}`
    })
  }

  initEvents = () => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.handleTilt, true)
      document.getElementById('doeSupported').innerText = 'Supported!'
    }
  }

  init() {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width
    const height = (window.innerHeight > 0) ? window.innerHeight : screen.height
    const svg = new Triangulr(width, height, 80, 40, colorGenerator)
    document.getElementById('app').appendChild(svg)

    this.paths = svg.getElementsByTagName('path')
    console.log(typeof this.paths)

    // console.log('PATHS', paths)

  }
}

new TiltApp()