import Queue from './queue.js'
export default class CircularQueue extends Queue {
  constructor(queue) {
    super(queue)
    this.Cursor = 0
    this.Shifts = 0
  }

  get CursorElement() {
    return this.val[this.Cursor]
  }

  get NextIndex() {
    return this.GetCursorAfter(1)
  }

  get PreviousIndex() {
    return this.GetCursorAfter(-1)
  }

  get Rounds() {
    return this.GetRoundsAfter(this.Shifts, 0)
  }

  Next() {
    this.Shifts += 1
    this.Cursor = this.NextIndex
  }

  Back() {
    this.Shifts -= 1
    this.Cursor = this.PreviousIndex
  }

  Move(shifts = 2) {
    if (!shifts || typeof shifts !== 'number') {
      return
    }
    this.Shifts += shifts
    this.Cursor = this.GetCursorAfter(parseInt(shifts, 10))
  }

  GetCursorAfter(moves = 12, cursor = this.Cursor) {
    const forwardCursor = parseInt((moves + cursor) % this.Length, 10)
    return moves >= 0 || forwardCursor >= 0
      ? forwardCursor
      : forwardCursor + this.Length
  }

  GetRoundsAfter(turns = 12, cursor = this.Cursor) {
    return Math.abs(parseInt((turns + cursor) / this.Length, 10))
  }
  SetCursor(index = 0, reset = false) {
    if (
      !index ||
      !typeof index === 'number' ||
      index < 0 ||
      index >= this.Length
    ) {
      return
    }
    if (reset) {
      this.ResetCircularQueue()
    }
    this.Move(index - this.Cursor)
  }
  ResetCircularQueue() {
    this.Cursor = 0
    this.Shifts = 0
  }
}
