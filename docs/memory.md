# memory.md — Project Memory for DesiMart

> **Purpose:** a living context file. Paste or attach it at the start of every AI-assistant session (Claude, Copilot, etc.) so the assistant remembers what the project is, what's decided, and what's done. Update it at the end of each work session.
>
> Read together with: `prd.md` (what), `architecture.md` (how), `design.md` (look).

---

## 1. Project Snapshot

- **Name:** DesiMart (working title)
- **What:** iOS-styled, mobile-friendly shopping website for Indian products
- **Why:** College Data Structures & Algorithms (DSA) mini-project
- **Author level:** beginner. Prefer simple code, small functions, and comments that explain *why*
- **Stack:** HTML + CSS + vanilla JavaScript (ES modules). Optional Java console mirror
- **Status:** 🟢 Completed (All 5 Phases Built & Verified)

## 2. Locked Decisions

| # | Decision | Reason |
|---|----------|--------|
| D1 | No frameworks, no build tools | Beginner-friendly, easy to explain |
| D2 | Product catalog = **Array** | Requirement |
| D3 | Cart = **Singly Linked List** with `head`, `tail`, `size` | Requirement; tail pointer gives O(1) append |
| D4 | Undo = **Stack** of action records | Requirement (LIFO) |
| D5 | Orders = **Queue** (linked, `front` / `rear`) | Requirement (FIFO) |
| D6 | UI renders **only from data-structure snapshots** (`toArray()`) | Keeps Inspector accurate |
| D7 | Undo calls cart methods directly so it never pushes to the stack | Avoids infinite undo loop |
| D8 | Placing an order clears the cart **and** the undo stack | Undoing across an order makes no sense |
| D9 | Product fallbacks = Category Tint + Line SVG Icon (No Emoji) | Clean modern design system |
| D10 | Run with Live Server / `npx serve` | ES modules need HTTP |
| D11 | Order Enqueue Condition = Payment Success ONLY | Prevents un-paid orders in FIFO Queue; failures preserve cart state |
| D12 | Security Rule = Zero sensitive card storage | Card number and CVV cleared from memory/DOM immediately after submit |

## 3. Rules for the AI Assistant

1. Do **not** use built-in `Array.push/pop/shift/unshift`, `Map`, or library classes for the **core** cart, stack and queue logic. Hand-code with nodes and pointers.
2. Keep every data-structure file under ~120 lines with a comment above each method stating its Big-O.
3. Never let UI code mutate nodes. Only `ShopService` may.
4. Explain new concepts briefly. The author must be able to defend every line in viva.
5. Follow `design.md` tokens. Don't invent new colors or radii.
6. When changing a file, show the complete updated function, not fragments.
7. Ask before adding any dependency.

## 4. Conventions

- **Files:** `PascalCase.js` for classes (`LinkedList.js`), `camelCase.js` for everything else.
- **Classes:** `PascalCase`. **Functions/variables:** `camelCase`. **CSS classes:** `kebab-case`.
- **CSS:** only use variables from `tokens.css`.
- **Money:** store as integers in rupees; format with `₹` + `toLocaleString("en-IN")`.
- **Commits:** small, present tense (`add linked list removeItem`).

## 5. Glossary

| Term | Meaning here |
|------|--------------|
| Node | One cart item box: `{ product, qty, next }` |
| HEAD / TAIL | First / last node of the cart list |
| TOP | Most recent action on the undo stack |
| FRONT / REAR | Oldest / newest order in the queue |
| Snapshot | Plain array made by `toArray()` for safe rendering |
| Inspector | Bottom panel that visualizes the three structures |

## 6. Progress Tracker

**Phase 1 — Data structures**
- [x] `LinkedList.js` (add, updateQty, remove, total, toArray, clear)
- [x] `Stack.js` (push, pop, peek, isEmpty, toArray)
- [x] `Queue.js` (enqueue, dequeue, peek, isEmpty, toArray)
- [x] Console tests pass (36 unit tests passed)

**Phase 2 — Catalog**
- [x] `products.js` with ≥ 12 items (12 authentic Indian products with photo fallbacks & SVGs)
- [x] `catalog.js` (findById, filter, search, bubble sort, binary search)

**Phase 3 — Service & Payment**
- [x] `ShopService` (add, changeQty, remove, undo, checkout, processNext)
- [x] `validators.js` (Luhn check, mobile, PIN, UPI, price breakdown)
- [x] `paymentGateway.js` (simulated payment gateway API with deterministic test rules)

**Phase 4 — UI & Checkout**
- [x] Tokens + base CSS + checkout.css
- [x] Catalog grid + category chips
- [x] Cart sheet with stepper & Checkout trigger
- [x] 3-Step Checkout sheet/modal with progress bar, validation, and simulated OTP
- [x] Undo button + toast
- [x] Orders list with PAID/COD badges + Process Next
- [x] Inspector panel (list, stack, queue with PAID/COD badges, op log)

