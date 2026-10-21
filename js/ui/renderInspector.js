import { emailOutbox, getLastOutboxOp } from '../services/outbox.js';

/**
 * Visualizer for the Data Structure Inspector panel.
 * Draws Linked List (Cart), Stack (Undo), Orders Queue, Email Outbox Queue, and Operation Log with Big-O.
 */
export function renderInspector(shop, containerEl) {
  if (!containerEl) return;

  const cartNodes = shop.cart.toArray();
  const stackItems = shop.undoStack.toArray();
  const queueOrders = shop.orderQueue.toArray();
  const emailJobs = emailOutbox.toArray();

  // 1. Update Header Bar: Log & Stats
  const logEl = containerEl.querySelector('#inspectorLog');
  if (logEl) {
    const outboxOp = getLastOutboxOp();
    if (outboxOp && outboxOp !== 'Outbox ready' && outboxOp !== 'Outbox cleared') {
      logEl.textContent = outboxOp;
    } else {
      logEl.textContent = shop.lastOp || 'Initialized — Ready';
    }
  }

  const statCartEl = containerEl.querySelector('#statNodes');
  const statStackEl = containerEl.querySelector('#statStack');
  const statQueueEl = containerEl.querySelector('#statQueue');
  const statEmailEl = containerEl.querySelector('#statEmail');

  if (statCartEl) statCartEl.textContent = `nodes ${shop.cart.size}`;
  if (statStackEl) statStackEl.textContent = `stack ${shop.undoStack.size()}`;
  if (statQueueEl) statQueueEl.textContent = `orders ${shop.orderQueue.length}`;
  if (statEmailEl) statEmailEl.textContent = `emails ${emailOutbox.length}`;

  // 2. Render Linked List Column
  const listColEl = containerEl.querySelector('#inspectorLinkedList');
  if (listColEl) {
    if (cartNodes.length === 0) {
      listColEl.innerHTML = `
        <div class="ds-empty">
          <span>HEAD = NULL</span><br/>
          <span style="font-size: 10px; color: var(--insp-dim);">List is empty</span>
        </div>
      `;
    } else {
      let listHtml = '';
      cartNodes.forEach((node, index) => {
        const isHead = index === 0;
        const isTail = index === cartNodes.length - 1;
        const isChanged = node.product.id === shop.lastChangedId;

        listHtml += `
          <div class="ds-node ${isChanged ? 'is-changed' : ''}">
            ${isHead ? '<span class="tag tag--head">HEAD</span>' : ''}
            ${isTail ? '<span class="tag tag--tail">TAIL</span>' : ''}
            <div class="ds-node__data">${node.product.name} ×${node.qty}</div>
            <div class="ds-node__ptr">•</div>
          </div>
          <span class="ds-arrow">→</span>
        `;
      });
      listHtml += `<span class="ds-node__ptr" style="color: var(--insp-dim); font-family: var(--mono); font-size: 12px;">NULL</span>`;
      listColEl.innerHTML = listHtml;
    }
  }

  // 3. Render Stack Column (LIFO, newest on top)
  const stackColEl = containerEl.querySelector('#inspectorStack');
  if (stackColEl) {
    if (stackItems.length === 0) {
      stackColEl.innerHTML = `
        <div class="ds-empty">
          <span>TOP = NULL</span><br/>
          <span style="font-size: 10px; color: var(--insp-dim);">Stack empty</span>
        </div>
      `;
    } else {
      const stackHtml = stackItems.map((action, index) => {
        const isTop = index === stackItems.length - 1;
        return `
          <div class="stack-item">
            <span>${action.type} ${action.name || ''}</span>
            ${isTop ? '<span class="tag tag--top">TOP</span>' : ''}
          </div>
        `;
      }).join('');
      stackColEl.innerHTML = `<div class="stack-column">${stackHtml}</div>`;
    }
  }

  // 4. Render Orders Queue Column (FIFO, front on left, rear on right)
  const queueColEl = containerEl.querySelector('#inspectorQueue');
  if (queueColEl) {
    if (queueOrders.length === 0) {
      queueColEl.innerHTML = `
        <div class="ds-empty">
          <span>FRONT / REAR = NULL</span><br/>
          <span style="font-size: 10px; color: var(--insp-dim);">Orders Queue empty</span>
        </div>
      `;
    } else {
      const queueHtml = queueOrders.map((order, index) => {
        const isFront = index === 0;
        const isRear = index === queueOrders.length - 1;
        const payTag = order.payment?.paymentStatus || 'PAID';

        return `
          <div class="queue-item">
            ${isFront ? '<span class="tag tag--front">FRONT</span>' : ''}
            ${isRear ? '<span class="tag tag--rear">REAR</span>' : ''}
            <span>${order.id} [${payTag}] (₹${order.total})</span>
          </div>
        `;
      }).join('');
      queueColEl.innerHTML = `<div class="queue-row">${queueHtml}</div>`;
    }
  }

  // 5. Render Email Outbox Queue Column (FIFO, front on left, rear on right)
  const emailColEl = containerEl.querySelector('#inspectorEmailQueue');
  if (emailColEl) {
    if (emailJobs.length === 0) {
      emailColEl.innerHTML = `
        <div class="ds-empty">
          <span>FRONT / REAR = NULL</span><br/>
          <span style="font-size: 10px; color: var(--insp-dim);">Email Outbox empty</span>
        </div>
      `;
    } else {
      const emailHtml = emailJobs.map((job, index) => {
        const isFront = index === 0;
        const isRear = index === emailJobs.length - 1;

        return `
          <div class="queue-item">
            ${isFront ? '<span class="tag tag--front">FRONT</span>' : ''}
            ${isRear ? '<span class="tag tag--rear">REAR</span>' : ''}
            <span>${job.id} [${job.type}]</span>
          </div>
        `;
      }).join('');
      emailColEl.innerHTML = `<div class="queue-row">${emailHtml}</div>`;
    }
  }
}
