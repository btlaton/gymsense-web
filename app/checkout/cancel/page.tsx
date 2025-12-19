/**
 * Checkout Cancel Page
 * 
 * Displayed when a user cancels checkout or payment fails.
 */

import { XCircle, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-lg text-center">
        {/* GymSense Logo */}
        <div className="mb-8 animate-fade-in-up">
          <span className="font-display text-3xl text-emerald-600">GymSense</span>
        </div>

        {/* Cancel Icon */}
        <div className="flex justify-center mb-6 animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 bg-stone-400/20 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-stone-300 to-stone-500 dark:from-stone-600 dark:to-stone-800 rounded-full flex items-center justify-center shadow-lg">
              <XCircle className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2 animate-fade-in-up">
          Payment Cancelled
        </h1>
        
        <p className="text-stone-600 dark:text-stone-400 mb-8 animate-fade-in-up delay-100">
          No worries! Your payment was not processed and you haven&apos;t been charged.
        </p>

        {/* Reassurance Card */}
        <div className="w-full max-w-md mx-auto mb-8 animate-fade-in-up delay-200">
          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 p-6">
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Changed your mind? That&apos;s completely fine. If you experienced any issues or have questions, 
              our team is here to help.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md mx-auto space-y-3 animate-fade-in-up delay-300">
          <a
            href="javascript:history.back()"
            className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </a>
          
          <a
            href="/"
            className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold hover:border-stone-300 dark:hover:border-stone-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </a>
          
          <a
            href="mailto:support@gymsense.io"
            className="flex items-center justify-center gap-2 w-full p-4 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Need Help? Contact Support
          </a>
        </div>

        {/* Common Issues */}
        <div className="w-full max-w-md mx-auto mt-12 text-left animate-fade-in-up delay-400">
          <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
            Common Issues
          </h3>
          
          <div className="space-y-4">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none p-3 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  My card was declined
                </span>
                <span className="text-stone-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-2 p-3 text-sm text-stone-600 dark:text-stone-400">
                Please check that your card details are correct and that you have sufficient funds. 
                If the problem persists, try a different payment method or contact your bank.
              </div>
            </details>
            
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none p-3 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  The page timed out
                </span>
                <span className="text-stone-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-2 p-3 text-sm text-stone-600 dark:text-stone-400">
                Checkout sessions expire after 30 minutes for security. Simply scan the QR code again 
                to start a new checkout session.
              </div>
            </details>
            
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none p-3 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  I was charged but landed here
                </span>
                <span className="text-stone-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-2 p-3 text-sm text-stone-600 dark:text-stone-400">
                If you see a charge on your bank statement but landed on this page, please don&apos;t worry. 
                Contact the gym staff or email <a href="mailto:support@gymsense.io" className="text-emerald-600 hover:underline">support@gymsense.io</a> and 
                we&apos;ll sort it out for you.
              </div>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}

