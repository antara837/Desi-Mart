import { QueueNode } from './Node.js';

/**
 * Queue — Hand-written FIFO structure with front and rear pointers.
 * Used for processing checkout orders.
 */
export class Queue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.length = 0;
  }

  // Time Complexity: O(1)
  // Appends a new order to the rear of the queue.
  enqueue(order) {
    const newNode = new QueueNode(order);
    if (this.isEmpty()) {
      this.front = newNode;
      this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }
    this.length += 1;
  }

  // Time Complexity: O(1)
  // Removes and returns the order at the front of the queue. Returns null if empty.
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const order = this.front.order;
    this.front = this.front.next;
    if (this.front === null) {
      this.rear = null;
    }
    this.length -= 1;
    return order;
  }

  // Time Complexity: O(1)
  // Returns the front order without removing it. Returns null if empty.
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.front.order;
  }

  // Time Complexity: O(1)
  // Returns true if the queue contains no items.
  isEmpty() {
    return this.length === 0;
  }

  // Time Complexity: O(n)
  // Creates a snapshot array from front to rear for rendering.
  toArray() {
    const list = [];
    let curr = this.front;
    while (curr !== null) {
      list.push(curr.order);
      curr = curr.next;
    }
    return list;
  }

  // Time Complexity: O(1)
  // Resets the queue to an empty state.
  clear() {
    this.front = null;
    this.rear = null;
    this.length = 0;
  }
}
