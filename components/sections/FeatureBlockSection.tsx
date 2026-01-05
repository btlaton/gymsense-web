'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface SubSection {
  title: string;
  description: string;
  imagePlaceholder: string;
}

interface FeatureBlockProps {
  category: string;
  categoryColor?: string;
  title: string;
  description: string;
  learnMoreHref?: string;
  heroImagePlaceholder?: string;
  subSections: [SubSection, SubSection]; // Exactly 2 subsections
}

export function FeatureBlockSection({
  category,
  categoryColor = 'emerald',
  title,
  description,
  learnMoreHref = '#',
  heroImagePlaceholder,
  subSections,
}: FeatureBlockProps) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <section className="py-20 md:py-32 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          {/* Category label */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <span className={`w-2 h-2 rounded-full ${colorClasses[categoryColor] || colorClasses.emerald}`} />
            <Link 
              href={learnMoreHref}
              className="text-stone-400 text-sm font-medium hover:text-stone-300 transition-colors flex items-center gap-1"
            >
              {category}
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-stone-600">
                <path d="M5.47 11.47a.75.75 0 001.06 1.06l4-4a.75.75 0 000-1.06l-4-4a.75.75 0 00-1.06 1.06L8.94 8l-3.47 3.47z" />
              </svg>
            </Link>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-50 mb-6 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-stone-400 text-lg">
              <span className="text-stone-300 font-medium">{description.split('.')[0]}.</span>
              {description.split('.').slice(1).join('.')}
            </p>
          </motion.div>

          {/* Learn more link */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              href={learnMoreHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-700 text-stone-300 text-sm font-medium hover:bg-stone-800 hover:border-stone-600 transition-colors"
            >
              Learn more
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.47 11.47a.75.75 0 001.06 1.06l4-4a.75.75 0 000-1.06l-4-4a.75.75 0 00-1.06 1.06L8.94 8l-3.47 3.47z" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Hero image placeholder (optional) */}
        {heroImagePlaceholder && (
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="aspect-[16/9] bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-center">
              <span className="text-stone-600 text-sm">[{heroImagePlaceholder}]</span>
            </div>
          </motion.div>
        )}

        {/* Two mini subsections side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-800 rounded-xl overflow-hidden border border-stone-800">
          {subSections.map((sub, i) => (
            <motion.div
              key={sub.title}
              className="bg-stone-950 p-6 md:p-8 lg:p-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Subsection title */}
              <h3 className="text-xl md:text-2xl font-semibold text-stone-50 mb-3">
                {sub.title}
              </h3>

              {/* Subsection description */}
              <p className="text-stone-400 text-base mb-6">
                {sub.description}
              </p>

              {/* Subsection image placeholder */}
              <div className="aspect-[16/10] bg-stone-900 rounded-lg border border-stone-800 flex items-center justify-center">
                <span className="text-stone-600 text-sm">[{sub.imagePlaceholder}]</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

