/**
 * Motion System — Manages animations on/off state and respects reduced-motion accessibility.
 */
const KEY = "desimart-motion";

export const motionOn = () => document.documentElement.dataset.motion === "on";

export function initMotion(toggleEl) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const initial = localStorage.getItem(KEY) ?? (reduced ? "off" : "on");

  document.documentElement.dataset.motion = initial;
  if (toggleEl) {
    toggleEl.checked = initial === "on";
    toggleEl.addEventListener("change", () => {
      const value = toggleEl.checked ? "on" : "off";
      document.documentElement.dataset.motion = value;
      localStorage.setItem(KEY, value);
    });
  }
}
