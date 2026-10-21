# design.md — DesiMart Design System (v2)

> Style brief: **quiet, restrained, iOS-clean.** Light grouped background, white rounded cards, soft neutral shadows, system-style typography, **flat pill-shaped black buttons**. It should look designed by a person: no emoji, no glow, no gradients, no neon.
>
> Motion is a core part of the feel, and users can switch it off with an **Animations toggle** (section 9).
>
> Section 13 is reserved for **your own design**. Anything you put there wins over the defaults below.

---

## 1. Design Principles

1. **Calm and clear:** lots of whitespace, one obvious action per card.
2. **Flat fills, soft depth:** solid colors and neutral shadows. Depth comes from layering, never from color.
3. **Rounded everything:** cards, chips, inputs and buttons never have sharp corners.
4. **Black is the action color:** primary buttons are solid black pills. Other colors are used only for status.
5. **Everything responds:** every tap, add, remove and state change has a small, purposeful animation.
6. **Show the data structures:** the Inspector is a first-class part of the UI.

## 2. "No AI Look" Rules (hard constraints)

| Never use | Use instead |
|-----------|-------------|
| Emoji anywhere (product images, buttons, toasts, headings, empty states, alt text) | Real product photos, or a flat tinted tile with a line icon |
| Glow, neon, or colored `box-shadow` / `drop-shadow` | Neutral shadows only, max 12–16% black |
| Gradients (backgrounds, buttons, text, borders) | Solid fills |
| Purple-to-blue or "AI" color schemes, sparkle or magic-wand icons | Neutral black / white / grey with one muted accent |
| Floating blurred blobs, glassmorphism cards | Plain surfaces (blur only on the sticky header) |
| Hype copy ("Awesome!", "Magical", "Supercharge") | Plain, specific copy ("Added to cart", "Order placed") |
| Centered-everything hero layouts and identical feature-card rows | Left-aligned, grid-based layouts with real content |
| Bouncy, over-long animations | Short, precise motion with a light spring at most |

Focus rings are solid 2 px outlines, not blurred glows.

## 3. Color Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#F2F2F7` | Page background (iOS grouped) |
| `--surface` | `#FFFFFF` | Cards, sheets |
| `--surface-2` | `#F7F7F9` | Nested areas, input fill |
| `--text` | `#111111` | Primary text |
| `--text-2` | `#6C6C70` | Secondary text |
| `--text-3` | `#8E8E93` | Captions, placeholders (non-essential only) |
| `--separator` | `#E5E5EA` | Hairlines |
| `--btn` | `#000000` | Primary button fill |
| `--btn-hover` | `#262626` | Primary button hover |
| `--btn-text` | `#FFFFFF` | Primary button text |
| `--accent` | `#007AFF` | Links, focus outline |
| `--success` | `#2E9E4F` | Processed |
| `--warning` | `#C77700` | Pending |
| `--danger` | `#D92D20` | Remove / destructive |

**Product tile tints** (fallback when no photo; muted, earthy):

| Category | Token | Value |
|----------|-------|-------|
| Groceries | `--tint-groceries` | `#EFE9DC` |
| Snacks | `--tint-snacks` | `#F1E4DC` |
| Beverages | `--tint-beverages` | `#E4EBE6` |
| Clothing | `--tint-clothing` | `#E6E9EF` |
| Home & Festive | `--tint-home` | `#EFE5E5` |

**Inspector (dark, neutral):**

| Token | Value | Use |
|-------|-------|-----|
| `--insp-bg` | `#1A1A1A` | Panel |
| `--insp-surface` | `#262626` | Node / item boxes |
| `--insp-line` | `#3A3A3C` | Borders, arrows |
| `--insp-text` | `#F5F5F5` | Text |
| `--insp-dim` | `#8A8A8E` | Labels |
| `--insp-list` | `#7FA8D6` | Linked-list tags (muted blue) |
| `--insp-stack` | `#D6A76A` | Stack tags (muted amber) |
| `--insp-queue` | `#8DBE9A` | Queue tags (muted sage) |
| `--insp-flash` | `#4A4A4D` | Just-changed background flash (flat, no glow) |

