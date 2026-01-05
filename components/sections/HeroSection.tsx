'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

// Word-by-word animation like Linear
function AnimatedHeadline({ 
  words, 
  className = '' 
}: { 
  words: string[]; 
  className?: string;
}) {
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, filter: 'blur(10px)', y: '20%' }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ 
            delay: 0.1 + i * 0.08, 
            duration: 0.5,
            ease: 'easeOut'
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Headlines
  const desktopWords = ['Gymsense', 'is', 'purpose-built', 'for', 'modern', 'gym', 'and', 'studio', 'operations'];
  const mobileWords = ['Purpose-built', 'for', 'modern', 'gym', 'operations'];

  return (
    <section className="relative min-h-screen flex items-start pt-32 md:pt-40 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fafaf9 1px, transparent 1px),
            linear-gradient(to bottom, #fafaf9 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
        <div className="flex flex-col items-start">
          {/* Spacer for desktop */}
          <div className="hidden md:block h-8" />
          
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight max-w-5xl">
            {mounted ? (
              <>
                {/* Desktop headline */}
                <span className="hidden md:inline">
                  <AnimatedHeadline words={desktopWords} />
                </span>
                {/* Mobile headline */}
                <span className="md:hidden">
                  <AnimatedHeadline words={mobileWords} />
                </span>
              </>
            ) : (
              <span className="opacity-0">Loading...</span>
            )}
          </h1>

          {/* Spacer */}
          <div className="h-6 md:h-8" />

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-stone-400 max-w-2xl"
            initial={{ opacity: 0, filter: 'blur(10px)', y: '20%' }}
            animate={mounted ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Meet the app that gym owners and operators actually want to use.
          </motion.p>

          {/* Spacer */}
          <div className="h-8 md:h-10" />

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4"
            initial={{ opacity: 0, filter: 'blur(10px)', y: '20%' }}
            animate={mounted ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Button variant="primary" size="lg" href="#get-started">
              Schedule a 10-min demo →
            </Button>
          </motion.div>

          {/* Spacer before hero image area */}
          <div className="h-16 md:h-24" />

          {/* Hero Image/Mockup Placeholder */}
          <motion.div
            className="w-full max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative aspect-[16/10] bg-stone-900 rounded-xl border border-stone-800 overflow-hidden shadow-2xl">
              {/* Placeholder for app screenshot/mockup */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-800 flex items-center justify-center">
                    <span className="font-display text-2xl text-emerald-500">gs</span>
                  </div>
                  <p className="text-stone-500 text-sm">
                    [App Screenshot / 3D Mockup Placeholder]
                  </p>
                </div>
              </div>
              
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
