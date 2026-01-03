/**
 * GymSense Landing Page
 * 
 * Auto-playing story scenes showing how Pro and Member apps work together.
 * Custom slide transitions to simulate real app navigation.
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Zap,
  ArrowRight,
  Check,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  MapPinCheck,
  ScanLine,
  TrendingUp,
  Dumbbell,
  Shirt,
  Cookie,
  X,
  Receipt,
  Smartphone,
  LineChart,
  Package,
  Shield
} from 'lucide-react';

// ===== COMPARISON FEATURES =====
const COMPARISON_FEATURES = [
  {
    id: 'billing',
    title: 'Recurring Billing & Payouts',
    icon: Receipt,
    gymsense: '100% accurate and AI-verified',
    competitor: 'brittle and error-prone',
  },
  {
    id: 'checkins',
    title: 'Member Check-ins',
    icon: Smartphone,
    gymsense: 'Touchless, instant QR scan from member app',
    competitor: 'computer or tablet requiring member to type name or code',
  },
  {
    id: 'insights',
    title: 'Revenue Growth Opportunities',
    icon: LineChart,
    gymsense: 'Actionable customer insights dashboard',
    competitor: 'dozens of static reports masked as "AI-powered marketing tools"',
  },
  {
    id: 'payments',
    title: 'In-Person Payments',
    icon: CreditCard,
    gymsense: 'Instant mobile-to-mobile QR scanning',
    competitor: 'hardware-required, slow and inefficient checkout flow',
  },
  {
    id: 'products',
    title: 'Product Catalog Flexibility',
    icon: Package,
    gymsense: 'In-app product creation and instant price updates',
    competitor: 'Requires a call with customer support to add/edit a product',
  },
  {
    id: 'permissions',
    title: 'Role-based App Permissions',
    icon: Shield,
    gymsense: 'Hide sensitive financial data from specified staff roles',
    competitor: 'same app experience for all staff',
  },
];

// ===== COMPARISON CAROUSEL COMPONENT =====
function ComparisonCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'competitor' | 'transition' | 'gymsense'>('competitor');
  const [isPaused, setIsPaused] = useState(false);
  
  const feature = COMPARISON_FEATURES[currentIndex];
  const Icon = feature.icon;
  
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setPhase(prev => {
        if (prev === 'competitor') return 'transition';
        if (prev === 'transition') return 'gymsense';
        // Move to next card
        setCurrentIndex(i => (i + 1) % COMPARISON_FEATURES.length);
        return 'competitor';
      });
    }, phase === 'gymsense' ? 3000 : phase === 'competitor' ? 1500 : 400);
    
    return () => clearInterval(timer);
  }, [phase, isPaused]);
  
  const goToFeature = (index: number) => {
    setCurrentIndex(index);
    setPhase('competitor');
  };
  
  return (
    <div 
      className="mb-6 max-w-md mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Card */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-5 min-h-[180px] sm:min-h-[200px]">
        {/* Feature Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center">
            <Icon className="w-4 h-4 text-emerald-500" />
          </div>
          <h4 className="text-stone-200 text-sm sm:text-base font-medium">{feature.title}</h4>
        </div>
        
        {/* Comparison Content */}
        <div className="relative h-24 sm:h-28">
          <AnimatePresence mode="wait">
            {phase === 'competitor' || phase === 'transition' ? (
              <motion.div
                key={`${feature.id}-competitor`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: phase === 'transition' ? 0.3 : 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-stone-500" />
                  </div>
                  <div>
                    <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-1">Leading Competitor</p>
                    <p className={`text-stone-400 text-sm sm:text-base ${phase === 'transition' ? 'line-through' : ''}`}>
                      {feature.competitor}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${feature.id}-gymsense`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <div className="flex items-start gap-2">
                  <motion.div 
                    className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-emerald-500 text-[10px] uppercase tracking-wide mb-1">gymsense</p>
                    <p className="text-stone-100 text-sm sm:text-base font-medium">
                      {feature.gymsense}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {COMPARISON_FEATURES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToFeature(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex 
                ? 'bg-emerald-500 w-4' 
                : 'bg-stone-700 hover:bg-stone-600'
            }`}
          />
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4 mt-2">
        <button 
          onClick={() => goToFeature((currentIndex - 1 + COMPARISON_FEATURES.length) % COMPARISON_FEATURES.length)}
          className="text-stone-500 hover:text-stone-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => goToFeature((currentIndex + 1) % COMPARISON_FEATURES.length)}
          className="text-stone-500 hover:text-stone-300 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ===== STORY CONFIGURATION =====
const STORIES = [
  {
    id: 'check-in',
    title: 'Touchless Member Check-Ins',
    // Transition directions: 'left' = slide from left, 'right' = slide from right, 'fade' = fade
    memberTransitions: ['fade', 'left', 'left'], // Step 0, 1, 2
    proTransitions: ['fade', 'fade', 'fade'],
    steps: [
      {
        narrative: "Sarah opens the app and swipes right to open the camera.",
        memberPhase: 'swipe-to-scan',
        proPhase: 'dashboard',
      },
      {
        narrative: "Sarah scans the QR code posted at the gym's front desk.",
        memberPhase: 'scanning',
        proPhase: 'waiting',
      },
      {
        narrative: "Sarah is checked in! The Pro app updates in real-time.",
        memberPhase: 'success',
        proPhase: 'new-checkin',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Seamless Mobile-to-Mobile Payments',
    memberTransitions: ['fade', 'right', 'fade'],
    proTransitions: ['fade', 'fade', 'fade'],
    steps: [
      {
        narrative: "Sarah swipes left to reveal her unique QR code for payment.",
        memberPhase: 'swipe-to-pay',
        proPhase: 'checkout',
      },
      {
        narrative: "Staff member scans Sarah's QR code to accept payment.",
        memberPhase: 'qr-display',
        proPhase: 'scanning',
      },
      {
        narrative: "Payment completes on both devices instantly.",
        memberPhase: 'payment-success',
        proPhase: 'payment-success',
      },
    ],
  },
  {
    id: 'session',
    title: 'Instant Session Bookings',
    memberTransitions: ['fade', 'fade'],
    proTransitions: ['fade', 'fade'],
    steps: [
      {
        narrative: "Marcus schedules Sarah's next personal training session.",
        memberPhase: 'home',
        proPhase: 'scheduling',
      },
      {
        narrative: "Sarah's app instantly shows the new session.",
        memberPhase: 'session-booked',
        proPhase: 'scheduled',
      },
    ],
  },
];

// Transition variants for different directions
const slideVariants = {
  left: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  },
  right: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export default function Home() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const story = STORIES[storyIndex];
  const step = story.steps[stepIndex];
  
  // Get transition directions for current step
  const memberTransition = story.memberTransitions[stepIndex] || 'fade';
  const proTransition = story.proTransitions[stepIndex] || 'fade';

  // Auto-advance through steps and stories
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (stepIndex < story.steps.length - 1) {
        setStepIndex(stepIndex + 1);
      } else if (storyIndex < STORIES.length - 1) {
        setStoryIndex(storyIndex + 1);
        setStepIndex(0);
      } else {
        setStoryIndex(0);
        setStepIndex(0);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [storyIndex, stepIndex, story.steps.length, isPlaying]);

  const goToStory = (index: number) => {
    setStoryIndex(index);
    setStepIndex(0);
  };

  const goNext = () => {
    if (stepIndex < story.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else if (storyIndex < STORIES.length - 1) {
      setStoryIndex(storyIndex + 1);
      setStepIndex(0);
    }
  };

  const goPrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
      setStepIndex(STORIES[storyIndex - 1].steps.length - 1);
    }
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Logo */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-emerald-500 mb-3">
            gymsense
          </h1>
          
          {/* Headline */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-stone-50 mb-3">
            The gym management app<br />
            <span className="text-emerald-400">owners actually want to use</span>
          </h2>
          
          {/* Subheadline */}
          <p className="text-sm sm:text-base text-stone-400 mb-2 max-w-xl mx-auto">
            Stop overpaying for clunky, outdated and error-prone software built for the 2000s.
          </p>
          <p className="text-sm sm:text-base text-stone-400 mb-6 max-w-xl mx-auto">
            Break free from software lock-in: Switch to gymsense in less than a day and start managing all of your locations directly from your phone.
          </p>
          
          {/* Feature Comparison Carousel */}
          <ComparisonCarousel />
          
          {/* CTA Button */}
          <a 
            href="#waitlist" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-sm sm:text-base"
          >
            Schedule a 10-minute demo
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* App Demo Section */}
      <section className="relative px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-stone-50 mb-1">
              Two apps, one unified ecosystem
            </h3>
            <p className="text-stone-500 text-sm">
              Watch how the Pro and Member apps work together
            </p>
          </div>

          {/* Story Tabs - 1x3 Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 max-w-md sm:max-w-lg mx-auto">
            {STORIES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStory(i)}
                className={`px-2 sm:px-3 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-medium transition-all text-center leading-tight ${
                  i === storyIndex 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Narrative - Above Phones */}
          <div className="text-center mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={`narrative-${storyIndex}-${stepIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-stone-300 text-sm sm:text-base md:text-lg max-w-md mx-auto"
              >
                {step.narrative}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Phone Display */}
          <div 
            className="relative"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
            onTouchStart={() => setIsPlaying(false)}
          >
            {/* Phones Container */}
            <div className="flex justify-center items-start gap-4">
              {/* Member Phone */}
              <div className="flex flex-col items-center">
                <PhoneMockup>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`member-${storyIndex}-${stepIndex}`}
                      variants={slideVariants[memberTransition as keyof typeof slideVariants]}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="h-full"
                    >
                      <MemberScreen phase={step.memberPhase} />
                    </motion.div>
                  </AnimatePresence>
                </PhoneMockup>
                <div className="mt-2 text-center">
                  <div className="text-emerald-400 font-medium text-xs sm:text-sm">Member App</div>
                </div>
              </div>

              {/* Pro Phone */}
              <div className="flex flex-col items-center">
                <PhoneMockup variant="light">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`pro-${storyIndex}-${stepIndex}`}
                      variants={slideVariants[proTransition as keyof typeof slideVariants]}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="h-full"
                    >
                      <ProScreen phase={step.proPhase} />
                    </motion.div>
                  </AnimatePresence>
                </PhoneMockup>
                <div className="mt-2 text-center">
                  <div className="text-stone-300 font-medium text-xs sm:text-sm">Pro App</div>
                </div>
              </div>
            </div>

            {/* Navigation - Only current scene's steps */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button 
                onClick={goPrev}
                className="p-2 rounded-full bg-stone-800 text-stone-400 hover:bg-stone-700 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Step indicators - ONLY current scene */}
              <div className="flex gap-2">
                {story.steps.map((_, sti) => {
                  const isActive = sti === stepIndex;
                  const isPast = sti < stepIndex;
                  return (
                    <button
                      key={sti}
                      onClick={() => setStepIndex(sti)}
                      className={`h-2 rounded-full transition-all ${
                        isActive ? 'w-6 bg-emerald-500' : 
                        isPast ? 'w-2 bg-emerald-700 hover:bg-emerald-600' : 'w-2 bg-stone-700 hover:bg-stone-600'
                      }`}
                      aria-label={`Go to step ${sti + 1}`}
                    />
                  );
                })}
              </div>

              <button 
                onClick={goNext}
                className="p-2 rounded-full bg-stone-800 text-stone-400 hover:bg-stone-700 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-stone-900">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-stone-500 uppercase tracking-wider text-xs font-semibold mb-3">
            The Problem
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-stone-300 mb-4 leading-relaxed">
            Gym management software hasn&apos;t evolved in over a decade. Clunky interfaces, hidden fees, and zero real-time sync.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-emerald-400 leading-relaxed font-medium">
            Gymsense is built different. Mobile-first. Real-time. Simple pricing.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-stone-500 uppercase tracking-wider text-xs font-semibold mb-3">
              Built Different
            </h3>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-50 mb-3">
              Everything you need, nothing you don&apos;t
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard 
              icon={<QRCodeIcon className="w-5 h-5" />}
              title="QR Check-In"
              description="Members scan to check in. No hardware needed."
            />
            <FeatureCard 
              icon={<CreditCard className="w-5 h-5" />}
              title="Instant Payments"
              description="Stripe-powered. Apple Pay. No POS required."
            />
            <FeatureCard 
              icon={<Calendar className="w-5 h-5" />}
              title="Smart Scheduling"
              description="Book PT sessions with drag-and-drop ease."
            />
            <FeatureCard 
              icon={<Zap className="w-5 h-5" />}
              title="Real-time Sync"
              description="Changes appear instantly across all devices."
            />
            <FeatureCard 
              icon={<Users className="w-5 h-5" />}
              title="Customer Profiles"
              description="Full history, packages, and billing in one view."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-5 h-5" />}
              title="Live Financials"
              description="Revenue tracking and insights at a glance."
            />
          </div>
        </div>
      </section>

      {/* Waitlist CTA Section */}
      <section id="waitlist" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-50 mb-3">
            Ready to upgrade your gym?
          </h2>
          <p className="text-stone-400 mb-6 text-sm sm:text-base">
            Join the waitlist for early access and founder pricing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-stone-50 placeholder:text-stone-500 focus:outline-none focus:border-emerald-600 transition-colors text-sm"
            />
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors text-sm">
              Join Waitlist
            </button>
          </div>
          
          <p className="text-stone-600 text-xs mt-3">
            No spam. Just updates on our launch.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-display text-xl text-emerald-500">gymsense</span>
          
          <div className="flex gap-4 text-stone-500 text-xs">
            <a href="/privacy" className="hover:text-stone-300 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-stone-300 transition-colors">Terms</a>
            <a href="/sms-terms" className="hover:text-stone-300 transition-colors">SMS Terms</a>
          </div>
          
          <p className="text-stone-600 text-xs">
            © 2026 gymsense
          </p>
        </div>
      </footer>
    </main>
  );
}

