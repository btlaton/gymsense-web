/**
 * GymSense Landing Page
 * 
 * Auto-playing story scenes showing how Pro and Member apps work together.
 * Simple, reliable animation that works across all devices.
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
  QrCode,
  Check,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  MapPinCheck
} from 'lucide-react';

// ===== STORY CONFIGURATION =====
const STORIES = [
  {
    id: 'check-in',
    title: 'Touchless Member Check-Ins',
    steps: [
      {
        narrative: "Sarah scans the gym's QR code at the entrance.",
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
    steps: [
      {
        narrative: "Sarah shows her payment QR to the staff.",
        memberPhase: 'qr-display',
        proPhase: 'scanning',
      },
      {
        narrative: "Payment complete on both devices instantly.",
        memberPhase: 'payment-success',
        proPhase: 'payment-success',
      },
    ],
  },
  {
    id: 'session',
    title: 'Instant Session Bookings',
    steps: [
      {
        narrative: "Marcus schedules Sarah's next PT session.",
        memberPhase: 'home',
        proPhase: 'scheduling',
      },
      {
        narrative: "Sarah's app instantly shows the new session.",
        memberPhase: 'new-session',
        proPhase: 'scheduled',
      },
    ],
  },
];

export default function Home() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const story = STORIES[storyIndex];
  const step = story.steps[stepIndex];

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
            The gym management app you{' '}
            <span className="text-emerald-400">actually want</span> to use
          </h2>
          
          {/* Subheadline */}
          <p className="text-sm sm:text-base text-stone-400 mb-4 max-w-xl mx-auto">
            Modern software for gym owners and their members. 
            QR check-ins, instant payments, real-time sync.
          </p>
          
          {/* CTA Button */}
          <a 
            href="#waitlist" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-sm sm:text-base"
          >
            Join the Waitlist
            <ArrowRight className="w-4 h-4" />
          </a>
          
          {/* Status Badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Launching Q1 2026
          </div>
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

          {/* Story Tabs - Two line support */}
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {STORIES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStory(i)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-center leading-tight min-w-[100px] sm:min-w-[120px] ${
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
            {/* Phones Container - No gap, side by side */}
            <div className="flex justify-center items-start gap-2 sm:gap-3">
              {/* Member Phone */}
              <div className="flex flex-col items-center">
                <PhoneMockup>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`member-${storyIndex}-${stepIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <MemberScreen phase={step.memberPhase} />
                    </motion.div>
                  </AnimatePresence>
                </PhoneMockup>
                <div className="mt-2 text-center">
                  <div className="text-stone-300 font-medium text-xs sm:text-sm">Member App</div>
                </div>
              </div>

              {/* Pro Phone */}
              <div className="flex flex-col items-center">
                <PhoneMockup variant="light">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`pro-${storyIndex}-${stepIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ProScreen phase={step.proPhase} />
                    </motion.div>
                  </AnimatePresence>
                </PhoneMockup>
                <div className="mt-2 text-center">
                  <div className="text-emerald-400 font-medium text-xs sm:text-sm">Pro App</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button 
                onClick={goPrev}
                className="p-2 rounded-full bg-stone-800 text-stone-400 hover:bg-stone-700 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Step indicators */}
              <div className="flex gap-1.5">
                {STORIES.flatMap((s, si) => 
                  s.steps.map((_, sti) => {
                    const isActive = si === storyIndex && sti === stepIndex;
                    const isPast = si < storyIndex || (si === storyIndex && sti < stepIndex);
                    return (
                      <div 
                        key={`${si}-${sti}`}
                        className={`h-1.5 rounded-full transition-all ${
                          isActive ? 'w-4 bg-emerald-500' : 
                          isPast ? 'w-1.5 bg-emerald-700' : 'w-1.5 bg-stone-700'
                        }`}
                      />
                    );
                  })
                )}
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
              icon={<QrCode className="w-5 h-5" />}
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

// ===== PHONE MOCKUP - Increased by ~10% =====

function PhoneMockup({ 
  children, 
  variant = 'dark'
}: { 
  children: React.ReactNode;
  variant?: 'dark' | 'light';
}) {
  return (
    <div className="relative w-[154px] sm:w-[176px] md:w-[198px] h-[308px] sm:h-[352px] md:h-[396px] bg-stone-800 rounded-[1.75rem] sm:rounded-[2.25rem] p-1.5 shadow-xl">
      <div className={`w-full h-full rounded-[1.5rem] sm:rounded-[1.75rem] overflow-hidden relative ${
        variant === 'dark' ? 'bg-stone-900' : 'bg-stone-50'
      }`}>
        {/* Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 sm:w-18 h-4 sm:h-5 bg-stone-800 rounded-full z-10" />
        
        {/* Screen */}
        <div className="w-full h-full pt-7 sm:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}

// ===== MEMBER SCREENS =====

function MemberScreen({ phase }: { phase: string }) {
  switch (phase) {
    case 'scanning':
      return <MemberScanningScreen />;
    case 'success':
      return <MemberSuccessScreen />;
    case 'qr-display':
      return <MemberQRScreen />;
    case 'payment-success':
      return <MemberPaymentSuccessScreen />;
    case 'home':
      return <MemberHomeScreen />;
    case 'new-session':
      return <MemberNewSessionScreen />;
    default:
      return <MemberHomeScreen />;
  }
}

function MemberScanningScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-3 relative">
      {/* Header with logo and avatar */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      {/* Scanning frame with larger QR icon */}
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
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <QrCode className="w-full h-full text-stone-50" strokeWidth={1} />
        </div>
      </div>
      
      <p className="mt-4 text-stone-400 text-xs">Scanning...</p>
    </div>
  );
}

function MemberSuccessScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-3 relative">
      {/* Header with logo and avatar */}
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
      <p className="mt-2 text-stone-200 text-xs sm:text-sm">Have a great workout, Sarah!</p>
    </div>
  );
}

function MemberQRScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-3 relative">
      {/* Header with logo and avatar */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-500 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-400" />
        </div>
      </div>
      
      <p className="text-stone-300 text-xs mb-2">Scan to Pay</p>
      
      <motion.div 
        className="w-28 sm:w-32 h-28 sm:h-32 bg-white rounded-xl flex items-center justify-center"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <QrCode className="w-24 sm:w-28 h-24 sm:h-28 text-stone-900" strokeWidth={1} />
      </motion.div>
      
      <p className="mt-3 text-stone-500 text-xs">Show to staff</p>
    </div>
  );
}

function MemberPaymentSuccessScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-3 relative">
      {/* Header with logo and avatar */}
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
      
      <p className="mt-4 text-stone-50 font-medium text-sm sm:text-base">Paid!</p>
      <p className="mt-1 text-emerald-400 text-xs font-medium">$45.00</p>
    </div>
  );
}

