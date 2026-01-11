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
import { 
  Elements, 
  CardElement, 
  PaymentRequestButtonElement,
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { 
  X, Check, Loader2, ChevronRight, Mail, 
  Clock, Zap, Repeat, AlertCircle,
  Download
} from 'lucide-react';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Supabase config - anon key is public (safe to expose)
const SUPABASE_URL = 'https://ldwwiiiskujewcluclbx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkd3dpaWlza3VqZXdjbHVjbGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODg1MzksImV4cCI6MjA3OTA2NDUzOX0.6hErpbUmhLocUTnkPz09P_UBOCd-WL-ZrvcJkm9qt3c';

// Sweathouse branding - matches sweathouseoc.com
const BRAND = {
  primaryColor: '#1FB9D9',      // Teal accent
  secondaryColor: '#FFFFFF',    // White text
  backgroundColor: '#000000',   // Black background
  cardBackground: '#111111',    // Slightly lighter for cards
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

// Stripe publishable key (platform key, not connected account)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51S7G4iDJJF9sHVx312eC7oFWkQFnpNlGifi56gjq5aMF3Xc8uE56jVpWzQBXKqHDGutJV5X3gsbcEM1XjYcMJ5lB00wHb3ZS9l';

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY, {
      stripeAccount: BRAND.stripeAccountId,
    });
  }
  return stripePromise;
}


// ============================================================================
// CHECKOUT FORM (inside Elements provider)
// ============================================================================

