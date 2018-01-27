import Queue from './utils/Queue'
import Stack from './utils/Stack'
import LinkedList from './utils/LinkedList'
import BinarySearchTree from './utils/BinarySearchTree'

const structureTypes = {
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
  /*
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
  */
  tree: {
    label: 'Binary Search Tree',
    className: BinarySearchTree,
    actions: [
      'insert',
      'getRoot',
      'getDepth',
      'search',
      'toString',
      'min',
      'max',
      'remove',
    ]
  },
}

export default structureTypes