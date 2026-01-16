'use client';

export default function OnboardingRefreshPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Warning Icon */}
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Logo */}
        <h1 className="text-3xl font-pacifico text-white mb-4">Gymsense</h1>

        {/* Message */}
        <h2 className="text-xl font-semibold text-white mb-3">
          Link Expired
        </h2>
        <p className="text-stone-400 mb-8">
          The onboarding link you used has expired. Don&apos;t worry—we can 
          generate a new one for you right away.
        </p>

        {/* Action */}
        <div className="bg-stone-900 rounded-xl p-6">
          <p className="text-stone-300 text-sm mb-4">
            Please contact us and we&apos;ll send you a fresh link:
          </p>
          <a
            href="mailto:support@gymsense.io?subject=New%20Onboarding%20Link%20Request"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Request New Link
          </a>
        </div>

        {/* Footer */}
        <p className="text-stone-500 text-sm mt-8">
          Or email us directly at{' '}
          <a href="mailto:support@gymsense.io" className="text-emerald-500 hover:underline">
            support@gymsense.io
          </a>
        </p>
      </div>
    </div>
  );
}
