/**
 * Sweathouse OC - Mission Viejo Checkout Page
 * 
 * Customer-facing product catalog and checkout flow for studio classes.
 * Uses Sweathouse branding and Stripe Elements for payment.
 * 
 * URL: gymsense.io/sweathouseoc/mission-viejo
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  X, Check, Loader2, ChevronRight, Mail, 
  Clock, Zap, Repeat, AlertCircle,
  Download
} from 'lucide-react';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ldwwiiiskujewcluclbx.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Sweathouse branding
const BRAND = {
  primaryColor: '#1FB9D9',
  secondaryColor: '#000000',
  backgroundColor: '#FFFFFF',
  logoUrl: 'https://www.sweathouseoc.com/wp-content/uploads/2024/08/Teal-and-WhiteSweatHouse-Logo.png',
  gymId: '7a23390d-f78d-475a-aacb-75bf0aa05ef0',
  gymName: 'Sweathouse OC - Mission Viejo',
  stripeAccountId: 'acct_1SoSYdDr8LtAIM9n',
};

// App download links
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

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      { stripeAccount: BRAND.stripeAccountId }
    );
  }
  return stripePromise;
}

// ============================================================================
// CHECKOUT FORM COMPONENT
// ============================================================================

interface CheckoutFormProps {
  product: Product;
  email: string;
  onSuccess: (setupCode: string) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ product, email, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setProcessing(true);
    
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: email,
          return_url: `${window.location.origin}/sweathouseoc/mission-viejo?success=true`,
        },
        redirect: 'if_required',
      });
      
      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded - fetch the setup code
        // The webhook will have created the customer with setup_code
        // For now, show success and tell them to check email
        onSuccess('');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: 'tabs',
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
        }}
      />
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50"
        style={{ 
          backgroundColor: BRAND.primaryColor,
          color: '#FFFFFF',
        }}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay $${product.price.toFixed(2)}`
        )}
      </button>
    </form>
  );
}

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
  const [step, setStep] = useState<'email' | 'terms' | 'payment' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupCode, setSetupCode] = useState<string>('');

  // Reset state when drawer opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('email');
        setEmail('');
        setTermsAccepted(false);
        setClientSecret(null);
        setError(null);
        setSetupCode('');
      }, 300);
    }
  }, [isOpen]);

  const isEmailValid = email.includes('@') && email.includes('.');

  const handleEmailSubmit = () => {
    if (!isEmailValid) return;
    setStep('terms');
  };

  const handleTermsAccept = async () => {
    if (!termsAccepted || !product) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create checkout session via edge function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-guest-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          gymId: BRAND.gymId,
          cartItems: [{
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
          }],
          successUrl: `${window.location.origin}/sweathouseoc/mission-viejo?success=true&email=${encodeURIComponent(email)}`,
          cancelUrl: `${window.location.origin}/sweathouseoc/mission-viejo`,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to create checkout');
      }
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create checkout');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (code: string) => {
    setSetupCode(code);
    setStep('success');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

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
        className={`fixed z-50 bg-white transition-transform duration-300 ease-out
          bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh] overflow-y-auto
          md:bottom-auto md:top-0 md:left-auto md:right-0 md:w-[480px] md:h-full md:rounded-none
          ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}
        style={{ fontFamily: 'Roboto, system-ui, sans-serif' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Product Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                {product.sessions_included && product.sessions_included !== 999 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {product.sessions_included} {product.sessions_included === 1 ? 'class' : 'classes'}
                  </p>
                )}
                {product.sessions_included === 999 && (
                  <p className="text-sm text-gray-500 mt-1">Unlimited classes</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold" style={{ color: BRAND.primaryColor }}>
                  ${product.price.toFixed(2)}
                </p>
                {product.billing_mode === 'recurring' && (
                  <p className="text-xs text-gray-500">/month</p>
                )}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              {product.expires_in_days && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Expires in {product.expires_in_days} days</span>
                </div>
              )}
              {product.billing_mode === 'recurring' && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Repeat className="w-4 h-4" />
                  <span>Renews monthly until cancelled</span>
                </div>
              )}
              {product.is_intro_offer && (
                <div className="flex items-center gap-2 text-sm" style={{ color: BRAND.primaryColor }}>
                  <Zap className="w-4 h-4" />
                  <span>New client offer</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Step: Email */}
          {step === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      '--tw-ring-color': BRAND.primaryColor,
                    } as React.CSSProperties}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  We&apos;ll send your confirmation and app setup code here.
                </p>
              </div>
              
              <button
                onClick={handleEmailSubmit}
                disabled={!isEmailValid}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: BRAND.primaryColor }}
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {/* Step: Terms */}
          {step === 'terms' && agreement && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{agreement.name}</h3>
                <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg text-sm text-gray-600 whitespace-pre-wrap">
                  {agreement.content}
                </div>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setTermsAccepted(!termsAccepted)}
                  className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    termsAccepted 
                      ? 'border-transparent' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: termsAccepted ? BRAND.primaryColor : undefined }}
                >
                  {termsAccepted && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </button>
                <span className="text-sm text-gray-700">
                  I have read and agree to the {agreement.name}
                </span>
              </label>
              
              <button
                onClick={handleTermsAccept}
                disabled={!termsAccepted || loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: BRAND.primaryColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <button
                onClick={() => setStep('email')}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back
              </button>
            </div>
          )}
          
          {/* Step: Payment */}
          {step === 'payment' && clientSecret && (
            <div>
              <Elements 
                stripe={getStripe()} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: BRAND.primaryColor,
                      fontFamily: 'Roboto, system-ui, sans-serif',
                    },
                  },
                }}
              >
                <CheckoutForm
                  product={product}
                  email={email}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
              
              <button
                onClick={() => setStep('terms')}
                className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back
              </button>
            </div>
          )}
          
          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${BRAND.primaryColor}20` }}
              >
                <Check className="w-8 h-8" style={{ color: BRAND.primaryColor }} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re all set!</h3>
              <p className="text-gray-600 mb-6">
                Check your email ({email}) for your confirmation and setup code.
              </p>
              
              {setupCode && (
                <div 
                  className="p-4 rounded-xl mb-6"
                  style={{ backgroundColor: `${BRAND.primaryColor}10` }}
                >
                  <p className="text-sm text-gray-600 mb-2">Your setup code</p>
                  <p 
                    className="text-3xl font-bold tracking-widest"
                    style={{ color: BRAND.primaryColor }}
                  >
                    {setupCode.split('').join(' ')}
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Next Steps</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold"
                      style={{ backgroundColor: BRAND.primaryColor }}
                    >
                      1
                    </div>
                    <p className="text-sm text-gray-600">
                      Download the <strong>Gymsense Member</strong> app
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold"
                      style={{ backgroundColor: BRAND.primaryColor }}
                    >
                      2
                    </div>
                    <p className="text-sm text-gray-600">
                      Enter your 4-digit setup code from your email
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold"
                      style={{ backgroundColor: BRAND.primaryColor }}
                    >
                      3
                    </div>
                    <p className="text-sm text-gray-600">
                      Book your classes and check in when you arrive!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <a
                  href={APP_LINKS.ios}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: BRAND.primaryColor }}
                >
                  <Download className="w-5 h-5" />
                  Download for iPhone
                </a>
                <a
                  href={APP_LINKS.android}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold border-2 transition-all"
                  style={{ 
                    borderColor: BRAND.primaryColor, 
                    color: BRAND.primaryColor,
                  }}
                >
                  <Download className="w-5 h-5" />
                  Download for Android
                </a>
              </div>
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
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
          {product.name}
        </h3>
        <div className="text-right">
          <p className="text-lg font-bold" style={{ color: BRAND.primaryColor }}>
            ${product.price.toFixed(2)}
          </p>
          {product.billing_mode === 'recurring' && (
            <p className="text-xs text-gray-500">/month</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {product.sessions_included && product.sessions_included !== 999 && (
          <span>{product.sessions_included} {product.sessions_included === 1 ? 'class' : 'classes'}</span>
        )}
        {product.sessions_included === 999 && (
          <span>Unlimited classes</span>
        )}
        {product.expires_in_days && (
          <>
            <span>•</span>
            <span>{product.expires_in_days} day{product.expires_in_days !== 1 ? 's' : ''}</span>
          </>
        )}
        {product.is_intro_offer && (
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${BRAND.primaryColor}20`, color: BRAND.primaryColor }}
          >
            Intro Offer
          </span>
        )}
      </div>
      
      <div className="mt-3 flex items-center justify-end text-sm font-medium" style={{ color: BRAND.primaryColor }}>
        Select
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </button>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SweatHouseCheckoutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [agreements, setAgreements] = useState<AgreementTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('class_pack');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check for success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      // Show success state - user returning from Stripe
      // The email confirmation with setup code was sent by webhook
      // For now, just show a message to check email
      setIsDrawerOpen(true);
    }
  }, []);

  // Fetch products and agreements
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      // Fetch products (excluding retail)
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, description, price, type, sessions_included, expires_in_days, is_intro_offer, stripe_product_id, stripe_price_id, recurring')
        .eq('gym_id', BRAND.gymId)
        .eq('is_active', true)
        .not('type', 'eq', 'retail')
        .order('price', { ascending: true });
      
      if (productsData) {
        // Transform to add billing_mode
        const transformed = productsData.map(p => ({
          ...p,
          billing_mode: (p.recurring ? 'recurring' : 'one_off') as 'one_off' | 'recurring',
        }));
        setProducts(transformed);
        
        // Set initial category based on what products exist
        const types = new Set(transformed.map(p => p.type));
        if (types.has('class_pack')) setActiveCategory('class_pack');
        else if (types.has('membership')) setActiveCategory('membership');
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
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
    // Clear URL params if returning from success
    if (window.location.search.includes('success')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Get products by category
  const categoryProducts = products.filter(p => p.type === activeCategory);
  
  // Get available categories (only show tabs for categories with products)
  const availableCategories = Array.from(new Set(products.map(p => p.type))) as ProductCategory[];
  
  // Get agreement for selected product
  const getAgreementForProduct = (product: Product | null): AgreementTemplate | null => {
    if (!product) return null;
    
    // Map product type to agreement type
    const agreementTypeMap: Record<string, string> = {
      'membership': 'studio_membership',
      'class_pack': 'class_pack',
      'private_session': 'private_session',
    };
    
    const agreementType = agreementTypeMap[product.type];
    return agreements.find(a => a.agreement_type === agreementType) || null;
  };

  // Category labels
  const categoryLabels: Record<ProductCategory, string> = {
    'membership': 'Memberships',
    'class_pack': 'Class Packs',
    'private_session': 'Private Sessions',
  };

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
          <p className="text-gray-500">Loading...</p>
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
        className="sticky top-0 z-30 px-6 py-4 shadow-sm"
        style={{ backgroundColor: BRAND.backgroundColor }}
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
      <section className="px-6 py-8 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join the Movement
          </h1>
          <p className="text-gray-600">
            Choose your membership or class pack to get started
          </p>
        </div>
      </section>
      
      {/* Category Tabs */}
      {availableCategories.length > 1 && (
        <div className="px-6 py-4 border-b border-gray-100 sticky top-[72px] z-20 bg-white">
          <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeCategory === category ? BRAND.primaryColor : undefined,
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
      <footer className="px-6 py-8 border-t border-gray-100 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-400 mb-2">
            Powered by
          </p>
          <p className="font-display text-xl" style={{ color: BRAND.primaryColor }}>
            gymsense
          </p>
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