// ===== QR CODE COMPONENT =====

function QRCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
      <rect x="14" y="18" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </svg>
  );
}

function QRCodeDisplay({ size = 'medium', dark = false }: { size?: 'small' | 'medium' | 'large'; dark?: boolean }) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24 sm:w-28 sm:h-28',
    large: 'w-28 h-28 sm:w-32 sm:h-32',
  };
  
  const color = dark ? '#1c1917' : '#fafaf9';
  
  return (
    <svg className={sizeClasses[size]} viewBox="0 0 100 100">
      {/* Position detection patterns (corners) */}
      <rect x="5" y="5" width="25" height="25" fill={color} />
      <rect x="8" y="8" width="19" height="19" fill={dark ? '#fafaf9' : '#1c1917'} />
      <rect x="12" y="12" width="11" height="11" fill={color} />
      
      <rect x="70" y="5" width="25" height="25" fill={color} />
      <rect x="73" y="8" width="19" height="19" fill={dark ? '#fafaf9' : '#1c1917'} />
      <rect x="77" y="12" width="11" height="11" fill={color} />
      
      <rect x="5" y="70" width="25" height="25" fill={color} />
      <rect x="8" y="73" width="19" height="19" fill={dark ? '#fafaf9' : '#1c1917'} />
      <rect x="12" y="77" width="11" height="11" fill={color} />
      
      {/* Data modules */}
      <rect x="35" y="5" width="5" height="5" fill={color} />
      <rect x="45" y="5" width="5" height="5" fill={color} />
      <rect x="55" y="5" width="5" height="5" fill={color} />
      <rect x="35" y="12" width="5" height="5" fill={color} />
      <rect x="50" y="12" width="5" height="5" fill={color} />
      <rect x="60" y="12" width="5" height="5" fill={color} />
      <rect x="40" y="19" width="5" height="5" fill={color} />
      <rect x="55" y="19" width="5" height="5" fill={color} />
      
      <rect x="5" y="35" width="5" height="5" fill={color} />
      <rect x="15" y="35" width="5" height="5" fill={color} />
      <rect x="25" y="35" width="5" height="5" fill={color} />
      <rect x="40" y="35" width="5" height="5" fill={color} />
      <rect x="50" y="35" width="5" height="5" fill={color} />
      <rect x="65" y="35" width="5" height="5" fill={color} />
      <rect x="80" y="35" width="5" height="5" fill={color} />
      <rect x="90" y="35" width="5" height="5" fill={color} />
      
      <rect x="10" y="42" width="5" height="5" fill={color} />
      <rect x="20" y="42" width="5" height="5" fill={color} />
      <rect x="35" y="42" width="5" height="5" fill={color} />
      <rect x="45" y="42" width="5" height="5" fill={color} />
      <rect x="55" y="42" width="5" height="5" fill={color} />
      <rect x="70" y="42" width="5" height="5" fill={color} />
      <rect x="85" y="42" width="5" height="5" fill={color} />
      
      <rect x="5" y="50" width="5" height="5" fill={color} />
      <rect x="15" y="50" width="5" height="5" fill={color} />
      <rect x="30" y="50" width="5" height="5" fill={color} />
      <rect x="40" y="50" width="5" height="5" fill={color} />
      <rect x="50" y="50" width="5" height="5" fill={color} />
      <rect x="60" y="50" width="5" height="5" fill={color} />
      <rect x="75" y="50" width="5" height="5" fill={color} />
      <rect x="90" y="50" width="5" height="5" fill={color} />
      
      <rect x="10" y="58" width="5" height="5" fill={color} />
      <rect x="25" y="58" width="5" height="5" fill={color} />
      <rect x="35" y="58" width="5" height="5" fill={color} />
      <rect x="50" y="58" width="5" height="5" fill={color} />
      <rect x="65" y="58" width="5" height="5" fill={color} />
      <rect x="80" y="58" width="5" height="5" fill={color} />
      
      <rect x="35" y="70" width="5" height="5" fill={color} />
      <rect x="45" y="70" width="5" height="5" fill={color} />
      <rect x="60" y="70" width="5" height="5" fill={color} />
      <rect x="75" y="70" width="5" height="5" fill={color} />
      <rect x="85" y="70" width="5" height="5" fill={color} />
      
      <rect x="40" y="77" width="5" height="5" fill={color} />
      <rect x="55" y="77" width="5" height="5" fill={color} />
      <rect x="70" y="77" width="5" height="5" fill={color} />
      <rect x="80" y="77" width="5" height="5" fill={color} />
      <rect x="90" y="77" width="5" height="5" fill={color} />
      
      <rect x="35" y="85" width="5" height="5" fill={color} />
      <rect x="50" y="85" width="5" height="5" fill={color} />
      <rect x="65" y="85" width="5" height="5" fill={color} />
      <rect x="75" y="85" width="5" height="5" fill={color} />
      <rect x="85" y="85" width="5" height="5" fill={color} />
      
      <rect x="40" y="92" width="5" height="5" fill={color} />
      <rect x="55" y="92" width="5" height="5" fill={color} />
      <rect x="70" y="92" width="5" height="5" fill={color} />
      <rect x="90" y="92" width="5" height="5" fill={color} />
    </svg>
  );
}

