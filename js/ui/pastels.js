/**
 * Pastel Palette System for DesiMart Reference Design
 * 
 * 6 Reference pastel theme colors and their darker tone-on-tone counterparts:
 * - Mint:       #C8F5E4  -> #287A5B
 * - Light Green:#BEEDB9  -> #397A35
 * - Blush Pink: #F8CFDB  -> #993B57
 * - Sky Blue:   #C9E6F7  -> #2D5D99
 * - Sand/Tan:   #DDD0B3  -> #6D5931
 * - Cream Peach:#F7E6D0  -> #93582E
 */

export const PASTEL_THEMES = [
  { pastel: '#C8F5E4', dark: '#287A5B', name: 'mint' },
  { pastel: '#BEEDB9', dark: '#397A35', name: 'lightgreen' },
  { pastel: '#F8CFDB', dark: '#993B57', name: 'pink' },
  { pastel: '#C9E6F7', dark: '#2D5D99', name: 'blue' },
  { pastel: '#DDD0B3', dark: '#6D5931', name: 'sand' },
  { pastel: '#F7E6D0', dark: '#93582E', name: 'peach' },
];

export function getProductPastel(product) {
  if (!product) return PASTEL_THEMES[0];
  const id = typeof product.id === 'number' ? product.id : 1;
  const index = Math.abs((id - 1) % PASTEL_THEMES.length);
  return PASTEL_THEMES[index];
}
