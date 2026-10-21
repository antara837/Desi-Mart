import { getIcon } from './icons.js';
import { getProductPastel } from './pastels.js';

/**
 * Render unified product image HTML helper for DesiMart.
 * 
 * Rules:
 * - Shows photo in image slot with loading="lazy", width and height attributes.
 * - Fallback: if no image or image load fails (onerror), keeps flat tinted tile with line icon.
 * - While loading, shows tinted tile underneath, fading in over 250ms when loaded (respects motionOn()).
 * - Plain words alt text (no emoji, escaped for safety).
 */
export function renderProductMedia(product, options = {}) {
  if (!product) return '';

  const {
    width = 800,
    height = 600,
    imgClass = 'product-card__img',
    tileClass = 'product-card__tile',
    style = '',
    loading = 'lazy'
  } = options;

  const theme = getProductPastel(product);
  const tint = theme.pastel || product.tint || 'var(--tint-groceries)';
  const iconSvg = getIcon(product.icon || 'wheat');
  const altText = (product.name || 'Product').replace(/"/g, '&quot;');

  if (!product.image) {
    return `
      <div class="${tileClass}" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: ${tint}; ${style}">
        ${iconSvg}
      </div>
    `;
  }

  return `
    <div class="${tileClass}" style="position: absolute; inset: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: ${tint}; z-index: 1;">
      ${iconSvg}
    </div>
    <img
      src="${product.image}"
      alt="${altText}"
      width="${width}"
      height="${height}"
      loading="${loading}"
      class="${imgClass}"
      style="position: relative; z-index: 2; width: 100%; height: 100%; object-fit: contain; object-position: center; opacity: 0; transition: opacity 250ms ease-in-out; ${style}"
      onload="if(document.documentElement.dataset.motion==='off'){this.style.opacity='1';this.style.transition='none';}else{this.style.opacity='1';}"
      onerror="this.style.display='none';"
    />
  `;
}
