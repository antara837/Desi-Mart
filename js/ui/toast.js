import { motionOn } from './motion.js';

let toastTimeout = null;

export function showToast(message) {
  let toastEl = document.getElementById("toastNotification");
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.id = "toastNotification";
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    document.body.appendChild(toastEl);
  }

  toastEl.textContent = message;
  toastEl.classList.add("is-visible");

  if (toastTimeout) clearTimeout(toastTimeout);

  const duration = motionOn() ? 2500 : 2000;
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, duration);
}
