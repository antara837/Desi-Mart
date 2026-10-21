import { getIcon } from './icons.js';
import { renderProductMedia } from './renderImage.js';
import { getProductPastel } from './pastels.js';

/**
 * Render Product Catalog Grid with Ratings, Badges, Discounts, Stock Status, Wishlist, and Quick View triggers.
 * Preserves 100% of existing card layout and visual structure.
 */
export function renderCatalog(products, containerEl, callbacks, wishlistState = new Set()) {
  if (!containerEl) return;

  const { onAddCallback, onToggleWishlist, onProductClick } = callbacks;

  if (products.length === 0) {
    containerEl.innerHTML = `
      <div class="ds-empty" style="grid-column: 1 / -1; padding: 40px 20px; background: var(--surface);">
        <p style="font-size: 16px; font-weight: 600; color: var(--text);">No products found.</p>
        <p style="font-size: 13px; color: var(--text-2); margin-top: 4px;">Try searching for another product or category.</p>
      </div>
    `;
    return;
  }

  containerEl.innerHTML = products.map((product, index) => {
    const formattedPrice = `₹${product.price.toLocaleString("en-IN")}`;
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const formattedOrig = hasDiscount ? `₹${product.originalPrice.toLocaleString("en-IN")}` : '';
    const discountPercent = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const isWishlisted = wishlistState.has(product.id);
    const theme = getProductPastel(product);

    // Stock Status Logic
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const stockLabel = isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left` : 'In Stock';
    const stockColor = isOutOfStock ? 'var(--danger)' : isLowStock ? 'var(--warning)' : 'var(--success)';

    return `
      <article
        class="card product-card card-enter"
        style="--i: ${index}; --card-pastel: ${theme.pastel}; --card-dark: ${theme.dark};"
        data-product-id="${product.id}"
      >
        <!-- Pastel Blob Media Container with Irregular/Tilted Edges -->
        <div class="product-card__media" style="background-color: ${theme.pastel}; cursor: pointer;">
          ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}

          <button
            class="wishlist-btn ${isWishlisted ? 'is-active' : ''}"
            data-id="${product.id}"
            aria-label="Toggle Wishlist for ${product.name}"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#D92D20' : 'none'}" stroke="${isWishlisted ? '#D92D20' : 'currentColor'}" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>

          ${renderProductMedia(product, { width: 800, height: 600, imgClass: 'product-card__img', tileClass: 'product-card__tile' })}
        </div>

        <!-- Centered Label & Info Beneath in Clean Sans -->
        <div class="product-card__info" style="cursor: pointer;">
          <div style="font-size: 12px; color: var(--text-2); display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 2px;">
            <span>⭐ ${product.rating || 4.8} <span style="color: var(--text-3);">(${product.reviews || 90})</span></span>
            <span>•</span>
            <span style="font-size: 11px; font-weight: 600; color: ${stockColor};">${stockLabel}</span>
          </div>

          <h3 class="product-card__title">${product.name}</h3>
          <p class="product-card__desc">${product.desc}</p>
        </div>

        <!-- Footer Pricing & Add Action -->
        <div class="product-card__footer">
          <div style="display: flex; flex-direction: column;">
            <span class="product-card__price tabular-nums">${formattedPrice}</span>
            ${hasDiscount ? `
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="text-decoration: line-through; color: var(--text-2); font-size: 12px;" class="tabular-nums">${formattedOrig}</span>
                <span style="font-size: 10px; font-weight: 700; color: var(--danger);">${discountPercent}% OFF</span>
              </div>
            ` : ''}
          </div>

          <button
            class="btn btn--sm add-to-cart-btn"
            data-id="${product.id}"
            aria-label="Add ${product.name} to cart"
            ${isOutOfStock ? 'disabled style="opacity: 0.5;"' : ''}
          >
            ${isOutOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Event Listeners: Add to Cart buttons
  const addBtns = containerEl.querySelectorAll('.add-to-cart-btn');
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      if (typeof onAddCallback === 'function') {
        onAddCallback(id);
      }

      // Button visual feedback
      const originalText = btn.innerHTML;
      btn.innerHTML = `${getIcon('check')} Added`;
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'var(--btn)';
      }, 1000);
    });
  });

  // Event Listeners: Wishlist buttons
  const wishlistBtns = containerEl.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      if (typeof onToggleWishlist === 'function') {
        onToggleWishlist(id);
      }
    });
  });

  // Event Listeners: Product Card / Image Click for Quick View
  const cards = containerEl.querySelectorAll('.product-card');
  cards.forEach(card => {
    const id = parseInt(card.dataset.productId, 10);
    const mediaEl = card.querySelector('.product-card__media');
    const infoEl = card.querySelector('.product-card__info');

    const handleQuickView = () => {
      if (typeof onProductClick === 'function') {
        onProductClick(id);
      }
    };

    if (mediaEl) mediaEl.addEventListener('click', handleQuickView);
    if (infoEl) infoEl.addEventListener('click', handleQuickView);
  });
}
