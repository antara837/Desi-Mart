import { PRODUCTS } from './data/products.js';
import { filterProducts, searchByName, sortProducts, findById } from './services/catalog.js';
import { ShopService } from './services/shop.js';
import { renderCatalog } from './ui/renderCatalog.js';
import { renderCart } from './ui/renderCart.js';
import { renderOrders } from './ui/renderOrders.js';
import { renderInspector } from './ui/renderInspector.js';
import { initCheckoutModal } from './ui/renderCheckout.js';
import { initQuickViewModal, openQuickView } from './ui/renderQuickView.js';
import { initMotion } from './ui/motion.js';
import { showToast } from './ui/toast.js';
import { openOverlay, closeOverlay } from './ui/overlay.js';
import { getSession, clearSession, getInitials } from './services/auth.js';
import { initAuthScreen } from './ui/renderAuth.js';
import { initProfileSidebar, openProfileSidebar, renderProfileView, setSignOutCallback } from './ui/renderProfile.js';
import { clearSentEmails } from './services/emailService.js';
import { queueEmailNotification, setOutboxCallbacks, resetOutbox } from './services/outbox.js';
import { runDsTests } from './ds/tests.js';

// Application State
let currentCategory = 'All';
let searchQuery = '';
let sortOrder = 'featured';
let priceFilter = 'all';
let ratingFilter = 0;

// Wishlist State
const wishlistState = new Set();

// Run console data structure tests first
runDsTests();

// Initialize ShopService with render callback
const shop = new ShopService(() => render());

// DOM Elements
const authScreenEl = document.getElementById('authScreen');
const appMainEl = document.getElementById('appMain');
const openProfileBtnEl = document.getElementById('openProfileBtn');

const productGridEl = document.getElementById('productGrid');
const recommendedGridEl = document.getElementById('recommendedGrid');
const cartCardEl = document.getElementById('cartCard');
const ordersCardEl = document.getElementById('ordersCard');
const inspectorPanelEl = document.getElementById('inspectorPanel');
const headerCartBadgeEl = document.getElementById('headerCartBadge');

const searchInputEl = document.getElementById('searchInput');
const searchClearBtnEl = document.getElementById('searchClearBtn');
const sortSelectEl = document.getElementById('sortSelect');
const categoryChipsGroupEl = document.getElementById('categoryChips');

const filterPriceSelectEl = document.getElementById('filterPriceSelect');
const filterRatingSelectEl = document.getElementById('filterRatingSelect');

const modalOverlayEl = document.getElementById('modalOverlay');
const settingsSheetEl = document.getElementById('settingsSheet');
const openSettingsBtnEl = document.getElementById('openSettingsBtn');
const closeSettingsBtnEl = document.getElementById('closeSettingsBtn');
const motionToggleEl = document.getElementById('motionToggle');

const inspectorHeaderEl = document.getElementById('inspectorHeader');
const inspectorTabBtns = document.querySelectorAll('.inspector__tab');

// Outbox async updates listener
setOutboxCallbacks({
  onUpdate: () => render(),
  onToast: (msg) => showToast(msg)
});

// Motion system initialization
initMotion(motionToggleEl);

// Quick View Modal initialization
initQuickViewModal(
  (productId, variant, qty) => {
    shop.addToCart(productId, variant, qty);
    const item = findById(PRODUCTS, productId);
    if (item) showToast(`Added ${item.name} (${variant || 'Default'}) to cart`);
  },
  (productId, isWishlisted) => {
    toggleWishlist(productId);
  },
  (productId) => wishlistState.has(productId)
);

