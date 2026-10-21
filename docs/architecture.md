# Architecture — DesiMart

## 1. Tech Stack (Front-End Only Architecture)

| Layer | Choice | Reason |
|-------|--------|--------|
| Markup | HTML5 | No build step |
| Styling | CSS3 with custom properties (design tokens) | iOS look with no framework |
| Logic | Vanilla JavaScript (ES modules) | Easy to read and explain |
| Data structures | Hand-written JS classes (`LinkedList`, `Stack`, `Queue`) | Core of the project |
| State Management | In-memory JS objects & `sessionStorage` (auth session only) | Front-end only; zero backend servers |
| Dev server | VS Code **Live Server** (or `npx serve`) | ES modules need `http://`, not `file://` |

> **Hard Rule:** Front-end only application. Zero network requests, zero backend servers, zero third-party APIs (no EmailJS, no Razorpay, no Express, no database). The UI never stores its own copy of data structures; it renders directly from snapshots (`toArray()`).

## 2. Folder Structure

```
desimart/
├── index.html
├── css/
│   ├── tokens.css          # colors, radius, shadows, spacing (from design.md)
│   ├── base.css            # reset, typography, layout
│   ├── components.css      # buttons, cards, chips, stepper, toast, auth, profile
│   ├── checkout.css        # multi-step checkout sheet & payment accordion
│   └── inspector.css       # bottom DS Inspector panel (4 columns)
├── js/
│   ├── data/
│   │   └── products.js     # PRODUCTS array (catalog)
│   ├── ds/
│   │   ├── Node.js         # CartNode + QueueNode
│   │   ├── LinkedList.js   # cart
│   │   ├── Stack.js        # undo
        └── Queue.js        # checkout queue & email outbox queue
│   ├── services/
│   │   ├── auth.js             # demo authentication & sessionStorage manager
│   │   ├── catalog.js          # search, filter, sort (array algorithms)
│   │   ├── emailService.js     # simulated front-end email delivery
│   │   ├── emailTemplates.js   # B&W HTML & text template generators (escaped)
│   │   ├── outbox.js           # emailOutbox Queue & FIFO worker
│   │   ├── paymentGateway.js   # simulated payment gateway API
│   │   ├── shop.js             # ShopService: orchestrates cart + undo + orders
│   │   └── validators.js       # Luhn check, mobile, PIN, UPI, price breakdown
│   ├── ui/
│   │   ├── icons.js            # SVG line icons
│   │   ├── motion.js           # reduced-motion & animation toggle controller
│   │   ├── overlay.js          # shared floating card overlay manager & focus trapper
│   │   ├── renderAuth.js       # demo sign-in view
│   │   ├── renderCart.js
│   │   ├── renderCatalog.js
│   │   ├── renderCheckout.js   # 3-step checkout & payment sheet
│   │   ├── renderInspector.js  # 4-column DS inspector visualizer
│   │   ├── renderOrders.js
│   │   ├── renderProfile.js    # profile sidebar & iOS sub-views navigation stack
│   │   └── toast.js
│   └── main.js             # wires events, auth state router, first render
└── docs/
    ├── prd.md
    ├── architecture.md
    ├── memory.md
    └── design.md
```

## 3. High-Level Data Flow

```
 User Sign-In / Order / Process Event
                │
                ▼
          main.js (event router)
                │
                ├─► ShopService (cart / undo / order queue)
                ├─► emailOutbox (Queue.js FIFO outbox)
                └─► emailService (simulated delivery to memory)
                        │
                        ▼
                 render() pipeline
                        │
 ┌──────────────────────┼──────────────────────┬──────────────────────┐
 ▼                      ▼                      ▼                      ▼
renderCatalog()     renderCart()          renderOrders()        renderInspector()
(reads catalog)    (reads cart.toArray)  (reads queue.toArray)  (reads all 4 structures)
```

## 4. Data Structure Designs

### 4.1 Product Catalog (Array)
`catalog.js` exposes hand-written algorithms: `findById(id)` (O(n)), `filterProducts` (O(n)), `searchByName` (O(n)), `sortProducts` (O(n²)).

### 4.2 Cart (Singly Linked List)
`CartLinkedList` with `head`, `tail`, `size`. `addItem` (O(n) find + O(1) append), `removeItem` (O(n)), `updateQty` (O(n)), `toArray` (O(n)).

### 4.3 Undo (Stack)
`Stack` (LIFO). `push` (O(1)), `pop` (O(1)), `peek` (O(1)). Pushes action records, pops on Undo to apply inverse operations.

### 4.4 Checkout Queue (Queue)
`Queue` (FIFO). `enqueue` (O(1)), `dequeue` (O(1)). Holds pending paid/COD orders.

### 4.5 Email Outbox Queue (Queue)
`emailOutbox` uses the **same `Queue` class** (FIFO).
- `enqueue`: When an order is placed or processed, email job `{ id, type, to, subject, createdAt, status }` is enqueued (O(1)).
- `dequeue`: `flushOutbox()` worker dequeues jobs one at a time (FIFO), waits ~800ms between jobs for visible draining, and delivers to `sentEmails` array in memory (O(1)).

## 5. Security & Privacy Model
- **Demo Auth**: Session-only demo (`sessionStorage`). Password is NEVER stored, logged, or kept. Form field is cleared immediately on submit.
- **HTML Escaping**: User input (display name, addresses, product names) is strictly escaped using `escapeHtml()` before embedding in HTML templates and preview cards.
- **Zero Card Storage**: Payment card numbers and CVVs are discarded immediately after validation.
- **Zero External Network Calls**: Pure front-end execution. Optional mailto link triggers local default mail client.
