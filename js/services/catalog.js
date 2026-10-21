/**
 * Catalog Service — Hand-written algorithms for searching, filtering, and sorting the catalog array.
 */

// Time Complexity: O(n)
// Linear search to find a product by ID in the products array.
export function findById(products, id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }
  return null;
}

// Time Complexity: O(n)
// Filters products by category using a loop. Returns all if category is 'All'.
export function filterByCategory(products, category) {
  if (!category || category === "All") {
    return products.slice();
  }
  const result = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].category === category) {
      result.push(products[i]);
    }
  }
  return result;
}

// Time Complexity: O(n)
// Enhanced search filtering products matching name, category, description, or keywords.
export function searchByName(products, searchText) {
  if (!searchText) return products.slice();
  const query = searchText.trim().toLowerCase();
  const result = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const matchName = p.name.toLowerCase().includes(query);
    const matchCat = p.category.toLowerCase().includes(query);
    const matchDesc = p.desc.toLowerCase().includes(query);
    const matchKw = p.keywords && p.keywords.some(k => k.toLowerCase().includes(query));

    if (matchName || matchCat || matchDesc || matchKw) {
      result.push(p);
    }
  }
  return result;
}

// Time Complexity: O(n)
// Multi-criteria filter for category, price range, minimum rating, and stock availability.
export function filterProducts(products, filters = {}) {
  const { category, priceRange, minRating, inStockOnly } = filters;
  let result = products.slice();

  if (category && category !== "All") {
    result = filterByCategory(result, category);
  }

  const filtered = [];
  for (let i = 0; i < result.length; i++) {
    const p = result[i];
    let keep = true;

    // Price range filtering
    if (priceRange === "under-200" && p.price >= 200) keep = false;
    if (priceRange === "200-500" && (p.price < 200 || p.price > 500)) keep = false;
    if (priceRange === "above-500" && p.price <= 500) keep = false;

    // Minimum rating filtering
    if (minRating && p.rating < minRating) keep = false;

    // Stock availability filtering
    if (inStockOnly && !p.inStock) keep = false;

    if (keep) {
      filtered.push(p);
    }
  }

  return filtered;
}

// Time Complexity: O(n²)
// Hand-written Bubble Sort to sort products by price or rating.
export function sortProducts(products, sortKey = "featured") {
  const arr = products.slice();
  const n = arr.length;

  if (sortKey === "featured") return arr;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      let shouldSwap = false;

      if (sortKey === "price-asc") {
        shouldSwap = arr[j].price > arr[j + 1].price;
      } else if (sortKey === "price-desc") {
        shouldSwap = arr[j].price < arr[j + 1].price;
      } else if (sortKey === "rating") {
        shouldSwap = arr[j].rating < arr[j + 1].rating; // highest rating first
      } else if (sortKey === "newest") {
        shouldSwap = arr[j].id < arr[j + 1].id; // highest ID first
      }

      if (shouldSwap) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// Backwards compatibility alias for sortByPrice
export function sortByPrice(products, order = "asc") {
  return sortProducts(products, order === "asc" ? "price-asc" : "price-desc");
}

// Time Complexity: O(log n)
// Hand-written Binary Search for searching a product by ID in a sorted array.
export function binarySearchById(sortedProducts, targetId) {
  let low = 0;
  let high = sortedProducts.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedProducts[mid].id === targetId) {
      return sortedProducts[mid];
    } else if (sortedProducts[mid].id < targetId) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return null;
}
