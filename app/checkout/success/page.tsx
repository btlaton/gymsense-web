/**
 * Checkout Success Page
 * 
 * Displayed after a successful Stripe checkout.
 * Fetches and displays purchase details.
 */

import { Suspense } from 'react';
import { CheckCircle2, Dumbbell, Calendar, Download, Mail } from 'lucide-react';

interface PageProps {
  searchParams: { session_id?: string };
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-20 h-20 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-6" />
      <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-3/4 mx-auto mb-4" />
      <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mx-auto mb-8" />
      <div className="h-32 bg-stone-200 dark:bg-stone-700 rounded mb-6" />
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
  let error = null;

  try {
    const response = await fetch(`${baseUrl}/api/checkout-session?session_id=${sessionId}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      sessionData = await response.json();
    }
  } catch (e) {
    console.error('Failed to fetch session:', e);
    error = 'Could not load purchase details';
  }

  // Extract relevant data
  const customerEmail = sessionData?.session?.customer_details?.email;
  const customerName = sessionData?.session?.customer_details?.name;
  const amountTotal = sessionData?.session?.amount_total;
  const lineItems = sessionData?.session?.line_items?.data || [];
  const gymName = sessionData?.gym?.name || 'the gym';

  return (
    <>
      {/* Success Icon */}
      <div className="flex justify-center mb-6 animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-check-bounce">
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2 animate-fade-in-up">
        Payment Successful!
      </h1>
      
      <p className="text-stone-600 dark:text-stone-400 mb-8 animate-fade-in-up delay-100">
        {customerName ? `Thanks, ${customerName.split(' ')[0]}!` : 'Thank you for your purchase!'}
        {' '}Your payment has been processed.
      </p>

      {/* Purchase Summary Card */}
      {(lineItems.length > 0 || amountTotal) && (
        <div className="w-full max-w-md mx-auto mb-8 animate-fade-in-up delay-200">
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-700">
              <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                Order Summary
              </h2>
            </div>
            
            <div className="px-6 py-4 space-y-3">
              {lineItems.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-stone-900 dark:text-stone-100">
                      {item.description || item.price?.product?.name || 'Item'}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                    )}
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
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
            
            {amountTotal && (
              <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-700">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-stone-700 dark:text-stone-300">Total Paid</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ${(amountTotal / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation email notice */}
      {customerEmail && (
        <div className="flex items-center justify-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-8 animate-fade-in-up delay-300">
          <Mail className="w-4 h-4" />
          <span>Confirmation sent to <strong className="text-stone-700 dark:text-stone-300">{customerEmail}</strong></span>
        </div>
      )}

      {/* Next Steps */}
      <div className="w-full max-w-md mx-auto animate-fade-in-up delay-400">
        <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4 text-center">
          What&apos;s Next
        </h3>
        
        <div className="space-y-3">
          <NextStepCard
            icon={<Download className="w-5 h-5" />}
            title="Download the App"
            description="Get the GymSense Member app to manage your membership"
            href="https://apps.apple.com/app/gymsense-member"
            primary
          />
          
          <NextStepCard
            icon={<Calendar className="w-5 h-5" />}
            title="Book Your First Session"
            description="Schedule a workout or training session"
            href="#"
          />
          
          <NextStepCard
            icon={<Dumbbell className="w-5 h-5" />}
            title="Visit the Gym"
            description={`Head to ${gymName} and check in with the app`}
            href="#"
          />
        </div>
      </div>
    </>
  );
}

function NextStepCard({
  icon,
  title,
  description,
  href,
  primary = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      className={`block p-4 rounded-xl border transition-all duration-200 ${
        primary
          ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-emerald-300 dark:hover:border-emerald-700'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${
          primary 
            ? 'bg-emerald-500' 
            : 'bg-stone-100 dark:bg-stone-700 text-emerald-600 dark:text-emerald-400'
        }`}>
          {icon}
        </div>
        <div>
          <h4 className={`font-semibold ${
            primary ? 'text-white' : 'text-stone-900 dark:text-stone-100'
          }`}>
            {title}
          </h4>
          <p className={`text-sm ${
            primary ? 'text-emerald-100' : 'text-stone-500 dark:text-stone-400'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function CheckoutSuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams.session_id;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-lg text-center">
        {/* GymSense Logo */}
        <div className="mb-8 animate-fade-in-up">
          <span className="font-display text-3xl text-emerald-600">GymSense</span>
        </div>

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
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2 animate-fade-in-up">
              Payment Successful!
            </h1>
            
            <p className="text-stone-600 dark:text-stone-400 mb-8 animate-fade-in-up delay-100">
              Thank you for your purchase. A confirmation email is on its way.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

