# PRD — DesiMart (DSA Mini-Project)

> Working name: **DesiMart**. Rename freely.
> A mobile-friendly, iOS-styled shopping website for Indian products, built to *visibly demonstrate* four core data structures: **Array, Linked List, Stack, Queue**.

---

## 1. Overview

DesiMart is a small shopping website where users browse Indian products, add them to a cart, undo mistakes, and place orders. The real goal of the project is educational: every feature is powered by a hand-written data structure, and a live **Data Structure Inspector** panel at the bottom of the screen shows those structures changing in real time.

**One-line pitch:** *"A shopping app where you can literally watch the linked list, stack and queue work."*

## 2. Goals

| # | Goal |
|---|------|
| G1 | Demonstrate Array, Singly Linked List, Stack (LIFO) and Queue (FIFO) through real features, not toy examples. |
| G2 | Make the data structures **visible** via the Inspector panel (nodes, pointers, TOP, FRONT/REAR). |
| G3 | Deliver a clean, modern, iOS-style UI that works on phones and laptops. |
| G4 | Keep the code simple enough that a beginner can explain every line during viva. |

## 3. Non-Goals (keep the scope safe)

- No real backend servers, databases, third-party services, EmailJS/Razorpay integrations, or external API network calls. All state lives in memory (session-only demo authentication).
- No frameworks (React/Angular). Plain HTML + CSS + JavaScript.
- Not using built-in `Array.push/pop/shift`, `Stack`, `Queue`, or `LinkedList` classes for the **core** structures. They must be hand-implemented.

## 4. Target Users

- **Primary:** Professor / evaluator reviewing the DSA mini-project.
- **Secondary:** Classmates and demo audience using the site on phones or laptops.

## 5. Data Structure Mapping (the heart of the project)

| Feature | Data Structure | Why it fits | Key operations |
|---------|---------------|-------------|----------------|
| Product catalog | **Array** | Fixed list, index access, easy to filter/sort/search | traverse, linear search by `id`, filter by category, sort by price, optional binary search |
| Shopping cart | **Singly Linked List** | Items are added/removed frequently; no shifting needed | insert at tail, update quantity, delete node (head/middle/tail), traverse for total |
| Undo | **Stack (LIFO)** | Last action must be undone first | `push` on each cart action, `pop` on Undo, `peek`, `isEmpty` |
| Order placement | **Queue (FIFO)** | Orders are processed in the order placed | `enqueue` on Place Order, `dequeue` on Process Next, `peek`, `isEmpty` |
| Email outbox | **Queue (FIFO)** | Email notifications are processed one at a time in order | `enqueue` on order confirm/process, `dequeue` on background worker flush |

## 6. User Stories

1. As a shopper, I can **browse** products and filter by category so I can find items quickly.
2. As a shopper, I can **add** a product to my cart and see the quantity increase if I add it again.
3. As a shopper, I can **increase, decrease or remove** items in my cart.
4. As a shopper, I can **undo** my last cart action.
5. As a shopper, I can **place an order** and see it join the processing queue.
6. As an admin/demo user, I can click **Process Next Order** to dequeue the oldest order.
7. As an evaluator, I can watch the **Inspector** update live to see nodes, stack and queue change with each action.

## 7. Functional Requirements

### 7.1 Catalog (Array)
- **FR-1** Display ≥ 12 Indian products (name, emoji/image, price in ₹, category, short description) from a product array.
- **FR-2** Category chips (All, Groceries, Snacks, Beverages, Clothing, Home & Festive) filter the list.
- **FR-3** Search box performs a linear search over the array by name.
- **FR-4** Sort by price (low→high, high→low) using a hand-written sort (bubble/selection/insertion).
- **FR-5** *(Stretch)* Binary search by product `id` on the sorted array.

### 7.2 Cart (Linked List)
- **FR-6** "Add" inserts a new node at the **tail**; if the product already exists, increase that node's `qty` instead.
- **FR-7** Quantity stepper (+ / −) updates `qty` in the node. If qty reaches 0, the node is deleted.
- **FR-8** "Remove" deletes the node, correctly handling **head, middle and tail** cases.
- **FR-9** Cart total and item count are computed by **traversing** the list.
- **FR-10** Empty-cart state is shown with a friendly message.

### 7.3 Undo (Stack)
- **FR-11** Every cart action (add, remove, quantity change) **pushes** an action record onto the undo stack.
- **FR-12** "Undo" **pops** the top record and applies its inverse to the cart.
- **FR-13** Undo button is disabled when the stack is empty.
- **FR-14** Undoing must **not** push a new record (avoid infinite loop).
- **FR-15** Placing an order clears the undo stack.

### 7.4 Checkout (Queue)
- **FR-16** "Place Order" creates an order object (id, item snapshot, total, timestamp, status `PENDING`) and **enqueues** it, then clears the cart.
- **FR-17** "Process Next Order" **dequeues** the front order, marks it `PROCESSED`, and adds it to an order history list.
- **FR-18** Show queue length and the front order in the UI.
- **FR-19** Disable "Process Next" when the queue is empty.

### 7.5 Data Structure Inspector (bottom panel)
- **FR-20** Fixed panel at the bottom with four sections: **Cart (Linked List)**, **Undo (Stack)**, **Orders (Queue)**, and **Email Outbox (Queue)**.
- **FR-21** Linked list is drawn as boxes with arrows: `HEAD → [Chai | 2] → [Ghee | 1] → NULL`, with a `TAIL` label.
- **FR-22** Stack is drawn vertically with a `TOP` marker; queues horizontally with `FRONT` and `REAR` markers.
- **FR-23** The panel updates **immediately** after each operation and briefly highlights the changed node/item.
- **FR-24** A one-line **operation log** shows the last operation and its Big-O, e.g. `push(ADD Masala Chai) — O(1)`.
- **FR-25** Panel can be collapsed/expanded; on mobile it uses tabs (Cart · Stack · Orders · Email).

### 7.6 Multi-Step Checkout & Simulated Payment Flow
- **FR-26** 3-Step Checkout modal (Delivery Details, Payment Method, Review & Pay).
- **FR-27** Hand-written validators for Indian mobile (10 digits starting 6-9), PIN code (6 digits), UPI ID (`name@bank`), and Luhn card validation.
- **FR-28** Price breakdown calculation: Subtotal, Delivery Fee (Free > ₹499 else ₹40), GST (5%), Grand Total.
- **FR-29** Simulated Payment Gateway API with asynchronous delay and deterministic test responses.
- **FR-30** Order queueing condition: orders are enqueued into the checkout Queue ONLY AFTER payment succeeds.
- **FR-31** Failure safety: on payment failure/decline, cart, undo stack, and queue remain untouched.
- **FR-32** Security & Privacy: zero full card numbers or CVVs stored in state/DOM/logs; only brand and last 4 digits saved.

### 7.7 Demo Auth, Profile Sidebar & Simulated Email Notifications
- **FR-33** Demo Auth: state-based sign-in screen, accepts any non-empty identifier/password, session-only persistence.
- **FR-34** Profile Sidebar: iOS grouped list displaying user info, order history, email inbox, settings, and sign-out.
- **FR-35** Email Outbox Queue: simulated email service powered by `emailOutbox` Queue.
- **FR-36** Mailto Integration: optional "Open in mail app" button in email preview cards.
