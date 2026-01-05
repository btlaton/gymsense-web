'use client';

import { motion } from 'framer-motion';

interface FeatureCard {
  title: string;
  description: string;
  imagePlaceholder: string;
}

const features: FeatureCard[] = [
  {
    title: 'Dual-app ecosystem',
    description: 'One app for gym owners and staff. Another for members. Seamlessly connected.',
    imagePlaceholder: 'Dual App Ecosystem',
  },
  {
    title: 'Obsessively designed to perfection',
    description: 'Every interaction crafted for speed, clarity, and delight. No bloat, no confusion.',
    imagePlaceholder: 'Design Details',
  },
  {
    title: 'Simple, transparent pricing',
    description: 'No per-member fees. No hidden costs. Just straightforward pricing that scales with you.',
    imagePlaceholder: 'Pricing',
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Built for modern gyms and studios
          </motion.h2>
        </div>

        {/* Feature cards - horizontal scroll on mobile, 3-column grid on desktop */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 min-w-max md:min-w-0">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="w-72 md:w-auto flex-shrink-0 md:flex-shrink"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="group relative bg-stone-900 rounded-xl border border-stone-800 overflow-hidden hover:border-stone-700 transition-colors h-full">
                  {/* Image placeholder */}
                  <div className="aspect-[4/3] bg-stone-800 flex items-center justify-center">
                    <span className="text-stone-600 text-sm">[{feature.imagePlaceholder}]</span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <h3 className="text-stone-50 font-medium text-base mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-stone-500 text-sm">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Expand button */}
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-800/80 border border-stone-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="#a8a29e">
                      <path d="M8.75 4a.75.75 0 00-1.5 0v3.25H4a.75.75 0 000 1.5h3.25V12a.75.75 0 001.5 0V8.75H12a.75.75 0 000-1.5H8.75V4z" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
