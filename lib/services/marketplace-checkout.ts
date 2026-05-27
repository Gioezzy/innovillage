/**
 * Marketplace Checkout Service
 * 
 * Provides validation and processing functions for marketplace checkout flow.
 * Validates customer information, delivery details, and product marketplace availability.
 * 
 * @module lib/services/marketplace-checkout
 */

import type { MarketplacePlatform } from '../validators/marketplace-url';

export interface MarketplaceCheckoutInput {
  /** Cart items to checkout */
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    shopeeUrl?: string | null;
    tokopediaUrl?: string | null;
  }>;
  /** Selected marketplace platform */
  marketplace: MarketplacePlatform;
  /** Customer contact and delivery information */
  customerInfo: {
    phone: string;
    address?: string;
    province?: string;
  };
  /** Delivery method selection */
  deliveryMethod: 'in_store' | 'delivery';
  /** Calculated shipping cost (for delivery orders) */
  shippingCost?: number;
  /** Optional customer notes */
  note?: string;
}

export interface MarketplaceCheckoutResult {
  /** Whether checkout validation passed */
  success: boolean;
  /** Created order ID if successful */
  orderId?: string;
  /** Array of marketplace URLs to redirect to */
  redirectUrls?: string[];
  /** Error message if validation failed */
  error?: string;
  /** Detailed validation errors */
  validationErrors?: string[];
}

/**
 * Validate marketplace checkout input before order creation.
 * 
 * Performs comprehensive validation including:
 * - Phone number format (E.164 with 10-15 digits)
 * - Delivery address requirements
 * - Province selection for delivery orders
 * - Note length constraints
 * - Product marketplace URL availability
 * 
 * @param {MarketplaceCheckoutInput} input - Checkout data to validate
 * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
 * 
 * @example
 * ```typescript
 * const validation = await validateMarketplaceCheckout({
 *   items: cartItems,
 *   marketplace: 'shopee',
 *   customerInfo: { phone: '+628123456789', address: '...' },
 *   deliveryMethod: 'delivery'
 * });
 * 
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export async function validateMarketplaceCheckout(
  input: MarketplaceCheckoutInput
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  // Validate phone number (E.164 format, 10-15 digits)
  // E.164 format: +[country code][number] (e.g., +628123456789)
  // Remove spaces and check format
  const cleanPhone = input.customerInfo.phone.replace(/\s/g, '');
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    errors.push(
      'Nomor telepon harus dalam format E.164 dengan 10-15 digit (contoh: +628123456789 atau 08123456789)'
    );
  }
  
  // Validate delivery method requirements
  if (input.deliveryMethod === 'delivery') {
    // Validate shipping address
    if (!input.customerInfo.address || input.customerInfo.address.trim() === '') {
      errors.push('Alamat pengiriman wajib diisi untuk metode delivery');
    } else if (input.customerInfo.address.length > 500) {
      errors.push('Alamat pengiriman maksimal 500 karakter');
    }
    
    // Validate province selection
    if (!input.customerInfo.province || input.customerInfo.province.trim() === '') {
      errors.push('Provinsi wajib dipilih untuk metode delivery');
    }
    
    // Validate shipping cost is provided
    if (input.shippingCost === undefined || input.shippingCost === null) {
      errors.push('Biaya pengiriman belum dihitung');
    } else if (input.shippingCost < 0) {
      errors.push('Biaya pengiriman tidak valid');
    }
  }
  
  // Validate note length
  if (input.note && input.note.length > 1000) {
    errors.push('Catatan maksimal 1000 karakter');
  }
  
  // Validate all products have marketplace URLs for selected platform
  const missingUrls = input.items.filter(item => {
    if (input.marketplace === 'shopee') {
      return !item.shopeeUrl || item.shopeeUrl.trim() === '';
    } else if (input.marketplace === 'tokopedia') {
      return !item.tokopediaUrl || item.tokopediaUrl.trim() === '';
    }
    return false;
  });
  
  if (missingUrls.length > 0) {
    const productNames = missingUrls.map(i => i.productName).join(', ');
    const platformName = input.marketplace === 'shopee' ? 'Shopee' : 'Tokopedia';
    errors.push(
      `Produk berikut tidak memiliki URL ${platformName}: ${productNames}`
    );
  }
  
  // Validate items array is not empty
  if (input.items.length === 0) {
    errors.push('Keranjang belanja kosong');
  }
  
  // Validate item quantities and prices
  input.items.forEach((item, index) => {
    if (item.quantity <= 0) {
      errors.push(`Produk "${item.productName}" memiliki jumlah tidak valid`);
    }
    if (item.unitPrice < 0) {
      errors.push(`Produk "${item.productName}" memiliki harga tidak valid`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extract marketplace redirect URLs from cart items.
 * 
 * @param {MarketplaceCheckoutInput} input - Checkout data
 * @returns {string[]} Array of marketplace URLs to open
 * 
 * @example
 * ```typescript
 * const urls = getMarketplaceRedirectUrls({
 *   items: cartItems,
 *   marketplace: 'shopee',
 *   // ... other fields
 * });
 * // Returns: ['https://shopee.co.id/product1', 'https://shopee.co.id/product2']
 * ```
 */
