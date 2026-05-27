import { createClient } from '@/lib/supabase/server';
import { getCheckoutConfig, getCheckoutConfigDescription } from '@/lib/config/checkout-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

/**
 * CheckoutConfigDisplay Component
 * 
 * Displays the current checkout configuration for super_admin users only.
 * Shows:
 * - Current CHECKOUT_METHOD value
 * - Configuration description
 * - Midtrans credential validation status
 * - Warning for invalid configurations
 * 
 * Requirements: 13.6, 13.8
 */
export default async function CheckoutConfigDisplay() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  // Check if user is super_admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  // Only show to super_admin users
  if (!profile || profile.role !== 'super_admin') {
    return null;
  }
  
  // Get checkout configuration
  const config = getCheckoutConfig();
  const description = getCheckoutConfigDescription();
  
  // Get raw environment variable to check for invalid values
  const rawCheckoutMethod = process.env.CHECKOUT_METHOD?.toLowerCase().trim() || 'marketplace';
  const validMethods = ['marketplace', 'direct', 'both'];
  const isInvalidConfig = !validMethods.includes(rawCheckoutMethod);
  
  // Determine status badge variant
  const getStatusBadge = () => {
    if (isInvalidConfig) {
      return (
        <Badge variant="destructive" className="gap-1.5">
          <XCircle className="h-3 w-3" />
          Invalid Configuration
        </Badge>
      );
    }
    
    if (config.midtransEnabled && !config.midtransCredentialsValid) {
      return (
        <Badge variant="destructive" className="gap-1.5">
          <AlertCircle className="h-3 w-3" />
          Missing Credentials
        </Badge>
      );
    }
    
    return (
      <Badge variant="default" className="gap-1.5 bg-green-600 hover:bg-green-700">
        <CheckCircle2 className="h-3 w-3" />
        Valid Configuration
      </Badge>
    );
  };
  
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Checkout Configuration</CardTitle>
            <CardDescription className="mt-1">
              Current checkout method settings (Super Admin only)
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Invalid Configuration Warning */}
        {isInvalidConfig && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-destructive">
                Invalid CHECKOUT_METHOD Configuration
              </p>
              <p className="text-sm text-muted-foreground">
                The environment variable CHECKOUT_METHOD is set to &quot;{rawCheckoutMethod}&quot; which is not valid. 
                Valid values are: marketplace, direct, or both. The system has defaulted to &quot;marketplace&quot; mode.
              </p>
            </div>
          </div>
        )}
        
        {/* Missing Credentials Warning */}
        {config.midtransEnabled && !config.midtransCredentialsValid && (
          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                Midtrans Credentials Missing
              </p>
              <p className="text-sm text-muted-foreground">
                Midtrans checkout is enabled but credentials are not configured. 
                Please set MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY environment variables.
              </p>
            </div>
          </div>
        )}
        
        {/* Configuration Details */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Checkout Method */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Checkout Method
              </label>
              <div className="px-3 py-2 bg-muted/50 border border-border rounded-md">
                <code className="text-sm font-mono text-foreground">
                  {config.method.toUpperCase()}
                </code>
              </div>
            </div>
            
            {/* Raw Environment Variable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Environment Variable
              </label>
              <div className="px-3 py-2 bg-muted/50 border border-border rounded-md">
                <code className="text-sm font-mono text-foreground">
                  {rawCheckoutMethod}
                </code>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <p className="text-sm text-foreground px-3 py-2 bg-muted/30 border border-border rounded-md">
              {description}
            </p>
          </div>
          
          {/* Feature Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Feature Status
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border border-border rounded-md">
                <span className="text-sm">Marketplace Checkout</span>
                {config.marketplaceEnabled ? (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="outline">Disabled</Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border border-border rounded-md">
                <span className="text-sm">Direct Checkout (Midtrans)</span>
                {config.midtransEnabled ? (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="outline">Disabled</Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Midtrans Credentials Status */}
          {config.midtransEnabled && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Midtrans Credentials
              </label>
              <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border border-border rounded-md">
                <span className="text-sm">Validation Status</span>
                {config.midtransCredentialsValid ? (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700 gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Valid
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1.5">
                    <XCircle className="h-3 w-3" />
                    Invalid
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Help Text */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            To change the checkout method, update the CHECKOUT_METHOD environment variable 
            in your .env.local file and restart the application. Valid values: marketplace, direct, both.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
