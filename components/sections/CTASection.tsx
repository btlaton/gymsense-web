'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function CTASection() {
  return (
    <section id="get-started" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight whitespace-nowrap">
            Ready to modernize your gym?
          </h2>

          {/* CTA */}
          <div className="flex">
            <Button variant="primary" size="lg" href="#get-started">
              Schedule a 10-min demo →
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