## 4. Typography

```css
--font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, system-ui, sans-serif;
--mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
```

Load Inter (400, 500, 600, 700) from Google Fonts so Android and Windows match.

| Style | Size / line-height | Weight | Use |
|-------|-------------------|--------|-----|
| Large Title | 34 / 41 | 700 | Page title (collapses on scroll) |
| Title 1 | 28 / 34 | 700 | Section titles |
| Title 2 | 22 / 28 | 600 | Card and sheet headings |
| Headline | 17 / 22 | 600 | Product name, row title |
| Body | 17 / 22 | 400 | Default |
| Subhead | 15 / 20 | 400 | Descriptions |
| Footnote | 13 / 18 | 400 | Meta |
| Caption | 12 / 16 | 500 | Chips, inspector labels |

Use `letter-spacing: -0.02em` on Large Title and Title 1, and `font-variant-numeric: tabular-nums` on prices and quantities.

## 5. Spacing, Radius, Shadow

**Spacing (4-pt grid):** `4, 8, 12, 16, 20, 24, 32, 40`.

| Radius token | Value | Use |
|--------------|-------|-----|
| `--r-sm` | `12px` | Inputs, small tiles |
| `--r-md` | `16px` | Images, inner elements |
| `--r-lg` | `24px` | Cards |
| `--r-xl` | `28px` | Bottom sheets (top corners) |
| `--r-pill` | `999px` | Buttons, chips, badges |

**Shadows (neutral only):**

```css
--shadow-1: 0 1px 2px rgba(0,0,0,.05), 0 2px 8px rgba(0,0,0,.04);
--shadow-2: 0 2px 4px rgba(0,0,0,.05), 0 10px 28px rgba(0,0,0,.09);
--shadow-3: 0 -6px 24px rgba(0,0,0,.16);
```

## 6. Copy-Paste `tokens.css`

```css
:root {
  --bg:#F2F2F7; --surface:#fff; --surface-2:#F7F7F9;
  --text:#111; --text-2:#6C6C70; --text-3:#8E8E93; --separator:#E5E5EA;
  --btn:#000; --btn-hover:#262626; --btn-text:#fff; --accent:#007AFF;
  --success:#2E9E4F; --warning:#C77700; --danger:#D92D20;

  --tint-groceries:#EFE9DC; --tint-snacks:#F1E4DC; --tint-beverages:#E4EBE6;
  --tint-clothing:#E6E9EF; --tint-home:#EFE5E5;

  --insp-bg:#1A1A1A; --insp-surface:#262626; --insp-line:#3A3A3C;
  --insp-text:#F5F5F5; --insp-dim:#8A8A8E;
  --insp-list:#7FA8D6; --insp-stack:#D6A76A; --insp-queue:#8DBE9A; --insp-flash:#4A4A4D;

  --font:-apple-system,BlinkMacSystemFont,"SF Pro Text","Inter","Segoe UI",Roboto,system-ui,sans-serif;
  --mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,Consolas,monospace;

  --r-sm:12px; --r-md:16px; --r-lg:24px; --r-xl:28px; --r-pill:999px;

  --shadow-1:0 1px 2px rgba(0,0,0,.05),0 2px 8px rgba(0,0,0,.04);
  --shadow-2:0 2px 4px rgba(0,0,0,.05),0 10px 28px rgba(0,0,0,.09);
  --shadow-3:0 -6px 24px rgba(0,0,0,.16);

  /* motion */
  --ease-out:cubic-bezier(.2,.8,.2,1);
  --ease-in:cubic-bezier(.4,0,1,1);
  --ease-spring:cubic-bezier(.34,1.4,.64,1);   /* light overshoot, never bouncy */
  --dur-fast:150ms; --dur:250ms; --dur-slow:400ms;
}
```

## 7. Layout & Breakpoints (mobile-first)

| Width | Layout |
|-------|--------|
| **< 600 px** | Single column. Product grid 2 columns. Cart is a **bottom sheet**. Inspector is a collapsed bar with tabs. |
| **600–1023 px** | Product grid 3 columns. Cart is a sheet or side drawer. |
| **>= 1024 px** | Catalog (fluid, max 880 px) + sticky **cart card** (360 px). Inspector spans the full width in 3 columns. |

