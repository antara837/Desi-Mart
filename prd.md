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
- **FR-20** Fixed panel at the bottom with three sections: **Cart (Linked List)**, **Undo (Stack)**, **Orders (Queue)**.
- **FR-21** Linked list is drawn as boxes with arrows: `HEAD → [Chai | 2] → [Ghee | 1] → NULL`, with a `TAIL` label.
- **FR-22** Stack is drawn vertically with a `TOP` marker; queue horizontally with `FRONT` and `REAR` markers.
- **FR-23** The panel updates **immediately** after each operation and briefly highlights the changed node/item.
- **FR-24** A one-line **operation log** shows the last operation and its Big-O, e.g. `push(ADD Masala Chai) — O(1)`.
- **FR-25** Panel can be collapsed/expanded; on mobile it uses tabs (Cart · Stack · Queue).

### 7.6 Multi-Step Checkout & Payment Flow
- **FR-26** 3-Step Checkout modal (Delivery Details, Payment Method, Review & Pay).
- **FR-27** Hand-written validators for Indian mobile (10 digits starting 6-9), PIN code (6 digits), UPI ID (`name@bank`), and Luhn card validation.
- **FR-28** Price breakdown calculation: Subtotal, Delivery Fee (Free > ₹499 else ₹40), GST (5%), Grand Total.
- **FR-29** Simulated Payment Gateway API with 1.5–2.5s asynchronous delay and deterministic test responses.
- **FR-30** Order queueing condition: orders are enqueued into the checkout Queue ONLY AFTER payment succeeds.
- **FR-31** Failure safety: on payment failure/decline, cart, undo stack, and queue remain untouched.
- **FR-32** Security & Privacy: zero full card numbers or CVVs stored in state/DOM/logs; only brand and last 4 digits saved.

## 8. Non-Functional Requirements

- **Responsive:** works from 360 px phones to 1440 px desktops.
- **Performance:** every interaction feels instant (< 100 ms).
- **Accessibility:** touch targets ≥ 44 px, visible focus rings, sufficient text contrast, `aria-live` on toasts.
- **Readability:** heavy comments in data structure files; one class per file.
- **Browser support:** latest Chrome, Safari, Edge, Firefox.
- **Runs offline** after loading (no external APIs). Fonts may load from Google Fonts with system fallbacks.

## 9. Acceptance Criteria (Definition of Done)

- [ ] All four structures are hand-implemented (no built-in equivalents for the core logic).
- [ ] Adding the same product twice increments one node instead of creating two.
- [ ] Deleting head, middle and tail nodes all work with no broken links.
- [ ] Undo restores the exact previous cart state, in reverse order of actions.
- [ ] Orders are processed strictly in first-in-first-out order.
- [ ] Inspector matches the actual data structure state after **every** action.
- [ ] Layout looks correct on a 375 px-wide phone and a 1280 px-wide laptop.
- [ ] Manual test checklist in `memory.md` is fully ticked.

## 10. Viva / Demo Script (3–4 minutes)

1. Open the site → point out the product **array** (show `products.js`).
2. Add *Masala Chai* → Inspector shows a new **node**, stack shows `push`.
3. Add *Basmati Rice*, then *Ghee* → three nodes, pointers visible.
4. Add *Masala Chai* again → same node, `qty = 2` (no new node).
5. Remove the **middle** item → show pointer re-linking.
6. Press **Undo** → item returns, stack `pop`.
7. Place order twice → two entries in the **queue** (FRONT/REAR).
8. Press **Process Next** → oldest order leaves first (FIFO).
9. Finish with the complexity table (Section 11).

## 11. Complexity Cheat-Sheet (for viva)

| Structure | Operation | Time |
|-----------|-----------|------|
| Array | access by index | O(1) |
| Array | linear search | O(n) |
| Array | bubble/selection/insertion sort | O(n²) |
| Array | binary search (sorted) | O(log n) |
| Linked List (with tail pointer) | insert at tail | O(1) |
| Linked List | search/update/delete by product | O(n) |
| Linked List | traverse for total | O(n) |
| Stack | push / pop / peek | O(1) |
| Queue (linked, with front & rear) | enqueue / dequeue / peek | O(1) |

## 12. Likely Viva Questions

- *Why a linked list for the cart instead of an array?* Insert/delete doesn't shift elements; the cart changes often.
- *Why is undo a stack?* The most recent action must be reversed first (LIFO).
- *Why is checkout a queue?* First order placed must be processed first (FIFO).
- *What is the cost of adding to the cart?* O(n) to check for an existing product, then O(1) to append via the tail pointer.
- *What edge cases did you handle when deleting a node?* Head node, tail node (update tail), only node, node not found.

## 13. Milestones

| Phase | Deliverable | Est. |
|-------|-------------|------|
| 1 | Data structure classes + console tests | 1–2 days |
| 2 | Product catalog UI + cart wired to linked list | 2 days |
| 3 | Undo stack + order queue | 1–2 days |
| 4 | Inspector panel | 2 days |
| 5 | iOS-style polish, responsive fixes, testing | 2 days |
| 6 | Report, screenshots, viva practice | 1–2 days |

## 14. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Undo logic gets confusing | Start with "undo add" only, then extend to remove and quantity change. |
| Inspector goes out of sync | Render UI **only** from the data structures (single source of truth). |
| Scope creep | Anything under "Stretch" is optional. Ship the core first. |
| ES modules fail when opening `index.html` directly | Use VS Code **Live Server** or `npx serve`. |

## 15. Open Items

- Final design/mockups: to be added by the author (see `design.md`, section 12).
- Optional Java mirror of the data structures for the written report (see `architecture.md`, section 10).
