/**
 * Formats a numeric INR price into human-readable Lakh / Crore strings.
 * Example:
 *   1350000 -> "₹13.50 Lakh"
 *   649000  -> "₹6.49 Lakh"
 *   12500000 -> "₹1.25 Crore"
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '₹0';
  }

  const numPrice = Number(price);

  if (numPrice >= 10000000) {
    const croreVal = (numPrice / 10000000).toFixed(2);
    return `₹${croreVal} Crore`;
  }

  if (numPrice >= 100000) {
    const lakhVal = (numPrice / 100000).toFixed(2);
    return `₹${lakhVal} Lakh`;
  }

  return `₹${numPrice.toLocaleString('en-IN')}`;
};
