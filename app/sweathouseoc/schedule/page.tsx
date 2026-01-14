/**
 * Sweathouse OC - Schedule Page (Schedule-First Checkout Flow)
 * 
 * This page shows the class schedule first, allowing users to:
 * 1. Browse classes by date
 * 2. Expand a class card to see details + instructor bio
 * 3. Book the class → opens checkout drawer
 * 4. Complete purchase + booking in single flow
 * 
 * URL: gymsense.io/sweathouseoc/schedule
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement, 
  LinkAuthenticationElement,
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { 
  X, Check, Loader2, ChevronRight, ChevronDown, ChevronUp,
  AlertCircle, Download, Clock, User, Users
} from 'lucide-react';
import { format, addDays, parseISO, startOfDay, isSameDay } from 'date-fns';

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

// Password protection for alpha testing
const ALPHA_PASSWORD = 'sweat2026';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51S7G4iDJJF9sHVx312eC7oFWkQFnpNlGifi56gjq5aMF3Xc8uE56jVpWzQBXKqHDGutJV5X3gsbcEM1XjYcMJ5lB00wHb3ZS9l';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY, {
  stripeAccount: BRAND.stripeAccountId,
});

// ============================================================================
// TYPES
// ============================================================================

interface ClassInstance {
  id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  booked_count: number;
  status: string;
  class_definition: {
    id: string;
    name: string;
    description: string | null;
    class_type: string;
    default_duration_minutes: number;
  };
  instructor: {
    id: string;
    name: string;
  } | null;
}

interface StudioInstructor {
  id: string;
  name: string;
  photo_url: string | null;
  bio: string | null;
  title: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: string;
  recurring: boolean;
  sessions_included: number | null;
  is_intro_offer: boolean;
  stripe_price_id: string | null;
}

// ============================================================================
// CHECKOUT FORM COMPONENT
// ============================================================================

function CheckoutForm({ 
  product, 
  classInstance,
  onSuccess, 
  onError,
  isRecurring,
}: { 
  product: Product;
  classInstance: ClassInstance;
  onSuccess: (email: string, name: string) => void;
  onError: (msg: string) => void;
  isRecurring: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [validatingPhone, setValidatingPhone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    if (!customerName.trim()) {
      onError('Please enter your name');
      return;
    }
    
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      onError('Please enter a valid phone number');
      return;
    }
    
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      onError('Please enter a valid email address');
      return;
    }
    
    if (!termsAccepted) {
      onError('Please accept the terms');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Validate intro offer eligibility (phone check)
      if (product.is_intro_offer) {
        setValidatingPhone(true);
        const validation = await fetch(`${SUPABASE_URL}/functions/v1/validate-intro-eligibility`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            phone: customerPhone.replace(/\D/g, ''),
            gymId: BRAND.gymId,
            productId: product.id,
          }),
        });
        
        const validationResult = await validation.json();
        setValidatingPhone(false);
        
        if (!validationResult.eligible) {
          throw new Error(validationResult.reason || 'Not eligible for intro offer');
        }
      }

      // Submit the form to validate all fields
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message || 'Please complete all required fields');
      }

      // Confirm the payment with billing details and receipt_email
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/sweathouseoc/schedule?success=true`,
          receipt_email: customerEmail,
          payment_method_data: {
            billing_details: {
              name: customerName.trim(),
              email: customerEmail,
              phone: customerPhone.replace(/\D/g, ''),
            },
          },
        },
        redirect: 'if_required',
      });
      
      if (confirmError) {
        throw new Error(confirmError.message || 'Payment failed');
      }
      
      if (paymentIntent?.status === 'succeeded') {
        onSuccess(customerEmail, customerName.trim());
      }
      
    } catch (err) {
      console.error('Payment error:', err);
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
      setValidatingPhone(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Your full name"
          required
          className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333',
          }}
        />
      </div>
      
      {/* Phone */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Phone</label>
        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="(555) 555-5555"
          required
          className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333',
          }}
        />
      </div>
      
      {/* Email */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Email</label>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333',
          }}
        />
      </div>
      
      {/* Payment */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Payment</label>
        <PaymentElement 
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                name: 'never',
                email: 'never',
                phone: 'never',
                address: 'auto',
              }
            },
          }}
        />
      </div>
      
      {/* Terms */}
      <div>
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
            I agree to the cancellation policy and membership terms
          </span>
        </label>
      </div>
      
      {/* Submit */}
      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
        style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {validatingPhone ? 'Validating...' : 'Processing...'}
          </span>
        ) : (
          `Complete Booking - $${product.price.toFixed(2)}${product.recurring ? '/mo' : ''}`
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
  classInstance: ClassInstance | null;
  products: Product[];
  instructors: StudioInstructor[];
}

