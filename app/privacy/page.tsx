/**
 * Privacy Policy Page
 * 
 * Publicly accessible privacy policy for GymSense.
 * Required by Apple App Store for app submission.
 * 
 * URL: https://gymsense.io/privacy
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - GymSense',
  description: 'GymSense Privacy Policy - How we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-3xl mb-2">gymsense</h1>
          <h2 className="text-2xl font-bold mb-2">Privacy Policy</h2>
          <p className="text-stone-400 text-sm">Last Updated: December 22, 2024</p>
        </div>

        <div className="prose prose-invert prose-stone max-w-none">
          <p className="text-stone-300 mb-8">
            GymSense (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the GymSense mobile applications (the &quot;Pro App&quot; and &quot;Member App&quot;) and related services. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our services.
          </p>

          {/* Section 1 */}
          <Section title="1. Information We Collect">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">1.1 Information You Provide</h4>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Account Information:</strong> Name, email address, and phone number when you create an account or are added by a gym</li>
              <li><strong className="text-stone-50">Authentication Data:</strong> Phone number for SMS verification, or credentials when using Sign in with Apple</li>
              <li><strong className="text-stone-50">Payment Information:</strong> Credit/debit card details are collected and processed by Stripe; we store only the last 4 digits and card brand for display purposes</li>
              <li><strong className="text-stone-50">Profile Preferences:</strong> Personal training preferences, preferred trainers, and scheduling preferences</li>
              <li><strong className="text-stone-50">Communications:</strong> Support requests and any messages you send us</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">1.2 Information Collected Automatically</h4>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Usage Data:</strong> Check-in history, session bookings, and transaction history</li>
              <li><strong className="text-stone-50">Device Information:</strong> Device type, operating system, and app version for technical support</li>
              <li><strong className="text-stone-50">Error Reports:</strong> Crash logs and error data to improve app stability (via Sentry)</li>
              <li><strong className="text-stone-50">Push Notification Tokens:</strong> Device tokens to send you notifications about sessions and updates</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">1.3 Information We Do NOT Collect</h4>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Precise location data or GPS coordinates</li>
              <li>Health or biometric data</li>
              <li>Photos or media from your device</li>
              <li>Contacts or address book</li>
              <li>Browsing history outside our app</li>
            </ul>
          </Section>

          {/* Section 2 */}
          <Section title="2. How We Use Your Information">
            <p className="text-stone-300 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Provide Services:</strong> Process check-ins, manage session bookings, and handle payments</li>
              <li><strong className="text-stone-50">Communicate:</strong> Send transactional emails (receipts, booking confirmations), SMS verification codes, and push notifications</li>
              <li><strong className="text-stone-50">Improve Our Service:</strong> Analyze usage patterns and fix technical issues</li>
              <li><strong className="text-stone-50">Prevent Fraud:</strong> Detect and prevent fraudulent transactions or unauthorized access</li>
              <li><strong className="text-stone-50">Legal Compliance:</strong> Comply with legal obligations and respond to legal requests</li>
            </ul>
          </Section>

          {/* Section 3 */}
          <Section title="3. How We Share Your Information">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">3.1 With Your Gym</h4>
            <p className="text-stone-300 mb-4">
              Your gym (the business using GymSense Pro) has access to your profile information, check-in history, session bookings, and payment history. Your gym is the &quot;data controller&quot; for your information; GymSense acts as a &quot;data processor&quot; on their behalf.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">3.2 With Service Providers</h4>
            <p className="text-stone-300 mb-4">We share information with third-party service providers who help us operate our services:</p>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-700">
                    <th className="text-left py-3 px-4 text-stone-50 font-semibold">Provider</th>
                    <th className="text-left py-3 px-4 text-stone-50 font-semibold">Purpose</th>
                    <th className="text-left py-3 px-4 text-stone-50 font-semibold">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="text-stone-300">
                  <tr className="border-b border-stone-800">
                    <td className="py-3 px-4 font-medium text-stone-50">Stripe</td>
                    <td className="py-3 px-4">Payment processing</td>
                    <td className="py-3 px-4">Name, email, payment card details</td>
                  </tr>
                  <tr className="border-b border-stone-800">
                    <td className="py-3 px-4 font-medium text-stone-50">Supabase</td>
                    <td className="py-3 px-4">Database and authentication</td>
                    <td className="py-3 px-4">All account data (encrypted at rest)</td>
                  </tr>
                  <tr className="border-b border-stone-800">
                    <td className="py-3 px-4 font-medium text-stone-50">Twilio</td>
                    <td className="py-3 px-4">SMS verification</td>
                    <td className="py-3 px-4">Phone number</td>
                  </tr>
                  <tr className="border-b border-stone-800">
                    <td className="py-3 px-4 font-medium text-stone-50">Resend</td>
                    <td className="py-3 px-4">Transactional emails</td>
                    <td className="py-3 px-4">Email address, name</td>
                  </tr>
                  <tr className="border-b border-stone-800">
                    <td className="py-3 px-4 font-medium text-stone-50">Sentry</td>
                    <td className="py-3 px-4">Error tracking</td>
                    <td className="py-3 px-4">Device info, error logs (no personal data)</td>
                  </tr>
                  <tr className="border-b border-stone-800">
                    <td className="py-3 px-4 font-medium text-stone-50">Expo</td>
                    <td className="py-3 px-4">Push notifications</td>
                    <td className="py-3 px-4">Device push token</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-stone-50">Apple</td>
                    <td className="py-3 px-4">Sign in with Apple</td>
                    <td className="py-3 px-4">Apple ID (if you choose this login method)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">3.3 Legal Requirements</h4>
            <p className="text-stone-300 mb-4">
              We may disclose your information if required by law, court order, or government request, or to protect our rights, safety, or property.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">3.4 Business Transfers</h4>
            <p className="text-stone-300">
              If GymSense is acquired or merges with another company, your information may be transferred as part of that transaction.
            </p>
          </Section>

          {/* Section 4 */}
          <Section title="4. Data Retention">
            <p className="text-stone-300 mb-4">We retain your information for as long as:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Your account is active</li>
              <li>Needed to provide you services</li>
              <li>Required by law (e.g., financial records for tax purposes)</li>
            </ul>
            <p className="text-stone-300 mt-4">
              After account deletion, we may retain certain data for up to 90 days for backup purposes, and indefinitely for anonymized analytics.
            </p>
          </Section>

          {/* Section 5 */}
          <Section title="5. Data Security">
            <p className="text-stone-300 mb-4">We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Encryption:</strong> All data is encrypted in transit (TLS) and at rest</li>
              <li><strong className="text-stone-50">Access Controls:</strong> Gym staff only see data for their own gym (multi-tenant isolation)</li>
              <li><strong className="text-stone-50">Payment Security:</strong> Card data is handled by Stripe (PCI-DSS compliant); we never store full card numbers</li>
              <li><strong className="text-stone-50">Authentication:</strong> Secure phone-based or Apple authentication</li>
            </ul>
          </Section>

          {/* Section 6 */}
          <Section title="6. Your Rights">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">6.1 All Users</h4>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-stone-50">Correction:</strong> Update inaccurate information</li>
              <li><strong className="text-stone-50">Deletion:</strong> Request deletion of your account and data</li>
              <li><strong className="text-stone-50">Opt-Out:</strong> Disable push notifications in app settings</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">6.2 California Residents (CCPA)</h4>
            <p className="text-stone-300 mb-2">California residents have additional rights under the CCPA:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">6.3 European Users (GDPR)</h4>
            <p className="text-stone-300 mb-2">If you are in the European Economic Area, you have additional rights:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Right to data portability</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
          </Section>

          {/* Section 7 */}
          <Section title="7. Children's Privacy">
            <p className="text-stone-300">
              GymSense is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will delete it promptly.
            </p>
          </Section>

          {/* Section 8 */}
          <Section title="8. Third-Party Links">
            <p className="text-stone-300">
              Our app may contain links to third-party websites or services. We are not responsible for their privacy practices. We encourage you to review their privacy policies.
            </p>
          </Section>

          {/* Section 9 */}
          <Section title="9. Changes to This Policy">
            <p className="text-stone-300 mb-4">We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Posting a notice in the app</li>
              <li>Sending you an email (if we have your email address)</li>
              <li>Updating the &quot;Last Updated&quot; date above</li>
            </ul>
          </Section>

          {/* Section 10 */}
          <Section title="10. Contact Us">
            <p className="text-stone-300 mb-4">If you have questions about this Privacy Policy or want to exercise your rights, contact us at:</p>
            <ul className="list-none text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Email:</strong> <a href="mailto:privacy@gymsense.io" className="text-orange-400 hover:underline">privacy@gymsense.io</a></li>
              <li><strong className="text-stone-50">Website:</strong> <a href="https://gymsense.io" className="text-orange-400 hover:underline">gymsense.io</a></li>
            </ul>
          </Section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
          © 2024 GymSense. All rights reserved.
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

