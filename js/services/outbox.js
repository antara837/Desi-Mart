import { Queue } from '../ds/Queue.js';
import { sendEmail } from './emailService.js';
import { buildOrderConfirmationEmail, buildOrderProcessedEmail } from './emailTemplates.js';
import { isValidEmailFormat } from './auth.js';

export const emailOutbox = new Queue();
let isFlushing = false;
let onUpdateCallback = null;
let onToastCallback = null;
let lastOutboxOp = 'Outbox ready';

export function setOutboxCallbacks({ onUpdate, onToast }) {
  onUpdateCallback = onUpdate;
  onToastCallback = onToast;
}

export function getLastOutboxOp() {
  return lastOutboxOp;
}

export function resetOutbox() {
  emailOutbox.clear();
  isFlushing = false;
  lastOutboxOp = 'Outbox cleared';
}

/**
 * Enqueues an email notification job into the emailOutbox Queue.
 */
export function queueEmailNotification(type, order, userSession) {
  if (!userSession || !userSession.email || !isValidEmailFormat(userSession.email)) {
    if (onToastCallback) onToastCallback("No valid email address, email not sent");
    return false;
  }

  let template = null;
  if (type === 'order-confirmation') {
    template = buildOrderConfirmationEmail({ order, user: userSession });
  } else if (type === 'order-processed') {
    template = buildOrderProcessedEmail({ order, user: userSession });
  }

  if (!template) return false;

  const job = {
    id: 'JOB-' + Math.floor(1000 + Math.random() * 9000),
    type,
    orderId: order.id,
    to: userSession.email,
    toName: userSession.displayName,
    subject: template.subject,
    text: template.text,
    html: template.html,
    createdAt: new Date().toLocaleTimeString(),
    status: 'QUEUED'
  };

  emailOutbox.enqueue(job);
  lastOutboxOp = `enqueue(EMAIL ${type}), O(1)`;

  if (onToastCallback) onToastCallback(`Email notification queued`);
  if (onUpdateCallback) onUpdateCallback();

  flushOutbox();
  return true;
}

/**
 * Flushes jobs from the emailOutbox Queue one at a time (FIFO).
 */
export function flushOutbox() {
  if (isFlushing || emailOutbox.isEmpty()) return;
  isFlushing = true;

  const job = emailOutbox.dequeue();
  lastOutboxOp = `dequeue(EMAIL) -> sending, O(1)`;
  if (onUpdateCallback) onUpdateCallback();

  sendEmail({
    to: job.to,
    toName: job.toName,
    subject: job.subject,
    text: job.text,
    html: job.html
  }).then((res) => {
    lastOutboxOp = `dequeue(EMAIL) -> ${res.status}, O(1)`;
    if (onToastCallback) {
      if (res.status === 'sent') {
        onToastCallback(`Email sent to ${job.to}`);
      } else {
        onToastCallback(`Failed to send email to ${job.to}`);
      }
    }

    if (onUpdateCallback) onUpdateCallback();

    setTimeout(() => {
      isFlushing = false;
      if (!emailOutbox.isEmpty()) {
        flushOutbox();
      }
    }, 800);
  });
}
