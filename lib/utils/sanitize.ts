/**
 * Input Sanitization Utilities
 * 
 * Provides functions to sanitize user input to prevent XSS attacks and ensure data integrity.
 * Used for marketplace URLs, customer notes, addresses, and other user-generated content.
 * 
 * @module lib/utils/sanitize
 */

/**
 * Sanitize a string by trimming whitespace and escaping HTML special characters.
 * Prevents XSS attacks by converting HTML entities to their safe equivalents.
 * 
 * @param {string | null | undefined} input - The string to sanitize
 * @returns {string} Sanitized string, or empty string if input is null/undefined
 * 
 * @example
 * ```typescript
 * sanitizeString('<script>alert("xss")</script>') 
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * 
 * sanitizeString('  Normal text  ')
 * // Returns: 'Normal text'
 * ```
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) {
    return '';
  }

  // Trim whitespace
  const trimmed = input.trim();

  // Escape HTML special characters to prevent XSS
  return trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize a URL by trimming whitespace and validating it's a proper URL format.
 * Does NOT escape HTML characters since URLs need to remain functional.
 * 
 * @param {string | null | undefined} url - The URL to sanitize
 * @returns {string} Sanitized URL, or empty string if invalid
 * 
 * @example
 * ```typescript
 * sanitizeUrl('  https://example.com  ')
 * // Returns: 'https://example.com'
 * 
 * sanitizeUrl('javascript:alert("xss")')
 * // Returns: '' (invalid protocol)
 * ```
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  // Trim whitespace
  const trimmed = url.trim();

  // Return empty string if URL is empty after trimming
  if (trimmed === '') {
    return '';
  }

  // Validate URL format and protocol
  try {
    const urlObj = new URL(trimmed);
    
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return '';
    }

    return trimmed;
  } catch {
    // Invalid URL format
    return '';
  }
}

/**
 * Sanitize marketplace URL specifically for Shopee, Tokopedia, or PadiUMKM.
 * Validates the URL format and ensures it matches the expected domain.
 * 
 * @param {string | null | undefined} url - The marketplace URL to sanitize
 * @param {'shopee' | 'tokopedia' | 'padiumkm'} platform - The marketplace platform
 * @returns {string} Sanitized URL, or empty string if invalid
 * 
 * @example
 * ```typescript
 * sanitizeMarketplaceUrl('https://shopee.co.id/product', 'shopee')
 * // Returns: 'https://shopee.co.id/product'
 * 
 * sanitizeMarketplaceUrl('https://evil.com/phishing', 'shopee')
 * // Returns: '' (wrong domain)
 * ```
 */
export function sanitizeMarketplaceUrl(
  url: string | null | undefined,
  platform: 'shopee' | 'tokopedia' | 'padiumkm'
): string {
  // First apply general URL sanitization
  const sanitized = sanitizeUrl(url);

  if (!sanitized) {
    return '';
  }

  // Validate platform-specific domain
  const domainPatterns = {
    shopee: /^https:\/\/shopee\.co\.id\//,
    tokopedia: /^https:\/\/www\.tokopedia\.com\//,
    padiumkm: /^https:\/\/padiumkm\.id\//,
  };

  const pattern = domainPatterns[platform];
  if (!pattern.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitize customer notes or addresses with length limits.
 * Trims whitespace, escapes HTML, and enforces maximum length.
 * 
 * @param {string | null | undefined} text - The text to sanitize
 * @param {number} maxLength - Maximum allowed length (default: 1000)
 * @returns {string} Sanitized text, truncated if necessary
 * 
 * @example
 * ```typescript
 * sanitizeText('  Customer note with <script>  ', 100)
 * // Returns: 'Customer note with &lt;script&gt;'
 * 
 * sanitizeText('A'.repeat(2000), 1000)
 * // Returns: 'A'.repeat(1000) (truncated)
 * ```
 */
export function sanitizeText(
  text: string | null | undefined,
  maxLength: number = 1000
): string {
  if (!text) {
    return '';
  }

  // Sanitize HTML
  const sanitized = sanitizeString(text);

  // Enforce maximum length
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize phone number by removing non-digit characters except leading +.
 * Preserves E.164 format for international phone numbers.
 * 
 * @param {string | null | undefined} phone - The phone number to sanitize
 * @returns {string} Sanitized phone number
 * 
 * @example
 * ```typescript
 * sanitizePhoneNumber('+62 812-3456-7890')
 * // Returns: '+628123456790'
 * 
 * sanitizePhoneNumber('  08123456789  ')
 * // Returns: '08123456789'
 * ```
 */
export function sanitizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) {
    return '';
  }

  // Trim whitespace
  const trimmed = phone.trim();

  // Keep only digits and leading +
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');

  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

/**
 * Sanitize province name by trimming and validating against known provinces.
 * Ensures the province is one of the 38 Indonesian provinces.
 * 
 * @param {string | null | undefined} province - The province name to sanitize
 * @returns {string} Sanitized province name, or empty string if invalid
 * 
 * @example
 * ```typescript
 * sanitizeProvince('  Jawa Barat  ')
 * // Returns: 'Jawa Barat'
 * 
 * sanitizeProvince('Invalid Province')
 * // Returns: '' (not in valid list)
 * ```
 */
export function sanitizeProvince(province: string | null | undefined): string {
  if (!province) {
    return '';
  }

  const trimmed = province.trim();

  // List of valid Indonesian provinces
  const validProvinces = [
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

  // Check if province is in valid list (case-insensitive)
  const isValid = validProvinces.some(
    (valid) => valid.toLowerCase() === trimmed.toLowerCase()
  );

  if (!isValid) {
    return '';
  }

  // Return the properly cased version from the valid list
  return validProvinces.find(
    (valid) => valid.toLowerCase() === trimmed.toLowerCase()
  ) || '';
}