- Max content width 1200 px, centered, 16 px (mobile) / 32 px (desktop) side padding.
- Add bottom padding to `<body>` equal to the collapsed Inspector height.
- Respect safe areas: `padding-bottom: env(safe-area-inset-bottom)`.

```
┌───────────────────────────────┐
│ DesiMart            [Cart 2]  │  sticky header, large title collapses on scroll
│ [ Search products         ]   │
│ (All)(Groceries)(Snacks)(...) │  pill chips with sliding active indicator
│ ┌──────┐ ┌──────┐             │
│ │ img  │ │ img  │             │  photo or tinted tile with line icon
│ │ Chai │ │ Rice │             │
│ │ Rs249│ │ Rs165│             │
│ │[Add ]│ │[Add ]│             │  black pill buttons
│ └──────┘ └──────┘             │
├───────────────────────────────┤
│ DATA STRUCTURE INSPECTOR      │  fixed bottom, dark, collapsible
│ Cart | Stack | Queue          │
└───────────────────────────────┘
```

## 8. Components

### 8.1 Buttons (flat, no glow)

| Variant | Style |
|---------|-------|
| **Primary** | Fill `--btn`, text `--btn-text`, height 48 px, padding `0 24px`, pill, weight 600, 17 px. |
| **Secondary** | Fill `--surface-2`, text `--text`. |
| **Ghost** | Transparent, text `--accent`. |
| **Destructive** | Text `--danger`; light neutral tint on press. |
| **Small** | Height 36 px, padding `0 16px`, 15 px (product cards). |

States: hover (fill `--btn-hover`), active (`scale(.96)`), focus-visible (`outline: 2px solid var(--accent); outline-offset: 2px`), disabled (`opacity .35`). **No box-shadow on buttons at all.**

```css
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  height:48px;padding:0 24px;border:0;border-radius:var(--r-pill);
  background:var(--btn);color:var(--btn-text);
  font:600 17px/1 var(--font);cursor:pointer;
  transition:transform var(--dur-fast) var(--ease-out),background-color var(--dur-fast);
}
.btn:hover{background:var(--btn-hover)}
.btn:active{transform:scale(.96)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn:disabled{opacity:.35;pointer-events:none}
.btn--secondary{background:var(--surface-2);color:var(--text)}
.btn--secondary:hover{background:var(--separator)}
.btn--sm{height:36px;padding:0 16px;font-size:15px}
```

### 8.2 Cards and Product Cards

```css
.card{background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--shadow-1);padding:16px;
      transition:transform var(--dur) var(--ease-out),box-shadow var(--dur) var(--ease-out)}
@media (hover:hover){.card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}
```

**Product card:** image slot on top (square or 4:3, `--r-md`, `object-fit: cover`), name (Headline), 2-line description (Subhead, `--text-2`), price (Headline, tabular-nums, formatted `₹249`), small black **Add** pill.

**Image rule (no emoji):**
1. Preferred: your own product photos in `/assets/products/<id>.jpg` (compressed, about 600 px wide).
2. Fallback: a flat tile in the category tint with a centered 40 px line icon in `--text-2`.

**Category icons (Lucide, outline, 1.75 px stroke):** Groceries = `wheat`, Snacks = `cookie`, Beverages = `coffee`, Clothing = `shirt`, Home & Festive = `lamp`.

### 8.3 Category Chips

Pill, 36 px tall. Inactive: `--surface` + `--shadow-1`. Active: black with white text. The active state is a **single black pill that slides** between chips (animate `transform` and `width`), instead of each chip swapping color instantly.

### 8.4 Search Field

44 px tall, `--surface`, pill, leading search icon. Focus: 2 px `--accent` outline. Clear (x) button scales in when the field has text.

### 8.5 Quantity Stepper

Pill container (`--surface-2`), 32 px circular minus/plus buttons, number between. At qty 1 the minus becomes a trash icon (deletes the node). The number rolls vertically when it changes.

### 8.6 Toggle Switch (iOS style)

