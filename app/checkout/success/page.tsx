/**
 * Checkout Success Page
 * 
 * Simple confirmation page shown after successful payment at the gym.
 * Displays gym name and purchase summary - no CTAs or next steps needed.
 */

import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PageProps {
  searchParams: { session_id?: string };
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-20 h-20 bg-stone-200 dark:bg-stone-700 rounded-full mb-6" />
      <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-48 mb-3" />
      <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded w-64 mb-8" />
      <div className="h-24 bg-stone-200 dark:bg-stone-700 rounded w-full max-w-sm" />
    </div>
  );
}

// Purchase details component (fetches data)
async function PurchaseDetails({ sessionId }: { sessionId: string }) {
  // Fetch checkout session details from our API
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  let sessionData = null;

  try {
    const response = await fetch(`${baseUrl}/api/checkout-session?session_id=${sessionId}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      sessionData = await response.json();
    }
  } catch (e) {
    console.error('Failed to fetch session:', e);
  }

  // Extract relevant data
  const customerName = sessionData?.session?.customer_details?.name;
  const amountTotal = sessionData?.session?.amount_total;
  const lineItems = sessionData?.session?.line_items?.data || [];
  
  // Hardcoded for now - single gym deployment
  const gymName = 'The Atlas Gym';

  return (
    <>
      {/* Success Icon */}
      <div className="flex justify-center mb-6 animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-check-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2 animate-fade-in-up">
        Payment Successful
      </h1>
      
      <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 animate-fade-in-up delay-100">
        {customerName 
          ? `Thank you, ${customerName.split(' ')[0]}!` 
          : 'Thank you for your purchase!'}
      </p>

      {/* Purchase Summary Card */}
      {(lineItems.length > 0 || amountTotal) && (
        <div className="w-full max-w-sm mx-auto animate-fade-in-up delay-200">
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
            {/* Gym Name Header */}
            {gymName && (
              <div className="px-5 py-4 bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-700">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 text-center">
                  {gymName}
                </p>
              </div>
            )}
            
            {/* Items */}
            <div className="px-5 py-4 space-y-3">
              {lineItems.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                      {item.description || item.price?.product?.name || 'Item'}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        Qty: {item.quantity}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                    ${((item.amount_total || 0) / 100).toFixed(2)}
                  </p>
                </div>
              ))}
              
              {lineItems.length === 0 && amountTotal && (
                <div className="flex justify-between items-center">
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    Purchase
                  </p>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    ${(amountTotal / 100).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            
            {/* Total */}
            {amountTotal && (
              <div className="px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 border-t border-stone-100 dark:border-stone-700">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-stone-700 dark:text-stone-300">Total</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${(amountTotal / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function CheckoutSuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams.session_id;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-lg text-center">
        {sessionId ? (
          <Suspense fallback={<LoadingSkeleton />}>
            <PurchaseDetails sessionId={sessionId} />
          </Suspense>
        ) : (
          // No session ID - still show success
          <>
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2 animate-fade-in-up">
              Payment Successful
            </h1>
            
            <p className="text-lg text-stone-600 dark:text-stone-400 animate-fade-in-up delay-100">
              Thank you for your purchase!
            </p>
          </>
        )}
      </div>
    </main>
  );
}
