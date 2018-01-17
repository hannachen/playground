import { isEmpty } from 'lodash'
import EventEmitter from 'event-emitter-es6'
import structureTypes from './structureTypes'

export default class TypeSelect extends EventEmitter {

  constructor() {
    super()

    this.initVariables()
    this.initEvents()
    this.init()
  }

  initVariables() {
    this.select = document.getElementById('structure')
  }

  initEvents() {
    this.select.addEventListener('change', this.onSelectChange)
  }

  init() {
    // generate type drop-down
    Object.keys(structureTypes).forEach((option) => {
      const optionElement = document.createElement('option')
      optionElement.value = option
      optionElement.innerHTML = structureTypes[option]['label']
      this.select.appendChild(optionElement)
    })
  }

  onSelectChange = (e) => {
    this.emit('change', e, this.select.value)
  }

  getSelected = () => {
    return this.select.value
  }
}