51 x 31 px track, 27 px white thumb, black track when on. Used for **Animations** (and any future settings).

```html
<label class="switch">
  <input type="checkbox" id="motionToggle" role="switch" aria-label="Animations">
  <span class="switch__track"></span>
  <span class="switch__thumb"></span>
</label>
```

```css
.switch{position:relative;display:inline-block;width:51px;height:31px;flex:none}
.switch input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;z-index:2}
.switch__track{position:absolute;inset:0;border-radius:var(--r-pill);background:#D1D1D6;
  transition:background-color var(--dur) var(--ease-out)}
.switch__thumb{position:absolute;top:2px;left:2px;width:27px;height:27px;border-radius:50%;background:#fff;
  box-shadow:0 1px 3px rgba(0,0,0,.25);
  transition:transform var(--dur) var(--ease-spring),width var(--dur-fast) var(--ease-out)}
.switch input:checked ~ .switch__track{background:var(--btn)}
.switch input:checked ~ .switch__thumb{transform:translateX(20px)}
.switch input:active ~ .switch__thumb{width:33px}                       /* thumb stretches on press */
.switch input:checked:active ~ .switch__thumb{transform:translateX(14px)}
.switch input:focus-visible ~ .switch__track{outline:2px solid var(--accent);outline-offset:2px}
```

### 8.7 Cart (bottom sheet on mobile, sticky card on desktop)

- Header: "Your cart" (Title 2), item count, close button.
- Rows: 48 px image/tile, name, unit price, stepper, line total, hairline separators.
- Footer: subtotal, **Undo** (secondary pill with undo icon; disabled when the stack is empty), **Place order** (primary, full width).
- Sheet: top radius `--r-xl`, drag handle (36 x 5 px, `--separator`), backdrop `rgba(0,0,0,.35)`. Drag down to dismiss.

### 8.8 Orders Card

Queue list with status badges: `Pending` (warning text on a light neutral tint) and `Processed` (success text). The front order is labeled "Next up". Button: **Process next order** (secondary).

### 8.9 Toast

Dark pill (`#1A1A1A`, white text), centered above the Inspector, `role="status" aria-live="polite"`, auto-hides in 2.5 s. Plain copy only, e.g. "Added Masala Chai Blend".

### 8.10 Cart Badge

Black pill with white number, 18 px min-width. The number rolls when the count changes.

### 8.11 Settings Sheet

Opened from a sliders icon in the header. Contains the **Animations** toggle (label: "Animations", helper text: "Turn off to reduce movement") and, optionally, "Show Inspector".

## 9. Motion System

### 9.1 Animations On/Off Toggle

- The **Animations** toggle lives in the Settings sheet (also acceptable: a small switch in the header on desktop).
- Default: **On**, unless the device has `prefers-reduced-motion: reduce`, then default **Off**.
- Choice is saved in `localStorage` (key `desimart-motion`).
- When Off: all transitions and keyframes are disabled, state changes appear instantly, and the toast still appears and disappears.

```css
:root[data-motion="off"] *,
:root[data-motion="off"] *::before,
:root[data-motion="off"] *::after{
  animation:none !important; transition:none !important; scroll-behavior:auto !important;
}
```

```js
// js/ui/motion.js
const KEY = "desimart-motion";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const initial = localStorage.getItem(KEY) ?? (reduced ? "off" : "on");

export const motionOn = () => document.documentElement.dataset.motion === "on";

export function initMotion(toggleEl) {
  document.documentElement.dataset.motion = initial;
  toggleEl.checked = initial === "on";
  toggleEl.addEventListener("change", () => {
    const value = toggleEl.checked ? "on" : "off";
    document.documentElement.dataset.motion = value;
    localStorage.setItem(KEY, value);
  });
}
```

Any JavaScript-driven animation (count-up numbers, fly-to-cart, Web Animations API) must check `motionOn()` first and skip straight to the end state when it is false.

### 9.2 Timing Guide

