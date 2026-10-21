import { getIcon } from './icons.js';
import { getInitials } from '../services/auth.js';
import { getSentEmails } from '../services/emailService.js';
import { openOverlay, closeOverlay } from './overlay.js';
import { renderProductMedia } from './renderImage.js';

let profileOverlayEl = null;
let profileSheetEl = null;
let currentView = 'main'; // 'main' | 'orders' | 'inbox' | 'email-detail' | 'settings'
let selectedEmail = null;

export function initProfileSidebar(onSignOutCallback) {
  profileOverlayEl = document.getElementById('profileOverlay');
  profileSheetEl = document.getElementById('profileSheet');

  if (!profileOverlayEl || !profileSheetEl) return;

  profileOverlayEl.addEventListener('click', (e) => {
    if (e.target === profileOverlayEl) closeProfileSidebar();
  });
}

export function openProfileSidebar(shop, session) {
  if (!profileOverlayEl || !profileSheetEl) return;
  currentView = 'main';
  selectedEmail = null;
  renderProfileView(shop, session, onSignOutCallback);
  openOverlay(profileOverlayEl, profileSheetEl);
}

export function closeProfileSidebar() {
  if (profileOverlayEl) closeOverlay(profileOverlayEl);
}

let onSignOutCallback = null;
export function setSignOutCallback(cb) {
  onSignOutCallback = cb;
}

/**
 * Main Render Pipeline for Profile Sub-Views (iOS Navigation Stack)
 */
export function renderProfileView(shop, session, onSignOut) {
  if (!profileSheetEl || !session) return;
  if (onSignOut) onSignOutCallback = onSignOut;

  const initials = getInitials(session.displayName);
  const pendingOrders = shop ? shop.orderQueue.toArray() : [];
  const processedOrders = shop ? (shop.orderHistory || []) : [];
  const totalOrdersCount = pendingOrders.length + processedOrders.length;

  const sentEmails = getSentEmails();

  if (currentView === 'main') {
    renderMainView(session, initials, totalOrdersCount, sentEmails.length);
  } else if (currentView === 'orders') {
    renderOrdersView(shop, session);
  } else if (currentView === 'inbox') {
    renderInboxView(sentEmails, session);
  } else if (currentView === 'email-detail') {
    renderEmailDetailView(selectedEmail, session);
  } else if (currentView === 'settings') {
    renderSettingsView(session);
  }

  attachProfileEvents(shop, session);
}

