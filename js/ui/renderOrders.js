import { getIcon } from './icons.js';

/**
 * Render Customer Orders ("Your Orders") and Process Next action.
 * Keeps underlying FIFO Queue logic intact while presenting customer-friendly copy.
 */
export function renderOrders(shop, containerEl, onProcessNext) {
  if (!containerEl) return;

  const queueItems = shop.orderQueue.toArray();
  const historyItems = shop.orderHistory;
  const isQueueEmpty = queueItems.length === 0;

  containerEl.innerHTML = `
    <div class="sidebar-panel-header">
      <h2 class="sidebar-panel-title">Your Orders</h2>
    </div>

    ${isQueueEmpty && historyItems.length === 0 ? `
      <div class="sidebar-empty-state">
        <div class="sidebar-empty-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B9AE9E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
        </div>
        <p class="sidebar-empty-title">No orders yet.</p>
        <p class="sidebar-empty-sub">Your completed orders will appear here.</p>
      </div>
    ` : ''}

    ${queueItems.length > 0 ? `
      <div class="orders-list">
        ${queueItems.map((order, index) => {
          const payStatus = order.payment ? order.payment.paymentStatus : 'PAID';
          const payBadgeClass = payStatus === 'COD' ? 'order-status-chip order-status-chip--processing' : 'order-status-chip order-status-chip--paid';

          return `
            <div class="order-row">
              <div class="order-row__info">
                <div class="order-row__id-line">
                  <span class="order-row__id">${order.id}</span>
                  <span class="order-status-chip order-status-chip--processing">Processing</span>
                  <span class="${payBadgeClass}">${payStatus}</span>
                </div>
                <div class="order-row__meta">
                  ${order.items.length} item(s) &bull; ${order.placedAt}
                </div>
              </div>
              <span class="order-row__total tabular-nums">₹${order.total.toLocaleString('en-IN')}</span>
            </div>
          `;
        }).join('')}
      </div>
    ` : ''}

    ${historyItems.length > 0 ? `
      <div class="orders-history">
        <p class="orders-history__label">Order History (${historyItems.length})</p>
        <div class="orders-history-list">
          ${historyItems.map(order => `
            <div class="order-history-row">
              <div class="order-row__id-line">
                <span class="order-row__id">${order.id}</span>
                <span class="order-status-chip order-status-chip--delivered">Confirmed</span>
                <span class="order-status-chip order-status-chip--paid">${order.payment?.paymentStatus || 'PAID'}</span>
              </div>
              <span class="order-row__total tabular-nums">₹${order.total.toLocaleString('en-IN')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  const processBtn = containerEl.querySelector('#processNextOrderBtn');
  if (processBtn && !processBtn.disabled) {
    processBtn.addEventListener('click', () => onProcessNext());
  }
}
