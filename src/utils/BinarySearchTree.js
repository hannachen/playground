const Node = function(key) {
  this.key = key
  this.left = null
  this.right = null
}

export default class BinarySearchTree {

  root = null

  insert = (key) => {
    const newNode = new Node(key)

    //special case - first element
    if (this.root === null) {
      this.root = newNode
    } else {
      this.insertNode(this.root, newNode)
    }
  }

  insertNode = (node, newNode) => {
    console.log('---')
    console.log('node', node.key)
    console.log('newNode', newNode.key)
    if (newNode.key < node.key) {
      console.log('newNode < node')
      console.log('left')
      if (node.left === null) {
        node.left = newNode
      } else {
        this.insertNode(node.left, newNode)
      }
    } else {
      console.log('newNode > node')
      console.log('right')
      if (node.right === null) {
        node.right = newNode
      } else {
        this.insertNode(node.right, newNode)
      }
    }
  }

  getRoot = () => {
    return this.root
  }

  getDepth = () => {
    const fringe = [{ node: this.root, depth: 1 }]
    let current = fringe.pop()
    let max = 0

    while (current && current.node) {
      const { left = null, right = null } = current.node

      // Find all children of this node
      if (left) {
        fringe.push({ node: left, depth: current.depth + 1 })
      }
      if (right) {
        fringe.push({ node: right, depth: current.depth + 1 })
      }

      if (current.depth > max) {
        max = current.depth
      }

      current = fringe.pop()
    }

    return max
  }

  search = (key) => {
    return this.searchNode(this.root, key)
  }

  searchNode = (node, key) => {
    if (node === null) {
      return false
    }
    if (key < node.key) {
      return this.searchNode(node.left, key)

    } else if (key > node.key){
      return this.searchNode(node.right, key)

    } else { //element is equal to node.item
      return true
    }
  }

  inOrderTraverse = (callback) => {
    this.inOrderTraverseNode(this.root, callback)
  }

  inOrderTraverseNode = (node, callback) => {
    if (node !== null) {
      this.inOrderTraverseNode(node.left, callback)
      callback(node.key)
      this.inOrderTraverseNode(node.right, callback)
    }
  }

  preOrderTraverse = (callback) => {
    this.preOrderTraverseNode(this.root, callback)
  }

  preOrderTraverseNode = (node, callback) => {
    if (node !== null) {
      callback(node.key)
      this.preOrderTraverseNode(node.left, callback)
      this.preOrderTraverseNode(node.right, callback)
    }
  }

  postOrderTraverse = (callback) => {
    this.postOrderTraverseNode(this.root, callback)
  }

  postOrderTraverseNode = (node, callback) => {
    if (node !== null) {
      this.postOrderTraverseNode(node.left, callback)
      this.postOrderTraverseNode(node.right, callback)
      callback(node.key)
    }
  }

  toString = () => {
    const vals = []
    this.inOrderTraverse(val => vals.push(val))
    return vals
  }

  min = () => {
    return this.minNode(this.root)
  }

  minNode = (node) => {
    if (node) {
      while (node && node.left !== null) {
        node = node.left
      }
      return node.key
    }
    return null
  }

  max = () => {
    return this.maxNode(this.root)
  }

  maxNode = (node) => {
    if (node) {
      while (node && node.right !== null) {
        node = node.right
      }
      return node.key
    }
    return null
  }

  remove = (element) => {
    this.root = this.removeNode(this.root, element)
  }

  findMinNode = (node) => {
    while (node && node.left !== null) {
      node = node.left
    }
    return node
  }

  removeNode = (node, element) => {
    if (node === null) {
      return null
    }
    if (element < node.key) {
      node.left = this.removeNode(node.left, element)
      return node

    } else if (element > node.key) {
      node.right = this.removeNode(node.right, element)
      return node

    } else { //element is equal to node.item

      //handle 3 special conditions
      //1 - a leaf node
      //2 - a node with only 1 child
      //3 - a node with 2 children

      //case 1
      if (node.left === null && node.right === null) {
        node = null
        return node
      }

      //case 2
      if (node.left === null) {
        node = node.right
        return node

      } else if (node.right === null) {
        node = node.left
        return node
      }

      //case 3
      let aux = findMinNode(node.right)
      node.key = aux.key
      node.right = removeNode(node.right, aux.key)
      return node
    }
  }
}