// Multi-step Checkout Modal initialization
initCheckoutModal(shop, {
  onCheckoutSuccess: (order) => {
    showToast(`Order ${order.id} placed successfully!`);
    const session = getSession();
    queueEmailNotification('order-confirmation', order, session);
    render();
  },
  onViewOrders: () => {
    if (ordersCardEl) {
      ordersCardEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Profile Sidebar initialization
initProfileSidebar();
setSignOutCallback(handleSignOut);

if (openProfileBtnEl) {
  openProfileBtnEl.addEventListener('click', () => {
    const session = getSession();
    if (session) {
      openProfileSidebar(shop, session);
    }
  });
}

/**
 * Toggles a product in the Wishlist state and displays a toast message.
 */
function toggleWishlist(productId) {
  const item = findById(PRODUCTS, productId);
  if (wishlistState.has(productId)) {
    wishlistState.delete(productId);
    if (item) showToast(`Removed ${item.name} from Wishlist`);
  } else {
    wishlistState.add(productId);
    if (item) showToast(`Saved ${item.name} to Wishlist`);
  }
  render();
}

/**
 * Applies search, filter, and sort algorithms over the catalog PRODUCTS array.
 */
function getFilteredProducts() {
  let list = filterProducts(PRODUCTS, {
    category: currentCategory,
    priceRange: priceFilter,
    minRating: ratingFilter,
    inStockOnly: false
  });

  list = searchByName(list, searchQuery);
  list = sortProducts(list, sortOrder);

  return list;
}

/**
 * Returns top recommended products (bestsellers/top rated) for "You May Also Like" section.
 */
function getRecommendedProducts() {
  return PRODUCTS.filter(p => p.badge === 'Bestseller' || p.rating >= 4.8).slice(0, 3);
}

/**
 * Sign-in Success Handler
 */
function handleSignInSuccess(session) {
  if (authScreenEl) authScreenEl.style.display = 'none';
  if (appMainEl) appMainEl.style.display = 'block';

  if (openProfileBtnEl) {
    openProfileBtnEl.style.display = 'inline-flex';
    openProfileBtnEl.textContent = getInitials(session.displayName);
  }

  render();
}

/**
 * Sign Out Handler (resets all in-memory data structures)
 */
function handleSignOut() {
  clearSession();
  shop.cart.clear();
  shop.undoStack.clear();
  shop.orderQueue.clear();
  shop.orderHistory = [];
  resetOutbox();
  clearSentEmails();
  wishlistState.clear();

  if (appMainEl) appMainEl.style.display = 'none';
  if (openProfileBtnEl) openProfileBtnEl.style.display = 'none';
  if (authScreenEl) authScreenEl.style.display = 'flex';

  initAuthScreen(handleSignInSuccess);
  showToast('Signed out successfully');
}

/**
 * Main Render Pipeline — Reads snapshots from data structures and updates DOM.
 */
function render() {
  const session = getSession();
  if (!session) return;

  const filteredProducts = getFilteredProducts();
  const recommendedProducts = getRecommendedProducts();

  const catalogCallbacks = {
    onAddCallback: (id) => {
      shop.addToCart(id);
      const item = findById(PRODUCTS, id);
      if (item) showToast(`Added ${item.name}`);
    },
    onToggleWishlist: (id) => {
      toggleWishlist(id);
    },
    onProductClick: (id) => {
      const item = findById(PRODUCTS, id);
      if (item) {
        openQuickView(
          item,
          (productId, variant, qty) => {
            shop.addToCart(productId, variant, qty);
            showToast(`Added ${item.name} to cart`);
          },
          (productId) => toggleWishlist(productId),
          wishlistState.has(id)
        );
      }
    }
  };

  // 1. Render Product Catalog Grid
  renderCatalog(filteredProducts, productGridEl, catalogCallbacks, wishlistState);

  // 2. Render Recommended Products Grid
  renderCatalog(recommendedProducts, recommendedGridEl, catalogCallbacks, wishlistState);

  // 3. Render Cart Sheet / Card
  renderCart(shop, cartCardEl, headerCartBadgeEl, {
    onQtyChange: (id, delta) => shop.changeQty(id, delta),
    onRemove: (id) => shop.removeFromCart(id),
    onUndo: () => {
      shop.undo();
      showToast("Undone last cart action");
    },
    onOpenCheckout: () => {
      if (typeof window.openCheckout === 'function') {
        window.openCheckout();
      }
    }
  });

  // 4. Render Orders Queue
  renderOrders(shop, ordersCardEl, () => {
    const order = shop.processNextOrder();
    if (order) {
      showToast(`Processed ${order.id}`);
      queueEmailNotification('order-processed', order, session);
      render();
    }
  });

  // 5. Render Data Structure Inspector Panel
  renderInspector(shop, inspectorPanelEl);

  // 6. Sync Profile View if open
  renderProfileView(shop, session, handleSignOut);
}

// Event Listeners: Search Input
if (searchInputEl) {
  searchInputEl.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchClearBtnEl) {
      searchClearBtnEl.style.display = searchQuery.length > 0 ? 'flex' : 'none';
    }
    render();
  });
}

if (searchClearBtnEl) {
  searchClearBtnEl.addEventListener('click', () => {
    searchQuery = '';
    if (searchInputEl) searchInputEl.value = '';
    searchClearBtnEl.style.display = 'none';
    render();
  });
}

// Event Listeners: Header Search Trigger Button
const headerSearchBtnEl = document.getElementById('headerSearchBtn');
if (headerSearchBtnEl && searchInputEl) {
  headerSearchBtnEl.addEventListener('click', () => {
    searchInputEl.focus();
    searchInputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// Event Listeners: Carousel Arrow Scroll Controls
const carouselPrevBtnEl = document.getElementById('carouselPrevBtn');
const carouselNextBtnEl = document.getElementById('carouselNextBtn');
if (carouselPrevBtnEl && productGridEl) {
  carouselPrevBtnEl.addEventListener('click', () => {
    productGridEl.scrollBy({ left: -300, behavior: 'smooth' });
  });
}
if (carouselNextBtnEl && productGridEl) {
  carouselNextBtnEl.addEventListener('click', () => {
    productGridEl.scrollBy({ left: 300, behavior: 'smooth' });
  });
}

const recPrevBtnEl = document.getElementById('recPrevBtn');
const recNextBtnEl = document.getElementById('recNextBtn');
if (recPrevBtnEl && recommendedGridEl) {
  recPrevBtnEl.addEventListener('click', () => {
    recommendedGridEl.scrollBy({ left: -300, behavior: 'smooth' });
  });
}
if (recNextBtnEl && recommendedGridEl) {
  recNextBtnEl.addEventListener('click', () => {
    recommendedGridEl.scrollBy({ left: 300, behavior: 'smooth' });
  });
}

// Event Listeners: Sort Select
if (sortSelectEl) {
  sortSelectEl.addEventListener('change', (e) => {
    sortOrder = e.target.value;
    render();
  });
}

// Event Listeners: Filters Selects in Settings Sheet
if (filterPriceSelectEl) {
  filterPriceSelectEl.addEventListener('change', (e) => {
    priceFilter = e.target.value;
    render();
  });
}

if (filterRatingSelectEl) {
  filterRatingSelectEl.addEventListener('change', (e) => {
    ratingFilter = parseFloat(e.target.value) || 0;
    render();
  });
}

// Event Listeners: Category Chips Navigation
if (categoryChipsGroupEl) {
  categoryChipsGroupEl.addEventListener('click', (e) => {
    const chipBtn = e.target.closest('.chip');
    if (!chipBtn) return;

    const category = chipBtn.dataset.category;
    if (category) {
      currentCategory = category;
      categoryChipsGroupEl.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      chipBtn.classList.add('is-active');
      render();
    }
  });
}

// Event Listeners: Inspector Expand/Collapse Panel
if (inspectorHeaderEl && inspectorPanelEl) {
  inspectorHeaderEl.addEventListener('click', () => {
    inspectorPanelEl.classList.toggle('is-expanded');
  });
}

// Event Listeners: Mobile Inspector Tabs Segmented Switcher
inspectorTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    inspectorTabBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const cols = inspectorPanelEl.querySelectorAll('.inspector__col');
    cols.forEach(col => {
      if (col.id === targetId) {
        col.classList.add('is-visible');
      } else {
        col.classList.remove('is-visible');
      }
    });
  });
});