| Token | Value | Use |
|-------|-------|-----|
| `--dur-fast` | 150 ms | Hover, press, color changes |
| `--dur` | 250 ms | Most state changes, node enter/exit |
| `--dur-slow` | 400 ms | Sheets, page load, larger movement |
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | Default for entering and moving |
| `--ease-in` | `cubic-bezier(.4,0,1,1)` | Leaving |
| `--ease-spring` | `cubic-bezier(.34,1.4,.64,1)` | Toggle thumb, badge bump, small overshoot |

Only animate `transform` and `opacity` where possible (smooth on phones).

### 9.3 Animation Catalog

| Where | Trigger | Animation |
|-------|---------|-----------|
| **Page load** | First render | Header fades in; product cards rise 12 px and fade in with a 40 ms stagger (cap at 8 cards). |
| **Large title** | Scroll | Title shrinks and moves into the header bar; header hairline and blur fade in. |
| **Scroll reveal** | Card enters viewport | Rise and fade once (IntersectionObserver). |
| **Category chips** | Tap a chip | Black pill slides to the chip; product grid fades out (100 ms) then re-staggers in. |
| **Search** | Typing | Non-matching cards fade and collapse; matches shift smoothly (FLIP). Clear button scales in. |
| **Product card** | Hover / press | Lift 2 px and stronger shadow; image scales to 1.03; press scales to .98. |
| **Add button** | Tap | Label swaps "Add" to a check icon plus "Added" for 1.2 s (check stroke draws in), then returns. |
| **Fly to cart** *(optional)* | Add | A small image tile travels along a curve to the cart button (400 ms). |
| **Cart button and badge** | Item added | Button bumps (scale 1 to 1.12 to 1, spring); badge number rolls upward. |
| **Cart sheet** | Open / close | Slides up 320 ms with backdrop fade; drag to dismiss follows the finger; closes by sliding down. |
| **Cart rows** | Row added | Slides in from the right and fades in. |
| **Cart rows** | Row removed | Fades, then height collapses (250 ms); rows below glide up. |
| **Stepper** | + / - | Button press scale; number rolls up or down. |
| **Subtotal** | Any cart change | Number counts to the new value over 300 ms. |
| **Undo button** | Tap | Undo icon rotates 360 degrees counter-clockwise; restored row flashes `--surface-2` back to `--surface`. |
| **Place order** | Tap | Button shows a spinner for about 600 ms, then a check; cart rows slide right and fade; new order card drops into the Orders list. |
| **Orders list** | Process next | Front order slides out to the left and fades; remaining orders slide up/left (FLIP); status badge cross-fades to "Processed". |
| **Toggle switch** | Tap | Thumb slides with a light spring, stretches on press; track color fades. |
| **Toast** | Show / hide | Slides up 16 px and fades in; slides down and fades out. |
| **Empty states** | Appear | Fade in with a 8 px rise. |
| **Inspector panel** | Expand / collapse | Height animates 350 ms; content fades in after 100 ms; chevron rotates 180 degrees. |
| **Inspector tabs (mobile)** | Switch tab | Segmented control's thumb slides; panel content cross-fades. |
| **Linked list** | Node added | Node scales .92 to 1 and fades in, then the arrow draws from the previous node (`scaleX` 0 to 1), then `TAIL` tag glides to the new node. |
| **Linked list** | Quantity changed | The count in the node rolls; node background flashes `--insp-flash` to normal (700 ms). |
| **Linked list** | Node removed | Node fades and its width collapses; neighbors close the gap; arrow re-links; `HEAD`/`TAIL` tags glide to their new nodes. |
| **Stack** | push | New item drops in from 16 px above and fades in; `TOP` tag moves to it. |
| **Stack** | pop | Top item lifts 12 px and fades out; `TOP` tag moves down. |
| **Queue** | enqueue | Item slides in from the right; `REAR` tag moves. |
| **Queue** | dequeue | Front item slides out to the left; others shift left; `FRONT` tag moves. |
| **Operation log** | New operation | Old text slides up and fades; new text slides in from below (200 ms). |
| **Stat chips** | Count changes | Number rolls. |
| **Focus** | Keyboard focus | Outline offset eases in (100 ms). |

### 9.4 Reusable Snippets

**Staggered card entrance**

