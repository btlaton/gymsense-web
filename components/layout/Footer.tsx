'use client';

import Link from 'next/link';

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Payments', href: '#payments' },
      { label: 'Scheduling', href: '#scheduling' },
      { label: 'Insights', href: '#analytics' },
      { label: 'User Guide', href: '/user-guide' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'support@gymsense.io', href: 'mailto:support@gymsense.io' },
      { label: 'Lake Forest, CA', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'SMS Terms', href: '/sms-terms' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Twitter', href: 'https://twitter.com/gymsense' },
      { label: 'Instagram', href: 'https://instagram.com/gymsense' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/gymsense' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo & tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl text-emerald-600">gymsense</span>
            </Link>
            <p className="text-stone-500 text-sm max-w-xs">
              Modern gym management for the modern gym.
            </p>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-stone-300 font-medium text-sm mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-stone-500 hover:text-stone-300 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-stone-600 text-sm">
            © {new Date().getFullYear()} Gymsense. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-stone-600 hover:text-stone-400 text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-stone-600 hover:text-stone-400 text-sm transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