function CheckoutDrawer({ isOpen, onClose, classInstance, products, instructors }: CheckoutDrawerProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  // Get intro offer product as default
  const introProduct = useMemo(() => 
    products.find(p => p.is_intro_offer) || products[0],
    [products]
  );

  // Reset state when drawer opens/closes
  useEffect(() => {
    if (isOpen && classInstance && !selectedProduct) {
      setSelectedProduct(introProduct);
      setError(null);
      setSuccess(false);
      setClientSecret(null);
    } else if (!isOpen) {
      // Delay reset for animation
      const timer = setTimeout(() => {
        setSelectedProduct(null);
        setClientSecret(null);
        setError(null);
        setSuccess(false);
        setCustomerEmail('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, classInstance, introProduct, selectedProduct]);

  // Create checkout when product is selected (for one-off) or when email provided (for recurring)
  const createCheckout = useCallback(async (product: Product, email?: string) => {
    if (!classInstance) return;
    
    setLoadingCheckout(true);
    setError(null);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-booking-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          gymId: BRAND.gymId,
          productId: product.id,
          classInstanceId: classInstance.id,
          email: product.recurring ? email : undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        if (data.requiresEmail) {
          // Recurring product needs email first - will handle in UI
          setLoadingCheckout(false);
          return;
        }
        throw new Error(data.error || 'Failed to initialize checkout');
      }
      
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error('Checkout init error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize checkout');
    } finally {
      setLoadingCheckout(false);
    }
  }, [classInstance]);

  // Create checkout when product changes (for one-off products)
  useEffect(() => {
    if (isOpen && selectedProduct && classInstance && !selectedProduct.recurring) {
      createCheckout(selectedProduct);
    }
  }, [isOpen, selectedProduct, classInstance, createCheckout]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(false);
    setClientSecret(null);
    
    if (!product.recurring) {
      createCheckout(product);
    }
  };

  const handleSuccess = useCallback((email: string) => {
    setCustomerEmail(email);
    setSuccess(true);
  }, []);

  const handleError = useCallback((msg: string) => setError(msg), []);

  // Get instructor details
  const instructor = useMemo(() => {
    if (!classInstance?.instructor) return null;
    return instructors.find(i => i.name === classInstance.instructor?.name) || null;
  }, [classInstance, instructors]);

  if (!isOpen || !classInstance) return null;

  const classDate = format(parseISO(classInstance.starts_at), 'EEEE, MMMM d');
  const classTime = format(parseISO(classInstance.starts_at), 'h:mm a');
  const spotsRemaining = classInstance.capacity - (classInstance.booked_count || 0);

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
          bottom-0 left-0 right-0 rounded-t-3xl max-h-[95vh] overflow-y-auto
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
          <h2 className="text-lg font-semibold text-white">Book Class</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Class Summary */}
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
            <h3 className="font-semibold text-white text-lg">{classInstance.class_definition.name}</h3>
            <p className="text-gray-400 text-sm mt-1">
              {classDate} @ {classTime}
            </p>
            {classInstance.instructor && (
              <p className="text-gray-400 text-sm">with {classInstance.instructor.name}</p>
            )}
            <p className="text-xs mt-2" style={{ color: BRAND.primaryColor }}>
              {spotsRemaining} {spotsRemaining === 1 ? 'spot' : 'spots'} remaining
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg text-red-400 text-sm flex items-start gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
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
              
              <h3 className="text-xl font-bold text-white mb-2">You&apos;re Booked!</h3>
              <p className="text-gray-400 mb-4">
                {classInstance.class_definition.name} on {classDate} @ {classTime}
              </p>
              
              {/* App Download Instructions */}
              <div className="rounded-xl p-4 text-left mb-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4" style={{ color: BRAND.primaryColor }} />
                  Download the Gymsense Member App
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Use the app to check in when you arrive and manage your bookings.</p>
                  <p className="text-white">Check your email for your 4-digit setup code!</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <a
                    href={APP_LINKS.ios}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-medium text-sm border transition-all hover:bg-white/5"
                    style={{ borderColor: '#333', color: '#fff' }}
                  >
                    iPhone
                  </a>
                  <a
                    href={APP_LINKS.android}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-medium text-sm border transition-all hover:bg-white/5"
                    style={{ borderColor: '#333', color: '#fff' }}
                  >
                    Android
                  </a>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-gray-500 text-sm hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          )}
          
          {/* Checkout Form */}
          {!success && (
            <>
              {/* Selected Product */}
              {selectedProduct && (
                <div className="mb-4">
                  <div 
                    className="p-4 rounded-xl flex justify-between items-center"
                    style={{ backgroundColor: '#1a1a1a', border: `2px solid ${BRAND.primaryColor}` }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{selectedProduct.name}</span>
                        {selectedProduct.is_intro_offer && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
                          >
                            INTRO
                          </span>
                        )}
                      </div>
                      {selectedProduct.sessions_included && (
                        <p className="text-sm text-gray-400">{selectedProduct.sessions_included} classes</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold" style={{ color: BRAND.primaryColor }}>
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                      {selectedProduct.recurring && (
                        <span className="text-xs text-gray-400">/mo</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="mt-2 text-sm hover:underline flex items-center gap-1"
                    style={{ color: BRAND.primaryColor }}
                  >
                    View other options <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* Loading */}
              {loadingCheckout && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND.primaryColor }} />
                </div>
              )}
              
              {/* Payment Form */}
              {!loadingCheckout && clientSecret && selectedProduct && (
                <Elements 
                  stripe={stripePromise} 
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: { 
                        colorPrimary: BRAND.primaryColor,
                        colorBackground: '#1a1a1a',
                        colorText: '#ffffff',
                        colorTextSecondary: '#9ca3af',
                        colorDanger: '#ef4444',
                        fontFamily: 'Roboto, system-ui, sans-serif',
                        borderRadius: '8px',
                      },
                      rules: {
                        '.Input': {
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                        },
                        '.Input:focus': {
                          border: `1px solid ${BRAND.primaryColor}`,
                          boxShadow: `0 0 0 1px ${BRAND.primaryColor}`,
                        },
                        '.Label': {
                          color: '#9ca3af',
                        },
                      },
                    },
                  }}
                >
                  <CheckoutForm 
                    product={selectedProduct}
                    classInstance={classInstance}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    isRecurring={selectedProduct.recurring}
                  />
                </Elements>
              )}
              
              {/* Recurring product - need email first */}
              {!loadingCheckout && !clientSecret && selectedProduct?.recurring && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    For memberships, please enter your email to continue.
                  </p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    onBlur={(e) => {
                      if (e.target.value && e.target.value.includes('@')) {
                        createCheckout(selectedProduct, e.target.value);
                      }
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Product Selection Modal */}
      {showProductModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 z-50"
            onClick={() => setShowProductModal(false)}
          />
          <div 
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-2xl"
            style={{ backgroundColor: '#111111', border: '1px solid #333' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Select an Option</h3>
              <button onClick={() => setShowProductModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`w-full p-4 rounded-xl text-left transition-all`}
                  style={{ 
                    backgroundColor: '#1a1a1a', 
                    border: selectedProduct?.id === product.id 
                      ? `2px solid ${BRAND.primaryColor}` 
                      : '1px solid #333',
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{product.name}</span>
                        {product.is_intro_offer && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
                          >
                            INTRO
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-sm text-gray-400 mt-1">{product.description}</p>
                      )}
                      {product.sessions_included && (
                        <p className="text-sm text-gray-400">{product.sessions_included} classes</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span className="font-bold" style={{ color: BRAND.primaryColor }}>
                        ${product.price.toFixed(2)}
                      </span>
                      {product.recurring && (
                        <span className="text-xs text-gray-400">/mo</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ============================================================================
// CLASS CARD COMPONENT
// ============================================================================

interface ClassCardProps {
  classInstance: ClassInstance;
  instructor: StudioInstructor | null;
  isExpanded: boolean;
  onToggle: () => void;
  onBook: () => void;
}

function ClassCard({ classInstance, instructor, isExpanded, onToggle, onBook }: ClassCardProps) {
  const time = format(parseISO(classInstance.starts_at), 'h:mm a');
  const spotsRemaining = classInstance.capacity - (classInstance.booked_count || 0);
  const isFull = spotsRemaining <= 0;
  
  return (
    <div 
      className="rounded-xl overflow-hidden transition-all"
      style={{ backgroundColor: BRAND.cardBackground, border: '1px solid #333' }}
    >
      {/* Main Row - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
      >
        {/* Time */}
        <div className="w-20 flex-shrink-0">
          <span className="font-semibold text-white">{time}</span>
        </div>
        
        {/* Class Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">
            {classInstance.class_definition.name}
          </h3>
          {classInstance.instructor && (
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <User className="w-3 h-3" />
              {classInstance.instructor.name}
            </p>
          )}
        </div>
        
        {/* Spots */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span 
            className={`text-sm ${isFull ? 'text-red-400' : ''}`}
            style={{ color: isFull ? undefined : BRAND.primaryColor }}
          >
            {isFull ? 'Full' : `${spotsRemaining} remaining`}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-800">
          {/* Description */}
          {classInstance.class_definition.description && (
            <p className="text-gray-400 text-sm mt-4 mb-4">
              {classInstance.class_definition.description}
            </p>
          )}
          
          {/* Instructor Bio */}
          {instructor && (
            <div className="flex gap-4 mb-4 p-3 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
              {instructor.photo_url ? (
                <img 
                  src={instructor.photo_url} 
                  alt={instructor.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: BRAND.primaryColor }}
                >
                  <User className="w-8 h-8 text-black" />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-semibold text-white">{instructor.name}</h4>
                {instructor.title && (
                  <p className="text-sm" style={{ color: BRAND.primaryColor }}>{instructor.title}</p>
                )}
                {instructor.bio && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-3">{instructor.bio}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Book Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            disabled={isFull}
            className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
          >
            {isFull ? 'Class Full' : 'Book This Class'}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SweatHouseSchedulePage() {
  // Password protection state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassInstance[]>([]);
  const [instructors, setInstructors] = useState<StudioInstructor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [checkoutClass, setCheckoutClass] = useState<ClassInstance | null>(null);

  // Check localStorage for previous authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gymsense_alpha_auth');
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ALPHA_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gymsense_alpha_auth', 'true');
      }
    } else {
      setPasswordError(true);
    }
  };

  // Password gate UI
  if (!isAuthenticated) {
    return (
      <main 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: BRAND.backgroundColor, fontFamily: 'Roboto, system-ui, sans-serif' }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img 
              src={BRAND.logoUrl}
              alt="Sweathouse OC"
              className="h-12 object-contain mx-auto mb-6"
            />
            <h1 className="text-xl font-bold text-white mb-2">Alpha Testing</h1>
            <p className="text-gray-400 text-sm">Enter password to continue</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: '#1a1a1a', 
                border: passwordError ? '1px solid #ef4444' : '1px solid #333',
              }}
            />
            {passwordError && (
              <p className="text-red-400 text-sm">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold transition-all"
              style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
            >
              Continue
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Generate date options (next 14 days)
  const dateOptions = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(startOfDay(new Date()), i));
    }
    return dates;
  }, []);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      // Fetch class instances for next 14 days
      const startDate = startOfDay(new Date()).toISOString();
      const endDate = addDays(new Date(), 14).toISOString();
      
      const { data: classesData } = await supabase
        .from('class_instances')
        .select(`
          id, starts_at, ends_at, capacity, booked_count, status,
          class_definition:class_definitions(id, name, description, class_type, default_duration_minutes),
          instructor:team!class_instances_instructor_id_fkey(id, name)
        `)
        .eq('gym_id', BRAND.gymId)
        .eq('status', 'scheduled')
        .gte('starts_at', startDate)
        .lte('starts_at', endDate)
        .order('starts_at');
      
      if (classesData) {
        setClasses(classesData as unknown as ClassInstance[]);
      }
      
      // Fetch instructors
      const { data: instructorsData } = await supabase
        .from('studio_instructors')
        .select('id, name, photo_url, bio, title')
        .eq('gym_id', BRAND.gymId)
        .eq('is_active', true);
      
      if (instructorsData) {
        setInstructors(instructorsData);
      }
      
      // Fetch products (class packs and memberships)
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, description, price, type, recurring, sessions_included, is_intro_offer, stripe_price_id')
        .eq('gym_id', BRAND.gymId)
        .eq('is_active', true)
        .in('type', ['class_pack', 'membership'])
        .order('price');
      
      if (productsData) {
        // Sort with intro offer first
        const sorted = [...productsData].sort((a, b) => {
          if (a.is_intro_offer && !b.is_intro_offer) return -1;
          if (!a.is_intro_offer && b.is_intro_offer) return 1;
          return a.price - b.price;
        });
        setProducts(sorted);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, []);

  // Filter classes for selected date
  const classesForDate = useMemo(() => {
    return classes.filter(c => 
      isSameDay(parseISO(c.starts_at), selectedDate)
    );
  }, [classes, selectedDate]);

  // Get instructor by name
  const getInstructor = useCallback((name: string | undefined) => {
    if (!name) return null;
    return instructors.find(i => i.name === name) || null;
  }, [instructors]);

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
          <p className="text-gray-400">Loading schedule...</p>
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
      <section className="px-6 py-8 text-center" style={{ borderBottom: '1px solid #222' }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-wide">
            Book Your First Class
          </h1>
          <p className="text-gray-400 text-sm">
            Browse our schedule and reserve your spot
          </p>
        </div>
      </section>
      
      {/* Date Picker */}
      <div 
        className="px-4 py-3 sticky top-[72px] z-20 overflow-x-auto"
        style={{ backgroundColor: BRAND.backgroundColor, borderBottom: '1px solid #222' }}
      >
        <div className="flex gap-2 max-w-2xl mx-auto">
          {dateOptions.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const dayName = format(date, 'EEE');
            const dayNum = format(date, 'd');
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[52px] transition-all ${
                  isSelected ? 'text-black' : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? BRAND.primaryColor : 'transparent',
                  border: isSelected ? 'none' : '1px solid #333',
                }}
              >
                <span className="text-xs font-medium uppercase">{dayName}</span>
                <span className="text-lg font-bold">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Schedule */}
      <section className="px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h2>
          
          {classesForDate.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No classes scheduled for this day.
            </div>
          ) : (
            <div className="space-y-3">
              {classesForDate.map((classInstance) => (
                <ClassCard
                  key={classInstance.id}
                  classInstance={classInstance}
                  instructor={getInstructor(classInstance.instructor?.name)}
                  isExpanded={expandedClassId === classInstance.id}
                  onToggle={() => setExpandedClassId(
                    expandedClassId === classInstance.id ? null : classInstance.id
                  )}
                  onBook={() => setCheckoutClass(classInstance)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-6 py-8 mt-8" style={{ borderTop: '1px solid #222' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-2">Already have credits?</p>
          <p className="text-sm text-gray-400">
            Download the <span style={{ color: BRAND.primaryColor }}>Gymsense</span> app to book
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a href={APP_LINKS.ios} className="text-sm underline" style={{ color: BRAND.primaryColor }}>
              iPhone
            </a>
            <a href={APP_LINKS.android} className="text-sm underline" style={{ color: BRAND.primaryColor }}>
              Android
            </a>
          </div>
        </div>
      </footer>
      
      {/* Checkout Drawer */}
      <CheckoutDrawer
        isOpen={!!checkoutClass}
        onClose={() => setCheckoutClass(null)}
        classInstance={checkoutClass}
        products={products}
        instructors={instructors}
      />
    </main>
  );
}
