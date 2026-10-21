/**
 * Shared Overlay & Focus Management Service
 * Provides unified open/close, focus trapping, Escape key listener, and scroll locking.
 */
let lastFocusedElement = null;
const activeOverlays = new Set();

export function openOverlay(overlayEl, cardEl, triggerEl = document.activeElement) {
  if (!overlayEl) return;

  if (activeOverlays.size === 0) {
    lastFocusedElement = triggerEl;
    document.body.classList.add('no-scroll');
  }

  activeOverlays.add(overlayEl);
  overlayEl.classList.add('is-open');

  if (cardEl) {
    const focusables = getFocusableElements(cardEl);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      cardEl.setAttribute('tabindex', '-1');
      cardEl.focus();
    }
  }
}

export function closeOverlay(overlayEl) {
  if (!overlayEl) return;

  overlayEl.classList.remove('is-open');
  activeOverlays.delete(overlayEl);

  if (activeOverlays.size === 0) {
    document.body.classList.remove('no-scroll');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }
}

export function closeAllOverlays() {
  activeOverlays.forEach(overlayEl => {
    overlayEl.classList.remove('is-open');
  });
  activeOverlays.clear();
  document.body.classList.remove('no-scroll');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

export function isOverlayOpen(overlayEl) {
  return activeOverlays.has(overlayEl);
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.disabled && el.offsetParent !== null);
}

// Global Keydown Handler for Escape & Tab focus trap
document.addEventListener('keydown', (e) => {
  if (activeOverlays.size === 0) return;

  if (e.key === 'Escape') {
    const overlaysArr = Array.from(activeOverlays);
    const topOverlay = overlaysArr[overlaysArr.length - 1];
    closeOverlay(topOverlay);
    return;
  }

  if (e.key === 'Tab') {
    const overlaysArr = Array.from(activeOverlays);
    const topOverlay = overlaysArr[overlaysArr.length - 1];
    const cardEl = topOverlay.querySelector('.overlay-card') || topOverlay;
    const focusables = getFocusableElements(cardEl);

    if (focusables.length === 0) return;

    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  }
});
