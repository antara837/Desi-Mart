/**
 * Email Templates Generator.
 * Creates clean black-and-white inline styled HTML and plain-text templates.
 * Security: ALL user-provided values (names, addresses, product names) are escaped.
 * Constraint: NO emoji and NO images.
 */

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Builds Order Confirmation Email (Plain text & HTML).
 */
export function buildOrderConfirmationEmail({ order, user }) {
  const recipientName = escapeHtml(user?.displayName || 'Customer');
  const orderId = escapeHtml(order.id);
  const city = escapeHtml(order.delivery?.city || 'India');
  const paymentMethod = escapeHtml(order.payment?.method || 'Card');
  const dateStr = escapeHtml(new Date(order.createdAt || Date.now()).toLocaleString('en-IN'));

  const items = order.items || [];
  const itemsText = items.map(i => `${i.product.name} (x${i.qty}) - Rs ${i.product.price * i.qty}`).join('\n');

  const itemsHtml = items.map(i => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e5ea; font-size: 14px;">${escapeHtml(i.product.name)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e5ea; font-size: 14px; text-align: center;">${i.qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e5ea; font-size: 14px; text-align: right;">₹${(i.product.price * i.qty).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const subtotal = order.priceBreakdown?.subtotal ?? order.total;
  const deliveryFee = order.priceBreakdown?.deliveryFee ?? 0;
  const grandTotal = order.total;

  const subject = `Order Confirmation - ${order.id}`;

  const text = `
DesiMart — Order Confirmation

Hello ${user?.displayName || 'Customer'},

Thank you for shopping with DesiMart! Your order ${order.id} has been placed successfully.

Order Summary:
Date: ${new Date(order.createdAt || Date.now()).toLocaleString('en-IN')}
Delivery City: ${order.delivery?.city || 'India'}
Payment Method: ${order.payment?.method || 'Card'}

Items Ordered:
${itemsText}

Subtotal: Rs ${subtotal}
Delivery: ${deliveryFee === 0 ? 'FREE' : 'Rs ' + deliveryFee}
Total Paid: Rs ${grandTotal}

We will notify you when your order is processed.

— DesiMart Team
`.trim();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; color: #111111; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5ea; border-radius: 16px;">
      <div style="border-bottom: 2px solid #111111; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 700; margin: 0; color: #111111;">DesiMart</h1>
        <p style="font-size: 13px; color: #6c6c70; margin: 4px 0 0 0;">Order Confirmation</p>
      </div>

      <p style="font-size: 15px; line-height: 1.5; margin-bottom: 16px;">
        Hello <strong>${recipientName}</strong>,
      </p>
      <p style="font-size: 14px; color: #3a3a3c; line-height: 1.5; margin-bottom: 20px;">
        Thank you for shopping with DesiMart! Your order <strong>${orderId}</strong> has been placed successfully.
      </p>

      <div style="background-color: #f7f7f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #6c6c70;">Order ID:</span>
          <strong>${orderId}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #6c6c70;">Date:</span>
          <span>${dateStr}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #6c6c70;">Destination City:</span>
          <span>${city}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #6c6c70;">Payment Method:</span>
          <strong style="text-transform: uppercase;">${paymentMethod}</strong>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f7f7f9; text-align: left;">
            <th style="padding: 8px; font-size: 12px; font-weight: 600; color: #6c6c70;">Item</th>
            <th style="padding: 8px; font-size: 12px; font-weight: 600; color: #6c6c70; text-align: center;">Qty</th>
            <th style="padding: 8px; font-size: 12px; font-weight: 600; color: #6c6c70; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="border-top: 1px solid #e5e5ea; padding-top: 12px; font-size: 14px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #6c6c70;">
          <span>Subtotal</span>
          <span>₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #6c6c70;">
          <span>Delivery Fee</span>
          <span>${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 17px; font-weight: 700; border-top: 1px solid #e5e5ea; padding-top: 8px; margin-top: 6px;">
          <span>Total</span>
          <span>₹${grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style="font-size: 12px; color: #8e8e93; border-top: 1px solid #e5e5ea; padding-top: 12px; text-align: center;">
        This is an automated order confirmation from DesiMart.
      </div>
    </div>
  `.trim();

  return { subject, text, html };
}

/**
 * Builds Order Processed Email (Plain text & HTML).
 */
export function buildOrderProcessedEmail({ order, user }) {
  const recipientName = escapeHtml(user?.displayName || 'Customer');
  const orderId = escapeHtml(order.id);
  const city = escapeHtml(order.delivery?.city || 'India');
  const dateStr = escapeHtml(new Date().toLocaleString('en-IN'));

  const subject = `Order Processed - ${order.id}`;

  const text = `
DesiMart — Order Status Update

Hello ${user?.displayName || 'Customer'},

Great news! Your order ${order.id} has been processed and is ready for dispatch to ${order.delivery?.city || 'your city'}.

Total Amount: Rs ${order.total}
Status: Processed

Thank you for shopping with DesiMart!

— DesiMart Team
`.trim();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; color: #111111; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5ea; border-radius: 16px;">
      <div style="border-bottom: 2px solid #2e9e4f; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 700; margin: 0; color: #111111;">DesiMart</h1>
        <p style="font-size: 13px; color: #2e9e4f; margin: 4px 0 0 0; font-weight: 600;">Status Update: Order Processed</p>
      </div>

      <p style="font-size: 15px; line-height: 1.5; margin-bottom: 16px;">
        Hello <strong>${recipientName}</strong>,
      </p>
      <p style="font-size: 14px; color: #3a3a3c; line-height: 1.5; margin-bottom: 20px;">
        Great news! Your order <strong>${orderId}</strong> has been processed and prepared for dispatch to <strong>${city}</strong>.
      </p>

      <div style="background-color: #f7f7f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #6c6c70;">Order ID:</span>
          <strong>${orderId}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #6c6c70;">Processed Time:</span>
          <span>${dateStr}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #6c6c70;">Status:</span>
          <strong style="color: #2e9e4f;">PROCESSED</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #6c6c70;">Total Amount:</span>
          <strong>₹${order.total.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      <div style="font-size: 12px; color: #8e8e93; border-top: 1px solid #e5e5ea; padding-top: 12px; text-align: center;">
        Thank you for shopping with DesiMart!
      </div>
    </div>
  `.trim();

  return { subject, text, html };
}
