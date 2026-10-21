import { CartNode } from './Node.js';

/**
 * CartLinkedList — Singly Linked List with head and tail pointers.
 * Used for the shopping cart.
 */
export class CartLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Time Complexity: O(n)
  // Searches for a node by product ID by traversing from head to tail.
  find(productId) {
    let curr = this.head;
    while (curr !== null) {
      if (curr.product.id === productId) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }

  // Time Complexity: O(n) to find existing node + O(1) append at tail if new.
  // Adds a product to the cart. If already present, increments quantity.
  addItem(product) {
    const existing = this.find(product.id);
    if (existing !== null) {
      existing.qty += 1;
      return existing;
    }

    const newNode = new CartNode(product, 1);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size += 1;
    return newNode;
  }

  // Time Complexity: O(n)
  // Updates quantity of a product by delta (+1 or -1). Removes node if qty reaches 0.
  updateQty(productId, delta) {
    const node = this.find(productId);
    if (node === null) return false;

    node.qty += delta;
    if (node.qty <= 0) {
      return this.removeItem(productId);
    }
    return true;
  }

  // Time Complexity: O(n)
  // Deletes a product node. Handles empty list, head, middle, tail, only node, not found.
  removeItem(productId) {
    if (this.head === null) return false; // Empty list

    // Case 1: Deleting the head node
    if (this.head.product.id === productId) {
      if (this.head === this.tail) {
        // Only node in the list
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
      }
      this.size -= 1;
      return true;
    }

    // Case 2: Deleting middle or tail node
    let prev = this.head;
    let curr = this.head.next;

    while (curr !== null) {
      if (curr.product.id === productId) {
        prev.next = curr.next;
        if (curr === this.tail) {
          // Target was the tail, update tail pointer to prev
          this.tail = prev;
        }
        this.size -= 1;
        return true;
      }
      prev = curr;
      curr = curr.next;
    }

    return false; // Not found
  }

  // Time Complexity: O(n)
  // Calculates total rupee value of all items in the list.
  getTotal() {
    let total = 0;
    let curr = this.head;
    while (curr !== null) {
      total += curr.product.price * curr.qty;
      curr = curr.next;
    }
    return total;
  }

  // Time Complexity: O(n)
  // Calculates total count of all item quantities in the list.
  getCount() {
    let count = 0;
    let curr = this.head;
    while (curr !== null) {
      count += curr.qty;
      curr = curr.next;
    }
    return count;
  }

  // Time Complexity: O(n)
  // Creates a clean array snapshot of items for safe UI rendering.
  toArray() {
    const items = [];
    let curr = this.head;
    while (curr !== null) {
      items.push({
        product: curr.product,
        qty: curr.qty
      });
      curr = curr.next;
    }
    return items;
  }

  // Time Complexity: O(1)
  // Resets the linked list to an empty state.
  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}