function MemberHomeScreen() {
  return (
    <div className="h-full bg-stone-900 p-3 relative">
      {/* Header with logo and avatar */}
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
          <QrCode className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
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
      {/* Header with logo and avatar with notification */}
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

// ===== PRO SCREENS =====

function ProScreen({ phase }: { phase: string }) {
  switch (phase) {
    case 'waiting':
      return <ProWaitingScreen />;
    case 'new-checkin':
      return <ProNewCheckinScreen />;
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

function ProWaitingScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header with logo and avatar */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <p className="text-stone-800 text-[10px] sm:text-xs font-medium mb-2">Today&apos;s Check-ins</p>
      
      {/* Cards in reverse order (most recent first) with shadows */}
      <div className="space-y-1">
        <CheckInRow name="David K." time="8:45 AM" />
        <CheckInRow name="Jessica L." time="8:32 AM" />
        <CheckInRow name="Mike R." time="8:15 AM" />
      </div>
    </div>
  );
}

function ProNewCheckinScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header with logo and avatar */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
      <p className="text-stone-800 text-[10px] sm:text-xs font-medium mb-2">Today&apos;s Check-ins</p>
      
      {/* Sarah's card at top with pop animation, pushing others down */}
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
        
        {/* Other cards pushed down */}
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CheckInRow name="David K." time="8:45 AM" />
        </motion.div>
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <CheckInRow name="Jessica L." time="8:32 AM" />
        </motion.div>
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CheckInRow name="Mike R." time="8:15 AM" />
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

function ProScanningScreen() {
  return (
    <div className="h-full bg-stone-100 flex flex-col items-center justify-center p-3 relative">
      {/* Header with logo and avatar */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between">
        <span className="font-display text-emerald-600 text-sm">gymsense</span>
        <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
          <User className="w-3 h-3 text-stone-500" />
        </div>
      </div>
      
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
      </div>
      
      <p className="mt-4 text-stone-600 text-xs">Scan member QR</p>
      
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
      {/* Header with logo and avatar */}
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
      
      <p className="mt-4 text-stone-900 font-medium text-sm sm:text-base">Paid!</p>
      <p className="mt-1 text-stone-500 text-xs">Sarah G. • $45.00</p>
    </div>
  );
}

function ProSchedulingScreen() {
  return (
    <div className="h-full bg-stone-50 p-3 relative">
      {/* Header with logo and avatar */}
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
      {/* Header with logo and avatar */}
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
