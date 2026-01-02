/**
 * GymSense Landing Page
 * 
 * Scroll-triggered story experience showcasing how the Pro and Member apps work together.
 * Uses Framer Motion for smooth scroll-linked animations.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Smartphone, 
  BarChart3, 
  Zap,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Clock,
  Check,
  User,
  Plus,
  Bell
} from 'lucide-react';

// ===== STORY SCENES CONFIGURATION =====
const STORY_SCENES = [
  {
    id: 'check-in',
    title: 'Instant Check-In',
    steps: [
      {
        narrative: "Sarah arrives at the gym and opens the Gymsense app.",
        focus: 'member',
        memberPhase: 'ready',
        proPhase: 'idle',
      },
      {
        narrative: "She scans the gym's QR code at the entrance.",
        focus: 'member',
        memberPhase: 'scanning',
        proPhase: 'idle',
      },
      {
        narrative: "Check-in confirmed! Welcome to the gym.",
        focus: 'member',
        memberPhase: 'success',
        proPhase: 'idle',
        showSync: true,
      },
      {
        narrative: "Instantly, the gym owner sees Sarah checked in on the Pro app.",
        focus: 'pro',
        memberPhase: 'success',
        proPhase: 'new-checkin',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Seamless Payments',
    steps: [
      {
        narrative: "After her workout, Sarah wants to buy a protein shake.",
        focus: 'member',
        memberPhase: 'qr-display',
        proPhase: 'idle',
      },
      {
        narrative: "She shows her payment QR code to the staff.",
        focus: 'both',
        memberPhase: 'qr-display',
        proPhase: 'scanning',
        showSync: true,
      },
      {
        narrative: "The staff scans it with the Pro app—payment complete!",
        focus: 'pro',
        memberPhase: 'payment-success',
        proPhase: 'payment-success',
      },
      {
        narrative: "Both apps show the confirmed transaction instantly.",
        focus: 'both',
        memberPhase: 'payment-success',
        proPhase: 'payment-success',
      },
    ],
  },
  {
    id: 'session',
    title: 'Training Sessions',
    steps: [
      {
        narrative: "Marcus, the trainer, schedules Sarah's next PT session.",
        focus: 'pro',
        memberPhase: 'home',
        proPhase: 'scheduling',
      },
      {
        narrative: "He picks a time slot and confirms the booking.",
        focus: 'pro',
        memberPhase: 'home',
        proPhase: 'confirming',
      },
      {
        narrative: "Session scheduled! The calendar is updated.",
        focus: 'pro',
        memberPhase: 'home',
        proPhase: 'scheduled',
        showSync: true,
      },
      {
        narrative: "Sarah's app instantly shows her new upcoming session.",
        focus: 'member',
        memberPhase: 'new-session',
        proPhase: 'scheduled',
      },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50 overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Story Sections */}
      <section className="relative">
        <div className="text-center py-16 px-6">
          <h3 className="text-stone-500 uppercase tracking-wider text-sm font-semibold mb-4">
            See It In Action
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-50 mb-4">
            Two apps, perfectly in sync
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Scroll to see how the Pro and Member apps work together in real-time.
          </p>
          </div>
          
        {STORY_SCENES.map((scene, index) => (
          <StoryScene key={scene.id} scene={scene} sceneIndex={index} />
        ))}
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-6 bg-stone-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-stone-500 uppercase tracking-wider text-sm font-semibold mb-4">
            The Problem
          </h3>
          <p className="text-xl md:text-2xl text-stone-300 mb-6 leading-relaxed">
            Gym management software hasn&apos;t evolved in over a decade. Owners are overpaying for bloated apps with clunky interfaces, archaic business reporting masked as &quot;AI-powered insights&quot;, and annoying calls with &quot;engagement&quot; representatives just to add a new product for sale.
          </p>
          <p className="text-xl md:text-2xl text-emerald-400 leading-relaxed font-medium">
            Ditch the computer/iPad-based check-ins, hardware-required in-person payments, and hidden payment processing fees.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-stone-500 uppercase tracking-wider text-sm font-semibold mb-4">
              Built Different
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-50 mb-4">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              Designed from the ground up for modern gyms and their members.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Calendar className="w-6 h-6" />}
              title="Smart Scheduling"
              description="Drag-and-drop calendar. Book sessions in seconds. See your week at a glance."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="Customer Profiles"
              description="Full training history, packages, and billing in one beautiful view."
            />
            <FeatureCard 
              icon={<CreditCard className="w-6 h-6" />}
              title="Seamless Payments"
              description="Stripe-powered. Automatic billing. Accept cards, Apple Pay, and more."
            />
            <FeatureCard 
              icon={<Smartphone className="w-6 h-6" />}
              title="Member App"
              description="QR check-in. Session booking. Payment history. Your brand, their phone."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-time Financials"
              description="Revenue tracking, transaction history, and insights at your fingertips."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title="Instant Sync"
              description="Changes in the Pro app appear instantly in the Member app. No refresh needed."
            />
          </div>
        </div>
      </section>

      {/* Waitlist CTA Section */}
      <section id="waitlist" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-50 mb-4">
            Ready to upgrade your gym?
          </h2>
          <p className="text-stone-400 mb-8">
            We&apos;re launching with a select group of gyms in early 2026. 
            Join the waitlist to get early access and founder pricing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-stone-900 border border-stone-700 rounded-xl text-stone-50 placeholder:text-stone-500 focus:outline-none focus:border-emerald-600 transition-colors"
            />
            <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-600/25">
              Join Waitlist
            </button>
          </div>
          
          <p className="text-stone-600 text-sm mt-4">
            No spam. Just updates on our launch.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-emerald-500">gymsense</span>
          </div>
          
          <div className="flex gap-6 text-stone-500 text-sm">
            <a href="/privacy" className="hover:text-stone-300 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-stone-300 transition-colors">Terms</a>
            <a href="/sms-terms" className="hover:text-stone-300 transition-colors">SMS Terms</a>
          </div>
          
          <p className="text-stone-600 text-sm">
            © 2026 gymsense. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

