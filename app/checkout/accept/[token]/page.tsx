/**
 * Agreement Acceptance Page
 * 
 * Landing page for customers to review and accept agreement terms
 * before proceeding to Stripe Checkout.
 * 
 * Flow:
 * 1. Fetch pending checkout data via Edge Function
 * 2. Display product info and agreement content
 * 3. Customer checks acceptance boxes
 * 4. On accept: call Edge Function to create Stripe session
 * 5. Redirect to Stripe Checkout
 * 
 * Part of Feature: Subscription Agreement Terms
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Check, FileText, ShoppingCart, AlertCircle, Loader2 } from 'lucide-react';

// Supabase Edge Function base URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ldwwiiiskujewcluclbx.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  type: string;
  billing_mode: 'one_off' | 'recurring';
}

interface Agreement {
  id: string;
  agreementType: string;
  name: string;
  content: string;
}

interface PendingCheckout {
  id: string;
  token: string;
  gymId: string;
  gymName: string;
  cartItems: CartItem[];
  totalCents: number;
  requiredAgreementTypes: string[];
  agreements: Agreement[];
  status: string;
  expiresAt: string;
  isExpired: boolean;
  successUrl: string;
  cancelUrl: string;
}

export default function AcceptAgreementPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<PendingCheckout | null>(null);
  const [acceptedAgreements, setAcceptedAgreements] = useState<Set<string>>(new Set());

  // Fetch pending checkout data
  useEffect(() => {
    async function fetchCheckout() {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/get-pending-checkout?token=${token}`, {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load checkout');
        }

        if (data.isExpired) {
          throw new Error('This checkout link has expired. Please request a new one.');
        }

        setCheckout(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchCheckout();
    }
  }, [token]);

  // Toggle agreement acceptance
  const toggleAgreement = (agreementType: string) => {
    setAcceptedAgreements(prev => {
      const next = new Set(prev);
      if (next.has(agreementType)) {
        next.delete(agreementType);
      } else {
        next.add(agreementType);
      }
      return next;
    });
  };

  // Check if all agreements are accepted
  const allAccepted = checkout?.requiredAgreementTypes.every(type => acceptedAgreements.has(type)) ?? false;

  // Handle continue to payment
  const handleContinue = async () => {
    if (!checkout || !allAccepted) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/accept-agreement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          token,
          acceptedAgreementTypes: Array.from(acceptedAgreements),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process agreement');
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to continue to payment');
      setSubmitting(false);
    }
  };

  // Format currency
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  // Strip HTML for plain text display (fallback)
  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&bull;/g, '•')
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&lsquo;|&rsquo;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&ndash;/g, '–')
      .replace(/&mdash;/g, '—')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-stone-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
          <p className="mt-4 text-stone-600">Loading checkout...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !checkout) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-stone-50">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Unable to Load Checkout
          </h1>
          <p className="text-stone-600 mb-6">
            {error || 'This checkout link is invalid or has expired.'}
          </p>
          <p className="text-stone-500 text-sm">
            Please ask the staff for a new checkout QR code.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-stone-950 text-white px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="font-display text-2xl text-emerald-500 mb-1">
            gymsense
          </div>
          <h1 className="text-lg font-medium text-stone-200">
            {checkout.gymName}
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Order Summary */}
        <section className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-stone-600" />
            <h2 className="text-lg font-semibold text-stone-900">Your Order</h2>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            {checkout.cartItems.map((item, index) => (
              <div 
                key={item.id}
                className={`px-5 py-4 flex justify-between items-start ${
                  index < checkout.cartItems.length - 1 ? 'border-b border-stone-100' : ''
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-stone-900">{item.name}</p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                  )}
                  {item.billing_mode === 'recurring' && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      Monthly Subscription
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-900">
                    {formatPrice(item.price * 100 * item.quantity)}
                  </p>
                  {item.billing_mode === 'recurring' && (
                    <p className="text-sm text-stone-500">/month</p>
                  )}
                </div>
              </div>
            ))}

            <div className="px-5 py-4 bg-stone-50 flex justify-between items-center border-t border-stone-200">
              <span className="font-medium text-stone-600">Total</span>
              <span className="text-xl font-bold text-stone-900">
                {formatPrice(checkout.totalCents)}
              </span>
            </div>
          </div>
        </section>

        {/* Agreements */}
        <section className="mb-8 animate-fade-in-up delay-100">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-stone-600" />
            <h2 className="text-lg font-semibold text-stone-900">Agreement Terms</h2>
          </div>

          <p className="text-stone-600 mb-4 text-sm">
            Please review and accept the following agreement{checkout.agreements.length > 1 ? 's' : ''} to continue:
          </p>

          <div className="space-y-4">
            {checkout.agreements.map((agreement) => {
              const isAccepted = acceptedAgreements.has(agreement.agreementType);

              return (
                <div 
                  key={agreement.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden"
                >
                  {/* Agreement Header */}
                  <div className="px-5 py-3 bg-stone-50 border-b border-stone-200">
                    <h3 className="font-semibold text-stone-900">{agreement.name}</h3>
                  </div>

                  {/* Agreement Content - Scrollable */}
                  <div className="px-5 py-4 max-h-64 overflow-y-auto">
                    <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {stripHtml(agreement.content)}
                    </div>
                  </div>

                  {/* Accept Checkbox */}
                  <div className="px-5 py-4 bg-stone-50 border-t border-stone-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => toggleAgreement(agreement.agreementType)}
                        className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          isAccepted 
                            ? 'bg-emerald-600 border-emerald-600' 
                            : 'bg-white border-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {isAccepted && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                      </button>
                      <span className="text-sm text-stone-700 select-none">
                        I have read and agree to the <span className="font-medium">{agreement.name}</span>
                      </span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Continue Button */}
        <div className="animate-fade-in-up delay-200">
          <button
            onClick={handleContinue}
            disabled={!allAccepted || submitting}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
              allAccepted && !submitting
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : allAccepted ? (
              'Continue to Payment'
            ) : (
              'Accept all agreements to continue'
            )}
          </button>

          <p className="text-center text-stone-500 text-sm mt-4">
            You will be redirected to a secure Stripe checkout page
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 px-6 py-8 mt-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-display text-xl text-emerald-600 mb-2">
            gymsense
          </div>
          <p className="text-sm">
            Powering modern gyms
          </p>
        </div>
      </footer>
    </main>
  );
}

