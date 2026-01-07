/**
 * Delete Account Page
 * 
 * Allows users to request deletion of their account and data.
 * Required by Google Play Store for app submission.
 * 
 * URL: https://gymsense.io/delete-account
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete Account - gymsense',
  description: 'Request deletion of your gymsense account and associated data.',
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-3xl mb-2">gymsense</h1>
          <h2 className="text-2xl font-bold mb-2">Delete Your Account</h2>
          <p className="text-stone-400 text-sm">Account & Data Deletion Request</p>
        </div>

        <div className="prose prose-invert prose-stone max-w-none">
          <p className="text-stone-300 mb-8">
            We respect your right to control your personal data. This page explains how to request 
            deletion of your gymsense account and what happens when you do.
          </p>

          {/* How to Request */}
          <Section title="How to Request Account Deletion">
            <p className="text-stone-300 mb-4">
              To request deletion of your account and associated data, please email us at:
            </p>
            
            <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 mb-6">
              <p className="text-stone-50 font-semibold mb-2">Email your request to:</p>
              <a 
                href="mailto:support@gymsense.io?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20gymsense%20account.%0A%0APhone%20number%20on%20account%3A%20%0AEmail%20on%20account%3A%20%0AGym%20name%3A%20%0A%0AReason%20(optional)%3A%20"
                className="text-orange-400 text-xl hover:underline"
              >
                support@gymsense.io
              </a>
              <p className="text-stone-400 text-sm mt-4">
                Please include the phone number or email associated with your account to help us locate your data.
              </p>
            </div>

            <p className="text-stone-300">
              We will process your request within <strong className="text-stone-50">30 days</strong> and 
              send you a confirmation email once complete.
            </p>
          </Section>

          {/* What Gets Deleted */}
          <Section title="What Data Will Be Deleted">
            <p className="text-stone-300 mb-4">
              When you request account deletion, the following data will be permanently removed:
            </p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Account Information:</strong> Your name, email address, and phone number</li>
              <li><strong className="text-stone-50">Profile Data:</strong> Any preferences or settings you&apos;ve configured</li>
              <li><strong className="text-stone-50">Check-in History:</strong> Records of your gym visits</li>
              <li><strong className="text-stone-50">Session Bookings:</strong> Personal training session history</li>
              <li><strong className="text-stone-50">Payment Methods:</strong> Saved card information (stored securely by our payment processor)</li>
              <li><strong className="text-stone-50">App Data:</strong> Push notification tokens and device information</li>
            </ul>
          </Section>

          {/* What May Be Retained */}
          <Section title="Data That May Be Retained">
            <p className="text-stone-300 mb-4">
              Certain data may be retained for legal, tax, or business purposes:
            </p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>
                <strong className="text-stone-50">Transaction Records:</strong> Payment history and receipts 
                may be retained for up to 7 years for tax and accounting purposes, as required by law
              </li>
              <li>
                <strong className="text-stone-50">Anonymized Analytics:</strong> Aggregated, non-identifiable 
                usage data may be retained for service improvement
              </li>
              <li>
                <strong className="text-stone-50">Legal Holds:</strong> Data subject to ongoing legal matters 
                may be preserved as required
              </li>
            </ul>
          </Section>

          {/* Important Notes */}
          <Section title="Important Information">
            <ul className="list-disc list-inside text-stone-300 space-y-3">
              <li>
                <strong className="text-stone-50">Gym Membership:</strong> Deleting your gymsense account 
                does not cancel any active gym membership or subscription. Please contact your gym directly 
                to cancel your membership.
              </li>
              <li>
                <strong className="text-stone-50">Processing Time:</strong> Account deletion is typically 
                processed within 30 days. You will receive a confirmation email when complete.
              </li>
              <li>
                <strong className="text-stone-50">Irreversible:</strong> Account deletion is permanent. 
                If you wish to use gymsense again, you will need to create a new account.
              </li>
              <li>
                <strong className="text-stone-50">Gym Owners/Staff:</strong> If you are a gym owner or 
                staff member using the Pro app, please contact us to discuss data transfer or gym account 
                management before deletion.
              </li>
            </ul>
          </Section>

          {/* In-App Deletion (Future) */}
          <Section title="Delete From Within the App">
            <p className="text-stone-300 mb-4">
              You can also request account deletion directly from the gymsense app:
            </p>
            <ol className="list-decimal list-inside text-stone-300 space-y-2">
              <li>Open the gymsense app</li>
              <li>Go to <strong className="text-stone-50">Settings</strong> (gear icon)</li>
              <li>Scroll to <strong className="text-stone-50">Account</strong> section</li>
              <li>Tap <strong className="text-stone-50">Delete Account</strong></li>
              <li>Confirm your request</li>
            </ol>
            <p className="text-stone-400 text-sm mt-4">
              Note: In-app deletion follows the same process and timeline as email requests.
            </p>
          </Section>

          {/* Contact */}
          <Section title="Questions?">
            <p className="text-stone-300 mb-4">
              If you have any questions about the deletion process or your data, please contact us:
            </p>
            <ul className="list-none text-stone-300 space-y-2">
              <li>
                <strong className="text-stone-50">Email:</strong>{' '}
                <a href="mailto:support@gymsense.io" className="text-orange-400 hover:underline">
                  support@gymsense.io
                </a>
              </li>
              <li>
                <strong className="text-stone-50">Privacy Policy:</strong>{' '}
                <a href="/privacy" className="text-orange-400 hover:underline">
                  gymsense.io/privacy
                </a>
              </li>
            </ul>
          </Section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
          © 2025 gymsense. All rights reserved.
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

