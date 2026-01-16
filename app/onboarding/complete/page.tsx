'use client';

export default function OnboardingCompletePage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Logo */}
        <h1 className="text-3xl font-pacifico text-white mb-4">Gymsense</h1>

        {/* Message */}
        <h2 className="text-xl font-semibold text-white mb-3">
          Account Connected!
        </h2>
        <p className="text-stone-400 mb-8">
          Your Stripe account has been successfully connected to Gymsense. 
          You&apos;re all set to start accepting payments from your members.
        </p>

        {/* Next Steps */}
        <div className="bg-stone-900 rounded-xl p-6 text-left">
          <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wide mb-4">
            What happens next?
          </h3>
          <ul className="space-y-3 text-stone-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">1.</span>
              <span>Our team will be notified and complete your gym setup</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">2.</span>
              <span>You&apos;ll receive an email with your Pro app login credentials</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">3.</span>
              <span>Start migrating your members to the Gymsense Member app</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-stone-500 text-sm mt-8">
          Questions? Email us at{' '}
          <a href="mailto:support@gymsense.io" className="text-emerald-500 hover:underline">
            support@gymsense.io
          </a>
        </p>
      </div>
    </div>
  );
}
