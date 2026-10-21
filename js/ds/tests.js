import { CartLinkedList } from './LinkedList.js';
import { Stack } from './Stack.js';
import { Queue } from './Queue.js';
import {
  validateMobile,
  validatePinCode,
  validateUpi,
  luhnCheck,
  detectCardBrand,
  calculatePriceBreakdown
} from '../services/validators.js';
import { deriveDisplayName, getInitials, isValidEmailFormat } from '../services/auth.js';
import { escapeHtml, buildOrderConfirmationEmail } from '../services/emailTemplates.js';
import { emailOutbox } from '../services/outbox.js';

/**
 * Console Test Runner for DesiMart Data Structures, Auth & Payment Validators
 */
export function runDsTests() {
  console.group('🧪 DesiMart Data Structure & Payment Tests');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`%c[PASS] ${message}`, 'color: #2E9E4F; font-weight: bold;');
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // --- 1. LINKED LIST TESTS ---
  console.group('1. CartLinkedList Tests');
  const cart = new CartLinkedList();
  const prodA = { id: 1, name: 'Masala Chai', price: 249 };
  const prodB = { id: 2, name: 'Basmati Rice', price: 165 };
  const prodC = { id: 3, name: 'Desi Ghee', price: 599 };

  cart.addItem(prodA);
  cart.addItem(prodB);
  cart.addItem(prodC);
  assert(cart.size === 3, 'Add A, B, C produces size 3');
  assert(cart.head.product.id === 1 && cart.tail.product.id === 3, 'Head is A and Tail is C');

  cart.addItem(prodA);
  assert(cart.size === 3, 'Add existing item A keeps size at 3');
  assert(cart.find(1).qty === 2, 'Add existing item A increases qty to 2');

  cart.removeItem(2);
  assert(cart.size === 2, 'Remove middle item B decreases size to 2');
  assert(cart.find(2) === null, 'Middle item B is no longer in list');
  assert(cart.head.next.product.id === 3, 'Head node A links directly to node C');

  cart.removeItem(1);
  assert(cart.size === 1, 'Remove head item A leaves size 1');
  assert(cart.head.product.id === 3, 'Head is now item C');

  cart.removeItem(3);
  assert(cart.size === 0, 'Remove last node C leaves size 0');
  assert(cart.head === null && cart.tail === null, 'Head and tail are both null after removing only node');
  console.groupEnd();

  // --- 2. STACK TESTS ---
  console.group('2. Undo Stack Tests');
  const stack = new Stack();
  stack.push({ type: 'ADD', productId: 1 });
  stack.push({ type: 'QTY', productId: 1, delta: 1 });
  stack.push({ type: 'REMOVE', productId: 2 });

  assert(stack.size() === 3, 'Stack size is 3 after 3 pushes');
  assert(stack.peek().type === 'REMOVE', 'Peek shows top item REMOVE');

  const pop1 = stack.pop();
  const pop2 = stack.pop();
  const pop3 = stack.pop();
  assert(pop1.type === 'REMOVE' && pop2.type === 'QTY' && pop3.type === 'ADD', 'Pops return actions in reverse (LIFO) order');
  assert(stack.isEmpty(), 'Stack is empty after 3 pops');
  console.groupEnd();

  // --- 3. QUEUE TESTS ---
  console.group('3. Checkout Queue Tests');
  const queue = new Queue();
  queue.enqueue({ id: 'ORD-1001', total: 500 });
  queue.enqueue({ id: 'ORD-1002', total: 750 });
  queue.enqueue({ id: 'ORD-1003', total: 300 });

  assert(queue.length === 3, 'Queue length is 3 after 3 enqueues');
  assert(queue.peek().id === 'ORD-1001', 'Peek shows front item ORD-1001');

  const deq1 = queue.dequeue();
  const deq2 = queue.dequeue();
  const deq3 = queue.dequeue();
  assert(deq1.id === 'ORD-1001' && deq2.id === 'ORD-1002' && deq3.id === 'ORD-1003', 'Dequeues return orders in original (FIFO) order');
  assert(queue.isEmpty(), 'Queue is empty after 3 dequeues');
  console.groupEnd();

  // --- 4. VALIDATOR & PAYMENT TESTS ---
  console.group('4. Validator & Payment Tests');

  // Luhn Check
  assert(luhnCheck('4111111111111111') === true, 'Luhn check passes for valid card 4111 1111 1111 1111');
  assert(luhnCheck('4000000000000002') === true, 'Luhn check passes for valid card number format 4000 0000 0000 0002');
  assert(luhnCheck('4111111111111112') === false, 'Luhn check fails for invalid card number');

  // Card Brand Detection
  assert(detectCardBrand('4111111111111111') === 'Visa', 'Brand detector identifies Visa starting with 4');
  assert(detectCardBrand('5211111111111111') === 'Mastercard', 'Brand detector identifies Mastercard starting with 52');
  assert(detectCardBrand('6080111111111111') === 'RuPay', 'Brand detector identifies RuPay starting with 60');

  // Mobile Validator
  assert(validateMobile('9876543210') === true, 'Mobile validator accepts 10 digits starting with 9');
  assert(validateMobile('5876543210') === false, 'Mobile validator rejects starting digit 5');
  assert(validateMobile('987654321') === false, 'Mobile validator rejects 9 digits');

  // PIN Code Validator
  assert(validatePinCode('400001') === true, 'PIN validator accepts 6 digits');
  assert(validatePinCode('40001') === false, 'PIN validator rejects 5 digits');

  // UPI Validator
  assert(validateUpi('success@test') === true, 'UPI validator accepts success@test');
  assert(validateUpi('invalid-upi') === false, 'UPI validator rejects missing @ symbol');

  // Price Breakdown Calculation
  const breakdown1 = calculatePriceBreakdown(300);
  assert(breakdown1.deliveryFee === 40, 'Delivery fee is Rs 40 for orders under Rs 999');
  assert(breakdown1.gst === 15, 'GST is 5% of Rs 300 = Rs 15');
  assert(breakdown1.grandTotal === 355, 'Grand total is 300 + 40 + 15 = 355');

  const breakdown2 = calculatePriceBreakdown(1000);
  assert(breakdown2.deliveryFee === 0, 'Delivery fee is FREE (Rs 0) for orders above Rs 999');

  console.groupEnd();

  // --- 5. AUTH & DISPLAY NAME TESTS ---
  console.group('5. Auth & Display Name Tests');
  assert(deriveDisplayName('rahul.sharma@example.com') === 'Rahul.sharma', 'deriveDisplayName extracts and capitalizes name before @');
  assert(deriveDisplayName('  john  ') === 'John', 'deriveDisplayName trims and capitalizes non-email username');
  assert(deriveDisplayName('') === 'Guest', 'deriveDisplayName falls back to Guest on empty input');

  assert(getInitials('Rahul Sharma') === 'RS', 'getInitials extracts RS from Rahul Sharma');
  assert(getInitials('rahul') === 'RA', 'getInitials extracts RA from single word rahul');
  assert(getInitials('') === 'GU', 'getInitials falls back to GU on empty input');

  assert(isValidEmailFormat('test@example.com') === true, 'isValidEmailFormat accepts test@example.com');
  assert(isValidEmailFormat('invalid-email') === false, 'isValidEmailFormat rejects string without @ and domain');
  console.groupEnd();

  // --- 6. EMAIL TEMPLATES & OUTBOX QUEUE TESTS ---
  console.group('6. Email Templates & Outbox Queue Tests');
  const maliciousName = '<script>alert(1)</script>';
  const escaped = escapeHtml(maliciousName);
  assert(escaped === '&lt;script&gt;alert(1)&lt;/script&gt;', 'escapeHtml sanitizes script tags correctly');

  const template = buildOrderConfirmationEmail({
    order: { id: 'ORD-999', total: 500, delivery: { city: 'Mumbai' }, payment: { method: 'Card' }, items: [] },
    user: { displayName: maliciousName }
  });
  assert(template.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'), 'Email template embeds escaped user HTML');
  assert(!template.html.includes('<script>'), 'Email template does NOT contain raw unescaped script tag');

  // Test Outbox FIFO Queue
  const testQueue = new Queue();
  testQueue.enqueue({ id: 'EML-1' });
  testQueue.enqueue({ id: 'EML-2' });
  testQueue.enqueue({ id: 'EML-3' });

  assert(testQueue.length === 3, 'Email outbox queue holds 3 enqueued jobs');
  const job1 = testQueue.dequeue();
  const job2 = testQueue.dequeue();
  const job3 = testQueue.dequeue();

  assert(job1.id === 'EML-1' && job2.id === 'EML-2' && job3.id === 'EML-3', 'Email outbox dequeues jobs in strict FIFO order');
  console.groupEnd();

  console.log(`%cSummary: ${passed} passed, ${failed} failed`, `font-weight: bold; color: ${failed === 0 ? '#2E9E4F' : '#D92D20'}`);
  console.groupEnd();
  return failed === 0;
}