export function getMarketplaceRedirectUrls(input: MarketplaceCheckoutInput): string[] {
  const urls: string[] = [];
  
  input.items.forEach(item => {
    let url: string | null | undefined;
    
    if (input.marketplace === 'shopee') {
      url = item.shopeeUrl;
    } else if (input.marketplace === 'tokopedia') {
      url = item.tokopediaUrl;
    }
    
    if (url && url.trim() !== '') {
      urls.push(url.trim());
    }
  });
  
  // Remove duplicates (in case same product appears multiple times)
  return Array.from(new Set(urls));
}

/**
 * Calculate total amount for marketplace checkout.
 * 
 * @param {MarketplaceCheckoutInput} input - Checkout data
 * @returns {number} Total amount in IDR
 * 
 * @example
 * ```typescript
 * const total = calculateCheckoutTotal({
 *   items: [{ quantity: 2, unitPrice: 100000 }],
 *   shippingCost: 15000,
 *   // ... other fields
 * });
 * // Returns: 215000
 * ```
 */
export function calculateCheckoutTotal(input: MarketplaceCheckoutInput): number {
  const itemsTotal = input.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  const shippingCost = input.shippingCost || 0;
  
  return itemsTotal + shippingCost;
}

/**
 * Validate that all items in checkout belong to the same store.
 * 
 * @param {Array} items - Cart items with store information
 * @returns {{valid: boolean; storeIds: string[]}} Validation result
 * 
 * @example
 * ```typescript
 * const result = validateSingleStore(cartItems);
 * if (!result.valid) {
 *   console.log('Multiple stores detected:', result.storeIds);
 * }
 * ```
 */
export function validateSingleStore(
  items: Array<{ storeId?: string; productName: string }>
): { valid: boolean; storeIds: string[] } {
  const storeIds = new Set<string>();
  
  items.forEach(item => {
    if (item.storeId) {
      storeIds.add(item.storeId);
    }
  });
  
  return {
    valid: storeIds.size <= 1,
    storeIds: Array.from(storeIds),
  };
}

/**
 * Format phone number to E.164 format for storage.
 * 
 * Handles common Indonesian phone number formats:
 * - 08xxx -> +628xxx
 * - 628xxx -> +628xxx
 * - +628xxx -> +628xxx (already formatted)
 * 
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 * 
 * @example
 * ```typescript
 * formatPhoneNumber('08123456789');  // Returns: '+628123456789'
 * formatPhoneNumber('628123456789'); // Returns: '+628123456789'
 * formatPhoneNumber('+628123456789'); // Returns: '+628123456789'
 * ```
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  
  // Already in E.164 format
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Indonesian number starting with 0
  if (cleaned.startsWith('0')) {
    return '+62' + cleaned.substring(1);
  }
  
  // Indonesian number starting with 62
  if (cleaned.startsWith('62')) {
    return '+' + cleaned;
  }
  
  // Default: assume it needs +62 prefix
  return '+62' + cleaned;
}

/**
 * Get Indonesian provinces list for province selection.
 * 
 * @returns {string[]} Array of 38 Indonesian provinces
 */
export function getIndonesianProvinces(): string[] {
  return [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Kepulauan Riau',
    'Jambi',
    'Sumatera Selatan',
    'Kepulauan Bangka Belitung',
    'Bengkulu',
    'Lampung',
    'DKI Jakarta',
    'Jawa Barat',
    'Banten',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Gorontalo',
    'Sulawesi Tengah',
    'Sulawesi Barat',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Maluku',
    'Maluku Utara',
    'Papua',
    'Papua Barat',
    'Papua Tengah',
    'Papua Pegunungan',
    'Papua Selatan',
    'Papua Barat Daya',
  ];
}
