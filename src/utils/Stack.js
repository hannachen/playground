const Stack = (() => {

  const items = new WeakMap()

  class Stack {
    constructor() {
      items.set(this, [])
    }

    push(element) {
      const s = items.get(this)
      s.push(element)
    }

    pop() {
      const s = items.get(this)
      const r = s.pop()
      return r
    }

    peek() {
      const s = items.get(this)
      return s[s.length-1]
    }

    isEmpty() {
      return items.get(this).length == 0
    }

    size() {
      const s = items.get(this)
      return s.length
    }

    clear() {
      items.set(this, [])
    }

    print() {
      console.log(this.toString())
    }

    toString() {
      return items.get(this).toString()
    }
  }
  return Stack
})()

export default Stack