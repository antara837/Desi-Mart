import { getIcon } from './icons.js';
import { openOverlay, closeOverlay } from './overlay.js';
import { renderProductMedia } from './renderImage.js';
import { getProductPastel } from './pastels.js';
import { PRODUCTS } from '../data/products.js';

let quickViewOverlayEl = null;
let quickViewSheetEl = null;
let savedAddToCart = null;
let savedToggleWishlist = null;
let savedIsWishlistedCallback = null;

/**
 * Initialize Quick View Modal markup and handlers.
 */
export function initQuickViewModal(onAddToCart, onToggleWishlist, isWishlistedCallback) {
  quickViewOverlayEl = document.getElementById('quickViewOverlay');
  quickViewSheetEl = document.getElementById('quickViewSheet');
  savedAddToCart = onAddToCart;
  savedToggleWishlist = onToggleWishlist;
  savedIsWishlistedCallback = isWishlistedCallback;

  if (!quickViewOverlayEl || !quickViewSheetEl) return;

  quickViewOverlayEl.addEventListener('click', (e) => {
    if (e.target === quickViewOverlayEl) closeQuickView();
  });
}

export function closeQuickView() {
  if (quickViewOverlayEl) closeOverlay(quickViewOverlayEl);
}

/**
 * Opens Quick View modal for a given product matching the reference design:
 * - Liquid pastel color takeover
 * - Giant centered title (stroke-to-solid tone-on-tone)
 * - Overlapping main image with 3D Y-axis spin entrance
 * - Floating orbiting decorative accents
 * - Side caption in small light text
 * - Sliding white content card with framed offset image
 * - Horizontal wipe on item switching
 */