```css
.card-enter{opacity:0;transform:translateY(12px);
  animation:rise var(--dur-slow) var(--ease-out) forwards;
  animation-delay:calc(var(--i, 0) * 40ms)}
@keyframes rise{to{opacity:1;transform:none}}
```

Set `style="--i: 0"`, `--i: 1`, and so on, per card in JavaScript.

**Row collapse (no fixed heights needed)**

```css
.row{display:grid;grid-template-rows:1fr;
  transition:grid-template-rows var(--dur) var(--ease-out),opacity var(--dur-fast)}
.row__inner{overflow:hidden}
.row.is-leaving{grid-template-rows:0fr;opacity:0}
```

Add `.is-leaving`, wait for `transitionend`, then remove the node from the data structure and re-render.

**Inspector node enter, flash, stack drop**

```css
.node--new{animation:node-in var(--dur) var(--ease-out)}
@keyframes node-in{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}

.arrow--new{transform-origin:left center;animation:draw 300ms var(--ease-out) 120ms backwards}
@keyframes draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}

.is-changed{animation:flash 700ms var(--ease-out)}
@keyframes flash{from{background:var(--insp-flash)}to{background:var(--insp-surface)}}

.stack-item--push{animation:drop var(--dur) var(--ease-out)}
@keyframes drop{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
```

**Number roll** (cart badge, quantity, stats)

```css
.roll{display:inline-block;overflow:hidden;height:1.2em;vertical-align:bottom}
.roll__inner{display:block;transition:transform var(--dur) var(--ease-out)}
/* Put old and new digit stacked; translateY(-50%) moves to the new one. */
```

**Moving tags (HEAD, TAIL, TOP, FRONT, REAR)**

Render each tag once, absolutely positioned, and move it with `transform: translateX(...)` and `transition: transform var(--dur) var(--ease-out)` so it glides between nodes.

**FLIP for list reordering**

1. Record each item's position before the change (`getBoundingClientRect`).
2. Re-render.
3. Apply `transform: translate(dx, dy)` to each item to place it where it was.
4. On the next frame, clear the transform with a transition on it.

### 9.5 Motion Rules

- Keep each animation under 400 ms, except the sheet drag-back.
- One primary animation per action; secondary ones are subtle and delayed 100–150 ms.
- Never block input while animating. Rendering must be correct even if an animation is interrupted.
- The data structure changes immediately; animation is only visual. The Inspector must always match the real state at the end of an animation.
- Every animation is disabled when the Animations toggle is off.

## 10. Data Structure Inspector

**Position:** fixed to the bottom, full width, `--insp-bg`, top radius `--r-xl`, `--shadow-3`, 1 px top border `--insp-line`. **No glow, no gradient.**

**Header row:** drag handle (tap to collapse/expand), title "Data Structure Inspector", monospace **operation log** (e.g. `push(ADD Masala Chai Blend), O(1)`), and stat chips (`nodes 3`, `stack 3`, `queue 1`).

**Height:** collapsed 56 px; expanded about 260 px on desktop and 45 vh on mobile.

**Body:** three equal columns on desktop; on mobile a segmented control (Cart, Stack, Queue) showing one at a time.

### 10.1 Linked List (Cart)

Rounded boxes (`--insp-surface`, 1 px `--insp-line` border, radius 14 px, monospace) with a **data** cell (`Chai x2`) and a **pointer** cell (a small dot). Arrows in `--insp-dim`. Tags `HEAD` and `TAIL` are small pills in `--insp-list`. The list ends with `NULL`. Row scrolls horizontally on overflow.

```
HEAD                     TAIL
 v                        v
[Chai x2 | .]->[Rice x1 | .]->[Ghee x1 | .]-> NULL
```

### 10.2 Stack (Undo)

Vertical column with the newest on top. Each item is a rounded rectangle labeled with its action (`ADD Chai`, `REMOVE Rice`). The top item has a `TOP` pill in `--insp-stack`. Empty state: dashed outline with the word "empty".

### 10.3 Queue (Orders)