// ===== HERO SECTION =====

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950" />
      
      {/* Decorative glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo */}
        <motion.h1 
          className="font-display text-5xl md:text-7xl text-emerald-500 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          gymsense
        </motion.h1>
        
        {/* Headline */}
        <motion.h2 
          className="text-2xl md:text-4xl font-semibold text-stone-50 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The gym management app you{' '}
          <span className="text-emerald-400">actually want</span> to use
        </motion.h2>
        
        {/* Subheadline */}
        <motion.p 
          className="text-base md:text-lg text-stone-400 mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Modern, mobile-first software for gym owners and their members. 
          Instant QR scanning for check-in and in-person payments. 
          Automated billing for memberships. Real-time financial insights.
        </motion.p>
        
        {/* Migration pitch */}
        <motion.div 
          className="text-lg md:text-2xl mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-stone-300 mb-1">Migrate from your current system in less than a day.</p>
          <p className="text-emerald-400">Find out why gyms are choosing to switch to gymsense.</p>
        </motion.div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a 
            href="#waitlist" 
            className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/25"
          >
            Join the Waitlist
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
        
        {/* Status Badge */}
        <motion.div 
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 border border-stone-800 text-stone-400 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Launching Q1 2026
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-stone-600 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ===== STORY SCENE COMPONENT =====

