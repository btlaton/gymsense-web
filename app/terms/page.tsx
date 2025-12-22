/**
 * Terms of Service Page
 * 
 * Publicly accessible terms of service for GymSense.
 * 
 * URL: https://gymsense.io/terms
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - GymSense',
  description: 'GymSense Terms of Service - The terms and conditions for using our services.',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-3xl mb-2">gymsense</h1>
          <h2 className="text-2xl font-bold mb-2">Terms of Service</h2>
          <p className="text-stone-400 text-sm">Last Updated: December 22, 2024</p>
        </div>

        <div className="prose prose-invert prose-stone max-w-none">
          <p className="text-stone-300 mb-4">
            Welcome to GymSense! These Terms of Service (&quot;Terms&quot;) govern your use of the GymSense mobile applications and services. By using GymSense, you agree to these Terms.
          </p>

          {/* Summary Box */}
          <div className="bg-stone-900 border-l-4 border-orange-500 p-4 rounded-r-lg mb-8">
            <p className="text-stone-300 m-0">
              <strong className="text-stone-50">Summary:</strong> GymSense is a gym management platform. Gym owners use the Pro App to manage their business. Members use the Member App to check in, book sessions, and pay. You agree to use the service responsibly and pay for services you purchase.
            </p>
          </div>

          {/* Section 1 */}
          <Section title="1. Definitions">
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li><strong className="text-stone-50">&quot;GymSense,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;</strong> refers to GymSense LLC and its affiliates</li>
              <li><strong className="text-stone-50">&quot;Services&quot;</strong> refers to the GymSense Pro App, Member App, and related services</li>
              <li><strong className="text-stone-50">&quot;Gym&quot;</strong> refers to a fitness business using GymSense Pro</li>
              <li><strong className="text-stone-50">&quot;Member&quot;</strong> or <strong className="text-stone-50">&quot;Customer&quot;</strong> refers to an individual using the Member App or transacting with a Gym</li>
              <li><strong className="text-stone-50">&quot;User&quot;</strong> refers to anyone using our Services</li>
            </ul>
          </Section>

          {/* Section 2 */}
          <Section title="2. Eligibility">
            <p className="text-stone-300 mb-4">To use GymSense, you must:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Be at least 18 years old (or the age of majority in your jurisdiction)</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Not be prohibited from using the Services under applicable law</li>
            </ul>
          </Section>

          {/* Section 3 */}
          <Section title="3. Account Registration">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">3.1 Account Creation</h4>
            <p className="text-stone-300 mb-2">You may create an account using phone verification or Sign in with Apple. You agree to:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Keep your account credentials secure</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activity under your account</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">3.2 One Account Per Person</h4>
            <p className="text-stone-300">
              You may only create one account. If your account is terminated, you may not create a new account without our permission.
            </p>
          </Section>

          {/* Section 4 */}
          <Section title="4. GymSense Services">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">4.1 For Gym Owners (Pro App)</h4>
            <p className="text-stone-300 mb-2">The Pro App allows gym owners and staff to:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Manage customer accounts and check-ins</li>
              <li>Schedule personal training sessions</li>
              <li>Process payments via Stripe Connect</li>
              <li>Sell memberships, PT packages, and guest passes</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">4.2 For Members (Member App)</h4>
            <p className="text-stone-300 mb-2">The Member App allows gym members to:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Check in to the gym</li>
              <li>View and book personal training sessions</li>
              <li>Manage payment methods</li>
              <li>View membership status and purchase history</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">4.3 Service Availability</h4>
            <p className="text-stone-300">
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may temporarily suspend service for maintenance, updates, or circumstances beyond our control.
            </p>
          </Section>

          {/* Section 5 */}
          <Section title="5. Payments and Billing">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">5.1 Payment Processing</h4>
            <p className="text-stone-300 mb-2">All payments are processed by <strong className="text-stone-50">Stripe</strong>. When you make a payment:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>You authorize Stripe to charge your payment method</li>
              <li>Your payment goes to the Gym&apos;s Stripe Connect account</li>
              <li>GymSense may receive a platform fee from the transaction</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">5.2 Gym Pricing</h4>
            <p className="text-stone-300">
              Gyms set their own prices for memberships, sessions, and products. GymSense is not responsible for pricing decisions made by gyms.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">5.3 Refunds</h4>
            <p className="text-stone-300">
              Refund policies are determined by each Gym. Contact your Gym directly for refund requests. GymSense does not process refunds on behalf of gyms unless required by law.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">5.4 Subscriptions</h4>
            <p className="text-stone-300 mb-2">If you purchase a recurring membership:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Your payment method will be charged automatically each billing period</li>
              <li>You may cancel at any time through the app or by contacting your Gym</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
            </ul>
          </Section>

          {/* Section 6 */}
          <Section title="6. Acceptable Use">
            <p className="text-stone-300 mb-4">You agree NOT to:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Use the Services for any unlawful purpose</li>
              <li>Impersonate another person or entity</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to access accounts or data not belonging to you</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Reverse engineer, decompile, or disassemble the app</li>
              <li>Use automated tools to access the Services (bots, scrapers)</li>
              <li>Harass, threaten, or abuse other users or gym staff</li>
              <li>Submit false or fraudulent payment information</li>
            </ul>
          </Section>

          {/* Section 7 */}
          <Section title="7. Intellectual Property">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">7.1 Our Rights</h4>
            <p className="text-stone-300">
              GymSense owns all rights to the Services, including the app design, code, trademarks, and content. You may not copy, modify, or distribute any part of our Services without permission.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">7.2 Your Content</h4>
            <p className="text-stone-300">
              You retain ownership of any content you submit (e.g., profile information). By submitting content, you grant GymSense a license to use it to provide the Services.
            </p>
          </Section>

          {/* Section 8 */}
          <Section title="8. Privacy">
            <p className="text-stone-300">
              Your privacy is important to us. Our <a href="/privacy" className="text-orange-400 hover:underline">Privacy Policy</a> explains how we collect, use, and protect your information. By using GymSense, you agree to our Privacy Policy.
            </p>
          </Section>

          {/* Section 9 */}
          <Section title="9. Disclaimers">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">9.1 &quot;As Is&quot; Service</h4>
            <p className="text-stone-300 uppercase text-sm">
              THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">9.2 Gym Relationships</h4>
            <p className="text-stone-300 mb-2">GymSense is a technology platform. We are not:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>A party to agreements between you and your Gym</li>
              <li>Responsible for the quality of gym services or facilities</li>
              <li>Liable for injuries occurring at gyms</li>
              <li>Responsible for disputes between members and gyms</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">9.3 Third-Party Services</h4>
            <p className="text-stone-300">
              We integrate with third-party services (Stripe, Apple, etc.). We are not responsible for their availability, performance, or policies.
            </p>
          </Section>

          {/* Section 10 */}
          <Section title="10. Limitation of Liability">
            <p className="text-stone-300 uppercase text-sm mb-4">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2 text-sm">
              <li>GYMSENSE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
              <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO GYMSENSE (NOT YOUR GYM) IN THE PAST 12 MONTHS, OR $100, WHICHEVER IS GREATER</li>
              <li>WE ARE NOT LIABLE FOR LOSSES RESULTING FROM UNAUTHORIZED ACCESS TO YOUR ACCOUNT IF YOU FAILED TO KEEP YOUR CREDENTIALS SECURE</li>
            </ul>
          </Section>

          {/* Section 11 */}
          <Section title="11. Indemnification">
            <p className="text-stone-300 mb-2">You agree to indemnify and hold harmless GymSense, its officers, directors, employees, and agents from any claims, damages, or expenses arising from:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Your use of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
            </ul>
          </Section>

          {/* Section 12 */}
          <Section title="12. Termination">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">12.1 By You</h4>
            <p className="text-stone-300">
              You may stop using GymSense at any time. To delete your account, contact us at <a href="mailto:support@gymsense.io" className="text-orange-400 hover:underline">support@gymsense.io</a> or use the in-app settings.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">12.2 By Us</h4>
            <p className="text-stone-300 mb-2">We may suspend or terminate your account if you:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent activity</li>
              <li>Pose a risk to other users or our Services</li>
            </ul>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">12.3 Effect of Termination</h4>
            <p className="text-stone-300 mb-2">Upon termination:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Your right to use the Services ends immediately</li>
              <li>Active subscriptions with gyms may continue based on their terms</li>
              <li>We may retain certain data as required by law</li>
            </ul>
          </Section>

          {/* Section 13 */}
          <Section title="13. Dispute Resolution">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">13.1 Informal Resolution</h4>
            <p className="text-stone-300">
              Before filing a formal dispute, please contact us at <a href="mailto:support@gymsense.io" className="text-orange-400 hover:underline">support@gymsense.io</a>. We&apos;ll try to resolve the issue within 30 days.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">13.2 Governing Law</h4>
            <p className="text-stone-300">
              These Terms are governed by the laws of the State of North Carolina, United States, without regard to conflict of law principles.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">13.3 Arbitration</h4>
            <p className="text-stone-300">
              Any disputes that cannot be resolved informally will be settled by binding arbitration under the rules of the American Arbitration Association. You waive the right to participate in class actions.
            </p>
          </Section>

          {/* Section 14 */}
          <Section title="14. Changes to Terms">
            <p className="text-stone-300 mb-4">We may update these Terms from time to time. We will notify you of material changes by:</p>
            <ul className="list-disc list-inside text-stone-300 space-y-2">
              <li>Posting a notice in the app</li>
              <li>Sending you a notification</li>
              <li>Updating the &quot;Last Updated&quot; date</li>
            </ul>
            <p className="text-stone-300 mt-4">
              Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </Section>

          {/* Section 15 */}
          <Section title="15. General Provisions">
            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">15.1 Entire Agreement</h4>
            <p className="text-stone-300">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and GymSense.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">15.2 Severability</h4>
            <p className="text-stone-300">
              If any provision is found unenforceable, the remaining provisions will continue in effect.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">15.3 No Waiver</h4>
            <p className="text-stone-300">
              Failure to enforce any provision does not waive our right to enforce it later.
            </p>

            <h4 className="text-lg font-semibold text-stone-50 mt-6 mb-3">15.4 Assignment</h4>
            <p className="text-stone-300">
              You may not assign your rights under these Terms. We may assign our rights without restriction.
            </p>
          </Section>

          {/* Section 16 */}
          <Section title="16. Contact Us">
            <p className="text-stone-300 mb-4">If you have questions about these Terms, contact us at:</p>
            <ul className="list-none text-stone-300 space-y-2">
              <li><strong className="text-stone-50">Email:</strong> <a href="mailto:support@gymsense.io" className="text-orange-400 hover:underline">support@gymsense.io</a></li>
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

