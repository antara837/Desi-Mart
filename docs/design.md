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

## 8. Components

### 8.1 Buttons (flat, no glow)

| Variant | Style |
|---------|-------|
| **Primary** | Fill `--btn`, text `--btn-text`, height 48 px, padding `0 24px`, pill, weight 600, 17 px. |
| **Secondary** | Fill `--surface-2`, text `--text`. |
| **Ghost** | Transparent, text `--accent`. |
| **Destructive** | Text `--danger`; light neutral tint on press. |
| **Small** | Height 36 px, padding `0 16px`, 15 px (product cards). |

### 8.2 Cards and Product Cards

```css
.card{background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--shadow-1);padding:16px;
      transition:transform var(--dur) var(--ease-out),box-shadow var(--dur) var(--ease-out)}
@media (hover:hover){.card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}
```

### 8.3 Category Chips

Pill, 36 px tall. Inactive: `--surface` + `--shadow-1`. Active: black with white text.

### 8.4 Search Field

44 px tall, `--surface`, pill, leading search icon.

### 8.5 Quantity Stepper

Pill container (`--surface-2`), 32 px circular minus/plus buttons.

### 8.6 Toggle Switch (iOS style)

51 x 31 px track, 27 px white thumb, black track when on.

### 8.7 Cart

- Header: "Your cart" (Title 2), item count, close button.
- Rows: 48 px image/tile, name, unit price, stepper, line total.
- Footer: subtotal, Undo, Place order.

### 8.8 Orders Card

Queue list with status badges: `Pending` and `Processed`.

### 8.9 Toast

Dark pill (`#1A1A1A`, white text), centered above the Inspector.

### 8.10 Cart Badge

Black pill with white number.

### 8.11 Settings Sheet

Opened from a sliders icon in the header. Contains the **Animations** toggle.

## 9. Motion System

Default **On**, saved in `localStorage` (key `desimart-motion`). Respects `prefers-reduced-motion`.

## 10. Data Structure Inspector

Fixed to the bottom, full width, `--insp-bg`, top radius `--r-xl`.

## 11. Iconography

Outline icons, 1.75 px stroke, inline SVG (Lucide). **No emoji.**

## 12. Accessibility Checklist

Visible focus outlines, keyboard shortcuts, screen-reader labels.

## 13. YOUR DESIGN

*(Reserved for overrides)*

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
