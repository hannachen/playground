import Paper from 'paper'
import { isEmpty } from 'lodash'
import tinycolor from 'tinycolor2'
import Stack from './utils/Stack'
import Queue from './utils/Queue'
import LinkedList from './utils/LinkedList'
import './scss/app.scss'

class App {
  arraySize = 14
  boxSize = 35
  dataType = null
  types = {
    stack: {
      label: 'Stack',
      className: Stack,
      actions: [
        'push',
        'pop',
        'peek',
        'isEmpty',
        'size',
        'clear',
        'print',
        'toString'
      ]
    },
    queue: {
      label: 'Queue',
      className: Queue,
      actions: [
        'enqueue',
        'dequeue',
        'front',
        'isEmpty',
        'size',
        'clear',
        'print',
        'toString'
      ]
    },
    linkedList: {
      label: 'Linked List',
      className: LinkedList,
      actions: [
        'append',
        'insert',
        'removeAt',
        'remove',
        'indexOf',
        'isEmpty',
        'size',
        'getHead',
        'toString',
        'print'
      ]
    },
    dblLinkList: {
      label: 'Doubly Linked List',
      actions: []
    },
    set: {
      label: 'Sets',
      actions: []
    },
    dictionary: {
      label: 'Dictionary',
      actions: []
    },
    tree: {
      label: 'Tree',
      actions: []
    },
  }

  constructor() {
    this.initVariables()
    this.initEvents()
    this.init()
  }

  initVariables() {
    this.canvas = document.getElementById('app')
    this.debugForm = document.getElementById('debug-form')
    this.randomBtn = document.getElementById('random')
    this.debugButtonsContainer = document.getElementById('debug-buttons')
    this.debugConsole = document.getElementById('console')
    this.valueInput = document.getElementById('debug-data')
    this.offset = (this.canvas.getBoundingClientRect().height - (this.arraySize * this.boxSize)) / 2
    this.select = document.getElementById('structure')
  }

  initEvents() {
    this.randomBtn.addEventListener('click', this.onRandomBtnClick)
    this.debugForm.addEventListener('submit', this.onSubmitDebug)
    this.debugForm.addEventListener('debug', this.updateDebugInput)
    this.select.addEventListener('change', this.onSelectChange)
  }

  init() {

    Object.keys(this.types).forEach((option) => {
      const optionElement = document.createElement('option')
      optionElement.value = option
      optionElement.innerHTML = this.types[option]['label']
      this.select.appendChild(optionElement)
    })

    this.setDataType(this.select.value)

    Paper.setup(this.canvas)

    this.canvasLayer = new Paper.Layer()
    this.drawActionButtons()
  }

  drawActionButtons = () => {
    this.clearButtons()
    const actions = this.types[this.select.value]['actions']
    actions.forEach(this.createButton)
  }

  createButton = (text, index) => {

    // Debug buttons
    const buttonContainer = document.createElement('li')
    buttonContainer.setAttribute('class', 'button-container')

    const button = document.createElement('button')
    button.setAttribute('content', text)
    button.setAttribute('data-action', text)
    button.innerHTML = text
    button.addEventListener('click', this.onBtnClick, true)

    buttonContainer.appendChild(button)

    // parse method for more details...
    const testType = new this.types[this.select.value]['className']()
    const parameters = testType[text].length

    if (parameters > 0) {
      const args = this.getArgs(testType[text])
      args.forEach(arg => {
        // Create input field
        const input = document.createElement('input')
        input.setAttribute('class', 'argument')
        input.setAttribute('name', [text, arg].join('-'))

        // Label
        const label = document.createElement('label')
        label.innerText = arg
        label.appendChild(input)

        // Label to button container
        buttonContainer.appendChild(label)
      })
    }

    this.debugButtonsContainer.appendChild(buttonContainer)

    /*
    const newPos = index * 50
    const offset = 10
    const rectangle = new Paper.Rectangle(new Paper.Point(25, newPos + offset), new Paper.Point(125, newPos + 50))
    const cornerSize = new Paper.Size(4, 4)
    const path = new Paper.Path.RoundRectangle(rectangle, cornerSize)
    path.fillColor = new Paper.Color(.1, .35, .27)

    // text
    const btnText = new Paper.PointText(path.position.x, path.position.y)
    btnText.fillColor = 'white'
    btnText.content = text

    // Reposition text
    btnText.position = new Paper.Point(btnText.position.x - (btnText.bounds.width/2), path.position.y)

    const button = new Paper.Group([path, btnText])
    button.data.action = text
    button.onClick = this.onBtnClick

    this.actionsLayer.addChild(button)
*/
  }

