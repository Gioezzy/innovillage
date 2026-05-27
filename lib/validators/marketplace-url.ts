/**
 * Marketplace URL Validator
 * 
 * Provides validation functions for marketplace URLs (Shopee, Tokopedia, PadiUMKM).
 * Ensures URLs match expected format and length constraints.
 * 
 * @module lib/validators/marketplace-url
 */

export type MarketplacePlatform = 'shopee' | 'tokopedia' | 'padiumkm';

export interface MarketplaceUrlValidation {
  /** Whether the URL is valid */
  isValid: boolean;
  /** The marketplace platform if URL is valid */
  platform?: MarketplacePlatform;
  /** Error message if URL is invalid */
  error?: string;
}

/** Maximum allowed length for marketplace URLs */
const MAX_URL_LENGTH = 2048;

/**
 * Validate a Shopee marketplace URL.
 * 
 * Valid Shopee URLs must:
 * - Start with https://shopee.co.id/
 * - Be 2048 characters or less
 * - Empty/null URLs are considered valid (optional field)
 * 
 * @param {string | null | undefined} url - The URL to validate
 * @returns {MarketplaceUrlValidation} Validation result
 * 
 * @example
 * ```typescript
 * const result = validateShopeeUrl('https://shopee.co.id/product-name');
 * if (result.isValid) {
 *   console.log('Valid Shopee URL');
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateShopeeUrl(url: string | null | undefined): MarketplaceUrlValidation {
  // Empty URLs are valid (optional field)
  if (!url || url.trim() === '') {
    return { isValid: true };
  }
  
  const trimmedUrl = url.trim();
  
  // Check length constraint
  if (trimmedUrl.length > MAX_URL_LENGTH) {
    return {
      isValid: false,
      error: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters`,
    };
  }
  
  // Check format constraint
  if (!trimmedUrl.startsWith('https://shopee.co.id/')) {
    return {
      isValid: false,
      error: 'Shopee URL must start with https://shopee.co.id/',
    };
  }
  
  return {
    isValid: true,
    platform: 'shopee',
  };
}

/**
 * Validate a Tokopedia marketplace URL.
 * 
 * Valid Tokopedia URLs must:
 * - Start with https://www.tokopedia.com/
 * - Be 2048 characters or less
 * - Empty/null URLs are considered valid (optional field)
 * 
 * @param {string | null | undefined} url - The URL to validate
 * @returns {MarketplaceUrlValidation} Validation result
 * 
 * @example
 * ```typescript
 * const result = validateTokopediaUrl('https://www.tokopedia.com/store/product');
 * if (result.isValid) {
 *   console.log('Valid Tokopedia URL');
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateTokopediaUrl(url: string | null | undefined): MarketplaceUrlValidation {
  // Empty URLs are valid (optional field)
  if (!url || url.trim() === '') {
    return { isValid: true };
  }
  
  const trimmedUrl = url.trim();
  
  // Check length constraint
  if (trimmedUrl.length > MAX_URL_LENGTH) {
    return {
      isValid: false,
      error: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters`,
    };
  }
  
  // Check format constraint
  if (!trimmedUrl.startsWith('https://www.tokopedia.com/')) {
    return {
      isValid: false,
      error: 'Tokopedia URL must start with https://www.tokopedia.com/',
    };
  }
  
  return {
    isValid: true,
    platform: 'tokopedia',
  };
}

/**
 * Validate a PadiUMKM marketplace URL.
 * 
 * Valid PadiUMKM URLs must:
 * - Start with https://
 * - Be 2048 characters or less
 * - Empty/null URLs are considered valid (optional field)
 * 
 * Note: PadiUMKM validation is more lenient as the exact URL format may vary.
 * 
 * @param {string | null | undefined} url - The URL to validate
 * @returns {MarketplaceUrlValidation} Validation result
 * 
 * @example
 * ```typescript
 * const result = validatePadiUMKMUrl('https://padiumkm.id/product');
 * if (result.isValid) {
 *   console.log('Valid PadiUMKM URL');
 * }
 * ```
 */
