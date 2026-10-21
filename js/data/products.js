/**
 * Product Catalog Data — 12 Authentic Indian Products across 5 categories.
 * Images: Fallback to flat category tinted tiles + Lucide line SVG icons.
 * Discounts: All badge % values are Math.round((1 - price/originalPrice)*100).
 */
export const PRODUCTS = [
  {
    id: 1,
    name: "Masala Chai",
    category: "Beverages",
    price: 249,
    originalPrice: 299,
    rating: 4.8,
    reviews: 142,
    stock: 25,
    badge: "Bestseller",
    featured: true,
    newest: false,
    variants: [
      { name: "250 g", price: 249 },
      { name: "500 g", price: 449 },
      { name: "1 kg", price: 849 }
    ],
    desc: "Fresh Assam tea blended with cardamom, ginger, cloves, and cinnamon.",
    tint: "var(--tint-beverages)",
    icon: "coffee",
    image: "assets/products/masala-chai.jpg",
    keywords: ["tea", "chai", "masala", "beverage", "assam", "spiced"]
  },
  {
    id: 2,
    name: "Basmati Rice",
    category: "Groceries",
    price: 165,
    originalPrice: 195,
    rating: 4.7,
    reviews: 98,
    stock: 40,
    badge: "Organic",
    featured: true,
    newest: false,
    variants: [
      { name: "1 kg", price: 165 },
      { name: "5 kg", price: 799 },
      { name: "10 kg", price: 1499 }
    ],
    desc: "Long-grain aromatic basmati rice for daily meals and biryani.",
    tint: "var(--tint-groceries)",
    icon: "wheat",
    image: "assets/products/basmati-rice.jpg",
    keywords: ["rice", "basmati", "grain", "grocery", "food", "biryani"]
  },
  {
    id: 3,
    name: "Desi Ghee",
    category: "Groceries",
    price: 599,
    originalPrice: 699,
    rating: 4.9,
    reviews: 215,
    stock: 18,
    badge: "14% OFF",
    featured: true,
    newest: false,
    variants: [
      { name: "250 ml", price: 349 },
      { name: "500 ml", price: 599 },
      { name: "1 L", price: 1099 }
    ],
    desc: "Pure golden cow ghee churned using traditional methods.",
    tint: "var(--tint-groceries)",
    icon: "wheat",
    image: "assets/products/desi-ghee.jpg",
    keywords: ["ghee", "cow ghee", "desi ghee", "butter", "clarified"]
  },
  {
    id: 4,
    name: "Bhujia Sev",
    category: "Snacks",
    price: 120,
    originalPrice: 140,
    rating: 4.6,
    reviews: 76,
    stock: 3,
    badge: "Bestseller",
    featured: false,
    newest: false,
    variants: [
      { name: "200 g", price: 120 },
      { name: "400 g", price: 220 },
      { name: "1 kg", price: 499 }
    ],
    desc: "Crispy and spicy namkeen snack seasoned with authentic spices.",
    tint: "var(--tint-snacks)",
    icon: "cookie",
    image: "assets/products/bhujia-sev.jpg",
    keywords: ["bhujia", "sev", "snack", "namkeen", "crispy", "rajasthani"]
  },
  {
    id: 5,
    name: "Darjeeling Tea",
    category: "Beverages",
    price: 450,
    originalPrice: 520,
    rating: 4.9,
    reviews: 64,
    stock: 12,
    badge: "New",
    featured: false,
    newest: true,
    variants: [
      { name: "100 g", price: 450 },
      { name: "250 g", price: 999 },
      { name: "500 g", price: 1899 }
    ],
    desc: "Fresh Darjeeling tea leaves with a rich floral aroma.",
    tint: "var(--tint-beverages)",
    icon: "coffee",
    image: "assets/products/darjeeling-tea.jpg",
    keywords: ["tea", "darjeeling", "green tea", "black tea", "beverage"]
  },
  {
    id: 6,
    name: "Khadi Kurta",
    category: "Clothing",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 112,
    stock: 15,
    badge: "25% OFF",
    featured: true,
    newest: false,
    variants: [
      { name: "M", price: 899 },
      { name: "L", price: 899 },
      { name: "XL", price: 949 },
      { name: "XXL", price: 999 }
    ],
    desc: "Comfortable and breathable white cotton khadi kurta.",
    tint: "var(--tint-clothing)",
    icon: "shirt",
    image: "assets/products/khadi-kurta.jpg",
    keywords: ["kurta", "khadi", "cotton", "clothing", "ethnic", "fashion", "clothes"]
  },
  {
    id: 7,
    name: "Brass Diya Set",
    category: "Home & Festive",
    price: 349,
    originalPrice: 420,
    rating: 4.8,
    reviews: 89,
    stock: 22,
    badge: "Festive",
    featured: true,
    newest: false,
    variants: [
      { name: "Set of 2", price: 349 },
      { name: "Set of 4", price: 649 },
      { name: "Set of 8", price: 1199 }
    ],
    desc: "Solid brass oil lamps for pooja and festive decoration.",
    tint: "var(--tint-home)",
    icon: "lamp",
    image: "assets/products/brass-diya-set.jpg",
    keywords: ["diya", "brass", "lamp", "festive", "diwali", "pooja", "home"]
  },
  {
    id: 8,
    name: "Turmeric Powder",
    category: "Groceries",
    price: 145,
    originalPrice: 175,
    rating: 4.9,
    reviews: 180,
    stock: 35,
    badge: "Organic",
    featured: false,
    newest: false,
    variants: [
      { name: "250 g", price: 145 },
      { name: "500 g", price: 270 },
      { name: "1 kg", price: 499 }
    ],
    desc: "Pure yellow turmeric powder for cooking and health benefits.",
    tint: "var(--tint-groceries)",
    icon: "wheat",
    image: "assets/products/turmeric-powder.jpg",
    keywords: ["turmeric", "haldi", "spice", "organic", "grocery"]
  },
  {
    id: 9,
    name: "Kashmiri Saffron",
    category: "Groceries",
    price: 495,
    originalPrice: 599,
    rating: 5.0,
    reviews: 134,
    stock: 0,
    badge: "Premium",
    featured: false,
    newest: false,
    variants: [
      { name: "1 g", price: 495 },
      { name: "2 g", price: 950 },
      { name: "5 g", price: 2299 }
    ],
    desc: "Pure Kashmiri red saffron threads for sweets and milk.",
    tint: "var(--tint-groceries)",
    icon: "wheat",
    image: "assets/products/kashmiri-saffron.jpg",
    keywords: ["saffron", "kesar", "kashmiri", "spice", "grocery"]
  },
  {
    id: 10,
    name: "Roasted Makhana",
    category: "Snacks",
    price: 199,
    originalPrice: 240,
    rating: 4.7,
    reviews: 92,
    stock: 28,
    badge: "Bestseller",
    featured: true,
    newest: false,
    variants: [
      { name: "150 g", price: 199 },
      { name: "300 g", price: 379 },
      { name: "500 g", price: 599 }
    ],
    desc: "Crunchy lotus seeds lightly roasted with rock salt.",
    tint: "var(--tint-snacks)",
    icon: "cookie",
    image: "assets/products/roasted-makhana.jpg",
    keywords: ["makhana", "fox nuts", "snack", "roasted", "lotus seeds", "healthy"]
  },
  {
    id: 11,
    name: "Cotton Dupatta",
    category: "Clothing",
    price: 549,
    originalPrice: 699,
    rating: 4.8,
    reviews: 58,
    stock: 14,
    badge: "21% OFF",
    featured: false,
    newest: true,
    variants: [
      { name: "Single", price: 549 },
      { name: "Pack of 2", price: 999 }
    ],
    desc: "Soft printed cotton dupatta for daily ethnic wear.",
    tint: "var(--tint-clothing)",
    icon: "shirt",
    image: "assets/products/cotton-dupatta.jpg",
    keywords: ["dupatta", "scarf", "cotton", "block print", "clothing", "ethnic", "clothes"]
  },
  {
    id: 12,
    name: "Aroma Diffuser",
    category: "Home & Festive",
    price: 399,
    originalPrice: 480,
    rating: 4.6,
    reviews: 45,
    stock: 9,
    badge: "Handmade",
    featured: false,
    newest: true,
    variants: [
      { name: "Standard", price: 399 },
      { name: "Gift Pack", price: 699 }
    ],
    desc: "Handcrafted clay diffuser for essential oils and fragrance.",
    tint: "var(--tint-home)",
    icon: "lamp",
    image: "assets/products/aroma-diffuser.jpg",
    keywords: ["diffuser", "terracotta", "clay", "aroma", "home", "decor", "handicraft", "festive"]
  }
];

