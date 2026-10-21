/**
 * Node classes used by Linked List and Queue data structures.
 */

// CartNode represents a single item in the cart Linked List.
export class CartNode {
  constructor(product, qty = 1) {
    this.product = product; // { id, name, price, category, desc, tint, icon }
    this.qty = qty;         // Quantity of this product
    this.next = null;       // Pointer to the next CartNode in the list
  }
}

// QueueNode represents a single order in the checkout Queue.
export class QueueNode {
  constructor(order) {
    this.order = order;     // Order details object
    this.next = null;       // Pointer to the next QueueNode in the queue
  }
}