Horizontal row with the oldest on the left. Each item shows `ORD-1001 / Rs578`. `FRONT` on the first, `REAR` on the last (`--insp-queue`). Small hints: `dequeue` on the left, `enqueue` on the right.

### 10.4 Highlight

The just-changed element uses the flat background flash (`--insp-flash` back to normal) plus its entry animation. **No glowing borders or shadows.**

## 11. Iconography

Outline icons, 1.75 px stroke, inline SVG (Lucide, free to use). Needed: `search`, `shopping-bag`, `plus`, `minus`, `trash-2`, `undo-2`, `x`, `check`, `chevron-up`, `chevron-down`, `sliders-horizontal`, `wheat`, `cookie`, `coffee`, `shirt`, `lamp`. **No emoji or emoji-style icons anywhere.**

## 12. Accessibility Checklist

- [ ] Every interactive element has at least a 44 x 44 px hit area.
- [ ] Text contrast is at least 4.5:1 (do not use `--text-3` for essential text).
- [ ] Visible `:focus-visible` outline on all controls.
- [ ] Real `<button>` elements; `aria-label` on icon-only buttons.
- [ ] Toggle uses `role="switch"` with a label.
- [ ] Toast uses `aria-live="polite"`.
- [ ] Inspector sections have headings and `aria-label`s (e.g. "Cart linked list").
- [ ] Meaning is never conveyed by color alone (HEAD/TAIL/TOP/FRONT/REAR labels).
- [ ] Animations toggle works and respects `prefers-reduced-motion` by default.
- [ ] Product photos have meaningful `alt` text (plain words, no emoji).
- [ ] Layout works at 200% zoom.

## 13. YOUR DESIGN (fill this in later)

> Anything here **overrides** sections 3 to 12.

**Figma / mockup links:**
- Home / catalog:
- Cart:
- Orders:
- Inspector:

**Screenshots / images:** *(add to `/docs/design/` and list file names here)*

**Custom colors:**

| Token | My value |
|-------|----------|
|       |          |

**Custom fonts:**

**Custom radii / shadows:**

**Custom animations (which to keep, remove, or change):**

**Logo / app name:**

**Other notes:**

---

## 14. Overlays and Detail Screens

- **Floating Cards:** All overlays (Product Detail Quick View, Multi-Step Checkout & Confirmation, Cart Sheet, Settings & Filters) float INSIDE the page. Overlays must NEVER touch screen edges.
- **Margins & Padding:** Desktop (≥ 600 px) uses at least 16 px margin on all sides (`padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))`). Phones (< 600 px) use at least 12 px margin on all sides (`12px` inset).
- **Border Radii:** All 4 corners are rounded using `var(--r-xl)` (28 px) on all screen sizes (no square corners on mobile bottom).
- **Card Heights & Scrolling:** `max-height: min(86dvh, 720px)` using dynamic viewport height (`dvh`). Content taller than cap scrolls INSIDE the card (`overflow-y: auto`) with card headers remaining sticky/visible.
- **Card Widths:** `width: min(100%, 560px)` for Product Detail Quick View and Checkout; `width: min(100%, 420px)` for Cart Sheet and Settings.
- **Backdrop & Dismissal:** Dimmed backdrop `rgba(0,0,0,.35)`. Tapping backdrop, pressing `Escape`, or tapping close button closes the overlay.
- **Accessibility & Focus:** Focus is trapped inside the active card while open, and restored to the trigger element on close. Page background scroll is locked (`body.no-scroll { overflow: hidden; }`).
- **Product Detail Layout:** Inside card: rounded media tile (`var(--r-md)`, 4/3 aspect-ratio, `max-height: 36dvh`), rating/stock info, title, description, price breakdown, variant selector, quantity stepper, and black pill "Add to cart" button. Fits on 375x667 phones without card scrolling.
- **Animations:** Desktop: scale (0.96 → 1) + opacity fade (250ms `var(--ease-out)`). Mobile: slide up (24px → 0) + opacity fade (250ms `var(--ease-out)`). Respects `motionOn()` / `data-motion="off"`.

---

*Implementation hint:* all styling and motion timing is driven by the tokens in `tokens.css`, so applying your design later is mostly editing variable values and a few component rules.
