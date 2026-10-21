import { CartLinkedList } from '../ds/LinkedList.js';
import { Stack } from '../ds/Stack.js';
import { Queue } from '../ds/Queue.js';
import { PRODUCTS } from '../data/products.js';
import { findById } from './catalog.js';
import { calculatePriceBreakdown } from './validators.js';
import { PaymentGateway } from './paymentGateway.js';

/**
 * ShopService — Orchestrates Cart (LinkedList), Undo (Stack), and Orders (Queue).
 * UI code communicates solely through ShopService methods and reads toArray() snapshots.
 */
export class ShopService {
  constructor(onChangeCallback = () => {}) {
    this.cart = new CartLinkedList();
    this.undoStack = new Stack();
    this.orderQueue = new Queue();
    this.orderHistory = [];
    this.paymentAttempts = [];
    this.nextOrderNo = 1001;
    this.onChange = onChangeCallback;
    this.lastOp = "Initialized — Ready";
    this.lastChangedId = null;
  }

  // Time Complexity: O(n) find + O(1) append
  // Adds a product to cart and pushes ADD action to undo stack.
  addToCart(productId, selectedVariant = null, initialQty = 1) {
    const originalProduct = findById(PRODUCTS, productId);
    if (!originalProduct) return;

    let productToAdd = originalProduct;
    if (selectedVariant) {
      productToAdd = {
        ...originalProduct,
        name: `${originalProduct.name} (${selectedVariant})`
      };
    }

    const node = this.cart.addItem(productToAdd);
    if (initialQty > 1 && node) {
      node.qty += (initialQty - 1);
    }

    this.undoStack.push({
      type: "ADD",
      productId: originalProduct.id,
      name: productToAdd.name
    });

    this.lastOp = `cart.addItem(${productToAdd.name}) — O(n) find + O(1) append`;
    this.lastChangedId = originalProduct.id;
    this.notify();
  }

  // Time Complexity: O(n)
  // Changes item quantity by delta. If node reaches 0, removes it and pushes REMOVE to stack.
  changeQty(productId, delta) {
    const node = this.cart.find(productId);
    if (!node) return;

    const newQty = node.qty + delta;
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cart.updateQty(productId, delta);
    this.undoStack.push({
      type: "QTY",
      productId: productId,
      delta: delta,
      name: node.product.name
    });

    this.lastOp = `cart.updateQty(${node.product.name}, ${delta > 0 ? '+1' : '-1'}) — O(n)`;
    this.lastChangedId = productId;
    this.notify();
  }

  // Time Complexity: O(n)
  // Removes a product node from cart and pushes REMOVE action to undo stack.
  removeFromCart(productId) {
    const node = this.cart.find(productId);
    if (!node) return;

    const product = node.product;
    const qty = node.qty;

    this.cart.removeItem(productId);
    this.undoStack.push({
      type: "REMOVE",
      product: product,
      qty: qty,
      name: product.name
    });

    this.lastOp = `cart.removeItem(${product.name}) — O(n) delete`;
    this.lastChangedId = productId;
    this.notify();
  }

  // Time Complexity: O(1) stack pop + inverse cart operation
  // Undoes the last cart action by calling cart methods directly (never pushes to stack).
  undo() {
    if (this.undoStack.isEmpty()) return;

    const action = this.undoStack.pop();

    if (action.type === "ADD") {
      this.cart.updateQty(action.productId, -1);
    } else if (action.type === "REMOVE") {
      this.cart.addItem(action.product);
      const restoredNode = this.cart.find(action.product.id);
      if (restoredNode) {
        restoredNode.qty = action.qty;
      }
    } else if (action.type === "QTY") {
      this.cart.updateQty(action.productId, -action.delta);
    }

    this.lastOp = `undoStack.pop(${action.type} ${action.name || ''}) — O(1) pop`;
    this.lastChangedId = action.productId || (action.product ? action.product.id : null);
    this.notify();
  }

  // Time Complexity: O(1) Queue Enqueue + O(1) Clear Cart & Stack (Asynchronous Payment API call)
  // Executes simulated checkout. On payment success ONLY, enqueues order and clears cart/undo stack.
  async checkout(deliveryDetails, paymentMethod, paymentDetails = {}) {
    if (this.cart.size === 0) {
      return { success: false, reason: "Cart is empty" };
    }

    const subtotal = this.cart.getTotal();
    const priceBreakdown = calculatePriceBreakdown(subtotal);
    const intent = PaymentGateway.createPaymentIntent(priceBreakdown);

    // Call simulated payment gateway API
    const result = await PaymentGateway.pay(intent.intentId, paymentMethod, paymentDetails);

    // Record payment attempt
    this.paymentAttempts.push({
      timestamp: new Date().toLocaleTimeString('en-IN'),
      method: paymentMethod,
      status: result.status,
      reason: result.reason
    });

    if (result.status === "success") {
      const order = {
        id: `ORD-${this.nextOrderNo++}`,
        items: this.cart.toArray(),
        priceBreakdown: priceBreakdown,
        total: priceBreakdown.grandTotal,
        delivery: {
          name: deliveryDetails.name,
          mobile: deliveryDetails.mobile,
          address: deliveryDetails.address,
          city: deliveryDetails.city,
          state: deliveryDetails.state,
          pin: deliveryDetails.pin
        },
        payment: {
          method: paymentMethod,
          brand: paymentDetails.brand || (paymentMethod === 'upi' ? 'UPI' : 'COD'),
          last4: paymentDetails.last4 || (paymentMethod === 'upi' ? (deliveryDetails.mobile || '1234').slice(-4) : 'COD'),
          paymentId: result.paymentId,
          paymentStatus: paymentMethod === 'cod' ? 'COD' : 'PAID'
        },
        placedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: "PENDING"
      };

      // 1. Enqueue order into FIFO Queue
      this.orderQueue.enqueue(order);

      // 2. Clear Cart Linked List & Undo Stack
      this.cart.clear();
      this.undoStack.clear();

      this.lastOp = `payment success -> enqueue(${order.id}), O(1) enqueue`;
      this.lastChangedId = order.id;
      this.notify();
      return { success: true, order, result };
    } else {
      // Payment failed/declined: cart, undo stack, and queue remain EXACTLY as they were!
      this.lastOp = `payment ${result.status} (${result.reason}) — state preserved`;
      this.notify();
      return { success: false, reason: result.reason, result };
    }
  }

  // Time Complexity: O(1) dequeue
  // Dequeues the front order from the queue and marks it PROCESSED in history.
  processNextOrder() {
    if (this.orderQueue.isEmpty()) return null;

    const order = this.orderQueue.dequeue();
    order.status = "PROCESSED";
    this.orderHistory.unshift(order); // keep newest processed first in history array

    this.lastOp = `orderQueue.dequeue(${order.id}) — O(1) dequeue`;
    this.lastChangedId = order.id;
    this.notify();
    return order;
  }

  notify() {
    if (typeof this.onChange === 'function') {
      this.onChange(this);
    }
  }
}
