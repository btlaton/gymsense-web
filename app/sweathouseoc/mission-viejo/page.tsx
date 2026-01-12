/**
 * Sweathouse OC - Mission Viejo Checkout Page
 * 
 * Customer-facing product catalog and checkout flow for studio classes.
 * Uses Sweathouse branding and Stripe Embedded Checkout.
 * 
 * URL: gymsense.io/sweathouseoc/mission-viejo
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { 
  X, Check, Loader2, ChevronRight, 
  Clock, Zap, Repeat, AlertCircle,
  Download
} from 'lucide-react';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = 'https://ldwwiiiskujewcluclbx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkd3dpaWlza3VqZXdjbHVjbGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODg1MzksImV4cCI6MjA3OTA2NDUzOX0.6hErpbUmhLocUTnkPz09P_UBOCd-WL-ZrvcJkm9qt3c';

const BRAND = {
  primaryColor: '#1FB9D9',
  secondaryColor: '#FFFFFF',
  backgroundColor: '#000000',
  cardBackground: '#111111',
  logoUrl: 'https://www.sweathouseoc.com/wp-content/uploads/2024/08/Teal-and-WhiteSweatHouse-Logo.png',
  gymId: '7a23390d-f78d-475a-aacb-75bf0aa05ef0',
  gymName: 'Sweathouse OC - Mission Viejo',
  stripeAccountId: 'acct_1SoSYdDr8LtAIM9n',
};

const APP_LINKS = {
  ios: 'https://gymsense.io/download/ios',
  android: 'https://gymsense.io/download/android',
};

// ============================================================================
// TYPES
// ============================================================================

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: 'membership' | 'class_pack' | 'private_session';
  sessions_included: number | null;
  expires_in_days: number | null;
  is_intro_offer: boolean;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  billing_mode: 'one_off' | 'recurring';
}

interface AgreementTemplate {
  id: string;
  agreement_type: string;
  name: string;
  content: string;
}

type ProductCategory = 'membership' | 'class_pack' | 'private_session';

// ============================================================================
// STRIPE SETUP
// ============================================================================

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51S7G4iDJJF9sHVx312eC7oFWkQFnpNlGifi56gjq5aMF3Xc8uE56jVpWzQBXKqHDGutJV5X3gsbcEM1XjYcMJ5lB00wHb3ZS9l';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY, {
  stripeAccount: BRAND.stripeAccountId,
});

// ============================================================================
// CHECKOUT DRAWER COMPONENT
// ============================================================================

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  agreement: AgreementTemplate | null;
}

function CheckoutDrawer({ isOpen, onClose, product, agreement }: CheckoutDrawerProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);
  
  // Prevent duplicate API calls
  const hasInitialized = useRef(false);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow close animation
      const timer = setTimeout(() => {
        setClientSecret(null);
        setSessionId(null);
        setError(null);
        setSuccess(false);
        setTermsAccepted(false);
        setShowTerms(false);
        setCheckoutReady(false);
        hasInitialized.current = false;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Create checkout session when drawer opens
  useEffect(() => {
    if (!isOpen || !product || hasInitialized.current || loading) return;
    
    hasInitialized.current = true;
    
    async function createCheckoutSession() {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Creating checkout session for:', product.name);
        
        // Build cart item for create-guest-checkout
        const cartItem = {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          quantity: 1,
          type: product.type,
          billing_mode: product.billing_mode,
          stripe_product_id: product.stripe_product_id,
          stripe_price_id: product.stripe_price_id,
          sessions_per_month: product.sessions_included,
        };
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/create-guest-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            gymId: BRAND.gymId,
            cartItems: [cartItem],
            successUrl: `${window.location.origin}/sweathouseoc/mission-viejo?success=true`,
            cancelUrl: `${window.location.origin}/sweathouseoc/mission-viejo`,
            uiMode: 'embedded',
          }),
        });
        
        const data = await response.json();
        console.log('Checkout session response:', data);
        
        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to create checkout session');
        }
        
        if (!data.clientSecret) {
          throw new Error('No client secret returned');
        }
        
        setClientSecret(data.clientSecret);
        setSessionId(data.sessionId);
        console.log('Checkout session created:', data.sessionId);
        
      } catch (err) {
        console.error('Checkout session error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize checkout');
        hasInitialized.current = false; // Allow retry
      } finally {
        setLoading(false);
      }
    }
    
    createCheckoutSession();
  }, [isOpen, product, loading]);

  // Store agreement acceptance when terms are accepted
  const handleTermsAccepted = useCallback(async (accepted: boolean) => {
    setTermsAccepted(accepted);
    
    if (accepted && sessionId && agreement) {
      try {
        console.log('Storing agreement acceptance...');
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/store-checkout-agreement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            gymId: BRAND.gymId,
            stripeSessionId: sessionId,
            agreementType: agreement.agreement_type,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Failed to store agreement:', data.error);
        } else {
          console.log('Agreement acceptance stored');
          setCheckoutReady(true);
        }
      } catch (err) {
        console.error('Error storing agreement:', err);
        // Don't block checkout - agreement can be linked later
        setCheckoutReady(true);
      }
    } else if (!accepted) {
      setCheckoutReady(false);
    }
  }, [sessionId, agreement]);

  // Handle checkout completion
  const handleComplete = useCallback(() => {
    console.log('Checkout completed!');
    setSuccess(true);
  }, []);

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed z-50 transition-transform duration-300 ease-out
          bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh] overflow-y-auto
          md:bottom-auto md:top-0 md:left-auto md:right-0 md:w-[480px] md:h-full md:rounded-none
          ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}
        style={{ 
          fontFamily: 'Roboto, system-ui, sans-serif',
          backgroundColor: '#111111',
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 px-6 py-4 flex items-center justify-between z-10"
          style={{ backgroundColor: '#111111', borderBottom: '1px solid #333' }}
        >
          <h2 className="text-lg font-semibold text-white">Checkout</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Product Summary */}
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-400 mt-1">{product.description}</p>
                )}
                {product.sessions_included && (
                  <p className="text-sm text-gray-400 mt-1">
                    {product.sessions_included} class credits
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-xl font-bold" style={{ color: BRAND.primaryColor }}>
                  ${product.price.toFixed(2)}
                </p>
                {product.billing_mode === 'recurring' && (
                  <p className="text-xs text-gray-400">/month</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg text-red-400 text-sm flex items-start gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND.primaryColor }} />
            </div>
          )}
          
          {/* Success State */}
          {success && (
            <div className="text-center py-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${BRAND.primaryColor}30` }}
              >
                <Check className="w-8 h-8" style={{ color: BRAND.primaryColor }} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">You&apos;re all set!</h3>
              <p className="text-gray-400 mb-4">
                Your {product?.sessions_included} class credits are ready to use.
              </p>
              
              {/* App Download Instructions */}
              <div className="rounded-xl p-4 text-left mb-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4" style={{ color: BRAND.primaryColor }} />
                  Download the Gymsense Member App
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Use the app to book classes, check in when you arrive, and manage your membership.</p>
                  <p className="text-white">Check your email for your 4-digit setup code!</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <a
                    href={APP_LINKS.ios}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-medium text-sm border transition-all hover:bg-white/5"
                    style={{ borderColor: '#333', color: '#fff' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    iPhone
                  </a>
                  <a
                    href={APP_LINKS.android}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-medium text-sm border transition-all hover:bg-white/5"
                    style={{ borderColor: '#333', color: '#fff' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 2.047a.5.5 0 0 0-.7.1l-2.2 3.2a8.9 8.9 0 0 0-5.2 0l-2.2-3.2a.5.5 0 0 0-.9.3v.1l2 2.9a9.1 9.1 0 0 0-4.7 7.9h17a9.1 9.1 0 0 0-4.7-7.9l2-2.9a.5.5 0 0 0-.1-.5zM7.5 10.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm9 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3.5 13.5h.5v7a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-7h10v7a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-7h.5a1 1 0 0 0 1-1v-1h-18v1a1 1 0 0 0 1 1z"/>
                    </svg>
                    Android
                  </a>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="text-gray-500 text-sm hover:text-white transition-colors"
              >
                Continue browsing
              </button>
            </div>
          )}
          
          {/* Terms Agreement (shown before checkout is ready) */}
          {!loading && !success && clientSecret && !checkoutReady && (
            <div className="mb-6">
              <div className="space-y-2 mb-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => handleTermsAccepted(!termsAccepted)}
                    className="mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0"
                    style={{ 
                      backgroundColor: termsAccepted ? BRAND.primaryColor : 'transparent',
                      borderColor: termsAccepted ? BRAND.primaryColor : '#555',
                    }}
                  >
                    {termsAccepted && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                  </button>
                  <span className="text-sm text-gray-400">
                    I agree to the{' '}
                    <button 
                      type="button"
                      onClick={() => setShowTerms(!showTerms)}
                      className="underline hover:text-white transition-colors"
                      style={{ color: BRAND.primaryColor }}
                    >
                      {agreement?.name || 'terms and conditions'}
                    </button>
                  </span>
                </label>
                
                {showTerms && agreement && (
                  <div 
                    className="p-3 rounded-lg text-xs text-gray-400 max-h-32 overflow-y-auto whitespace-pre-wrap"
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  >
                    {agreement.content}
                  </div>
                )}
              </div>
              
              {!termsAccepted && (
                <p className="text-sm text-gray-500 text-center">
                  Please accept the terms to continue to payment
                </p>
              )}
            </div>
          )}
          
          {/* Stripe Embedded Checkout */}
          {!loading && !success && clientSecret && checkoutReady && (
            <div className="stripe-checkout-container">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{
                  clientSecret,
                  onComplete: handleComplete,
                }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isIntro = product.is_intro_offer;
  
  return (
    <button
      onClick={onSelect}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-100 group ${isIntro ? 'animate-border-pulse' : ''}`}
      style={{ 
        backgroundColor: isHovered ? '#1a1a1a' : BRAND.cardBackground,
        borderColor: isIntro ? undefined : '#333333',
        boxShadow: isPressed ? 'none' : '2px 2px 0px #44403c',
        transform: isPressed ? 'translate(2px, 2px)' : 'none',
      }}
    >
      {/* Top row: Name and Price */}
      <div className="flex justify-between items-start mb-1.5">
        <h3 className="font-semibold text-white text-base group-hover:text-gray-200">
          {product.name}
        </h3>
        <div className="text-right flex-shrink-0 ml-3">
          <span className="text-lg font-bold" style={{ color: BRAND.primaryColor }}>
            ${product.price.toFixed(2)}
          </span>
          {product.billing_mode === 'recurring' && (
            <span className="text-xs text-gray-400 ml-0.5">/mo</span>
          )}
        </div>
      </div>
      
      {/* Bottom row: Description on left, SELECT on right */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {product.description && (
            <span>{product.description}</span>
          )}
        </div>
        <div className="flex items-center text-xs font-semibold uppercase tracking-wide flex-shrink-0" style={{ color: BRAND.primaryColor }}>
          Select
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const PAGE_PASSWORD = 'sweathouse2026';

export default function SweatHouseCheckoutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [agreements, setAgreements] = useState<AgreementTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('membership');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const stored = localStorage.getItem('sweathouse_auth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Check for success redirect
  useEffect(() => {
    if (!isAuthenticated) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PAGE_PASSWORD) {
      localStorage.setItem('sweathouse_auth', 'true');
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Fetch products and agreements
  useEffect(() => {
    if (!isAuthenticated) return;
    
    async function fetchData() {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, description, price, type, sessions_included, expires_in_days, is_intro_offer, stripe_product_id, stripe_price_id, recurring')
        .eq('gym_id', BRAND.gymId)
        .eq('is_active', true)
        .not('type', 'eq', 'retail')
        .order('price', { ascending: true });
      
      if (productsData) {
        const transformed = productsData.map(p => ({
          ...p,
          billing_mode: (p.recurring ? 'recurring' : 'one_off') as 'one_off' | 'recurring',
        }));
        setProducts(transformed);
        
        // Set initial category
        const types = new Set(transformed.map(p => p.type));
        if (types.has('membership')) setActiveCategory('membership');
        else if (types.has('class_pack')) setActiveCategory('class_pack');
        else if (types.has('private_session')) setActiveCategory('private_session');
      }
      
      // Fetch agreement templates
      const { data: agreementsData } = await supabase
        .from('agreement_templates')
        .select('id, agreement_type, name, content')
        .eq('gym_id', BRAND.gymId);
      
      if (agreementsData) {
        setAgreements(agreementsData);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, [isAuthenticated]);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Get products by category
  const categoryProducts = products
    .filter(p => p.type === activeCategory)
    .sort((a, b) => {
      if (a.is_intro_offer && !b.is_intro_offer) return -1;
      if (!a.is_intro_offer && b.is_intro_offer) return 1;
      return a.price - b.price;
    });
  
  // Get available categories
  const categoryOrder: ProductCategory[] = ['membership', 'class_pack', 'private_session'];
  const availableCategories = categoryOrder.filter(cat => 
    products.some(p => p.type === cat)
  );
  
  // Get agreement for selected product
  const getAgreementForProduct = (product: Product | null): AgreementTemplate | null => {
    if (!product) return null;
    
    const agreementTypeMap: Record<string, string> = {
      'membership': 'studio_membership',
      'class_pack': 'class_pack',
      'private_session': 'private_session',
    };
    
    const agreementType = agreementTypeMap[product.type];
    return agreements.find(a => a.agreement_type === agreementType) || null;
  };

  const categoryLabels: Record<ProductCategory, string> = {
    'membership': 'Memberships',
    'class_pack': 'Class Packs',
    'private_session': 'Private Sessions',
  };

  // Password gate
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: BRAND.backgroundColor, fontFamily: 'Roboto, system-ui, sans-serif' }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img 
              src={BRAND.logoUrl} 
              alt="Sweathouse" 
              className="h-12 mx-auto mb-4"
            />
            <p className="text-gray-400 text-sm">Alpha Preview</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#1a1a1a',
                  border: passwordError ? '1px solid #ef4444' : '1px solid #333',
                }}
                autoFocus
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-400">Incorrect password</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-black uppercase tracking-wide"
              style={{ backgroundColor: BRAND.primaryColor }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <main 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BRAND.backgroundColor, fontFamily: 'Roboto, system-ui, sans-serif' }}
      >
        <div className="text-center">
          <Loader2 
            className="w-12 h-12 animate-spin mx-auto mb-4"
            style={{ color: BRAND.primaryColor }}
          />
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen"
      style={{ backgroundColor: BRAND.backgroundColor, fontFamily: 'Roboto, system-ui, sans-serif' }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-30 px-6 py-4"
        style={{ backgroundColor: BRAND.backgroundColor, borderBottom: '1px solid #222' }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <img 
            src={BRAND.logoUrl}
            alt={BRAND.gymName}
            className="h-12 object-contain"
          />
        </div>
      </header>
      
      {/* Hero */}
      <section className="px-6 py-10 text-center" style={{ borderBottom: '1px solid #222' }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
            An Option for Everybody
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Explore our thoughtfully designed pricing options, tailored to meet your fitness needs.
          </p>
        </div>
      </section>
      
      {/* Category Tabs */}
      {availableCategories.length > 1 && (
        <div 
          className="px-4 py-3 sticky top-[72px] z-20"
          style={{ backgroundColor: BRAND.backgroundColor, borderBottom: '1px solid #222' }}
        >
          <div className="max-w-2xl mx-auto flex gap-1.5 justify-center">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: activeCategory === category ? BRAND.primaryColor : 'transparent',
                  border: activeCategory === category ? 'none' : '1px solid #444',
                }}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Products Grid */}
      <section className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => handleProductSelect(product)}
            />
          ))}
          
          {categoryProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products available in this category.
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-6 py-8 mt-8" style={{ borderTop: '1px solid #222' }}>
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xl text-white" style={{ fontFamily: 'var(--font-pacifico), cursive' }}>gymsense</span>
        </div>
      </footer>
      
      {/* Checkout Drawer */}
      <CheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        product={selectedProduct}
        agreement={getAgreementForProduct(selectedProduct)}
      />
    </main>
  );
}
