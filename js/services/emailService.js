/**
 * Simulated Email Service (Front-end Only).
 * Simulates email delivery by waiting ~800ms and saving the email into sentEmails array in memory.
 * HARD RULE: Zero network requests, zero third-party APIs.
 */

const sentEmails = [];

/**
 * Sends a simulated email notification.
 * @param {{ to: string, toName: string, subject: string, text: string, html: string }} params
 * @returns {Promise<{ status: "sent" | "failed", reason?: string }>}
 */
export function sendEmail({ to, toName, subject, text, html }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!to || typeof to !== 'string' || !to.includes('@')) {
        resolve({ status: 'failed', reason: 'Invalid email address' });
        return;
      }

      const emailRecord = {
        id: 'EML-' + Math.floor(100000 + Math.random() * 900000),
        to,
        toName: toName || 'Customer',
        subject: subject || 'DesiMart Notification',
        text: text || '',
        html: html || '',
        createdAt: new Date().toISOString(),
        status: 'SENT'
      };

      sentEmails.unshift(emailRecord);
      resolve({ status: 'sent' });
    }, 800);
  });
}

/**
 * Gets all sent emails stored in memory (newest first).
 */
export function getSentEmails() {
  return [...sentEmails];
}

/**
 * Resets the in-memory sent emails list on sign out.
 */
export function clearSentEmails() {
  sentEmails.length = 0;
}
