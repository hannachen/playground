import Paper from 'paper'
import { isEmpty } from 'lodash'
import tinycolor from 'tinycolor2'
import rightArrow from 'svg-icon/dist/svg/ionic/arrow-right-c.svg'
import TypeSelect from './TypeSelect'
import structureTypes from './structureTypes'
import Queue from './utils/Queue'
import Stack from './utils/Stack'
import LinkedList from './utils/LinkedList'
import BinarySearchTree from './utils/BinarySearchTree'
import './scss/app.scss'

class App {
  arraySize = 14
  boxSize = 35
  arrowSvg = null

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
    this.select = new TypeSelect()
    this.data = new structureTypes[this.select.getSelected()]['className']
  }

  initEvents() {
    this.randomBtn.addEventListener('click', this.onRandomBtnClick)
    this.debugForm.addEventListener('submit', this.onSubmitDebug)
    this.debugForm.addEventListener('debug', this.updateDebugInput)
    this.select.on('change', this.onSelectChange)
  }

  init() {
    Paper.setup(this.canvas)

    // Load svg
    Paper.project.importSVG(rightArrow, {
      expandShapes: false,
      onLoad: this.onSvgLoaded
    })

    this.canvasLayer = new Paper.Layer()
    this.topLayer = new Paper.Layer()
    this.topLayer.bringToFront()

    this.drawActionButtons(structureTypes[this.select.getSelected()])
  }

  onSvgLoaded = (svg) => {
    const path = svg.children && svg.children.path ? svg.children.path : svg
    path.fillColor = 'white'
    this.arrowSvg = new Paper.SymbolDefinition(path)
  }

  drawActionButtons = (selected = {}) => {
    this.clearButtons()
    const actions = selected.actions || []
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
    const testType = new structureTypes[this.select.getSelected()]['className']
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
  }

  drawStack = () => {
    const boxes = !isEmpty(this.data.toString()) ? this.data.toString().split(',') : []
    boxes.forEach(this.createBox)
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

  drawList = (node = null, index = 0) => {
    const current = node || this.data.getHead()

    this.createNode(current, index)

    if (current.next) {
      this.drawList(current.next, index + 1)
    }
  }

  createNode = (node, index) => {
    const { boxSize } = this
    const canvasCenterH = this.canvas.getBoundingClientRect().width / 2
    const verticalPos = (index * boxSize) + this.offset
    const group = new Paper.Group()

    // index box
    const indexBoxSize = new Paper.Size(boxSize)
    const indexBox = new Paper.Path.Rectangle(
      new Paper.Point(canvasCenterH - boxSize, verticalPos), indexBoxSize
    )
    indexBox.strokeColor = 'white'
    group.addChild(indexBox)

    // index text
    const indexBoxPosition = [indexBox.position.x, indexBox.position.y]
    const indexText = new Paper.PointText(indexBoxPosition)
    indexText.fillColor = 'white'
    indexText.content = `${index}`
    indexText.position = new Paper.Point(indexBoxPosition)
    group.addChild(indexText)

    // current box
    const rectangleSize = new Paper.Size(boxSize * 2, boxSize)
    const element = new Paper.Path.Rectangle(
      new Paper.Point(canvasCenterH, verticalPos), rectangleSize
    )
    element.fillColor = new Paper.Color(.26, node.element/255, .95)
    group.addChild(element)

    // current text
    const elementCenter = [element.position.x, element.position.y]
    const text = new Paper.PointText(elementCenter)
    text.fillColor = 'white'
    text.fontWeight = 800
    text.content = `${node.element}`
    text.position = new Paper.Point(elementCenter)
    group.addChild(text)

    // next
    if (node.next) {
      const next = new Paper.Path.Rectangle(
        new Paper.Point(canvasCenterH + (boxSize * 2), verticalPos), rectangleSize
      )
      next.fillColor = new Paper.Color(.95, (node.next.element || 0)/255, .95)
      group.addChild(next)

      // next text
      const nextCenter = [next.position.x, next.position.y]
      const nextText = new Paper.PointText(nextCenter)
      nextText.fillColor = 'white'
      nextText.fontWeight = 800
      nextText.content = `${node.next.element}`
      nextText.position = new Paper.Point(nextCenter)
      group.addChild(nextText)
    }

    this.canvasLayer.addChild(group)

    // draw link
    const arrow = this.arrowSvg.place()
    arrow.position = new Paper.Point(canvasCenterH + (boxSize * 3) + 3, element.position.y)
    arrow.opacity = node.next ? 1 : 0
    arrow.scale(0.06)

    const arrowBox = new Paper.Path.Rectangle(
      new Paper.Point(canvasCenterH, verticalPos),
      new Paper.Size(boxSize * 5, boxSize)
    )
    arrowBox.strokeColor = 'white'

    const arrowGroup = new Paper.Group([arrow, arrowBox])
    this.topLayer.addChild(arrowGroup)
  }

  drawTree = () => {

    this.createBranch({
      node: this.data.getRoot(),
      maxDepth: this.data.getDepth()
    })
  }

  createBranch = ({ node, position = null, level = 1, maxDepth = 1 }) => {
    const canvasCenterH = this.canvas.getBoundingClientRect().width / 2
    const verticalPos = this.boxSize + this.offset
    const nodeCenter = position || new Paper.Point(canvasCenterH, verticalPos)

    if (node) {
      // draw circle
      const nodeCircle = new Paper.Path.Circle(nodeCenter, this.boxSize/2)
      nodeCircle.fillColor = 'black'
      nodeCircle.strokeColor = 'white'

      const text = new Paper.PointText(nodeCenter)
      text.fillColor = 'white'
      text.fontWeight = 800
      text.content = `${node.key}-${level}`
      text.position = new Paper.Point(nodeCenter)
    }
    if (node.left || node.right) {
      level++
    }
    if (node.left) {
      // draw line to bottom left
      const leftLineTerminal = this.calculateLineEndPosition({ from: nodeCenter, level, maxDepth })
      const leftLine = new Paper.Path.Line(nodeCenter, leftLineTerminal)
      leftLine.strokeColor = 'white'
      leftLine.sendToBack()

      // get line end position
      this.createBranch({ node: node.left, position: leftLineTerminal, level, maxDepth })
    }
    if (node.right) {
      // draw line to bottom right
      const rightLineTerminal = this.calculateLineEndPosition({ from: nodeCenter, direction: 'right', level, maxDepth })
      const rightLine = new Paper.Path.Line(nodeCenter, rightLineTerminal)
      rightLine.strokeColor = 'white'
      rightLine.sendToBack()

      // get line end position
      this.createBranch({ node: node.right, position: rightLineTerminal, level, maxDepth })
    }
  }

  calculateLineEndPosition = ({ from, direction = 'left', length = 40, level = 1, maxDepth = 1 }) => {
    const diff = maxDepth - level
    const ratio = level / maxDepth
    const amount =  25 + ((15 * ratio) * diff)
    const offset = direction === 'left' ? ~amount + 1 : amount
    const angle = 90 + offset
    const lengthOffset = level * 5
    const x = Math.cos(angle*Math.PI/180) * (length + lengthOffset) + from.x
    const y = Math.sin(angle*Math.PI/180) * (length + lengthOffset) + from.y

    return new Paper.Point(x, y)
  }

  visualize = () => {
    this.clearCanvas()
    this.getCallBack().call()
    this.centerContent()
  }

  getTargetValues = (target) => {
    let args = []
    const inputs = Array.from(target.closest('li').querySelectorAll('input'))
    inputs.forEach((input) => {
      args.push(input.value || this.randomNumber())
    })
    return args.join(',')
  }

  getCallBack = () => {
    const { data } = this
    switch (true) {
      case data instanceof BinarySearchTree:
        return this.drawTree
        break
      case data instanceof LinkedList:
        return this.drawList
        break
      case data instanceof Stack:
      case data instanceof Queue:
      default:
        return this.drawStack
    }
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
    const center = new Paper.Point(
      this.canvas.getBoundingClientRect().width / 2,
      this.canvas.getBoundingClientRect().height / 2
    )
    this.canvasLayer.position = center
    this.topLayer.position = center
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
    this.visualize()
  }

  onRandomBtnClick = (e) => {
    e.preventDefault()
    const randomNums = this.randomArray(this.arraySize, 0, 200)
    this.valueInput.value = randomNums.join()
  }

  onSubmitDebug = (e) => {
    e.preventDefault()
    const debugVal = this.valueInput.value ? this.valueInput.value.split(',') : []
    const selected = structureTypes[this.select.getSelected()]
    const defaultAction = selected.actions[0]
    this.data = new selected['className']

    // Go through data one at a time...
    debugVal.forEach(value => this.data[defaultAction](parseInt(value)))

    // draw
    this.visualize()
  }

  onSelectChange = (e, selected) => {
    const selectedType = structureTypes[selected]
    this.data = new selectedType['className']

    this.clearCanvas()
    this.clearTextarea()
    this.clearConsole()
    this.drawActionButtons(selectedType)
  }

  clearCanvas = () => {
    this.topLayer.removeChildren()
    this.canvasLayer.removeChildren()
  }

  clearTextarea = () => {
    this.valueInput.value = ''
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