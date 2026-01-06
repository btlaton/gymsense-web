'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900" />
      
      {/* Radial gradient glow behind screenshots */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Content area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-8 w-full">
        <div className="flex flex-col items-start">
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
        </div>
      </div>

      {/* Screenshot Container - Stacked cascade with subtle 3D */}
      <div className="relative flex-1 min-h-[550px] md:min-h-[650px] lg:min-h-[750px]">
        {/* Perspective container - subtle depth */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ 
            perspective: '2500px',
            perspectiveOrigin: '50% 40%',
          }}
        >
          {/* 3D container with gentle tilt */}
          <motion.div
            className="absolute inset-0 flex items-start justify-center pt-4"
            style={{
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, rotateX: 0 }}
            animate={mounted ? { 
              opacity: 1, 
              rotateX: 18,
            } : {}}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Stacked screenshots - cascading from back-left to front-right */}
            {mounted && (
              <>
                {/* Back-left screenshot - hero-3 (Member App) */}
                <motion.div
                  className="absolute"
                  style={{
                    zIndex: 1,
                    left: '50%',
                    top: '0',
                  }}
                  initial={{ opacity: 0, y: 60, x: 'calc(-50% - 245px)' }}
                  animate={{ 
                    opacity: 1, 
                    y: -60,
                    x: 'calc(-50% - 245px)',
                  }}
                  transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-black/90 border border-stone-600/20">
                    <Image
                      src="/hero-3.png"
                      alt="Gymsense Member App View"
                      width={420}
                      height={900}
                      className="w-[240px] sm:w-[300px] md:w-[380px] lg:w-[440px] xl:w-[480px] h-auto"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Middle screenshot - hero-1 (Schedule) */}
                <motion.div
                  className="absolute"
                  style={{
                    zIndex: 2,
                    left: '50%',
                    top: '0',
                  }}
                  initial={{ opacity: 0, y: 60, x: '-50%' }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    x: '-50%',
                  }}
                  transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-black/90 border border-stone-500/30">
                    <Image
                      src="/hero-1.png"
                      alt="Gymsense Pro App - Schedule View"
                      width={420}
                      height={900}
                      className="w-[240px] sm:w-[300px] md:w-[380px] lg:w-[440px] xl:w-[480px] h-auto"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Front-right screenshot - hero-2 (Financials) - main focus */}
                <motion.div
                  className="absolute"
                  style={{
                    zIndex: 3,
                    left: '50%',
                    top: '0',
                  }}
                  initial={{ opacity: 0, y: 60, x: 'calc(-50% + 245px)' }}
                  animate={{ 
                    opacity: 1, 
                    y: 60,
                    x: 'calc(-50% + 245px)',
                  }}
                  transition={{ delay: 1.0, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-black/90 border border-stone-600/20">
                    <Image
                      src="/hero-2.png"
                      alt="Gymsense Pro App - Financials View"
                      width={420}
                      height={900}
                      className="w-[240px] sm:w-[300px] md:w-[380px] lg:w-[440px] xl:w-[480px] h-auto"
                      priority
                    />
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Gradient overlays for depth/fade effect */}
        {/* Bottom fade - strong fade to background */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top, rgb(12, 10, 9) 0%, rgb(12, 10, 9) 15%, transparent 100%)',
          }}
        />
        
        {/* Side fades - subtle vignette */}
        <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-stone-950 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-stone-950 to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
