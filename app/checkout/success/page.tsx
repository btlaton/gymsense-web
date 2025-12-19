/**
 * Checkout Success Page
 * 
 * Styled to match the Pro app's success modal exactly.
 * Shows order total and customer name.
 */

import { Check } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

// Fetch session details from Stripe via Supabase edge function
async function getSessionDetails(sessionId: string) {
  try {
    // Call our Supabase edge function directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase config');
      return null;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/get-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ session_id: sessionId }),
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Session data:', data);
      return data;
    } else {
      console.error('Failed to fetch session:', await response.text());
    }
  } catch (e) {
    console.error('Failed to fetch session:', e);
  }
  return null;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;
  
  let customerName: string | null = null;
  let amountTotal: number | null = null;
  
  if (sessionId) {
    const data = await getSessionDetails(sessionId);
    customerName = data?.session?.customer_details?.name || null;
    amountTotal = data?.session?.amount_total || null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50">
      <div className="flex flex-col items-center w-full max-w-sm">
        {/* Green Checkmark Circle - matches Pro app */}
        <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-lg">
          <Check className="w-16 h-16 text-white" strokeWidth={3} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-stone-900 mb-1">
          Order Confirmed!
        </h1>
        
        {/* Subtitle */}
        <p className="text-stone-500 mb-10">
          Payment was processed successfully
        </p>

        {/* Order Summary Card - matches Pro app */}
        <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
          {/* Order Total Row */}
          <div className="flex justify-between items-center px-5 py-4">
            <span className="text-stone-600">Order Total</span>
            <span className="text-3xl font-bold text-stone-900">
              {amountTotal 
                ? `$${(amountTotal / 100).toFixed(2)}`
                : '—'
              }
            </span>
          </div>
          
          {/* Divider */}
          <div className="border-t border-stone-100 mx-5" />
          
          {/* Paid By Row */}
          <div className="px-5 py-4">
            <span className="text-stone-500">
              {customerName 
                ? `Paid by ${customerName}`
                : 'Payment received'
              }
            </span>
          </div>
        </div>

        {/* Done Button - matches Pro app (just closes the browser tab) */}
        <a 
          href="about:blank"
          className="px-16 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg rounded-full shadow-md transition-colors text-center"
        >
          Done
        </a>
        
        {/* Hint text */}
        <p className="text-stone-400 text-sm mt-4">
          You can close this page
        </p>
      </div>
    </main>
  );
}