function renderMainView(session, initials, ordersCount, inboxCount) {
  const emailDisplay = session.email ? session.email : 'No email linked';

  profileSheetEl.innerHTML = `
    <div class="profile-nav-header">
      <div style="font-weight: 700; font-size: 17px;">Account Profile</div>
      <button class="btn btn--ghost btn--icon-only close-profile-btn" aria-label="Close Profile">
        ${getIcon('x')}
      </button>
    </div>

    <div style="padding: 20px 20px 0 20px; display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
      <div class="avatar-lg">${initials}</div>
      <div>
        <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 2px 0;">${session.displayName}</h2>
        <p style="font-size: 13px; color: var(--text-2); margin: 0;">${emailDisplay}</p>
      </div>
    </div>

    <div style="padding: 0 20px 20px 20px;">
      <div class="ios-group">
        <div class="ios-row" id="navToOrders">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="ios-icon">${getIcon('package')}</div>
            <span style="font-weight: 500; font-size: 15px;">My Orders</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="ios-badge">${ordersCount}</span>
            <span style="color: var(--text-3);">${getIcon('chevronRight')}</span>
          </div>
        </div>

        <div class="ios-row" id="navToInbox">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="ios-icon">${getIcon('mail')}</div>
            <span style="font-weight: 500; font-size: 15px;">Email Inbox</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="ios-badge">${inboxCount}</span>
            <span style="color: var(--text-3);">${getIcon('chevronRight')}</span>
          </div>
        </div>

        <div class="ios-row" id="navToSettings">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="ios-icon">${getIcon('settings')}</div>
            <span style="font-weight: 500; font-size: 15px;">Settings</span>
          </div>
          <span style="color: var(--text-3);">${getIcon('chevronRight')}</span>
        </div>
      </div>

      <div class="ios-group" style="margin-top: 16px;">
        <div class="ios-row" id="btnSignOutProfile" style="color: var(--danger); cursor: pointer;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="ios-icon" style="color: var(--danger);">${getIcon('logOut')}</div>
            <span style="font-weight: 600; font-size: 15px;">Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderOrdersView(shop, session) {
  const pendingOrders = shop ? shop.orderQueue.toArray() : [];
  const processedOrders = shop ? (shop.orderHistory || []) : [];

  // Combine newest first
  const allOrders = [
    ...pendingOrders.map(o => ({ ...o, statusLabel: 'Pending', statusBadgeClass: 'badge--pending' })),
    ...processedOrders.map(o => ({ ...o, statusLabel: 'Processed', statusBadgeClass: 'badge--processed' }))
  ].reverse();

  profileSheetEl.innerHTML = `
    <div class="profile-nav-header">
      <button class="btn btn--ghost nav-back-btn" id="navBackToMain" style="gap: 4px; padding: 0 8px;">
        ${getIcon('chevronLeft')} Profile
      </button>

      <span style="font-weight: 700; font-size: 16px;">My Orders</span>

      <button class="btn btn--ghost btn--icon-only close-profile-btn" aria-label="Close Profile">
        ${getIcon('x')}
      </button>
    </div>

    <div style="padding: 16px 20px 20px 20px; overflow-y: auto; flex: 1;">
      ${allOrders.length === 0 ? `
        <div class="ds-empty" style="padding: 32px 16px;">
          <p style="color: var(--text); font-weight: 600; font-size: 15px; margin: 0;">No orders placed yet.</p>
          <p style="font-size: 13px; color: var(--text-2); margin-top: 4px;">Items you order will appear here.</p>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${allOrders.map(order => `
            <div class="card" style="padding: 14px; box-shadow: var(--shadow-1);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 700; font-size: 15px;">${order.id}</span>
                <div style="display: flex; gap: 6px;">
                  <span class="badge ${order.statusBadgeClass}">${order.statusLabel}</span>
                  <span class="badge badge--processed" style="font-size: 11px;">${order.payment?.paymentStatus || 'PAID'}</span>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px;">
                ${order.items.map(i => `
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-2);">
                    <div style="width: 32px; height: 32px; border-radius: var(--r-sm); overflow: hidden; position: relative; flex-shrink: 0; background-color: ${i.product.tint};">
                      ${renderProductMedia(i.product, { width: 32, height: 32 })}
                    </div>
                    <span>${i.product.name} (×${i.qty})</span>
                  </div>
                `).join('')}
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; border-top: 1px solid var(--separator); padding-top: 8px;">
                <span style="color: var(--text-2);">${new Date(order.createdAt || Date.now()).toLocaleTimeString()}</span>
                <span style="font-weight: 700; font-size: 15px;">₹${order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function renderInboxView(sentEmails, session) {
  profileSheetEl.innerHTML = `
    <div class="profile-nav-header">
      <button class="btn btn--ghost nav-back-btn" id="navBackToMain" style="gap: 4px; padding: 0 8px;">
        ${getIcon('chevronLeft')} Profile
      </button>

      <span style="font-weight: 700; font-size: 16px;">Email Inbox</span>

      <button class="btn btn--ghost btn--icon-only close-profile-btn" aria-label="Close Profile">
        ${getIcon('x')}
      </button>
    </div>

    <div style="padding: 16px 20px 20px 20px; overflow-y: auto; flex: 1;">
      ${sentEmails.length === 0 ? `
        <div class="ds-empty" style="padding: 32px 16px;">
          <p style="color: var(--text); font-weight: 600; font-size: 15px; margin: 0;">No emails sent yet.</p>
          <p style="font-size: 13px; color: var(--text-2); margin-top: 4px;">Order confirmations and status updates will be logged here.</p>
        </div>
      ` : `
        <div class="ios-group">
          ${sentEmails.map(email => `
            <div class="ios-row email-inbox-row" data-id="${email.id}" style="cursor: pointer; padding: 12px 16px;">
              <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; overflow: hidden; padding-right: 8px;">
                <span style="font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${email.subject}</span>
                <span style="font-size: 12px; color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">To: ${email.to}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="badge badge--processed" style="font-size: 10px;">${email.status}</span>
                <span style="color: var(--text-3);">${getIcon('chevronRight')}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function renderEmailDetailView(email, session) {
  if (!email) {
    currentView = 'inbox';
    renderInboxView(getSentEmails(), session);
    return;
  }

  // Mailto link preparation
  const isValidTo = email.to && email.to.includes('@');
  const plainTextTruncated = (email.text || '').slice(0, 1600);
  const mailtoUrl = isValidTo
    ? `mailto:${encodeURIComponent(email.to)}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(plainTextTruncated)}`
    : '#';

  profileSheetEl.innerHTML = `
    <div class="profile-nav-header">
      <button class="btn btn--ghost nav-back-btn" id="navBackToInbox" style="gap: 4px; padding: 0 8px;">
        ${getIcon('chevronLeft')} Inbox
      </button>

      <span style="font-weight: 700; font-size: 15px;">Email Preview</span>

      <button class="btn btn--ghost btn--icon-only close-profile-btn" aria-label="Close Profile">
        ${getIcon('x')}
      </button>
    </div>

    <div style="padding: 16px 20px 20px 20px; overflow-y: auto; flex: 1;">
      <div style="margin-bottom: 16px;">
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">${email.subject}</div>
        <div style="font-size: 13px; color: var(--text-2);">
          <span>To: ${email.to}</span> •
          <span>${new Date(email.createdAt).toLocaleTimeString()}</span>
        </div>
      </div>

      <!-- Rendered Email Body Preview Container -->
      <div class="email-preview-frame" style="background: #ffffff; border: 1px solid var(--separator); border-radius: 16px; padding: 16px; margin-bottom: 16px; box-shadow: var(--shadow-1);">
        ${email.html}
      </div>

      <!-- Mailto Action Button -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <a
          href="${mailtoUrl}"
          class="btn btn--secondary btn--full ${!isValidTo ? 'disabled' : ''}"
          style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; ${!isValidTo ? 'opacity: 0.4; pointer-events: none;' : ''}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${getIcon('mail')} Open in mail app
        </a>
        <p style="font-size: 12px; color: var(--text-3); text-align: center; margin: 0;">
          Opens your own mail app. Nothing is sent by this website.
        </p>
      </div>
    </div>
  `;
}

function renderSettingsView(session) {
  const motionOn = document.documentElement.dataset.motion === 'on';

  profileSheetEl.innerHTML = `
    <div class="profile-nav-header">
      <button class="btn btn--ghost nav-back-btn" id="navBackToMain" style="gap: 4px; padding: 0 8px;">
        ${getIcon('chevronLeft')} Profile
      </button>

      <span style="font-weight: 700; font-size: 16px;">Settings</span>

      <button class="btn btn--ghost btn--icon-only close-profile-btn" aria-label="Close Profile">
        ${getIcon('x')}
      </button>
    </div>

    <div style="padding: 16px 20px 20px 20px;">
      <div class="ios-group">
        <div class="ios-row" style="padding: 16px;">
          <div>
            <div style="font-weight: 600; font-size: 15px;">Animations</div>
            <div style="font-size: 13px; color: var(--text-2); margin-top: 2px;">Turn off to reduce motion & smooth transitions</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="profileMotionToggle" role="switch" aria-label="Animations" ${motionOn ? 'checked' : ''} />
            <span class="switch__track"></span>
            <span class="switch__thumb"></span>
          </label>
        </div>
      </div>
    </div>
  `;

  const motionToggle = document.getElementById('profileMotionToggle');
  if (motionToggle) {
    motionToggle.addEventListener('change', () => {
      const val = motionToggle.checked ? 'on' : 'off';
      document.documentElement.dataset.motion = val;
      localStorage.setItem('desimart-motion', val);
      // Sync main motion toggle if present
      const mainToggle = document.getElementById('motionToggle');
      if (mainToggle) mainToggle.checked = motionToggle.checked;
    });
  }
}

function attachProfileEvents(shop, session) {
  const closeBtns = profileSheetEl.querySelectorAll('.close-profile-btn');
  closeBtns.forEach(btn => btn.addEventListener('click', closeProfileSidebar));

  const navBackMain = profileSheetEl.querySelector('#navBackToMain');
  if (navBackMain) {
    navBackMain.addEventListener('click', () => {
      currentView = 'main';
      renderProfileView(shop, session, onSignOutCallback);
    });
  }

  const navBackInbox = profileSheetEl.querySelector('#navBackToInbox');
  if (navBackInbox) {
    navBackInbox.addEventListener('click', () => {
      currentView = 'inbox';
      renderProfileView(shop, session, onSignOutCallback);
    });
  }

  const navOrders = profileSheetEl.querySelector('#navToOrders');
  if (navOrders) {
    navOrders.addEventListener('click', () => {
      currentView = 'orders';
      renderProfileView(shop, session, onSignOutCallback);
    });
  }

  const navInbox = profileSheetEl.querySelector('#navToInbox');
  if (navInbox) {
    navInbox.addEventListener('click', () => {
      currentView = 'inbox';
      renderProfileView(shop, session, onSignOutCallback);
    });
  }

  const navSettings = profileSheetEl.querySelector('#navToSettings');
  if (navSettings) {
    navSettings.addEventListener('click', () => {
      currentView = 'settings';
      renderProfileView(shop, session, onSignOutCallback);
    });
  }

  const inboxRows = profileSheetEl.querySelectorAll('.email-inbox-row');
  inboxRows.forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      const emails = getSentEmails();
      selectedEmail = emails.find(e => e.id === id);
      currentView = 'email-detail';
      renderProfileView(shop, session, onSignOutCallback);
    });
  });

  const btnSignOut = profileSheetEl.querySelector('#btnSignOutProfile');
  if (btnSignOut) {
    btnSignOut.addEventListener('click', () => {
      closeProfileSidebar();
      if (onSignOutCallback) onSignOutCallback();
    });
  }
}