function StoryScene({ scene, sceneIndex }: { scene: typeof STORY_SCENES[0]; sceneIndex: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Calculate which step we're on based on scroll (0-3 for 4 steps)
  const stepProgress = useTransform(smoothProgress, [0.2, 0.8], [0, scene.steps.length - 0.01]);
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    const unsubscribe = stepProgress.on("change", (latest) => {
      const step = Math.max(0, Math.min(scene.steps.length - 1, Math.floor(latest)));
      setCurrentStep(step);
    });
    return () => unsubscribe();
  }, [stepProgress, scene.steps.length]);
  
  const step = scene.steps[currentStep];
  
  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ height: `${150 * scene.steps.length}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient for this scene */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          sceneIndex === 0 ? 'bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950/20' :
          sceneIndex === 1 ? 'bg-gradient-to-br from-stone-950 via-stone-900 to-stone-900' :
          'bg-gradient-to-br from-stone-950 via-emerald-950/10 to-stone-900'
        }`} />
        
        {/* Scene title */}
        <motion.div 
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="px-4 py-2 bg-stone-800/80 backdrop-blur-sm rounded-full border border-stone-700">
            <span className="text-emerald-400 text-sm font-medium">{scene.title}</span>
          </div>
        </motion.div>
        
        {/* Main content area */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            
            {/* Member Phone */}
            <motion.div
              className="relative"
              animate={{
                x: step.focus === 'pro' ? -30 : 0,
                scale: step.focus === 'member' || step.focus === 'both' ? 1 : 0.9,
                opacity: step.focus === 'pro' ? 0.5 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <PhoneMockup variant="dark">
                <MemberAppScreen phase={step.memberPhase} />
              </PhoneMockup>
              <div className="mt-4 text-center">
                <div className="text-stone-300 font-medium text-sm">Member App</div>
                <div className="text-stone-500 text-xs">For gym members</div>
              </div>
            </motion.div>
            
            {/* Connection Animation */}
            <div className="hidden lg:block relative w-32">
              <SyncAnimation active={step.showSync || false} />
            </div>
            
            {/* Pro Phone */}
            <motion.div
              className="relative"
              animate={{
                x: step.focus === 'member' ? 30 : 0,
                scale: step.focus === 'pro' || step.focus === 'both' ? 1 : 0.9,
                opacity: step.focus === 'member' ? 0.5 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <PhoneMockup variant="light">
                <ProAppScreen phase={step.proPhase} />
              </PhoneMockup>
              <div className="mt-4 text-center">
                <div className="text-emerald-400 font-medium text-sm">Pro App</div>
                <div className="text-stone-500 text-xs">For gym owners</div>
              </div>
            </motion.div>
          </div>
          
          {/* Narrative Text */}
          <motion.div 
            className="mt-8 text-center"
            key={`${scene.id}-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xl md:text-2xl text-stone-200 max-w-2xl mx-auto leading-relaxed">
              {step.narrative}
            </p>
          </motion.div>
          
          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {scene.steps.map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'bg-emerald-500 w-6' : 'bg-stone-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SYNC ANIMATION =====

function SyncAnimation({ active }: { active: boolean }) {
  return (
    <div className="relative h-20 flex items-center justify-center">
      {/* Connection line */}
      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-stone-800" />
      
      {/* Animated particles */}
      {active && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"
              initial={{ x: -60, opacity: 0 }}
              animate={{ 
                x: [- 60, 60],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
      
      {/* Sync icon */}
      <motion.div 
        className="relative z-10 w-10 h-10 bg-stone-900 border-2 border-emerald-500 rounded-full flex items-center justify-center"
        animate={active ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: active ? Infinity : 0 }}
      >
        <Zap className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-stone-600'}`} />
      </motion.div>
    </div>
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
    <div className="relative">
      {/* Outer bezel */}
      <div className="w-[220px] sm:w-[260px] h-[440px] sm:h-[520px] bg-stone-800 rounded-[2.5rem] sm:rounded-[3rem] p-2 shadow-2xl shadow-black/50">
        {/* Inner bezel */}
        <div className={`w-full h-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative ${
          variant === 'dark' ? 'bg-stone-900' : 'bg-stone-50'
        }`}>
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-stone-950 rounded-full z-10" />
          
          {/* Screen content */}
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </div>
      
      {/* Highlight effect */}
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}

// ===== MEMBER APP SCREENS =====

function MemberAppScreen({ phase }: { phase: string }) {
  switch (phase) {
    case 'ready':
      return <MemberReadyScreen />;
    case 'scanning':
      return <MemberScanningScreen />;
    case 'success':
      return <MemberSuccessScreen />;
    case 'qr-display':
      return <MemberQRDisplayScreen />;
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

function MemberReadyScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-6 pt-12">
      <div className="absolute top-10 left-4">
        <span className="font-display text-emerald-500 text-lg">gymsense</span>
      </div>
      
      <div className="w-32 h-32 border-2 border-dashed border-stone-700 rounded-2xl flex items-center justify-center mb-6">
        <QrCode className="w-16 h-16 text-stone-600" />
      </div>
      
      <p className="text-stone-300 font-medium text-center mb-2">Ready to Check In</p>
      <p className="text-stone-500 text-sm text-center">Point camera at gym QR code</p>
      
      <div className="absolute bottom-8 left-4 right-4">
        <div className="px-4 py-3 bg-emerald-600 rounded-xl text-center">
          <span className="text-white font-medium">Open Scanner</span>
        </div>
      </div>
    </div>
  );
}

function MemberScanningScreen() {
  return (
    <div className="h-full bg-stone-950 flex flex-col items-center justify-center relative">
        {/* Simulated camera background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-800/40 via-stone-900/60 to-stone-950/80" />
        
      <div className="absolute top-10 left-0 right-0 px-4 text-center">
        <span className="font-display text-emerald-500 text-lg">gymsense</span>
        </div>
        
        {/* Scanning frame */}
      <div className="relative w-36 h-36 z-10">
          {/* Animated corners */}
        <motion.div 
          className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500 rounded-tl-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500 rounded-tr-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500 rounded-bl-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500 rounded-br-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
        />
        
        {/* Scanning line */}
        <motion.div 
          className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
          animate={{ top: ["10%", "85%", "10%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
          <div className="absolute inset-0 flex items-center justify-center">
          <QrCode className="w-16 h-16 text-white/20" />
          </div>
        </div>
        
      <p className="mt-6 text-stone-400 text-sm z-10">Scanning...</p>
      
      <div className="absolute bottom-8 left-4 right-4">
        <div className="px-4 py-2.5 bg-stone-800/90 rounded-full text-center border border-stone-700">
          <span className="text-emerald-400 text-sm">● Searching for QR code</span>
          </div>
        </div>
      </div>
  );
}

function MemberSuccessScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col items-center justify-center p-6">
      <div className="absolute top-10 left-0 right-0 text-center">
        <span className="font-display text-emerald-500 text-lg">gymsense</span>
        </div>
        
      <motion.div 
        className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-stone-50 font-semibold text-xl text-center mb-1">Checked In!</p>
        <p className="text-stone-400 text-sm text-center">Welcome to The Atlas Gym</p>
      </motion.div>
      
      <div className="absolute bottom-8 text-stone-500 text-sm">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}

function MemberQRDisplayScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col p-4 pt-12">
      <div className="flex items-center justify-between mb-6">
        <span className="font-display text-emerald-500 text-lg">gymsense</span>
        <div className="w-8 h-8 rounded-full bg-stone-700" />
        </div>
        
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-stone-200 font-medium mb-1">Scan to Pay</p>
        <p className="text-stone-500 text-sm mb-6">Show this to complete purchase</p>
          
          {/* QR Code */}
        <motion.div 
          className="relative"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/10">
            <QrCode className="w-32 h-32 text-stone-900" />
            </div>
            {/* Animated corners */}
          <motion.div 
            className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-500 rounded-tl"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-500 rounded-tr"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
          />
          <motion.div 
            className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-500 rounded-bl"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-500 rounded-br"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
          />
        </motion.div>
        
        <p className="mt-6 text-stone-500 text-sm">Expires in 4:59</p>
        </div>
      </div>
  );
}

function MemberPaymentSuccessScreen() {
  return (
    <div className="h-full bg-stone-900 flex flex-col p-4 pt-12">
      <div className="text-center mb-6">
        <span className="font-display text-emerald-500 text-lg">gymsense</span>
        </div>
        
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div 
          className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        
        <p className="text-stone-50 font-semibold text-xl text-center mb-1">Payment Complete!</p>
        <p className="text-stone-400 text-sm text-center mb-6">Paid to The Atlas Gym</p>
        
        <div className="w-full bg-stone-800 rounded-xl p-4 border border-stone-700">
            <div className="flex justify-between items-center">
            <span className="text-stone-400 text-sm">Total</span>
            <span className="text-emerald-400 font-semibold text-lg">$45.00</span>
            </div>
          </div>
        </div>
        
      <div className="pb-4">
        <div className="w-full py-3 bg-emerald-950 border border-emerald-900 rounded-xl text-center text-white font-medium">
            Done
        </div>
      </div>
    </div>
  );
}

function MemberHomeScreen() {
  return (
    <div className="h-full bg-stone-900 p-4 pt-12">
      <div className="flex items-center justify-between mb-6">
        <span className="font-display text-emerald-500 text-lg">gymsense</span>
        <div className="w-8 h-8 rounded-full bg-stone-700" />
      </div>
      
      <div className="mb-6">
        <p className="text-stone-200 font-medium mb-1">Welcome back, Sarah!</p>
        <p className="text-stone-500 text-sm">Your membership is active</p>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-stone-800 rounded-xl p-4 text-center border border-stone-700">
          <QrCode className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <span className="text-stone-300 text-xs">Check In</span>
        </div>
        <div className="bg-stone-800 rounded-xl p-4 text-center border border-stone-700">
          <CreditCard className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <span className="text-stone-300 text-xs">Pay</span>
        </div>
      </div>
      
      {/* No sessions */}
      <div className="text-stone-500 text-sm mb-3">Upcoming Sessions</div>
      <div className="bg-stone-800/50 rounded-xl p-4 border border-dashed border-stone-700 text-center">
        <p className="text-stone-500 text-sm">No upcoming sessions</p>
          </div>
          </div>
  );
}

function MemberNewSessionScreen() {
  return (
    <div className="h-full bg-stone-900 p-4 pt-12">
      <div className="flex items-center justify-between mb-6">
        <span className="font-display text-emerald-500 text-lg">gymsense</span>
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-stone-700" />
          <motion.div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <span className="text-white text-xs font-bold">1</span>
          </motion.div>
          </div>
        </div>
      
      <div className="mb-6">
        <p className="text-stone-200 font-medium mb-1">Welcome back, Sarah!</p>
        <p className="text-stone-500 text-sm">Your membership is active</p>
      </div>
      
      {/* New session notification */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="bg-emerald-600/20 border border-emerald-600/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">New Session Booked!</span>
        </div>
          <p className="text-stone-200 font-medium mb-1">Personal Training</p>
          <p className="text-stone-400 text-sm">Tomorrow • 9:00 AM - 10:00 AM</p>
          <p className="text-stone-500 text-sm">with Marcus</p>
      </div>
      </motion.div>
      
      {/* Session card */}
      <div className="text-stone-500 text-sm mb-3">Upcoming Sessions</div>
      <motion.div 
        className="bg-stone-800 border border-stone-700 rounded-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-400 text-sm">Tomorrow</span>
        </div>
        <p className="text-stone-200 font-medium">Personal Training</p>
        <p className="text-stone-400 text-sm">9:00 AM • 60 min</p>
      </motion.div>
    </div>
  );
}

// ===== PRO APP SCREENS =====

function ProAppScreen({ phase }: { phase: string }) {
  switch (phase) {
    case 'idle':
      return <ProIdleScreen />;
    case 'new-checkin':
      return <ProNewCheckinScreen />;
    case 'scanning':
      return <ProScanningScreen />;
    case 'payment-success':
      return <ProPaymentSuccessScreen />;
    case 'scheduling':
      return <ProSchedulingScreen />;
    case 'confirming':
      return <ProConfirmingScreen />;
    case 'scheduled':
      return <ProScheduledScreen />;
    default:
      return <ProIdleScreen />;
  }
}

function ProIdleScreen() {
  return (
    <div className="h-full bg-stone-50 p-4 pt-12">
      <div className="flex items-center justify-between mb-6">
        <span className="font-display text-emerald-600 text-lg">gymsense</span>
        <div className="w-8 h-8 rounded-full bg-stone-300" />
      </div>
      
      <p className="text-stone-800 font-medium mb-4">Today&apos;s Check-ins</p>
      
      <div className="space-y-2">
        <ProCheckInRow name="Mike R." time="8:15 AM" />
        <ProCheckInRow name="Jessica L." time="8:32 AM" />
        <ProCheckInRow name="David K." time="8:45 AM" />
      </div>
      
      <div className="absolute bottom-6 left-4 right-4">
        <div className="flex gap-2">
          <div className="flex-1 bg-stone-200 rounded-lg p-3 text-center">
            <div className="text-stone-800 font-semibold">3</div>
            <div className="text-stone-500 text-xs">Today</div>
          </div>
          <div className="flex-1 bg-stone-200 rounded-lg p-3 text-center">
            <div className="text-stone-800 font-semibold">28</div>
            <div className="text-stone-500 text-xs">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProNewCheckinScreen() {
  return (
    <div className="h-full bg-stone-50 p-4 pt-12">
      <div className="flex items-center justify-between mb-6">
        <span className="font-display text-emerald-600 text-lg">gymsense</span>
        <div className="w-8 h-8 rounded-full bg-stone-300" />
      </div>
      
      <p className="text-stone-800 font-medium mb-4">Today&apos;s Check-ins</p>
      
      <div className="space-y-2">
        <ProCheckInRow name="Mike R." time="8:15 AM" />
        <ProCheckInRow name="Jessica L." time="8:32 AM" />
        <ProCheckInRow name="David K." time="8:45 AM" />
        
        {/* New check-in - highlighted */}
        <motion.div 
          className="bg-emerald-100 border-2 border-emerald-400 rounded-xl p-3 flex items-center gap-3"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
      </div>
      <div className="flex-1">
            <div className="text-stone-900 font-medium">Sarah M.</div>
            <div className="text-emerald-600 text-sm font-medium">Just now</div>
          </div>
          <motion.div 
            className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-6 left-4 right-4">
        <div className="flex gap-2">
          <div className="flex-1 bg-stone-200 rounded-lg p-3 text-center">
            <motion.div 
              className="text-stone-800 font-semibold"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              4
            </motion.div>
            <div className="text-stone-500 text-xs">Today</div>
          </div>
          <div className="flex-1 bg-stone-200 rounded-lg p-3 text-center">
            <div className="text-stone-800 font-semibold">29</div>
            <div className="text-stone-500 text-xs">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProCheckInRow({ name, time }: { name: string; time: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
        <User className="w-5 h-5 text-stone-500" />
      </div>
      <div className="flex-1">
        <div className="text-stone-800 font-medium">{name}</div>
        <div className="text-stone-500 text-sm">{time}</div>
      </div>
    </div>
  );
}

function ProScanningScreen() {
  return (
    <div className="h-full bg-stone-100 flex flex-col items-center justify-center relative">
      <div className="absolute top-10 left-4">
        <span className="font-display text-emerald-600 text-lg">gymsense</span>
        </div>
        
        {/* Scanning frame */}
      <div className="relative w-36 h-36">
        <motion.div 
          className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-600 rounded-tl-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-600 rounded-tr-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-600 rounded-bl-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-600 rounded-br-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
        />
        
        {/* Scanning line */}
        <motion.div 
          className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"
          animate={{ top: ["10%", "85%", "10%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
          
          <div className="absolute inset-0 flex items-center justify-center">
          <QrCode className="w-12 h-12 text-emerald-600/30" />
          </div>
        </div>
        
      <p className="mt-6 text-stone-600 text-sm">Scan member QR code</p>
        
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
            <div className="flex justify-between items-center">
            <span className="text-stone-500 text-sm">Cart Total</span>
            <span className="text-emerald-600 font-semibold">$45.00</span>
            </div>
          </div>
        </div>
      </div>
  );
}

function ProPaymentSuccessScreen() {
  return (
    <div className="h-full bg-stone-50 flex flex-col p-4 pt-12">
      <div className="text-center mb-6">
        <span className="font-display text-emerald-600 text-lg">gymsense</span>
        </div>
        
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div 
          className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        
        <p className="text-stone-900 font-semibold text-xl text-center mb-1">Payment Complete!</p>
        <p className="text-stone-500 text-sm text-center mb-6">Charged to Sarah M.</p>
        
        <div className="w-full bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-stone-700 text-sm">Protein Shake</span>
            <span className="text-stone-700 text-sm">$45.00</span>
            </div>
          <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
            <span className="text-stone-500 text-sm">Total</span>
              <span className="text-emerald-600 font-semibold">$45.00</span>
            </div>
          </div>
        </div>
        
      <div className="pb-4">
        <div className="w-full py-3 bg-emerald-600 rounded-xl text-center text-white font-medium">
            Done
        </div>
      </div>
    </div>
  );
}

function ProSchedulingScreen() {
  return (
    <div className="h-full bg-stone-50 p-4 pt-12">
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-emerald-600 text-lg">gymsense</span>
        <div className="w-8 h-8 rounded-full bg-stone-300" />
      </div>
      
      <p className="text-stone-800 font-medium mb-4">New Session</p>
      
      {/* Customer selection */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 mb-4 shadow-sm">
        <p className="text-stone-500 text-xs mb-2">Client</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-stone-800 font-medium">Sarah M.</p>
            <p className="text-stone-500 text-sm">4 sessions remaining</p>
          </div>
        </div>
        </div>
        
      {/* Date/Time */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 mb-4 shadow-sm">
        <p className="text-stone-500 text-xs mb-2">Date & Time</p>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-stone-800 font-medium">Tomorrow</p>
            <p className="text-stone-500 text-sm">Select time...</p>
          </div>
        </div>
      </div>
      
      {/* Time slots */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-stone-200 rounded-lg py-2 text-center text-stone-500 text-sm">8:00</div>
        <motion.div 
          className="bg-emerald-600 rounded-lg py-2 text-center text-white text-sm"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          9:00
        </motion.div>
        <div className="bg-stone-200 rounded-lg py-2 text-center text-stone-500 text-sm">10:00</div>
      </div>
    </div>
  );
}

function ProConfirmingScreen() {
  return (
    <div className="h-full bg-stone-50 p-4 pt-12">
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-emerald-600 text-lg">gymsense</span>
        <div className="w-8 h-8 rounded-full bg-stone-300" />
      </div>
      
      <p className="text-stone-800 font-medium mb-4">Confirm Session</p>
      
      {/* Session summary */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
            <p className="text-stone-800 font-medium">Sarah M.</p>
            <p className="text-stone-500 text-sm">Personal Training</p>
            </div>
          </div>
          
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
            <span className="text-stone-500">Date</span>
            <span className="text-stone-800">Tomorrow</span>
            </div>
            <div className="flex justify-between">
            <span className="text-stone-500">Time</span>
            <span className="text-stone-800">9:00 AM - 10:00 AM</span>
            </div>
            <div className="flex justify-between">
            <span className="text-stone-500">Duration</span>
            <span className="text-stone-800">60 min</span>
            </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Trainer</span>
            <span className="text-stone-800">Marcus</span>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="w-full py-3 bg-emerald-600 rounded-xl text-center text-white font-medium"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        Confirm Booking
      </motion.div>
    </div>
  );
}

function ProScheduledScreen() {
  return (
    <div className="h-full bg-stone-50 p-4 pt-12">
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-emerald-600 text-lg">gymsense</span>
        <div className="w-8 h-8 rounded-full bg-stone-300" />
      </div>
      
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <p className="text-stone-800 font-semibold text-lg">Session Scheduled!</p>
        <p className="text-stone-500 text-sm">Sarah will be notified</p>
      </motion.div>
      
      {/* Session card */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="bg-emerald-100 px-4 py-2 border-b border-emerald-200">
          <div className="text-emerald-700 text-sm font-medium">Tomorrow • 9:00 AM</div>
            </div>
        <div className="p-4">
          <p className="text-stone-800 font-medium mb-2">Personal Training</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
              <User className="w-4 h-4 text-stone-500" />
          </div>
            <div>
              <p className="text-stone-800 text-sm">Sarah M.</p>
              <p className="text-stone-500 text-xs">60 min • Marcus</p>
        </div>
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
    <div className="group p-6 bg-stone-900 border border-stone-800 rounded-2xl hover:border-stone-700 transition-all duration-200">
      <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-emerald-600/30 transition-colors">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-stone-50 mb-2">{title}</h4>
      <p className="text-stone-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
