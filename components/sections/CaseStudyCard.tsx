'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function CaseStudyCard() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
            {/* Content */}
            <div className="flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-stone-400 text-sm font-medium uppercase tracking-wider">
                  Case Study
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-stone-50 mb-4">
                The Atlas Gym&apos;s transition from Mindbody to Gymsense
              </h2>

              {/* Description */}
              <p className="text-stone-400 text-lg mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
                ad minim veniam, quis nostrud exercitation.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mb-8">
                <div>
                  <div className="text-3xl font-semibold text-stone-50">XX%</div>
                  <div className="text-stone-500 text-sm">Lorem ipsum</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-stone-50">XX hrs</div>
                  <div className="text-stone-500 text-sm">Dolor sit amet</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-stone-50">$XX</div>
                  <div className="text-stone-500 text-sm">Consectetur</div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="#case-study"
                className="inline-flex items-center gap-2 text-stone-50 font-medium hover:text-emerald-400 transition-colors"
              >
                Read the full story
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5.47 11.47a.75.75 0 001.06 1.06l4-4a.75.75 0 000-1.06l-4-4a.75.75 0 00-1.06 1.06L8.94 8l-3.47 3.47z" />
                </svg>
              </Link>
            </div>

            {/* Image placeholder */}
            <div className="relative aspect-[4/3] lg:aspect-auto bg-stone-800 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-700 flex items-center justify-center">
                  <span className="text-stone-500 text-2xl">🏋️</span>
                </div>
                <p className="text-stone-600 text-sm">
                  [Atlas Gym Photo / Screenshot]
                </p>
              </div>
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