  createBox = (value, index) => {
    const { boxSize } = this

    const square = new Paper.Path.Rectangle(
      new Paper.Point(this.canvas.getBoundingClientRect().width / 2, (index * boxSize) + this.offset),
      new Paper.Size(boxSize * 2, boxSize)
    )
    square.fillColor = new Paper.Color(.26, value/255, .95)

    // text
    const text = new Paper.PointText(square.position.x, square.position.y)
    text.fillColor = 'white'
    text.fontWeight = 800
    text.content = `${value}`

    // Reposition text
    text.position = new Paper.Point(text.position.x - (text.bounds.width/2), square.position.y)

    const group = new Paper.Group([square, text])
    this.canvasLayer.addChild(group)
  }

  createNode = (value, index) => {
    const { boxSize } = this
    const canvasCenterH = this.canvas.getBoundingClientRect().width / 2
    const verticalPos = (index * boxSize) + this.offset
    const rectangleSize = new Paper.Size(boxSize * 2, boxSize)

    // current
    const element = new Paper.Path.Rectangle(
      new Paper.Point(canvasCenterH, verticalPos), rectangleSize
    )
    element.fillColor = new Paper.Color(.26, value/255, .95)

    // current text
    const text = new Paper.PointText(element.position.x, element.position.y)
    text.fillColor = 'white'
    text.fontWeight = 800
    text.content = `${value}`

    // next
    const next = new Paper.Path.Rectangle(
      new Paper.Point(canvasCenterH + (boxSize * 2), verticalPos), rectangleSize
    )
    next.fillColor = new Paper.Color(.95, value/255, .95)

    // next text
    const nextText = new Paper.PointText(next.position.x, next.position.y)
    nextText.fillColor = 'white'
    nextText.fontWeight = 800
    nextText.content = `${value}`
  }

  drawBoxes = () => {
    this.canvasLayer.removeChildren()
    const boxes = !isEmpty(this.data.toString()) ? this.data.toString().split(',') : []
    boxes.forEach(this.getCallback())
    this.centerContent()
  }

  getCallback = () => {
    const { data } = this
    switch (true) {
      case data instanceof LinkedList:
        return this.createNode
        break
      case data instanceof Stack:
      case data instanceof Queue:
      default:
        return this.createBox
    }
  }

  setDataType = (selectValue = null) => {
    this.dataType = this.types[selectValue || this.select.value]
    this.data = new this.dataType.className()
  }

  updateDebugInput = (e) => {
    this.valueInput.value = e.detail.data
    this.clearConsole()
    const result = e.detail.result
    if (result !== null && result !== undefined) {
      const resultText = typeof result === 'boolean' ? (result === true ? 'true' : 'false') : result
      this.debugConsole.innerText = resultText
    }
  }

  /**
   * Re-center content
   */
  centerContent = () => {
    this.canvasLayer.position = new Paper.Point(
      this.canvas.getBoundingClientRect().width / 2,
      this.canvas.getBoundingClientRect().height / 2
    )
  }

  onBtnClickCb = (detail) => {
    const event = new CustomEvent('debug', { detail })
    this.debugForm.dispatchEvent(event)
  }

  onBtnClick = (e) => {
    const { target } = e
    const action = target.getAttribute('data-action')
    if (typeof this.data[action] === 'function') {
      const argCount = this.data[action].length
      const args = argCount > 0 ? this.getTargetValues(target) : null
      const result = this.data[action](args)
      this.onBtnClickCb({ action, result, data: this.data.toString() })
    }
    this.drawBoxes()
  }

  getTargetValues = (target) => {
    let args = []
    const inputs = Array.from(target.closest('li').querySelectorAll('input'))
    inputs.forEach((input) => {
      args.push(input.value || this.randomNumber())
    })
    return args.join(',')
  }

  onSubmitDebug = (e) => {
    e.preventDefault()
    const debugVal = this.valueInput.value ? this.valueInput.value.split(',') : []
    this.data = new this.dataType.className()
    const defaultAction = this.dataType.actions[0]
    debugVal.forEach((value) => this.data[defaultAction](value))
    this.drawBoxes()
  }

  onRandomBtnClick = (e) => {
    e.preventDefault()
    const randomNums = this.randomArray(this.arraySize, 0, 200)
    this.valueInput.value = randomNums.join()
  }

  onSelectChange = (e) => {
    e.preventDefault()
    this.clearButtons()
    this.clearConsole()
    this.setDataType(e.target.value)
    this.drawActionButtons()
  }

  clearConsole = () => {
    this.debugConsole.innerText = ''
  }

  clearButtons = () => {
    this.debugButtonsContainer.innerText = ''
  }

  randomNumber = (min = 0, max = 225) => {
    return (Math.round((max-min) * Math.random() + min))
  }

  randomArray = (numElements, min, max) => {
    let nums = new Array
    for (let element=0; element < numElements; element++) {
      nums[element] = this.randomNumber(min, max)
    }
    return (nums)
  }

  getArgs = (func) => {
    // First match everything inside the function argument parents.
    let args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1]

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function(arg) {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
      // Ensure no undefined values are added.
      return arg;
    });
  }
}

new App()