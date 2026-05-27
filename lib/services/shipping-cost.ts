/**
 * Shipping Cost Service
 * 
 * Provides shipping cost calculation based on Indonesian provinces.
 * Supports all 38 Indonesian provinces with predefined shipping rates.
 * 
 * @module lib/services/shipping-cost
 */

/**
 * Shipping rates for all 38 Indonesian provinces (in IDR).
 * Rates range from 0 to 500,000 IDR based on distance and logistics complexity.
 */
export const SHIPPING_RATES: Record<string, number> = {
  // Sumatera Region
  'Aceh': 25000,
  'Sumatera Utara': 25000,
  'Sumatera Barat': 12000,
  'Riau': 20000,
  'Jambi': 22000,
  'Sumatera Selatan': 25000,
  'Bengkulu': 25000,
  'Lampung': 28000,
  'Kepulauan Riau': 28000,
  'Kepulauan Bangka Belitung': 25000,

  // Java Region
  'DKI Jakarta': 35000,
  'Jawa Barat': 35000,
  'Jawa Tengah': 38000,
  'DI Yogyakarta': 38000,
  'Jawa Timur': 40000,
  'Banten': 35000,

  // Bali & Nusa Tenggara Region
  'Bali': 42000,
  'Nusa Tenggara Barat': 50000,
  'Nusa Tenggara Timur': 55000,

  // Kalimantan Region
  'Kalimantan Barat': 55000,
  'Kalimantan Tengah': 55000,
  'Kalimantan Selatan': 55000,
  'Kalimantan Timur': 60000,
  'Kalimantan Utara': 65000,

  // Sulawesi Region
  'Sulawesi Utara': 60000,
  'Sulawesi Tengah': 60000,
  'Sulawesi Selatan': 55000,
  'Sulawesi Tenggara': 60000,
  'Gorontalo': 65000,
  'Sulawesi Barat': 60000,

  // Maluku Region
  'Maluku': 75000,
  'Maluku Utara': 75000,

  // Papua Region
  'Papua': 90000,
  'Papua Barat': 90000,
  'Papua Selatan': 90000,
  'Papua Tengah': 90000,
  'Papua Pegunungan': 90000,
  'Papua Barat Daya': 90000,
};

/**
 * List of all 38 Indonesian provinces in alphabetical order.
 */
export const INDONESIAN_PROVINCES = Object.keys(SHIPPING_RATES).sort();

/**
 * Result of shipping cost calculation.
 */
export interface ShippingCostResult {
  /** Whether the calculation was successful */
  success: boolean;
  /** Calculated shipping cost in IDR (if successful) */
  cost?: number;
  /** Province name (if successful) */
  province?: string;
  /** Error message (if failed) */
  error?: string;
}

/**
 * Calculate shipping cost for a given province.
 * 
 * @param {string | null | undefined} province - The destination province name
 * @returns {ShippingCostResult} Calculation result with cost or error
 * 
 * @example
 * ```typescript
 * const result = calculateShippingCost('Jawa Barat');
 * if (result.success) {
 *   console.log(`Shipping cost: ${result.cost} IDR`);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Handle missing province
 * const result = calculateShippingCost(null);
 * // result.success === false
 * // result.error === 'Province is required for shipping cost calculation'
 * ```
 */
export function calculateShippingCost(
  province: string | null | undefined
): ShippingCostResult {
  // Validate province input
  if (!province || province.trim() === '') {
    return {
      success: false,
      error: 'Province is required for shipping cost calculation',
    };
  }

  const trimmedProvince = province.trim();

  // Check if province exists in shipping rates
  if (!(trimmedProvince in SHIPPING_RATES)) {
    return {
      success: false,
      error: `Shipping rate not available for province: ${trimmedProvince}`,
    };
  }

  const cost = SHIPPING_RATES[trimmedProvince];

  return {
    success: true,
    cost,
    province: trimmedProvince,
  };
}

/**
 * Get shipping cost for a province, returning 0 if province is invalid.
 * This is a convenience function for cases where you want a default value.
 * 
 * @param {string | null | undefined} province - The destination province name
 * @returns {number} Shipping cost in IDR, or 0 if province is invalid
 * 
 * @example
 * ```typescript
 * const cost = getShippingCost('Bali'); // Returns 42000
 * const invalidCost = getShippingCost('Invalid'); // Returns 0
 * ```
 */
export function getShippingCost(province: string | null | undefined): number {
  const result = calculateShippingCost(province);
  return result.success ? result.cost! : 0;
}

/**
 * Validate if a province name is valid for shipping.
 * 
 * @param {string | null | undefined} province - The province name to validate
 * @returns {boolean} True if province is valid, false otherwise
 * 
 * @example
 * ```typescript
 * isValidProvince('Jawa Barat'); // true
 * isValidProvince('Invalid Province'); // false
 * isValidProvince(null); // false
 * ```
 */
export function isValidProvince(province: string | null | undefined): boolean {
  if (!province || province.trim() === '') {
    return false;
  }
  return province.trim() in SHIPPING_RATES;
}

/**
 * Get all available provinces for shipping.
 * 
 * @returns {string[]} Array of all 38 Indonesian provinces in alphabetical order
 * 
 * @example
 * ```typescript
 * const provinces = getAvailableProvinces();
 * // ['Aceh', 'Bali', 'Banten', ...]
 * ```
 */
export function getAvailableProvinces(): string[] {
  return INDONESIAN_PROVINCES;
}

/**
 * Get shipping cost range information.
 * 
 * @returns {{ min: number; max: number; average: number }} Shipping cost statistics
 * 
 * @example
 * ```typescript
 * const range = getShippingCostRange();
 * // { min: 12000, max: 90000, average: 48947 }
 * ```
 */
export function getShippingCostRange(): {
  min: number;
  max: number;
  average: number;
} {
  const costs = Object.values(SHIPPING_RATES);
  const min = Math.min(...costs);
  const max = Math.max(...costs);
  const average = Math.round(costs.reduce((a, b) => a + b, 0) / costs.length);

  return { min, max, average };
}
