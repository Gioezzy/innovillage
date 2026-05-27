/**
 * Checkout Configuration Service
 * 
 * Provides feature toggle functionality for switching between marketplace and direct checkout methods.
 * Reads from CHECKOUT_METHOD environment variable to determine which checkout flow to enable.
 * 
 * @module lib/config/checkout-config
 */

export type CheckoutMethod = 'marketplace' | 'direct' | 'both';

export interface CheckoutConfig {
  /** The configured checkout method */
  method: CheckoutMethod;
  /** Whether Midtrans direct checkout is enabled */
  midtransEnabled: boolean;
  /** Whether marketplace checkout is enabled */
  marketplaceEnabled: boolean;
  /** Whether Midtrans credentials are properly configured */
  midtransCredentialsValid: boolean;
}

/**
 * Get the current checkout configuration based on environment variables.
 * 
 * Reads CHECKOUT_METHOD environment variable and validates it.
 * Defaults to 'marketplace' if not set or invalid.
 * 
 * Valid values (case-insensitive):
 * - 'marketplace': Only marketplace checkout enabled
 * - 'direct': Only Midtrans direct checkout enabled
 * - 'both': Both checkout methods available
 * 
 * @returns {CheckoutConfig} The current checkout configuration
 * 
 * @example
 * ```typescript
 * const config = getCheckoutConfig();
 * if (config.marketplaceEnabled) {
 *   // Show marketplace checkout UI
 * }
 * ```
 */
export function getCheckoutConfig(): CheckoutConfig {
  const rawMethod = process.env.CHECKOUT_METHOD?.toLowerCase().trim();
  const validMethods: CheckoutMethod[] = ['marketplace', 'direct', 'both'];
  
  // Validate and normalize method
  let method: CheckoutMethod = 'marketplace'; // Default
  
  if (rawMethod && validMethods.includes(rawMethod as CheckoutMethod)) {
    method = rawMethod as CheckoutMethod;
  } else if (rawMethod) {
    // Invalid value provided - log error and use default
    console.error(
      `[CheckoutConfig] Invalid CHECKOUT_METHOD: "${rawMethod}". ` +
      `Valid values are: ${validMethods.join(', ')}. Defaulting to "marketplace".`
    );
  }
  
  // Determine which checkout methods are enabled
  const midtransEnabled = method === 'direct' || method === 'both';
  const marketplaceEnabled = method === 'marketplace' || method === 'both';
  
  // Validate Midtrans credentials if Midtrans is enabled
  let midtransCredentialsValid = false;
  if (midtransEnabled) {
    const hasServerKey = !!process.env.MIDTRANS_SERVER_KEY;
    const hasClientKey = !!process.env.MIDTRANS_CLIENT_KEY;
    midtransCredentialsValid = hasServerKey && hasClientKey;
    
    if (!midtransCredentialsValid) {
      console.warn(
        '[CheckoutConfig] Midtrans checkout is enabled but credentials are missing. ' +
        'Please set MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY environment variables.'
      );
    }
  }
  
  return {
    method,
    midtransEnabled,
    marketplaceEnabled,
    midtransCredentialsValid,
  };
}

/**
 * Check if a specific checkout method is enabled.
 * 
 * @param {CheckoutMethod} method - The checkout method to check
 * @returns {boolean} True if the method is enabled
 * 
 * @example
 * ```typescript
 * if (isCheckoutMethodEnabled('marketplace')) {
 *   // Marketplace checkout is available
 * }
 * ```
 */
export function isCheckoutMethodEnabled(method: 'marketplace' | 'direct'): boolean {
  const config = getCheckoutConfig();
  return method === 'marketplace' ? config.marketplaceEnabled : config.midtransEnabled;
}

/**
 * Get a human-readable description of the current checkout configuration.
 * Useful for admin panels and debugging.
 * 
 * @returns {string} Description of the current configuration
 * 
 * @example
 * ```typescript
 * const description = getCheckoutConfigDescription();
 * // Returns: "Marketplace checkout only (PSE compliance mode)"
 * ```
 */
export function getCheckoutConfigDescription(): string {
  const config = getCheckoutConfig();
  
  switch (config.method) {
    case 'marketplace':
      return 'Marketplace checkout only (PSE compliance mode)';
    case 'direct':
      return 'Direct checkout only (Midtrans payment gateway)';
    case 'both':
      return 'Both marketplace and direct checkout available';
    default:
      return 'Unknown configuration';
  }
}