// ===== PHONE MOCKUP =====

function PhoneMockup({ 
  children, 
  variant = 'dark'
}: { 
  children: React.ReactNode;
  variant?: 'dark' | 'light';
}) {
  return (
    <div className="relative w-[175px] sm:w-[195px] md:w-[215px] h-[380px] sm:h-[423px] md:h-[467px] bg-stone-800 rounded-[2rem] sm:rounded-[2.5rem] p-1.5 shadow-xl">
      <div className={`w-full h-full rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden relative ${
        variant === 'dark' ? 'bg-stone-900' : 'bg-stone-50'
      }`}>
        {/* Notch / Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-5 sm:h-6 bg-stone-800 rounded-full z-10" />
        
        {/* Screen */}
        <div className="w-full h-full pt-8 sm:pt-9 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// ===== MEMBER SCREENS =====

function MemberScreen({ phase }: { phase: string }) {
  switch (phase) {
    case 'swipe-to-scan':
      return <MemberSwipeToScanScreen />;
    case 'scanning':
      return <MemberScanningScreen />;
    case 'success':
      return <MemberSuccessScreen />;
    case 'swipe-to-pay':
      return <MemberSwipeToPayScreen />;
    case 'qr-display':
      return <MemberQRScreen />;
    case 'payment-success':
      return <MemberPaymentSuccessScreen />;
    case 'home':
      return <MemberHomeScreen />;
    case 'new-session':
      return <MemberNewSessionScreen />;
    case 'session-booked':
      return <MemberSessionBookedScreen />;
    default:
      return <MemberHomeScreen />;
  }
}

function MemberSwipeToScanScreen() {
  return (
    <div className="h-full bg-stone-900 p-3 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      <p className="text-stone-200 text-xs font-medium mb-1">Welcome, Sarah!</p>
      <p className="text-stone-500 text-[10px] mb-4">Membership active</p>
      
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-stone-800 rounded-lg p-3 text-center border border-stone-700">
          <QRCodeIcon className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <span className="text-stone-300 text-[10px]">Check In</span>
        </div>
        <div className="bg-stone-800 rounded-lg p-3 text-center border border-stone-700">
          <CreditCard className="w-5 h-5 text-stone-500 mx-auto mb-1" />
          <span className="text-stone-500 text-[10px]">Pay</span>
        </div>
      </div>
      
      {/* Swipe indicator */}
      <div className="flex items-center justify-center mt-6">
        <motion.div 
          className="flex items-center gap-1 text-emerald-400"
          animate={{ x: [-8, 8, -8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs whitespace-nowrap">Swipe to check in</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>
    </div>
  );
}

function MemberScanningScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-3 relative">
      {/* Header */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      {/* Scanning frame */}
      <div className="relative w-24 sm:w-28 h-24 sm:h-28">
        <motion.div 
          className="absolute inset-0 border-2 border-emerald-500 rounded-xl"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div 
          className="absolute inset-x-2 h-0.5 bg-emerald-500"
          animate={{ top: ['10%', '85%', '10%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <QRCodeDisplay size="small" />
        </div>
      </div>
      
      <p className="mt-4 text-stone-400 text-xs">Scanning...</p>
    </div>
  );
}

function MemberSuccessScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-3 relative">
      {/* Header */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      <motion.div 
        className="w-16 sm:w-18 h-16 sm:h-18 bg-emerald-600 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Check className="w-8 sm:w-9 h-8 sm:h-9 text-white" />
      </motion.div>
      
      <p className="mt-4 text-stone-50 font-medium text-sm sm:text-base">Checked In!</p>
      <p className="mt-2 text-stone-200 text-xs sm:text-sm whitespace-nowrap">Have a great workout, Sarah!</p>
    </div>
  );
}

function MemberSwipeToPayScreen() {
  return (
    <div className="h-full bg-stone-900 p-3 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      <p className="text-stone-200 text-xs font-medium mb-1">Welcome, Sarah!</p>
      <p className="text-stone-500 text-[10px] mb-4">Membership active</p>
      
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-stone-800 rounded-lg p-3 text-center border border-stone-700">
          <QRCodeIcon className="w-5 h-5 text-stone-500 mx-auto mb-1" />
          <span className="text-stone-500 text-[10px]">Check In</span>
        </div>
        <div className="bg-stone-800 rounded-lg p-3 text-center border border-stone-700">
          <CreditCard className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <span className="text-stone-300 text-[10px]">Pay</span>
        </div>
      </div>
      
      {/* Swipe indicator */}
      <div className="flex items-center justify-center mt-6">
        <motion.div 
          className="flex items-center gap-1 text-emerald-400"
          animate={{ x: [8, -8, 8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs whitespace-nowrap">Swipe to pay</span>
        </motion.div>
      </div>
    </div>
  );
}

function MemberQRScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-3 relative">
      {/* Header */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      <p className="text-stone-300 text-xs font-medium mb-3">Ready to Pay</p>
      
      <motion.div 
        className="bg-white rounded-xl p-3 flex items-center justify-center"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <QRCodeDisplay size="large" dark />
      </motion.div>
      
      <p className="mt-3 text-stone-400 text-xs">Show to staff</p>
      <p className="mt-1 text-stone-600 text-[10px]">Card ending in 4242</p>
    </div>
  );
}

function MemberPaymentSuccessScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-3 relative">
      {/* Header */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      <motion.div 
        className="w-16 sm:w-18 h-16 sm:h-18 bg-emerald-600 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Check className="w-8 sm:w-9 h-8 sm:h-9 text-white" />
      </motion.div>
      
      <p className="mt-4 text-stone-50 font-medium text-sm sm:text-base whitespace-nowrap">Payment Successful!</p>
      <p className="mt-1 text-emerald-400 text-xs font-medium">$45.00</p>
    </div>
  );
}

function MemberHomeScreen() {
  return (
    <div className="h-full bg-stone-900 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      <p className="text-stone-200 text-xs font-medium mb-1">Welcome, Sarah!</p>
      <p className="text-stone-500 text-[10px] mb-3">Membership active</p>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-stone-800 rounded-lg p-2 text-center">
          <QRCodeIcon className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <span className="text-stone-400 text-[10px]">Check In</span>
        </div>
        <div className="bg-stone-800 rounded-lg p-2 text-center">
          <CreditCard className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <span className="text-stone-400 text-[10px]">Pay</span>
        </div>
      </div>
      
      <p className="text-stone-500 text-[10px] mb-1">Upcoming</p>
      <div className="bg-stone-800/50 rounded-lg p-2 border border-dashed border-stone-700">
        <p className="text-stone-500 text-[10px] text-center">No sessions</p>
      </div>
    </div>
  );
}

function MemberNewSessionScreen() {
  return (
    <div className="h-full bg-stone-900 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
            <User className="w-3 h-3 text-stone-400" />
          </div>
          <motion.div 
            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <span className="text-white text-[8px] font-bold">1</span>
          </motion.div>
        </div>
      </div>
      
      <p className="text-stone-200 text-xs font-medium mb-3">Welcome, Sarah!</p>
      
      <motion.div 
        className="bg-emerald-600/20 border border-emerald-600/40 rounded-lg p-2 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-1 mb-1">
          <Bell className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400 text-[10px] font-medium">New Session!</span>
        </div>
        <p className="text-stone-200 text-xs font-medium">Personal Training</p>
        <p className="text-stone-400 text-[10px]">Tomorrow • 9:00 AM</p>
      </motion.div>
    </div>
  );
}

function MemberSessionBookedScreen() {
  return (
    <div className="h-full bg-stone-900 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      <p className="text-stone-200 text-xs font-medium mb-1">Welcome, Sarah!</p>
      <p className="text-stone-500 text-[10px] mb-3">Membership active</p>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-stone-800 rounded-lg p-2 text-center">
          <QRCodeIcon className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <span className="text-stone-400 text-[10px]">Check In</span>
        </div>
        <div className="bg-stone-800 rounded-lg p-2 text-center">
          <CreditCard className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <span className="text-stone-400 text-[10px]">Pay</span>
        </div>
      </div>
      
      <p className="text-stone-500 text-[10px] mb-1">Upcoming</p>
      <motion.div 
        className="bg-stone-800 rounded-lg p-2 border border-emerald-600/40"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600/20 flex items-center justify-center">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div>
            <p className="text-stone-200 text-[10px] font-medium">Personal Training</p>
            <p className="text-stone-500 text-[9px]">Tomorrow • 9:00 AM</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ===== PRO SCREENS =====

function ProScreen({ phase }: { phase: string }) {
  switch (phase) {
    case 'dashboard':
      return <ProDashboardScreen />;
    case 'waiting':
      return <ProWaitingScreen />;
    case 'new-checkin':
      return <ProNewCheckinScreen />;
    case 'checkout':
      return <ProCheckoutScreen />;
    case 'scanning':
      return <ProScanningScreen />;
    case 'payment-success':
      return <ProPaymentSuccessScreen />;
    case 'scheduling':
      return <ProSchedulingScreen />;
    case 'scheduled':
      return <ProScheduledScreen />;
    default:
      return <ProWaitingScreen />;
  }
}

function ProDashboardScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <p className="text-stone-800 text-xs font-medium mb-3">Dashboard</p>
      
      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Revenue */}
        <div className="bg-white rounded-lg p-2 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="text-stone-500 text-[8px]">Revenue</span>
          </div>
          <p className="text-stone-800 text-sm font-semibold">$2,450</p>
          <p className="text-emerald-600 text-[8px]">+12% today</p>
        </div>
        
        {/* Check-ins - Highlighted with tap animation */}
        <motion.div 
          className="bg-emerald-50 rounded-lg p-2 border-2 border-emerald-400 shadow-sm relative"
          animate={{ scale: [1, 0.97, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <MapPinCheck className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700 text-[8px] font-medium">Check-ins</span>
          </div>
          <p className="text-stone-800 text-sm font-semibold">24</p>
          <p className="text-emerald-600 text-[8px]">5 today</p>
          {/* Tap indicator */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Customers */}
        <div className="bg-white rounded-lg p-2 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <Users className="w-3 h-3 text-stone-500" />
            <span className="text-stone-500 text-[8px]">Customers</span>
          </div>
          <p className="text-stone-800 text-sm font-semibold">156</p>
          <p className="text-stone-500 text-[8px]">Active members</p>
        </div>
        
        {/* Training */}
        <div className="bg-white rounded-lg p-2 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <Dumbbell className="w-3 h-3 text-stone-500" />
            <span className="text-stone-500 text-[8px]">Training</span>
          </div>
          <p className="text-stone-800 text-sm font-semibold">8</p>
          <p className="text-stone-500 text-[8px]">Sessions today</p>
        </div>
      </div>
    </div>
  );
}

function ProWaitingScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <p className="text-stone-800 text-[10px] sm:text-xs font-medium mb-2">Today&apos;s Check-ins</p>
      
      <div className="space-y-1">
        <CheckInRow name="David K." time="8:45 AM" />
        <CheckInRow name="Jessica L." time="8:32 AM" />
        <CheckInRow name="Mike R." time="8:15 AM" />
        <CheckInRow name="Amanda T." time="7:58 AM" />
        <CheckInRow name="Chris P." time="7:42 AM" />
      </div>
    </div>
  );
}

function ProNewCheckinScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <p className="text-stone-800 text-[10px] sm:text-xs font-medium mb-2">Today&apos;s Check-ins</p>
      
      <div className="space-y-1">
        <motion.div 
          className="bg-emerald-100 border border-emerald-400 rounded-lg p-1.5 flex items-center gap-1.5 shadow-md"
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0">
            <MapPinCheck className="w-2.5 h-2.5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-stone-900 text-[10px] font-medium leading-tight">Sarah G.</p>
            <p className="text-emerald-600 text-[8px] leading-tight">Just now</p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
            className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <Check className="w-2.5 h-2.5 text-white" />
          </motion.div>
        </motion.div>
        
        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.1 }}>
          <CheckInRow name="David K." time="8:45 AM" />
        </motion.div>
        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.15 }}>
          <CheckInRow name="Jessica L." time="8:32 AM" />
        </motion.div>
        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
          <CheckInRow name="Mike R." time="8:15 AM" />
        </motion.div>
        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.25 }}>
          <CheckInRow name="Amanda T." time="7:58 AM" />
        </motion.div>
        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.3 }}>
          <CheckInRow name="Chris P." time="7:42 AM" />
        </motion.div>
      </div>
    </div>
  );
}

