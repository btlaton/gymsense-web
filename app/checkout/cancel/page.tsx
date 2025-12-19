/**
 * Checkout Cancel Page
 * 
 * Simple page shown when a customer cancels checkout or payment fails.
 * Displayed in the context of being at the gym - keep it simple.
 */

import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-lg text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6 animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 bg-stone-400/20 rounded-full blur-xl" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-stone-300 to-stone-500 dark:from-stone-600 dark:to-stone-800 rounded-full flex items-center justify-center shadow-lg">
              <XCircle className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-3 animate-fade-in-up">
          Payment Cancelled
        </h1>
        
        <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 animate-fade-in-up delay-100">
          No worries — you haven&apos;t been charged.
        </p>

        {/* Helpful Note */}
        <div className="w-full max-w-sm mx-auto animate-fade-in-up delay-200">
          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 px-6 py-5">
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Scan the QR code again to retry, or ask a staff member for help.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