export function openQuickView(product, onAddToCart, onToggleWishlist, isWishlisted = false, isSwapping = false) {
  if (!quickViewOverlayEl || !quickViewSheetEl) return;

  const activeAddToCart = onAddToCart || savedAddToCart;
  const activeToggleWishlist = onToggleWishlist || savedToggleWishlist;

  const allProducts = PRODUCTS && PRODUCTS.length ? PRODUCTS : [product];
  const currentIndex = allProducts.findIndex(p => p.id === product.id);

  const hasVariants = product.variants && product.variants.length > 0;
  let selectedVariantObj = hasVariants
    ? (typeof product.variants[0] === 'object' ? product.variants[0] : { name: product.variants[0], price: product.price })
    : { name: '', price: product.price };
  let currentPrice = selectedVariantObj.price || product.price;
  let selectedQty = 1;
  let inWishlist = isWishlisted;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const stockLabel = isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left` : 'In Stock';
  const stockColor = isOutOfStock ? 'var(--danger)' : isLowStock ? 'var(--warning)' : 'var(--success)';

  const formattedPrice = `₹${currentPrice.toLocaleString("en-IN")}`;
  const hasDiscount = product.originalPrice && product.originalPrice > currentPrice;
  const formattedOrig = hasDiscount ? `₹${product.originalPrice.toLocaleString("en-IN")}` : '';
  const discountPercent = hasDiscount ? Math.round((1 - currentPrice / product.originalPrice) * 100) : 0;

  const theme = getProductPastel(product);

  quickViewSheetEl.innerHTML = `
    <div
      class="qv-showcase ${isSwapping ? 'qv-is-swapping' : ''}"
      style="--theme-pastel: ${theme.pastel}; --theme-dark: ${theme.dark};"
    >
      ${isSwapping ? `<div class="qv-wipe-layer"></div>` : ''}

      <!-- Hero Section with Min-Height ~46vh -->
      <div class="qv-hero-section">
        <!-- 1. Full-bleed Color Takeover with Liquid Organic Background -->
        <div class="qv-liquid-bg">
          <!-- SVG Organic Blob Path -->
          <svg class="qv-liquid-morph" viewBox="0 0 600 480" preserveAspectRatio="none" aria-hidden="true">
            <path
              class="qv-liquid-path"
              d="M 0,0 L 600,0 L 600,380 Q 450,460 300,410 Q 150,360 0,440 Z"
              fill="${theme.pastel}"
            />
          </svg>

          <!-- Faint botanical / shape silhouettes in slightly lighter tint -->
          <svg class="qv-silhouettes" viewBox="0 0 500 350" fill="none" aria-hidden="true">
            <path d="M 50,80 C 80,40 120,60 140,110 C 100,120 70,110 50,80 Z" fill="rgba(255,255,255,0.42)" />
            <path d="M 420,120 C 460,90 480,130 460,170 C 430,160 410,140 420,120 Z" fill="rgba(255,255,255,0.38)" />
            <circle cx="90" cy="240" r="16" fill="rgba(255,255,255,0.32)" />
            <circle cx="430" cy="50" r="24" fill="rgba(255,255,255,0.3)" />
            <path d="M 230,40 C 260,20 280,50 270,70 C 240,70 230,55 230,40 Z" fill="rgba(255,255,255,0.35)" />
          </svg>
        </div>

        <!-- Top Header Action Bar (z-index: 30) -->
        <div class="qv-top-bar">
          <span class="badge qv-badge-pill">${product.badge || product.category}</span>

          <!-- Switching between items controls (Requirement 7) -->
          <div class="qv-nav-switch" aria-label="Switch product">
            <button id="qvPrevBtn" class="qv-nav-btn" aria-label="Previous product">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span class="qv-counter-text tabular-nums">${currentIndex >= 0 ? currentIndex + 1 : 1} / ${allProducts.length}</span>
            <button id="qvNextBtn" class="qv-nav-btn" aria-label="Next product">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button
              id="qvWishlistBtn"
              class="wishlist-btn ${inWishlist ? 'is-active' : ''}"
              style="position: static;"
              aria-label="Wishlist item"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWishlist ? '#D92D20' : 'none'}" stroke="${inWishlist ? '#D92D20' : 'currentColor'}" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
            <button id="closeQuickViewBtn" class="btn btn--ghost btn--icon-only qv-close-btn" aria-label="Close Quick View">
              ${getIcon('x')}
            </button>
          </div>
        </div>

        <!-- 2. Title Zone on Top: clamp(2.5rem, 9vw, 5.5rem), unclipped, white-space normal -->
        <div class="qv-title-zone">
          <h1 class="qv-giant-title">${product.name}</h1>
        </div>

        <!-- 3. Product Image Zone Below: centered, max-height 55%, slight overlap with title margin only -->
        <div class="qv-hero-media-zone">
          <!-- Floating decorative accents outside the title bounding box (left and right of image) -->
          <span class="qv-accent qv-accent--left" aria-hidden="true">🍃</span>
          <span class="qv-accent qv-accent--right" aria-hidden="true">✨</span>
          <span class="qv-accent qv-accent--left-sub" aria-hidden="true">🌱</span>

          <!-- Centered product image with 3D Y-axis spin entrance -->
          <div class="qv-image-container">
            ${renderProductMedia(product, { width: 800, height: 600, imgClass: 'qv-hero-img', tileClass: 'qv-hero-tile' })}
          </div>

          <!-- Short light-weight caption at the right of the image -->
          <div class="qv-side-caption">
            <span class="qv-caption-rating">⭐ ${product.rating || 4.8}</span>
            <span class="qv-caption-meta">${product.reviews || 95} reviews</span>
            <span class="qv-caption-tag">${stockLabel}</span>
          </div>
        </div>
      </div> <!-- /.qv-hero-section -->

      <!-- 4. White Content Card sliding up from bottom with ~16px breathing room -->
      <div class="qv-content-card">
        <div class="sheet__handle" style="margin-bottom: 12px; grid-column: 1 / -1;"></div>

        <!-- Left Column: Details, description, price, stepper, add button -->
        <div class="qv-content-left">
          <div style="margin-bottom: 8px;">
            <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px;">
              <h2 class="qv-card-title">${product.name}</h2>
              <span style="font-size: 12px; font-weight: 600; color: ${stockColor};">• ${stockLabel}</span>
            </div>
            <p class="qv-card-desc">${product.desc}</p>
          </div>

          <!-- Pricing Row with Discount -->
          <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px;">
            <span id="qvPriceVal" class="qv-price-val tabular-nums">${formattedPrice}</span>
            ${hasDiscount ? `
              <span style="text-decoration: line-through; color: var(--text-2); font-size: 14px;" class="tabular-nums">${formattedOrig}</span>
              <span class="badge badge--pending" style="font-size: 11px;">${discountPercent}% OFF</span>
            ` : ''}
          </div>

          <!-- Variants Selection Chips -->
          ${hasVariants ? `
            <div style="margin-bottom: 14px;">
              <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 6px; color: var(--text-2);">Select Size / Weight:</label>
              <div id="qvVariantsGroup" style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${product.variants.map((v, i) => {
                  const vName = typeof v === 'object' ? v.name : v;
                  const vPrice = typeof v === 'object' ? v.price : product.price;
                  return `
                    <button class="chip qv-variant-chip ${i === 0 ? 'is-active' : ''}" data-variant="${vName}" data-price="${vPrice}" style="height: 32px; font-size: 13px; padding: 0 12px;">
                      ${vName}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Quantity Stepper & Add Action -->
          <div style="display: flex; align-items: center; gap: 12px; margin-top: 14px;">
            <div class="stepper" style="padding: 3px 6px;">
              <button id="qvDecBtn" class="stepper__btn" aria-label="Decrease quantity">
                ${getIcon('minus')}
              </button>
              <span id="qvQtyVal" class="stepper__val tabular-nums">1</span>
              <button id="qvIncBtn" class="stepper__btn" aria-label="Increase quantity">
                ${getIcon('plus')}
              </button>
            </div>

            <button
              id="qvAddBtn"
              class="btn btn--full qv-add-btn"
              style="flex: 1; height: 46px;"
              ${isOutOfStock ? 'disabled style="opacity:0.5;"' : ''}
            >
              ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        <!-- Right Column: Framed Offset Product Thumbnail (Thin outline frame) -->
        <div class="qv-content-right" aria-hidden="true">
          <div class="qv-framed-wrapper">
            <div class="qv-framed-box" style="border-color: ${theme.pastel};">
              <img src="${product.image}" alt="" class="qv-framed-img" onerror="this.style.display='none';" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers: Close
  const closeBtn = document.getElementById('closeQuickViewBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeQuickView);

  // Wishlist toggle
  const wishlistBtn = document.getElementById('qvWishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      inWishlist = !inWishlist;
      wishlistBtn.classList.toggle('is-active', inWishlist);
      const svg = wishlistBtn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', inWishlist ? '#D92D20' : 'none');
        svg.setAttribute('stroke', inWishlist ? '#D92D20' : 'currentColor');
      }
      if (typeof activeToggleWishlist === 'function') {
        activeToggleWishlist(product.id, inWishlist);
      }
    });
  }

  // Next / Prev Item Switcher Handlers (Requirement 7)
  const prevBtn = document.getElementById('qvPrevBtn');
  const nextBtn = document.getElementById('qvNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIdx = (currentIndex - 1 + allProducts.length) % allProducts.length;
      const prevProd = allProducts[prevIdx];
      const isWish = savedIsWishlistedCallback ? savedIsWishlistedCallback(prevProd.id) : false;
      openQuickView(prevProd, activeAddToCart, activeToggleWishlist, isWish, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIdx = (currentIndex + 1) % allProducts.length;
      const nextProd = allProducts[nextIdx];
      const isWish = savedIsWishlistedCallback ? savedIsWishlistedCallback(nextProd.id) : false;
      openQuickView(nextProd, activeAddToCart, activeToggleWishlist, isWish, true);
    });
  }

  // Variant Chip selection with dynamic price update
  const variantChips = quickViewSheetEl.querySelectorAll('.qv-variant-chip');
  const qvPriceVal = document.getElementById('qvPriceVal');

  variantChips.forEach(chip => {
    chip.addEventListener('click', () => {
      variantChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const vName = chip.dataset.variant;
      const vPrice = parseInt(chip.dataset.price, 10);
      selectedVariantObj = { name: vName, price: vPrice };
      if (qvPriceVal && !isNaN(vPrice)) {
        qvPriceVal.textContent = `₹${vPrice.toLocaleString("en-IN")}`;
      }
    });
  });

  // Quantity Steppers
  const decBtn = document.getElementById('qvDecBtn');
  const incBtn = document.getElementById('qvIncBtn');
  const qtyVal = document.getElementById('qvQtyVal');

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      if (selectedQty > 1) {
        selectedQty--;
        if (qtyVal) qtyVal.textContent = selectedQty;
      }
    });
  }

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      if (!isOutOfStock && selectedQty < product.stock) {
        selectedQty++;
        if (qtyVal) qtyVal.textContent = selectedQty;
      }
    });
  }

  // Add to Cart Button
  const addBtn = document.getElementById('qvAddBtn');
  if (addBtn && !isOutOfStock) {
    addBtn.addEventListener('click', () => {
      if (typeof activeAddToCart === 'function') {
        activeAddToCart(product.id, selectedVariantObj.name, selectedQty, selectedVariantObj.price);
      }
      closeQuickView();
    });
  }

  openOverlay(quickViewOverlayEl, quickViewSheetEl);
}

