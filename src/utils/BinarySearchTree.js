export default class BinarySearchTree {

  root = null

  Node = (key) => {
    this.key = key
    this.left = null
    this.right = null
  }

  insert = (key) => {

    var newNode = new Node(key)

    //special case - first element
    if (root === null){
      this.root = newNode
    } else {
      this.insertNode(this.root, newNode)
    }
  }

  insertNode = (node, newNode) => {
    if (newNode.key < node.key) {
      if (node.left === null) {
        node.left = newNode
      } else {
        this.insertNode(node.left, newNode)
      }
    } else {
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

  min = () => {
    return this.minNode(this.root)
  }

  minNode = (node) => {
    if (node){
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
    if (node){
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