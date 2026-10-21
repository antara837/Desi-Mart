import { getIcon } from './icons.js';
import { closeOverlay } from './overlay.js';
import { renderProductMedia } from './renderImage.js';

/**
 * Render Shopping Cart Card/Sheet and Cart Badge.
 * Customer-facing strings use professional e-commerce copy without developer terminology.
 */
export function renderCart(shop, containerEl, badgeEl, callbacks) {
  const { onQtyChange, onRemove, onUndo, onOpenCheckout } = callbacks;
  const items = shop.cart.toArray();
  const totalCount = shop.cart.getCount();
  const subtotalAmount = shop.cart.getTotal();

  // Price calculations
  const deliveryFee = (subtotalAmount === 0 || subtotalAmount >= 999) ? 0 : 40;
  const finalTotal = subtotalAmount + deliveryFee;

  // 1. Update Cart Badge Count with pop animation
  if (badgeEl) {
    const prevCount = parseInt(badgeEl.dataset.prevCount || '0', 10);
    badgeEl.textContent = totalCount;
    badgeEl.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    if (totalCount !== prevCount) {
      badgeEl.classList.remove('cart-badge--pop');
      void badgeEl.offsetWidth; // reflow to restart animation
      badgeEl.classList.add('cart-badge--pop');
    }
    badgeEl.dataset.prevCount = totalCount;
  }

  const containers = [containerEl, document.getElementById('cartSheet')].filter(Boolean);

  containers.forEach(targetEl => {
    const isSheet = targetEl.id === 'cartSheet';
    const undoDisabled = shop.undoStack.isEmpty();

    if (items.length === 0) {
      targetEl.innerHTML = `
        <div class="sidebar-panel-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <h2 class="sidebar-panel-title">Your Cart</h2>
            <span class="cart-badge cart-count-pill">0</span>
          </div>
          ${isSheet ? `
            <button class="btn btn--ghost btn--icon-only close-cart-sheet-btn" aria-label="Close Cart">
              ${getIcon('x')}
            </button>
          ` : ''}
        </div>

        <div class="sidebar-empty-state">
          <div class="sidebar-empty-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B9AE9E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <p class="sidebar-empty-title">Your cart is empty.</p>
          <p class="sidebar-empty-sub">Add products from the catalog to get started.</p>
        </div>

        <div class="cart-actions-block">
          <button
            class="cart-checkout-btn btn btn--full cart-checkout-primary"
            disabled
            aria-disabled="true"
          >
            Checkout
          </button>
          <button
            class="cart-undo-btn cart-undo-ghost"
            ${undoDisabled ? 'disabled aria-disabled="true"' : ''}
            aria-label="Undo last action"
          >
            ${getIcon('undo')} Undo last action
          </button>
        </div>
      `;
    } else {
      targetEl.innerHTML = `
        <div class="sidebar-panel-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <h2 class="sidebar-panel-title">Your Cart</h2>
            <span class="cart-badge cart-count-pill">${totalCount}</span>
          </div>
          ${isSheet ? `
            <button class="btn btn--ghost btn--icon-only close-cart-sheet-btn" aria-label="Close Cart">
              ${getIcon('x')}
            </button>
          ` : ''}
        </div>

        <div class="cart-rows-list" style="max-height: 320px; overflow-y: auto; margin-bottom: 16px;">
          ${items.map(item => {
            const subtotal = `₹${(item.product.price * item.qty).toLocaleString('en-IN')}`;
            const isQtyOne = item.qty === 1;

            return `
              <div class="cart-row" data-id="${item.product.id}">
                <div class="cart-row__thumb" style="background-color: ${item.product.tint};">
                  ${renderProductMedia(item.product, { width: 56, height: 56, imgClass: 'cart-thumb-img', tileClass: 'cart-thumb-tile' })}
                </div>
                <div class="cart-row__details">
                  <span class="cart-row__title">${item.product.name}</span>
                  <span class="cart-row__price tabular-nums">₹${item.product.price} each</span>
                </div>
                <div class="cart-row__right">
                  <div class="cart-stepper">
                    <button class="cart-stepper__btn stepper-minus" data-id="${item.product.id}" aria-label="${isQtyOne ? 'Remove item' : 'Decrease quantity'}">
                      ${isQtyOne
                        ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`
                        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`
                      }
                    </button>
                    <span class="cart-stepper__val tabular-nums">${item.qty}</span>
                    <button class="cart-stepper__btn stepper-plus" data-id="${item.product.id}" aria-label="Increase quantity">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                  <span class="cart-row__subtotal tabular-nums">${subtotal}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="cart-summary-block">
          <div class="cart-summary-row">
            <span class="cart-summary-label">Subtotal</span>
            <span class="cart-summary-value tabular-nums">₹${subtotalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div class="cart-summary-row">
            <span class="cart-summary-label">Delivery ${subtotalAmount > 0 && deliveryFee === 0 ? '<span class="cart-free-label">Free above ₹999</span>' : ''}</span>
            <span class="cart-summary-value tabular-nums">${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</span>
          </div>
          <div class="cart-summary-total">
            <span>Total</span>
            <span class="tabular-nums">₹${finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="cart-actions-block">
          <button
            class="cart-checkout-btn btn btn--full cart-checkout-primary"
            aria-label="Proceed to checkout"
          >
            Checkout
          </button>
          <button
            class="cart-undo-btn cart-undo-ghost"
            ${undoDisabled ? 'disabled aria-disabled="true"' : ''}
            aria-label="Undo last action"
          >
            ${getIcon('undo')} Undo last action
          </button>
        </div>
      `;
    }

    // Attach Event Handlers for targetEl
    const undoBtn = targetEl.querySelector('.cart-undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => onUndo());
    }

    const checkoutBtn = targetEl.querySelector('.cart-checkout-btn');
    if (checkoutBtn && !checkoutBtn.disabled) {
      checkoutBtn.addEventListener('click', () => {
        if (isSheet) {
          const cartOverlayEl = document.getElementById('cartOverlay');
          if (cartOverlayEl) closeOverlay(cartOverlayEl);
        }
        if (typeof onOpenCheckout === 'function') {
          onOpenCheckout();
        } else if (typeof window.openCheckout === 'function') {
          window.openCheckout();
        }
      });
    }

    const closeBtn = targetEl.querySelector('.close-cart-sheet-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const cartOverlayEl = document.getElementById('cartOverlay');
        if (cartOverlayEl) closeOverlay(cartOverlayEl);
      });
    }

    const plusBtns = targetEl.querySelectorAll('.stepper-plus');
    plusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        onQtyChange(id, +1);
      });
    });

    const minusBtns = targetEl.querySelectorAll('.stepper-minus');
    minusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        onQtyChange(id, -1);
      });
    });
  });
}