**Phase 5 — Polish & Security**
- [x] Mobile layout at 375 px (full-screen checkout sheet)
- [x] Desktop layout at 1280 px (centered checkout card)
- [x] Animations, focus states, reduced-motion toggle
- [x] Security sanitization (zero card numbers persisted in DOM/memory)
- [x] README + verification report
- [x] Viva practice (see `prd.md` §10 and §12)

## 7. Manual Test Checklist

- [x] Add 3 different products → 3 nodes in Inspector
- [x] Add an existing product → same node, qty + 1
- [x] Remove head / middle / tail → pointers stay correct
- [x] Decrease qty to 0 → node removed
- [x] Undo after add / remove / qty change → previous state restored
- [x] Undo button disabled on empty stack
- [x] 3-Step Checkout validation → inline errors for invalid mobile/PIN/card/UPI
- [x] Payment Success (`4111...` or `success@test`) → order enqueued, cart cleared, stack cleared
- [x] Payment Failure (`4000...02` or `4000...95` or `fail@test`) → cart, stack, queue LEFT UNTOUCHED
- [x] Simulated OTP prompt → any 6 digits pass except 000000 (fails)
- [x] Place 2 orders → queue shows FRONT (older) and REAR (newer) with PAID/COD badges
- [x] Process Next → older order leaves first
- [x] Empty cart → Checkout disabled
- [x] Reload page → app starts clean, no console errors
- [x] Works on phone width (375 px) and desktop width (1280 px)

## 8. Known Issues / Ideas Parking Lot

- *(none)*

## 9. Session Log (append newest at top)

### Session 5 — Local Product Images Processing & UI Integration
- Done: Processed all 12 local product images from `product images/` into `assets/products/`, resized and center-cropped to 4:3 (800x600 px JPEG under 80 KB). Linked all 12 products in `js/data/products.js` to their respective image assets. Created `js/ui/renderImage.js` helper providing lazy loading, 250ms fade-in transition (respecting `motionOn()`), fallback tinted tiles with line icons (zero broken-image icons), and 1.03 desktop hover zoom inside rounded overflow-hidden cards. Added `assets/products/README.md` documenting image mappings.
- Decisions made: 100% matched mapping (12/12). `khadi-kurta.jpg` noted for vertical subject crop. 49/49 automated unit tests passing. Zero network requests made.
- Bugs found: None.
- Next step: All tasks and visual verifications complete.

### Session 4 — Demo Auth, Profile Sidebar & Simulated Email Outbox Queue
- Done: Implemented state-based demo sign-in (accepts any credentials, validates non-empty, derives displayName & initials, session-only persistence), Profile Sidebar (iOS grouped list, My Orders, Email Inbox, Settings, Sign Out), and simulated Email Service with an Email Outbox Queue (`emailOutbox` instance of `Queue.js`) visible as 4th column in DS Inspector.
- Decisions made: Front-end only architecture (zero network requests, zero backend, zero external services). 49 automated unit tests passing.
- Bugs found: None.
- Next step: All features & verification complete!

### Session 3 — Floating Card Overlay System & Product Detail Layout

### Session 2 — Multi-Step Checkout & Simulated Payment Gateway
- Done: Added `validators.js` (Luhn algorithm, mobile/PIN/UPI validators, price breakdown), `paymentGateway.js` (simulated gateway API), `renderCheckout.js` (3-step checkout sheet, OTP prompt, confirmation screen), and updated `ShopService.checkout()` to enqueue orders ONLY on payment success while keeping cart/stack untouched on failure.
- Decisions made: Hand-written Luhn algorithm and zero card storage for strict security. 36 automated unit tests passing.
- Bugs found: None.
- Next step: All features complete!

### Session 1 — Implementation & Full Verification
- Done: Built Phase 1 (Data Structures & Console tests), Phase 2 (Catalog & Array algorithms), Phase 3 (ShopService Orchestrator), Phase 4 (CSS iOS Design System, UI components, Inspector), Phase 5 (Motion toggle & responsive layouts).
- Decisions made: Zero emojis used; line SVGs & category tints used for product fallbacks; 19 automated unit tests passing.
- Bugs found: None.
- Next step: Ready for project submission and viva presentation!

### Session 0 — Planning
- Done: wrote `prd.md`, `architecture.md`, `memory.md`, `design.md`
- Decisions made: see Locked Decisions D1–D10
- Bugs found: none
- Next step: build `LinkedList.js` and test it in the console

## 10. Quick Prompt Template for New AI Sessions

```
Project: DesiMart (DSA mini-project). I'm a beginner.
Context files: prd.md, architecture.md, design.md, memory.md (attached).
Today's goal: <e.g., implement CartLinkedList.removeItem>
Constraints: follow the Rules for the AI Assistant in memory.md.
Please give complete code for the file(s) and a short explanation.
```