interface CheckoutFormInnerProps {
  product: Product;
  email: string;
  setEmail: (email: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  agreement: AgreementTemplate | null;
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutFormInner({ 
  product, 
  email, 
  setEmail,
  termsAccepted, 
  setTermsAccepted, 
  agreement,
  clientSecret,
  onSuccess,
  onError
}: CheckoutFormInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  const isEmailValid = email.includes('@') && email.includes('.');
  const canSubmit = stripe && elements && isEmailValid && termsAccepted && !processing;

  // Set up Apple Pay / Google Pay
  useEffect(() => {
    if (!stripe || !product) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: product.name,
        amount: Math.round(product.price * 100),
      },
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      if (!stripe || !clientSecret) return;
      
      // Confirm with the payment method from Apple Pay
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false }
      );

      if (error) {
        ev.complete('fail');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'requires_action') {
        ev.complete('success');
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
        if (confirmError) {
          onError(confirmError.message || 'Payment failed');
        } else {
          onSuccess();
        }
      } else {
        ev.complete('success');
        onSuccess();
      }
    });
  }, [stripe, product, elements, clientSecret, onSuccess, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !canSubmit || !clientSecret) return;
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);
    
    try {
      const { error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { email },
          },
          receipt_email: email,
        }
      );
      
      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-white placeholder:text-gray-500"
            style={{ 
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
            }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          We&apos;ll send your confirmation and setup code here.
        </p>
      </div>

      {/* Apple Pay / Google Pay Button */}
      {canMakePayment && paymentRequest && (
        <div>
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'default',
                  theme: 'light',
                  height: '48px',
                },
              },
            }}
          />
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-500">or enter card manually</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>
        </div>
      )}

      {/* Simple Card Element */}
      <div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                fontFamily: 'Roboto, system-ui, sans-serif',
                '::placeholder': {
                  color: '#6b7280',
                },
                iconColor: '#6b7280',
              },
              invalid: {
                color: '#ef4444',
                iconColor: '#ef4444',
              },
            },
            hidePostalCode: true,
          }}
          className="p-4 rounded-lg"
          id="card-element"
        />
        <style jsx global>{`
          #card-element {
            background-color: #1a1a1a;
            border: 1px solid #333;
          }
          #card-element.StripeElement--focus {
            border-color: ${BRAND.primaryColor};
          }
        `}</style>
      </div>

      {/* Terms */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => setTermsAccepted(!termsAccepted)}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-4 rounded-lg font-semibold text-lg uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          backgroundColor: BRAND.primaryColor,
          color: '#000000',
        }}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay $${product.price.toFixed(2)}${product.billing_mode === 'recurring' ? '/mo' : ''}`
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
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // We'll create PaymentIntent after email is entered (triggered from form)

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail('');
        setTermsAccepted(false);
        setClientSecret(null);
        setError(null);
        setSuccess(false);
      }, 300);
    }
  }, [isOpen]);

  const createPaymentIntent = useCallback(async () => {
    if (!product) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Creating PaymentIntent for:', product.name, product.price);
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-web-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          gymId: BRAND.gymId,
          productId: product.id,
        }),
      });
      
      const data = await response.json();
      console.log('PaymentIntent response:', data);
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error('No client secret returned');
      }
    } catch (err) {
      console.error('PaymentIntent error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize checkout');
    } finally {
      setLoading(false);
    }
  }, [product]);

  // Create PaymentIntent when drawer opens
  useEffect(() => {
    if (isOpen && product && !clientSecret && !loading) {
      createPaymentIntent();
    }
  }, [isOpen, product, clientSecret, loading, createPaymentIntent]);

  const handleSuccess = () => {
    setSuccess(true);
  };

  const handleError = (errorMessage: string) => {
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
              <p className="text-gray-400 mb-6">
                Check your email for your confirmation and setup code.
              </p>
              
              <div className="rounded-xl p-4 text-left mb-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                <h4 className="font-semibold text-white mb-3">Next Steps</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-black text-sm font-semibold"
                      style={{ backgroundColor: BRAND.primaryColor }}
                    >
                      1
                    </div>
                    <p className="text-sm text-gray-400">
                      Download the <strong className="text-white">Gymsense Member</strong> app
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-black text-sm font-semibold"
                      style={{ backgroundColor: BRAND.primaryColor }}
                    >
                      2
                    </div>
                    <p className="text-sm text-gray-400">
                      Enter your 4-digit setup code from your email
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-black text-sm font-semibold"
                      style={{ backgroundColor: BRAND.primaryColor }}
                    >
                      3
                    </div>
                    <p className="text-sm text-gray-400">
                      Book your classes and check in when you arrive!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <a
                  href={APP_LINKS.ios}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-black uppercase tracking-wide transition-all hover:opacity-90"
                  style={{ backgroundColor: BRAND.primaryColor }}
                >
                  <Download className="w-5 h-5" />
                  Download for iPhone
                </a>
                <a
                  href={APP_LINKS.android}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold border transition-all hover:bg-white/5"
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
          
          {/* Single-Screen Checkout Form */}
          {!loading && !success && clientSecret && (
            <Elements 
              stripe={getStripe()} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: BRAND.primaryColor,
                    fontFamily: 'Roboto, system-ui, sans-serif',
                    colorBackground: '#1a1a1a',
                    colorText: '#ffffff',
                    colorTextSecondary: '#9ca3af',
                    borderRadius: '8px',
                  },
                  rules: {
                    '.Input': {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                    },
                    '.Tab': {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                    },
                    '.Tab--selected': {
                      backgroundColor: '#2a2a2a',
                      borderColor: BRAND.primaryColor,
                    },
                  },
                },
              }}
            >
              <CheckoutFormInner
                product={product}
                email={email}
                setEmail={setEmail}
                termsAccepted={termsAccepted}
                setTermsAccepted={setTermsAccepted}
                agreement={agreement}
                clientSecret={clientSecret}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </Elements>
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

// Password for alpha testing
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

  // Show password gate if not authenticated
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
        
        // Set initial category based on what products exist (priority: membership first)
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

  // Get products by category, intro offers first
  const categoryProducts = products
    .filter(p => p.type === activeCategory)
    .sort((a, b) => {
      // Intro offers first
      if (a.is_intro_offer && !b.is_intro_offer) return -1;
      if (!a.is_intro_offer && b.is_intro_offer) return 1;
      // Then by price
      return a.price - b.price;
    });
  
  // Get available categories (only show tabs for categories with products)
  // Ordered: Memberships -> Class Packs -> Private Sessions
  const categoryOrder: ProductCategory[] = ['membership', 'class_pack', 'private_session'];
  const availableCategories = categoryOrder.filter(cat => 
    products.some(p => p.type === cat)
  );
  
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
            Explore our thoughtfully designed pricing options, tailored to meet your fitness needs. Whether you&apos;re just starting out or a seasoned Lagree enthusiast, we have a package that fits your goals and lifestyle.
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
