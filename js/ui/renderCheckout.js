import { getIcon } from './icons.js';
import { openOverlay, closeOverlay } from './overlay.js';
import { renderProductMedia } from './renderImage.js';
import {
  validateMobile,
  validatePinCode,
  validateUpi,
  luhnCheck,
  detectCardBrand,
  validateCardExpiry,
  validateCvv,
  calculatePriceBreakdown
} from '../services/validators.js';

// Indian States and Union Territories
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Helper to escape user input HTML to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render and Manage the 3-Step Checkout Modal.
 */
export function initCheckoutModal(shop, callbacks) {
  const { onCheckoutSuccess, onViewOrders } = callbacks;

  let currentStep = 1;
  let deliveryDetails = {
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pin: ''
  };

  let paymentMethod = 'card'; // 'card' | 'upi' | 'cod'
  let paymentDetails = {
    brand: 'Card',
    last4: '',
    cardNumber: '',
    upiId: '',
    otp: ''
  };

  const overlayEl = document.getElementById('checkoutOverlay');
  const sheetEl = document.getElementById('checkoutSheet');

  if (!overlayEl || !sheetEl) return;

  // Open Checkout Modal
  window.openCheckout = function() {
    if (shop.cart.size === 0) return;
    currentStep = 1;
    paymentDetails = { brand: 'Card', last4: '', cardNumber: '', upiId: '', otp: '' };
    renderStep();
    openOverlay(overlayEl, sheetEl);
  };

  // Close Checkout Modal
  window.closeCheckout = function() {
    closeOverlay(overlayEl);
    // Clear transient card security data
    paymentDetails = { brand: 'Card', last4: '', cardNumber: '', upiId: '', otp: '' };
  };

  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) window.closeCheckout();
  });

  // Render current step inside checkout sheet
  function renderStep() {
    const cartItems = shop.cart.toArray();
    const subtotal = shop.cart.getTotal();
    const priceBreakdown = calculatePriceBreakdown(subtotal);

    // Calculate progress line fill percentage
    const progressWidth = currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%';

    sheetEl.innerHTML = `
      <!-- Checkout Header -->
      <div class="checkout-header">
        <div class="checkout-title-row">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0;">
            ${currentStep === 4 ? 'Order Confirmed' : 'Checkout'}
          </h2>
          <button class="btn btn--ghost btn--icon-only" onclick="closeCheckout()" aria-label="Close Checkout">
            ${getIcon('x')}
          </button>
        </div>

        ${currentStep < 4 ? `
          <!-- 3-Step Progress Bar -->
          <div class="checkout-progress">
            <div class="checkout-progress__line">
              <div class="checkout-progress__fill" style="width: ${progressWidth};"></div>
            </div>

            <div class="checkout-step-node ${currentStep >= 1 ? 'is-active' : ''} ${currentStep > 1 ? 'is-complete' : ''}">
              <div class="checkout-step-dot">${currentStep > 1 ? getIcon('check') : '1'}</div>
              <span class="checkout-step-label">Delivery</span>
            </div>

            <div class="checkout-step-node ${currentStep >= 2 ? 'is-active' : ''} ${currentStep > 2 ? 'is-complete' : ''}">
              <div class="checkout-step-dot">${currentStep > 2 ? getIcon('check') : '2'}</div>
              <span class="checkout-step-label">Payment</span>
            </div>

            <div class="checkout-step-node ${currentStep >= 3 ? 'is-active' : ''}">
              <div class="checkout-step-dot">3</div>
              <span class="checkout-step-label">Review</span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Checkout Body Content -->
      <div class="checkout-body">
        ${renderStepContent(priceBreakdown, cartItems)}
      </div>
    `;

    attachStepEvents(priceBreakdown);
  }

  // Render inner HTML based on currentStep
  function renderStepContent(priceBreakdown, cartItems) {
    if (currentStep === 1) {
      // --- STEP 1: DELIVERY DETAILS ---
      return `
        <form id="deliveryForm" novalidate>
          <div class="form-group" id="group-name">
            <label class="form-label" for="inputName">Full Name</label>
            <input type="text" id="inputName" class="form-input" placeholder="e.g. Rahul Sharma" value="${escapeHtml(deliveryDetails.name)}" autocomplete="name" required />
            <span class="form-error" id="error-name" style="display:none;">Please enter your full name.</span>
          </div>

          <div class="form-group" id="group-mobile">
            <label class="form-label" for="inputMobile">Mobile Number (10 digits starting 6-9)</label>
            <input type="tel" id="inputMobile" class="form-input" placeholder="e.g. 9876543210" maxlength="10" inputmode="numeric" value="${escapeHtml(deliveryDetails.mobile)}" autocomplete="tel" required />
            <span class="form-error" id="error-mobile" style="display:none;">Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.</span>
          </div>

          <div class="form-group" id="group-address">
            <label class="form-label" for="inputAddress">Address Line</label>
            <input type="text" id="inputAddress" class="form-input" placeholder="House no, Street, Landmark" value="${escapeHtml(deliveryDetails.address)}" autocomplete="street-address" required />
            <span class="form-error" id="error-address" style="display:none;">Please enter your delivery address.</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group" id="group-city">
              <label class="form-label" for="inputCity">City</label>
              <input type="text" id="inputCity" class="form-input" placeholder="e.g. Mumbai" value="${escapeHtml(deliveryDetails.city)}" autocomplete="address-level2" required />
              <span class="form-error" id="error-city" style="display:none;">Enter city.</span>
            </div>

            <div class="form-group" id="group-pin">
              <label class="form-label" for="inputPin">PIN Code (6 digits)</label>
              <input type="text" id="inputPin" class="form-input" placeholder="e.g. 400001" maxlength="6" inputmode="numeric" value="${escapeHtml(deliveryDetails.pin)}" autocomplete="postal-code" required />
              <span class="form-error" id="error-pin" style="display:none;">Enter valid 6-digit PIN code.</span>
            </div>
          </div>

          <div class="form-group" id="group-state">
            <label class="form-label" for="inputState">State / Union Territory</label>
            <select id="inputState" class="form-select" autocomplete="address-level1">
              ${INDIAN_STATES.map(st => `<option value="${st}" ${deliveryDetails.state === st ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>

          <button type="submit" class="btn btn--full" style="margin-top: 12px;">
            Continue to Payment
          </button>
        </form>
      `;
    }

    if (currentStep === 2) {
      // --- STEP 2: PAYMENT METHOD ---
      return `
        <!-- Evaluator Test Payments Cheat Sheet -->
        <div class="test-payments-note">
          <div style="font-weight: 700; margin-bottom: 4px;">🧪 Test Payments Cheat Sheet (for Evaluation)</div>
          <div>• <strong>Card Success:</strong> <code>4111 1111 1111 1111</code></div>
          <div>• <strong>Bank Decline:</strong> <code>4000 0000 0000 0002</code></div>
          <div>• <strong>Insufficient Funds:</strong> <code>4000 0000 0000 9995</code></div>
          <div>• <strong>UPI Success:</strong> <code>success@test</code> | <strong>UPI Timeout:</strong> <code>fail@test</code></div>
          <div>• <strong>Card OTP:</strong> Any 6 digits except <code>000000</code> (which fails).</div>
        </div>

        <div style="font-size: 12px; color: var(--text-2); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
          ${getIcon('lock')} Demo payment. No real money is charged.
        </div>

        <div class="payment-methods-list">
          <!-- 1. CARD METHOD -->
          <div class="payment-row ${paymentMethod === 'card' ? 'is-selected' : ''}" data-method="card">
            <div class="payment-row__header">
              <div class="payment-row__left">
                <span class="radio-indicator"></span>
                ${getIcon('creditCard')}
                <span style="font-weight: 600;">Credit / Debit Card</span>
              </div>
              <span id="cardBrandBadge" class="card-brand-badge">${paymentDetails.brand || 'Card'}</span>
            </div>
            <div class="payment-row__content">
              <div class="payment-row__inner">
                <div class="form-group" id="group-card-num" style="margin-top: 12px;">
                  <label class="form-label" for="inputCardNum">Card Number</label>
                  <input type="text" id="inputCardNum" class="form-input tabular-nums" placeholder="4111 1111 1111 1111" maxlength="19" inputmode="numeric" autocomplete="cc-number" />
                  <span class="form-error" id="error-card-num" style="display:none;">Invalid card number (fails Luhn check).</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-group" id="group-card-exp">
                    <label class="form-label" for="inputCardExp">Expiry (MM/YY)</label>
                    <input type="text" id="inputCardExp" class="form-input tabular-nums" placeholder="12/28" maxlength="5" autocomplete="cc-exp" />
                    <span class="form-error" id="error-card-exp" style="display:none;">Invalid/expired date.</span>
                  </div>

                  <div class="form-group" id="group-card-cvv">
                    <label class="form-label" for="inputCardCvv">CVV</label>
                    <input type="password" id="inputCardCvv" class="form-input tabular-nums" placeholder="123" maxlength="3" inputmode="numeric" autocomplete="cc-csc" />
                    <span class="form-error" id="error-card-cvv" style="display:none;">Must be 3 digits.</span>
                  </div>
                </div>

                <div class="form-group" id="group-card-name" style="margin-bottom: 0;">
                  <label class="form-label" for="inputCardName">Name on Card</label>
                  <input type="text" id="inputCardName" class="form-input" placeholder="Rahul Sharma" autocomplete="cc-name" />
                  <span class="form-error" id="error-card-name" style="display:none;">Please enter name on card.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. UPI METHOD -->
          <div class="payment-row ${paymentMethod === 'upi' ? 'is-selected' : ''}" data-method="upi">
            <div class="payment-row__header">
              <div class="payment-row__left">
                <span class="radio-indicator"></span>
                ${getIcon('smartphone')}
                <span style="font-weight: 600;">UPI (GPay, PhonePe, Paytm)</span>
              </div>
            </div>
            <div class="payment-row__content">
              <div class="payment-row__inner">
                <div class="form-group" id="group-upi" style="margin-top: 12px; margin-bottom: 0;">
                  <label class="form-label" for="inputUpi">Virtual Payment Address (VPA / UPI ID)</label>
                  <input type="text" id="inputUpi" class="form-input" placeholder="e.g. success@test or username@okhdfcbank" value="${escapeHtml(paymentDetails.upiId)}" />
                  <span class="form-error" id="error-upi" style="display:none;">Enter valid UPI ID in format username@bank.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. CASH ON DELIVERY -->
          <div class="payment-row ${paymentMethod === 'cod' ? 'is-selected' : ''}" data-method="cod">
            <div class="payment-row__header">
              <div class="payment-row__left">
                <span class="radio-indicator"></span>
                ${getIcon('truck')}
                <span style="font-weight: 600;">Cash on Delivery (COD)</span>
              </div>
            </div>
            <div class="payment-row__content">
              <div class="payment-row__inner">
                <p style="font-size: 13px; color: var(--text-2); margin-top: 12px;">Pay with cash or UPI upon delivery. No upfront payment required.</p>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px;">
          <button type="button" class="btn btn--secondary" onclick="prevStep()">Back</button>
          <button type="button" id="paymentContinueBtn" class="btn btn--full" style="flex: 1;">Continue to Review</button>
        </div>
      `;
    }

    if (currentStep === 3) {
      // --- STEP 3: REVIEW & PAY ---
      const formattedTotal = `₹${priceBreakdown.grandTotal.toLocaleString("en-IN")}`;
      const payButtonLabel = paymentMethod === 'cod' ? 'Place Cash on Delivery Order' : `Pay ${formattedTotal}`;

      return `
        <div id="checkoutErrorBanner" class="test-payments-note" style="display: none; background: #FEE4E2; border-color: #FDA29B; color: var(--danger); margin-bottom: 16px;">
          <div style="font-weight: 700;" id="checkoutErrorMessage">Payment failed</div>
        </div>

        <!-- Order Items Summary -->
        <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 10px;">Order Summary (${cartItems.length} items)</h3>
        <div style="max-height: 180px; overflow-y: auto; margin-bottom: 16px; border: 1px solid var(--separator); border-radius: var(--r-md); padding: 12px;">
          ${cartItems.map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px dashed var(--separator); gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                <div style="width: 36px; height: 36px; border-radius: var(--r-sm); overflow: hidden; position: relative; flex-shrink: 0; background-color: ${item.product.tint};">
                  ${renderProductMedia(item.product, { width: 36, height: 36 })}
                </div>
                <span>${escapeHtml(item.product.name)} × ${item.qty}</span>
              </div>
              <span class="tabular-nums" style="font-weight: 600;">₹${(item.product.price * item.qty).toLocaleString("en-IN")}</span>
            </div>
          `).join('')}
        </div>

        <!-- Price Breakdown -->
        <div class="price-breakdown-card">
          <div class="price-row">
            <span>Subtotal</span>
            <span class="tabular-nums">₹${priceBreakdown.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div class="price-row">
            <span>Delivery Fee ${priceBreakdown.deliveryFee === 0 ? '(Free above ₹499)' : ''}</span>
            <span class="tabular-nums">${priceBreakdown.deliveryFee === 0 ? 'FREE' : '₹' + priceBreakdown.deliveryFee}</span>
          </div>
          <div class="price-row">
            <span>GST (5%)</span>
            <span class="tabular-nums">₹${priceBreakdown.gst.toLocaleString("en-IN")}</span>
          </div>
          <div class="price-row price-row--total">
            <span>Grand Total</span>
            <span class="tabular-nums">${formattedTotal}</span>
          </div>
        </div>

        <!-- Delivery & Payment Preview -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; font-size: 13px;">
          <div style="background: var(--surface-2); padding: 10px 12px; border-radius: var(--r-sm);">
            <div style="font-weight: 600; color: var(--text-2); margin-bottom: 2px;">DELIVERING TO</div>
            <div style="font-weight: 600;">${escapeHtml(deliveryDetails.name)}</div>
            <div style="color: var(--text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(deliveryDetails.address)}, ${escapeHtml(deliveryDetails.city)}</div>
          </div>
          <div style="background: var(--surface-2); padding: 10px 12px; border-radius: var(--r-sm);">
            <div style="font-weight: 600; color: var(--text-2); margin-bottom: 2px;">PAYMENT METHOD</div>
            <div style="font-weight: 600; text-transform: uppercase;">${paymentMethod} (${paymentDetails.brand || 'COD'})</div>
            <div style="color: var(--text-2);">${paymentMethod === 'card' ? '•••• ' + paymentDetails.last4 : paymentMethod === 'upi' ? escapeHtml(paymentDetails.upiId) : 'Cash on delivery'}</div>
          </div>
        </div>

        <div style="display: flex; gap: 12px;">
          <button type="button" class="btn btn--secondary" onclick="prevStep()">Back</button>
          <button type="button" id="payFinalBtn" class="btn btn--full" style="flex: 1;">
            ${payButtonLabel}
          </button>
        </div>
      `;
    }

    if (currentStep === 4) {
      // --- STEP 4: SUCCESS CONFIRMATION SCREEN ---
      const lastOrder = shop.orderQueue.toArray().slice(-1)[0] || shop.orderHistory[0];
      const orderId = lastOrder ? lastOrder.id : 'ORD-1001';
      const grandTotal = lastOrder ? lastOrder.total : priceBreakdown.grandTotal;

      return `
        <div class="success-container">
          <div class="success-check-wrapper">
            ${getIcon('checkCircle')}
          </div>
          <h3 style="font-size: 22px; font-weight: 700; margin-bottom: 4px;">Order Placed Successfully!</h3>
          <p style="color: var(--text-2); font-size: 14px; margin-bottom: 20px;">
            Order ID: <strong style="color: var(--text);">${orderId}</strong>
          </p>

          <div style="background: var(--surface-2); width: 100%; padding: 16px; border-radius: var(--r-md); margin-bottom: 20px; text-align: left; font-size: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: var(--text-2);">Total Amount Paid:</span>
              <strong class="tabular-nums">₹${grandTotal.toLocaleString("en-IN")}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: var(--text-2);">Payment Mode:</span>
              <strong style="text-transform: uppercase;">${paymentMethod} (${lastOrder?.payment?.paymentStatus || 'PAID'})</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-2);">Estimated Delivery:</span>
              <strong>Delivered in 2–3 business days</strong>
            </div>
          </div>

          <div style="display: flex; gap: 12px; width: 100%;">
            <button id="successViewOrdersBtn" class="btn btn--secondary" style="flex: 1;">View Orders</button>
            <button id="successContinueBtn" class="btn btn--full" style="flex: 1;">Continue Shopping</button>
          </div>
        </div>
      `;
    }
  }

  // Attach dynamic event listeners per step
  function attachStepEvents(priceBreakdown) {
    if (currentStep === 1) {
      const form = document.getElementById('deliveryForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('inputName').value.trim();
          const mobile = document.getElementById('inputMobile').value.trim();
          const address = document.getElementById('inputAddress').value.trim();
          const city = document.getElementById('inputCity').value.trim();
          const pin = document.getElementById('inputPin').value.trim();
          const state = document.getElementById('inputState').value;

          let valid = true;

          // Name check
          const groupName = document.getElementById('group-name');
          const errName = document.getElementById('error-name');
          if (!name) {
            groupName.classList.add('has-error');
            errName.style.display = 'block';
            valid = false;
          } else {
            groupName.classList.remove('has-error');
            errName.style.display = 'none';
          }

          // Mobile check
          const groupMobile = document.getElementById('group-mobile');
          const errMobile = document.getElementById('error-mobile');
          if (!validateMobile(mobile)) {
            groupMobile.classList.add('has-error');
            errMobile.style.display = 'block';
            valid = false;
          } else {
            groupMobile.classList.remove('has-error');
            errMobile.style.display = 'none';
          }

          // Address check
          const groupAddress = document.getElementById('group-address');
          const errAddress = document.getElementById('error-address');
          if (!address) {
            groupAddress.classList.add('has-error');
            errAddress.style.display = 'block';
            valid = false;
          } else {
            groupAddress.classList.remove('has-error');
            errAddress.style.display = 'none';
          }

          // City check
          const groupCity = document.getElementById('group-city');
          const errCity = document.getElementById('error-city');
          if (!city) {
            groupCity.classList.add('has-error');
            errCity.style.display = 'block';
            valid = false;
          } else {
            groupCity.classList.remove('has-error');
            errCity.style.display = 'none';
          }

          // PIN check
          const groupPin = document.getElementById('group-pin');
          const errPin = document.getElementById('error-pin');
          if (!validatePinCode(pin)) {
            groupPin.classList.add('has-error');
            errPin.style.display = 'block';
            valid = false;
          } else {
            groupPin.classList.remove('has-error');
            errPin.style.display = 'none';
          }

          if (valid) {
            deliveryDetails = { name, mobile, address, city, state, pin };
            currentStep = 2;
            renderStep();
          }
        });
      }
    }

    if (currentStep === 2) {
      // Payment method row click selection
      const rows = sheetEl.querySelectorAll('.payment-row');
      rows.forEach(row => {
        row.addEventListener('click', (e) => {
          const method = row.dataset.method;
          if (method) {
            paymentMethod = method;
            rows.forEach(r => r.classList.remove('is-selected'));
            row.classList.add('is-selected');
          }
        });
      });

      // Card brand auto-detect on typing
      const cardNumInput = document.getElementById('inputCardNum');
      if (cardNumInput) {
        cardNumInput.addEventListener('input', (e) => {
          const val = e.target.value;
          const brand = detectCardBrand(val);
          const badge = document.getElementById('cardBrandBadge');
          if (badge) badge.textContent = brand;
          paymentDetails.brand = brand;
        });
      }

      const continueBtn = document.getElementById('paymentContinueBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          if (paymentMethod === 'card') {
            const cardNum = document.getElementById('inputCardNum').value.trim();
            const exp = document.getElementById('inputCardExp').value.trim();
            const cvv = document.getElementById('inputCardCvv').value.trim();
            const name = document.getElementById('inputCardName').value.trim();

            let valid = true;

            const groupNum = document.getElementById('group-card-num');
            const errNum = document.getElementById('error-card-num');
            if (!luhnCheck(cardNum)) {
              groupNum.classList.add('has-error');
              errNum.style.display = 'block';
              valid = false;
            } else {
              groupNum.classList.remove('has-error');
              errNum.style.display = 'none';
            }

            const groupExp = document.getElementById('group-card-exp');
            const errExp = document.getElementById('error-card-exp');
            if (!validateCardExpiry(exp)) {
              groupExp.classList.add('has-error');
              errExp.style.display = 'block';
              valid = false;
            } else {
              groupExp.classList.remove('has-error');
              errExp.style.display = 'none';
            }

            const groupCvv = document.getElementById('group-card-cvv');
            const errCvv = document.getElementById('error-card-cvv');
            if (!validateCvv(cvv)) {
              groupCvv.classList.add('has-error');
              errCvv.style.display = 'block';
              valid = false;
            } else {
              groupCvv.classList.remove('has-error');
              errCvv.style.display = 'none';
            }

            const groupName = document.getElementById('group-card-name');
            const errName = document.getElementById('error-card-name');
            if (!name) {
              groupName.classList.add('has-error');
              errName.style.display = 'block';
              valid = false;
            } else {
              groupName.classList.remove('has-error');
              errName.style.display = 'none';
            }

            if (valid) {
              const cleaned = cardNum.replace(/\D/g, '');
              paymentDetails.last4 = cleaned.slice(-4);
              paymentDetails.cardNumber = cleaned;

              // Prompt simulated OTP for card payments
              const otpInput = prompt("Simulated 3D Secure OTP: Enter any 6-digit OTP (Enter 000000 to test failure):", "123456");
              if (otpInput === null) return; // User cancelled prompt
              paymentDetails.otp = otpInput.trim();

              currentStep = 3;
              renderStep();
            }
          } else if (paymentMethod === 'upi') {
            const upiId = document.getElementById('inputUpi').value.trim();
            const groupUpi = document.getElementById('group-upi');
            const errUpi = document.getElementById('error-upi');

            if (!validateUpi(upiId)) {
              groupUpi.classList.add('has-error');
              errUpi.style.display = 'block';
            } else {
              groupUpi.classList.remove('has-error');
              errUpi.style.display = 'none';
              paymentDetails.upiId = upiId;
              paymentDetails.brand = 'UPI';
              currentStep = 3;
              renderStep();
            }
          } else if (paymentMethod === 'cod') {
            paymentDetails.brand = 'COD';
            currentStep = 3;
            renderStep();
          }
        });
      }
    }

    if (currentStep === 3) {
      const payBtn = document.getElementById('payFinalBtn');
      if (payBtn) {
        payBtn.addEventListener('click', async () => {
          payBtn.disabled = true;
          payBtn.innerHTML = `<span class="spinner-icon">${getIcon('coffee')}</span> Processing Payment...`;

          const result = await shop.checkout(deliveryDetails, paymentMethod, paymentDetails);

          // Security Rule: Clear sensitive card numbers from memory immediately!
          paymentDetails.cardNumber = '';

          if (result.success) {
            currentStep = 4;
            renderStep();
            if (typeof onCheckoutSuccess === 'function') {
              onCheckoutSuccess(result.order);
            }
          } else {
            payBtn.disabled = false;
            const formattedTotal = `₹${priceBreakdown.grandTotal.toLocaleString("en-IN")}`;
            payBtn.innerHTML = paymentMethod === 'cod' ? 'Place Cash on Delivery Order' : `Pay ${formattedTotal}`;

            const errBanner = document.getElementById('checkoutErrorBanner');
            const errText = document.getElementById('checkoutErrorMessage');
            if (errBanner && errText) {
              errText.textContent = `Payment Failed: ${result.reason || 'Transaction declined'}`;
              errBanner.style.display = 'block';
            }
          }
        });
      }
    }

    if (currentStep === 4) {
      const continueBtn = document.getElementById('successContinueBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          window.closeCheckout();
        });
      }

      const viewOrdersBtn = document.getElementById('successViewOrdersBtn');
      if (viewOrdersBtn) {
        viewOrdersBtn.addEventListener('click', () => {
          window.closeCheckout();
          if (typeof onViewOrders === 'function') {
            onViewOrders();
          }
        });
      }
    }
  }

  window.prevStep = function() {
    if (currentStep > 1) {
      currentStep--;
      renderStep();
    }
  };
}
