import { describe, test, expect } from 'vitest';
import { formatPrice } from '../utils/formatters';

describe('Price Formatter Utility (formatPrice)', () => {
  test('formats prices in Lakh correctly', () => {
    expect(formatPrice(1350000)).toBe('₹13.50 Lakh');
    expect(formatPrice(649000)).toBe('₹6.49 Lakh');
    expect(formatPrice(2200000)).toBe('₹22.00 Lakh');
  });

  test('formats prices in Crore correctly', () => {
    expect(formatPrice(12500000)).toBe('₹1.25 Crore');
  });

  test('formats standard numbers below 1 Lakh correctly', () => {
    expect(formatPrice(85000)).toBe('₹85,000');
  });

  test('handles invalid or zero inputs gracefully', () => {
    expect(formatPrice(0)).toBe('₹0');
    expect(formatPrice(null)).toBe('₹0');
    expect(formatPrice(undefined)).toBe('₹0');
  });
});
