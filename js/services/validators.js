/**
 * Hand-written Validation & Calculation Helper Functions.
 * No external libraries or regex dependencies for core algorithm checks.
 */

// Time Complexity: O(1)
// Validates 10-digit Indian mobile number starting with 6, 7, 8, or 9.
export function validateMobile(mobile) {
  if (!mobile) return false;
  const cleaned = mobile.trim();
  if (cleaned.length !== 10) return false;
  const firstDigit = cleaned.charAt(0);
  if (firstDigit < '6' || firstDigit > '9') return false;
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned.charAt(i) < '0' || cleaned.charAt(i) > '9') return false;
  }
  return true;
}

// Time Complexity: O(1)
// Validates 6-digit Indian PIN code.
export function validatePinCode(pin) {
  if (!pin) return false;
  const cleaned = pin.trim();
  if (cleaned.length !== 6) return false;
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned.charAt(i) < '0' || cleaned.charAt(i) > '9') return false;
  }
  return true;
}

// Time Complexity: O(n)
// Validates UPI ID format (e.g. name@bank).
export function validateUpi(upiId) {
  if (!upiId) return false;
  const cleaned = upiId.trim();
  const parts = cleaned.split('@');
  if (parts.length !== 2) return false;
  const [handle, bank] = parts;
  if (!handle || handle.length < 2 || !bank || bank.length < 2) return false;
  return true;
}

// Time Complexity: O(n)
// Hand-written Luhn Algorithm for credit/debit card validation.
export function luhnCheck(cardNumber) {
  if (!cardNumber) return false;
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Time Complexity: O(1)
// Detects card brand from prefix (Visa, Mastercard, RuPay, or generic Card).
export function detectCardBrand(cardNumber) {
  if (!cardNumber) return 'Card';
  const digits = cardNumber.replace(/\D/g, '');
  if (!digits) return 'Card';

  if (digits.startsWith('4')) {
    return 'Visa';
  }

  const prefix2 = parseInt(digits.substring(0, 2), 10);
  const prefix4 = parseInt(digits.substring(0, 4), 10);

  if ((prefix2 >= 51 && prefix2 <= 55) || (prefix4 >= 2221 && prefix4 <= 2720)) {
    return 'Mastercard';
  }

  if (
    prefix2 === 60 ||
    prefix2 === 65 ||
    (prefix2 >= 81 && prefix2 <= 89) ||
    prefix4 === 353 ||
    prefix4 === 356
  ) {
    return 'RuPay';
  }

  return 'Card';
}

// Time Complexity: O(1)
// Validates expiry date (MM/YY format, must be current month/year or later).
export function validateCardExpiry(expiryStr) {
  if (!expiryStr) return false;
  const parts = expiryStr.split('/');
  if (parts.length !== 2) return false;

  const month = parseInt(parts[0].trim(), 10);
  let year = parseInt(parts[1].trim(), 10);

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

  if (year < 100) {
    year += 2000; // Convert YY to YYYY
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

// Time Complexity: O(1)
// Validates 3-digit CVV number.
export function validateCvv(cvv) {
  if (!cvv) return false;
  const cleaned = cvv.trim();
  if (cleaned.length !== 3) return false;
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned.charAt(i) < '0' || cleaned.charAt(i) > '9') return false;
  }
  return true;
}

// Time Complexity: O(1)
// Calculates price breakdown: Subtotal, Delivery Fee (Free above Rs 499), GST (5%), Grand Total.
export function calculatePriceBreakdown(subtotal) {
  const deliveryFee = subtotal >= 999 ? 0 : 40;
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + gst;

  return {
    subtotal,
    deliveryFee,
    gst,
    grandTotal
  };
}