export function validatePadiUMKMUrl(url: string | null | undefined): MarketplaceUrlValidation {
  // Empty URLs are valid (optional field)
  if (!url || url.trim() === '') {
    return { isValid: true };
  }
  
  const trimmedUrl = url.trim();
  
  // Check length constraint
  if (trimmedUrl.length > MAX_URL_LENGTH) {
    return {
      isValid: false,
      error: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters`,
    };
  }
  
  // Check format constraint (must be HTTPS)
  if (!trimmedUrl.startsWith('https://')) {
    return {
      isValid: false,
      error: 'PadiUMKM URL must start with https://',
    };
  }
  
  return {
    isValid: true,
    platform: 'padiumkm',
  };
}

/**
 * Get available marketplaces for a product based on configured URLs.
 * 
 * Only returns marketplaces that have valid, non-empty URLs configured.
 * 
 * @param {Object} product - Product with marketplace URL fields
 * @param {string | null} [product.shopee_url] - Shopee product URL
 * @param {string | null} [product.tokopedia_url] - Tokopedia product URL
 * @param {string | null} [product.padiumkm_url] - PadiUMKM product URL
 * @returns {MarketplacePlatform[]} Array of available marketplace platforms
 * 
 * @example
 * ```typescript
 * const product = {
 *   shopee_url: 'https://shopee.co.id/product',
 *   tokopedia_url: null,
 *   padiumkm_url: null
 * };
 * const marketplaces = getAvailableMarketplaces(product);
 * // Returns: ['shopee']
 * ```
 */
export function getAvailableMarketplaces(product: {
  shopee_url?: string | null;
  tokopedia_url?: string | null;
  padiumkm_url?: string | null;
}): MarketplacePlatform[] {
  const marketplaces: MarketplacePlatform[] = [];
  
  // Check Shopee
  if (product.shopee_url) {
    const validation = validateShopeeUrl(product.shopee_url);
    if (validation.isValid && validation.platform) {
      marketplaces.push('shopee');
    }
  }
  
  // Check Tokopedia
  if (product.tokopedia_url) {
    const validation = validateTokopediaUrl(product.tokopedia_url);
    if (validation.isValid && validation.platform) {
      marketplaces.push('tokopedia');
    }
  }
  
  // Check PadiUMKM
  if (product.padiumkm_url) {
    const validation = validatePadiUMKMUrl(product.padiumkm_url);
    if (validation.isValid && validation.platform) {
      marketplaces.push('padiumkm');
    }
  }
  
  return marketplaces;
}

/**
 * Check if all products in a list have URLs for a specific marketplace.
 * 
 * Useful for validating cart items before marketplace checkout.
 * 
 * @param {Array} products - Array of products to check
 * @param {MarketplacePlatform} platform - The marketplace platform to check
 * @returns {Object} Validation result with list of products missing URLs
 * 
 * @example
 * ```typescript
 * const result = validateProductsForMarketplace(cartItems, 'shopee');
 * if (!result.allValid) {
 *   console.log('Missing URLs:', result.missingProducts);
 * }
 * ```
 */
export function validateProductsForMarketplace(
  products: Array<{
    id: string;
    name: string;
    shopee_url?: string | null;
    tokopedia_url?: string | null;
    padiumkm_url?: string | null;
  }>,
  platform: MarketplacePlatform
): {
  allValid: boolean;
  missingProducts: Array<{ id: string; name: string }>;
} {
  const missingProducts: Array<{ id: string; name: string }> = [];
  
  products.forEach((product) => {
    let hasValidUrl = false;
    
    switch (platform) {
      case 'shopee':
        const shopeeValidation = validateShopeeUrl(product.shopee_url);
        hasValidUrl = shopeeValidation.isValid && !!product.shopee_url;
        break;
      case 'tokopedia':
        const tokopediaValidation = validateTokopediaUrl(product.tokopedia_url);
        hasValidUrl = tokopediaValidation.isValid && !!product.tokopedia_url;
        break;
      case 'padiumkm':
        const padiumkmValidation = validatePadiUMKMUrl(product.padiumkm_url);
        hasValidUrl = padiumkmValidation.isValid && !!product.padiumkm_url;
        break;
    }
    
    if (!hasValidUrl) {
      missingProducts.push({ id: product.id, name: product.name });
    }
  });
  
  return {
    allValid: missingProducts.length === 0,
    missingProducts,
  };
}

/**
 * Get a user-friendly marketplace name for display.
 * 
 * @param {MarketplacePlatform} platform - The marketplace platform
 * @returns {string} Display name
 * 
 * @example
 * ```typescript
 * const name = getMarketplaceName('shopee');
 * // Returns: "Shopee"
 * ```
 */
export function getMarketplaceName(platform: MarketplacePlatform): string {
  switch (platform) {
    case 'shopee':
      return 'Shopee';
    case 'tokopedia':
      return 'Tokopedia';
    case 'padiumkm':
      return 'PadiUMKM';
    default:
      return platform;
  }
}
