/**
 * SMS Terms Page
 * 
 * Required for A2P 10DLC campaign registration.
 * Explains how gymsense uses SMS for verification codes.
 * 
 * URL: https://gymsense.io/sms-terms
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMS Terms - gymsense',
  description: 'gymsense SMS Terms - Information about SMS verification codes and messaging.',
};

export default function SMSTermsPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-3xl mb-2">gymsense</h1>
          <h2 className="text-2xl font-bold mb-2">SMS Terms & Conditions</h2>
          <p className="text-stone-400 text-sm">Last Updated: January 1, 2026</p>
        </div>

        <div className="prose prose-invert prose-stone max-w-none">
          {/* Summary Box */}
          <div className="bg-stone-900 border-l-4 border-emerald-500 p-4 rounded-r-lg mb-8">
            <p className="text-stone-300 m-0">
              <strong className="text-stone-50">Summary:</strong> gymsense sends one-time verification codes via SMS to verify your phone number during login and account setup. Standard message and data rates may apply. You can opt out at any time.
            </p>
          </div>

          {/* Section 1 */}
          <Section title="1. What SMS Messages We Send">
            <p className="text-stone-300 mb-4">
              gymsense uses SMS messaging exclusively for account security and verification purposes. We send:
            </p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">One-time verification codes</strong> - A 6-digit code sent when you log in or create an account</li>
              <li><strong className="text-stone-50">Account security alerts</strong> - Notifications about suspicious activity or password changes (rare)</li>
            </ul>
            <p className="text-stone-300 mt-4">
              <strong className="text-stone-50">Message frequency:</strong> Typically 1 message per login attempt. You will not receive marketing messages.
            </p>
          </Section>

          {/* Section 2 */}
          <Section title="2. How You Opt-In">
            <p className="text-stone-300 mb-4">
              You opt-in to receive SMS messages from gymsense when you:
            </p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Enter your phone number in the gymsense mobile app during account signup</li>
              <li>Enter your phone number when logging in to your existing account</li>
              <li>Update your phone number in your account settings</li>
            </ul>
            <p className="text-stone-300 mt-4">
              By entering your phone number and tapping &quot;Send Code&quot; or similar, you consent to receive one-time verification codes via SMS.
            </p>
          </Section>

          {/* Section 3 */}
          <Section title="3. Sample Messages">
            <p className="text-stone-300 mb-4">
              Here are examples of the SMS messages you may receive from gymsense:
            </p>
            <div className="bg-stone-900 border border-stone-700 rounded-lg p-4 mb-4">
              <p className="text-stone-300 font-mono text-sm m-0">
                Your gymsense verification code is: 123456
              </p>
            </div>
            <div className="bg-stone-900 border border-stone-700 rounded-lg p-4">
              <p className="text-stone-300 font-mono text-sm m-0">
                123456 is your gymsense login code. This code expires in 5 minutes.
              </p>
            </div>
          </Section>

          {/* Section 4 */}
          <Section title="4. Message & Data Rates">
            <p className="text-stone-300">
              Standard message and data rates may apply depending on your mobile carrier and plan. gymsense does not charge for SMS messages, but your carrier may. Check with your carrier for details about your messaging plan.
            </p>
          </Section>

          {/* Section 5 */}
          <Section title="5. How to Opt-Out">
            <p className="text-stone-300 mb-4">
              You can stop receiving SMS messages from gymsense at any time by:
            </p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Replying STOP</strong> to any SMS message from gymsense</li>
              <li><strong className="text-stone-50">Contacting us</strong> at <a href="mailto:support@gymsense.io" className="text-emerald-400 hover:underline">support@gymsense.io</a></li>
              <li><strong className="text-stone-50">Deleting your account</strong> in the app settings</li>
            </ul>
            <p className="text-stone-300 mt-4">
              <strong className="text-stone-50">Note:</strong> If you opt out of SMS, you may not be able to log in to your gymsense account, as phone verification is our primary authentication method.
            </p>
          </Section>

          {/* Section 6 */}
          <Section title="6. Help & Support">
            <p className="text-stone-300 mb-4">
              For help with SMS verification or to report issues:
            </p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Reply <strong className="text-stone-50">HELP</strong> to any SMS message</li>
              <li>Email us at <a href="mailto:support@gymsense.io" className="text-emerald-400 hover:underline">support@gymsense.io</a></li>
            </ul>
          </Section>

          {/* Section 7 */}
          <Section title="7. Privacy">
            <p className="text-stone-300">
              Your phone number is used only for account verification and security. We do not sell, rent, or share your phone number with third parties for marketing purposes. For more information, see our{' '}
              <a href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</a>.
            </p>
          </Section>

          {/* Section 8 */}
          <Section title="8. Carrier Disclaimer">
            <p className="text-stone-300">
              Carriers are not liable for delayed or undelivered messages. Message delivery is subject to effective transmission by your network carrier.
            </p>
          </Section>

          {/* Section 9 */}
          <Section title="9. Contact Information">
            <p className="text-stone-300 mb-4">If you have questions about our SMS practices, contact us:</p>
            <ul className="list-none text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Email:</strong> <a href="mailto:support@gymsense.io" className="text-emerald-400 hover:underline">support@gymsense.io</a></li>
              <li><strong className="text-stone-50">Website:</strong> <a href="https://gymsense.io" className="text-emerald-400 hover:underline">gymsense.io</a></li>
            </ul>
          </Section>
        </div>

        {/* Quick Reference Box */}
        <div className="mt-12 bg-stone-900 border border-stone-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-stone-50 mb-4">Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-stone-400 mb-1">Message Type</p>
              <p className="text-stone-50">One-time verification codes</p>
            </div>
            <div>
              <p className="text-stone-400 mb-1">Frequency</p>
              <p className="text-stone-50">1 message per login attempt</p>
            </div>
            <div>
              <p className="text-stone-400 mb-1">To Opt-Out</p>
              <p className="text-stone-50">Reply STOP to any message</p>
            </div>
            <div>
              <p className="text-stone-400 mb-1">For Help</p>
              <p className="text-stone-50">Reply HELP or email support@gymsense.io</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
          © 2026 gymsense. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold text-stone-50 mb-4 pb-2 border-b border-stone-700">
        {title}
      </h3>
      {children}
    </section>
  );
}

