/**
 * Stack — Hand-written LIFO structure with an explicit top index pointer.
 * Used for the Undo system.
 */
export class Stack {
  constructor() {
    this.items = [];
    this.top = -1;
  }

  // Time Complexity: O(1)
  // Pushes an action onto the top of the stack.
  push(action) {
    this.top += 1;
    this.items[this.top] = action;
  }

  // Time Complexity: O(1)
  // Pops and returns the top action from the stack. Returns null if empty.
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    const action = this.items[this.top];
    this.items[this.top] = null;
    this.top -= 1;
    return action;
  }

  // Time Complexity: O(1)
  // Returns the top action without removing it. Returns null if empty.
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.top];
  }

  // Time Complexity: O(1)
  // Checks if the stack has no items.
  isEmpty() {
    return this.top === -1;
  }

  // Time Complexity: O(1)
  // Returns current number of items in the stack.
  size() {
    return this.top + 1;
  }

  // Time Complexity: O(n)
  // Returns a array snapshot from bottom to top for rendering in the Inspector.
  toArray() {
    const list = [];
    for (let i = 0; i <= this.top; i++) {
      list.push(this.items[i]);
    }
    return list;
  }

  // Time Complexity: O(1)
  // Resets the stack to empty.
  clear() {
    this.items = [];
    this.top = -1;
  }
}
