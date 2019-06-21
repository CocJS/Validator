import Arrays from './index.js'
export default class Queue extends Arrays {
  constructor(array) {
    super(array)
  }

  get Empty() {
    return this.Length ? false : true
  }

  get Front() {
    return this.val[0]
  }

  get Rear() {
    return this.Last
  }

  get Size() {
    return this.Length
  }

  // Methods

  Enqueue(val = 'foo') {
    this.val.push(val)
  }

  Dequeue() {
    this.val.splice(0, 1)
  }
}