// Event Listeners: Settings & Filters Sheet Dialog
function openSettings() {
  if (modalOverlayEl && settingsSheetEl) openOverlay(modalOverlayEl, settingsSheetEl);
}

function closeSettings() {
  if (modalOverlayEl) closeOverlay(modalOverlayEl);
}

if (openSettingsBtnEl) openSettingsBtnEl.addEventListener('click', openSettings);
if (closeSettingsBtnEl) closeSettingsBtnEl.addEventListener('click', closeSettings);
if (modalOverlayEl) {
  modalOverlayEl.addEventListener('click', (e) => {
    if (e.target === modalOverlayEl) closeSettings();
  });
}

// Cart Sheet Header Button Click & Overlay Event Handlers
const openCartBtnEl = document.getElementById('openCartBtn');
const cartOverlayEl = document.getElementById('cartOverlay');
const cartSheetEl = document.getElementById('cartSheet');

function openCartSheet() {
  if (cartOverlayEl && cartSheetEl) openOverlay(cartOverlayEl, cartSheetEl);
}

function closeCartSheet() {
  if (cartOverlayEl) closeOverlay(cartOverlayEl);
}

if (openCartBtnEl) {
  openCartBtnEl.addEventListener('click', () => {
    openCartSheet();
  });
}

if (cartOverlayEl) {
  cartOverlayEl.addEventListener('click', (e) => {
    if (e.target === cartOverlayEl) closeCartSheet();
  });
}

// App Initialization Check
const activeSession = getSession();
if (activeSession) {
  handleSignInSuccess(activeSession);
} else {
  if (authScreenEl) authScreenEl.style.display = 'flex';
  if (appMainEl) appMainEl.style.display = 'none';
  if (openProfileBtnEl) openProfileBtnEl.style.display = 'none';
  initAuthScreen(handleSignInSuccess);
}
