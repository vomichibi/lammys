/**
 * Format a number as currency (AUD)
 * @param amount - The amount to format
 * @param currency - The currency code (defaults to AUD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert dollars to cents for Stripe
 * @param amount - Amount in dollars
 * @returns Amount in cents
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert cents to dollars
 * @param cents - Amount in cents
 * @returns Amount in dollars
 */
export function toDollars(cents: number): number {
  return cents / 100;
}

/**
 * Calculate total amount from items array
 * @param items - Array of items with price and quantity
 * @returns Total amount
 */
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Apply discount to amount
 * @param amount - Original amount
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discounted amount
 */
export function applyDiscount(amount: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }
  return amount * (1 - discountPercent / 100);
}

/**
 * Calculate GST amount (10%)
 * @param amount - Amount including GST
 * @returns GST amount
 */
export function calculateGST(amount: number): number {
  return amount / 11; // GST is 1/11 of the total amount (including GST)
}

/**
 * Format a price range
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Formatted price range string
 */
export function formatPriceRange(min: number, max: number): string {
  if (min === max) {
    return formatCurrency(min);
  }
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}