function CheckInRow({ name, time }: { name: string; time: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-1.5 flex items-center gap-1.5 shadow-sm">
      <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
        <MapPinCheck className="w-2.5 h-2.5 text-stone-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-stone-800 text-[10px] font-medium leading-tight">{name}</p>
        <p className="text-stone-500 text-[8px] leading-tight">{time}</p>
      </div>
    </div>
  );
}

function ProCheckoutScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <p className="text-stone-800 text-[10px] sm:text-xs font-medium mb-2">Checkout</p>
      
      {/* Cart Items */}
      <div className="space-y-2 mb-2">
        <div className="bg-white rounded-lg p-2 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-stone-400" />
            <div className="flex-1">
              <p className="text-stone-800 text-[10px] font-medium">T-Shirt</p>
              <p className="text-stone-500 text-[8px]">1x $24.50</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-stone-400" />
            <div className="flex-1">
              <p className="text-stone-800 text-[10px] font-medium">Protein Cookie</p>
              <p className="text-stone-500 text-[8px]">1x $4.00</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Total */}
      <div className="bg-stone-100 rounded-lg p-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-stone-600 text-[10px]">Total</span>
          <span className="text-stone-900 text-xs font-semibold">$28.50</span>
        </div>
      </div>
      
      {/* Scan button */}
      <motion.div 
        className="bg-emerald-600 rounded-lg py-2.5 text-center shadow-sm flex items-center justify-center gap-2"
        animate={{ scale: [1, 0.97, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
      >
        <ScanLine className="w-4 h-4 text-white" />
        <span className="text-white text-[11px] font-medium">Scan Member QR</span>
      </motion.div>
    </div>
  );
}

function ProScanningScreen() {
  return (
    <div className="h-full bg-stone-100 flex flex-col items-center justify-center p-3 relative">
      {/* Header */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <p className="text-stone-600 text-xs font-medium mb-3">Scan member QR</p>
      
      <div className="relative w-24 sm:w-28 h-24 sm:h-28">
        <motion.div 
          className="absolute inset-0 border-2 border-emerald-600 rounded-xl"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div 
          className="absolute inset-x-2 h-0.5 bg-emerald-600"
          animate={{ top: ['10%', '85%', '10%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <QRCodeDisplay size="small" dark />
        </div>
      </div>
      
      <div className="absolute bottom-3 left-3 right-3">
        <div className="bg-white rounded-lg p-2 border border-stone-200 shadow-sm flex justify-between items-center">
          <span className="text-stone-500 text-[10px]">Cart</span>
          <span className="text-emerald-600 text-xs font-medium">$45.00</span>
        </div>
      </div>
    </div>
  );
}

function ProPaymentSuccessScreen() {
  return (
    <div className="h-full bg-stone-50 flex flex-col items-center justify-center p-3 relative">
      {/* Header */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <motion.div 
        className="w-16 sm:w-18 h-16 sm:h-18 bg-emerald-600 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Check className="w-8 sm:w-9 h-8 sm:h-9 text-white" />
      </motion.div>
      
      <p className="mt-4 text-stone-900 font-medium text-sm sm:text-base whitespace-nowrap">Payment Successful!</p>
      <p className="mt-1 text-stone-500 text-xs">Sarah G. • $45.00</p>
    </div>
  );
}

function ProSchedulingScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <p className="text-stone-800 text-[10px] sm:text-xs font-medium mb-2">New Session</p>
      
      <div className="bg-white rounded-lg p-2 border border-stone-200 shadow-sm mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-stone-800 text-[10px] font-medium">Sarah G.</p>
            <p className="text-stone-500 text-[8px]">4 sessions left</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-2 border border-stone-200 shadow-sm mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <div>
            <p className="text-stone-800 text-[10px]">Tomorrow</p>
            <p className="text-stone-500 text-[8px]">9:00 AM</p>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="bg-emerald-600 rounded-lg py-2 text-center shadow-sm"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <span className="text-white text-[10px] font-medium">Book Session</span>
      </motion.div>
    </div>
  );
}

function ProScheduledScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <div className="text-center mb-3">
        <motion.div 
          className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Check className="w-6 h-6 text-white" />
        </motion.div>
        <p className="text-stone-800 text-xs font-medium">Booked!</p>
      </div>
      
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-emerald-100 px-2 py-1">
          <p className="text-emerald-700 text-[9px] font-medium">Tomorrow • 9:00 AM</p>
        </div>
        <div className="p-2">
          <p className="text-stone-800 text-[10px] font-medium mb-1">Personal Training</p>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center">
              <User className="w-2 h-2 text-stone-500" />
            </div>
            <p className="text-stone-500 text-[9px]">Sarah G.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SHARED COMPONENTS =====

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl">
      <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center text-emerald-500 mb-3">
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-stone-50 mb-1">{title}</h4>
      <p className="text-stone-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
}
