/**
 * GymSense Landing Page
 * 
 * Mobile-optimized landing page showcasing the Pro and Member apps.
 * Features synchronized scene-based animations showing the apps working together.
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Smartphone, 
  BarChart3, 
  UserCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  ScanLine,
  QrCode,
  Clock,
  Check,
  User
} from 'lucide-react';

// Scene definitions with phase durations in ms
const SCENES = [
  { 
    name: 'check-in', 
    label: 'Scan to Check In',
    phases: ['scanning', 'processing', 'success', 'hold'],
    durations: [2500, 1500, 2000, 2000] 
  },
  { 
    name: 'payment', 
    label: 'Scan to Pay',
    phases: ['qr-display', 'scanning', 'success', 'hold'],
    durations: [2500, 2000, 2000, 1500] 
  },
  { 
    name: 'session', 
    label: 'Training Sessions',
    phases: ['display'],
    durations: [5000] 
  },
];

export default function Home() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Scene and phase progression
  useEffect(() => {
    const currentScene = SCENES[sceneIndex];
    const phaseDuration = currentScene.durations[phaseIndex];

    const timer = setTimeout(() => {
      // Move to next phase or next scene
      if (phaseIndex < currentScene.phases.length - 1) {
        setPhaseIndex(phaseIndex + 1);
      } else {
        // Move to next scene
        setSceneIndex((sceneIndex + 1) % SCENES.length);
        setPhaseIndex(0);
      }
    }, phaseDuration);

    return () => clearTimeout(timer);
  }, [sceneIndex, phaseIndex]);

  const currentScene = SCENES[sceneIndex];
  const currentPhase = currentScene.phases[phaseIndex];

  return (
    <main className="min-h-screen bg-stone-950 text-stone-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950" />
        
        {/* Decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo */}
          <h1 className="font-display text-5xl md:text-7xl text-emerald-500 mb-4 animate-fade-in-up">
            gymsense
          </h1>
          
          {/* Headline */}
          <h2 className="text-2xl md:text-4xl font-semibold text-stone-50 mb-4 animate-fade-in-up delay-100">
            The gym management app your members{' '}
            <span className="text-emerald-400">actually want</span> to use
          </h2>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-stone-400 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Modern, mobile-first software for gym owners and their members. 
            Beautiful design. Seamless payments. Real-time everything.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <a 
              href="#features" 
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/25"
            >
              See what&apos;s possible
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#waitlist" 
              className="px-8 py-4 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-stone-100 font-semibold rounded-xl transition-all duration-200"
            >
              Join the waitlist
            </a>
          </div>
          
          {/* Status Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 border border-stone-800 text-stone-400 text-sm animate-fade-in-up delay-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Launching Q1 2026
          </div>
        </div>
        
        {/* Phone Mockups - Synchronized Scenes */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto animate-fade-in-up delay-500">
          {/* Scene Label */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900/80 backdrop-blur border border-stone-800 rounded-full">
              <span className="text-emerald-400 font-medium text-sm">{currentScene.label}</span>
            </div>
          </div>
          
          <div className="flex justify-center items-end gap-4 md:gap-8">
            {/* Member App Phone */}
            <PhoneMockup 
              label="Member App"
              sublabel="For gym members"
              variant="secondary"
            >
              <MemberAppScreen scene={currentScene.name} phase={currentPhase} />
            </PhoneMockup>
            
            {/* Pro App Phone */}
            <PhoneMockup 
              label="Pro App"
              sublabel="For gym owners & staff"
              variant="primary"
            >
              <ProAppScreen scene={currentScene.name} phase={currentPhase} />
            </PhoneMockup>
          </div>
          
          {/* Scene indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {SCENES.map((scene, i) => (
              <button
                key={scene.name}
                onClick={() => { setSceneIndex(i); setPhaseIndex(0); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  i === sceneIndex 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                {scene.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-stone-700 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-stone-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-6 bg-stone-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-stone-500 uppercase tracking-wider text-sm font-semibold mb-4">
            The Problem
          </h3>
          <p className="text-2xl md:text-3xl text-stone-300 mb-8 leading-relaxed">
            Gym management software hasn&apos;t evolved in a decade. 
            Clunky interfaces. Frustrated members. Missed revenue.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-stone-500">
            <span className="px-4 py-2 bg-stone-800 rounded-full text-sm">Paper sign-in sheets</span>
            <span className="px-4 py-2 bg-stone-800 rounded-full text-sm">Outdated apps</span>
            <span className="px-4 py-2 bg-stone-800 rounded-full text-sm">Manual billing</span>
            <span className="px-4 py-2 bg-stone-800 rounded-full text-sm">No member app</span>
          </div>
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
          
          {/* Features Grid */}
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

      {/* App Showcase Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-stone-950 to-stone-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-stone-500 uppercase tracking-wider text-sm font-semibold mb-4">
              Two Apps, One Ecosystem
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-50 mb-4">
              Pro for you. Member app for them.
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              Everything stays in sync. You manage the gym, members manage their experience.
            </p>
          </div>
          
          {/* Side by side comparison */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Pro App */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
                <UserCheck className="w-4 h-4" />
                Pro App
              </div>
              <h4 className="text-2xl font-bold text-stone-50 mb-4">
                Run your gym from your pocket
              </h4>
              <ul className="text-left space-y-3 max-w-sm mx-auto">
                <ListItem>Visual calendar with drag-and-drop scheduling</ListItem>
                <ListItem>Scan member QR codes for instant checkout</ListItem>
                <ListItem>Full customer profiles with training history</ListItem>
                <ListItem>Team management with role-based access</ListItem>
                <ListItem>Real-time revenue and transaction tracking</ListItem>
              </ul>
            </div>
            
            {/* Member App */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 rounded-full text-stone-300 text-sm font-medium mb-6">
                <Smartphone className="w-4 h-4" />
                Member App
              </div>
              <h4 className="text-2xl font-bold text-stone-50 mb-4">
                The app members actually use
              </h4>
              <ul className="text-left space-y-3 max-w-sm mx-auto">
                <ListItem>One-tap QR check-in (no more sign-in sheets)</ListItem>
                <ListItem>View and book upcoming training sessions</ListItem>
                <ListItem>Manage payment methods securely</ListItem>
                <ListItem>See purchase history and membership status</ListItem>
                <ListItem>Beautiful dark mode that matches your brand</ListItem>
              </ul>
            </div>
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
          
          {/* Email capture form placeholder */}
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

// ===== MEMBER APP SCREENS =====

function MemberAppScreen({ scene, phase }: { scene: string; phase: string }) {
  if (scene === 'check-in') {
    return <MemberCheckInScreen phase={phase} />;
  }
  if (scene === 'payment') {
    return <MemberPaymentScreen phase={phase} />;
  }
  if (scene === 'session') {
    return <MemberSessionScreen />;
  }
  return null;
}

function MemberCheckInScreen({ phase }: { phase: string }) {
  const isScanning = phase === 'scanning' || phase === 'processing';
  const isSuccess = phase === 'success' || phase === 'hold';

  return (
    <div className="h-full w-full relative">
      {/* Camera/Scanning view */}
      <div className={`absolute inset-0 bg-stone-950 flex flex-col items-center justify-center transition-opacity duration-500 ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
        {/* Simulated camera background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-800/40 via-stone-900/60 to-stone-950/80" />
        
        {/* Header */}
        <div className="absolute top-8 left-0 right-0 px-3">
          <span className="font-display text-emerald-500 text-base">gymsense</span>
        </div>
        
        {/* Scanning frame */}
        <div className="relative w-28 h-28">
          {/* Animated corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-500 rounded-tl-lg animate-corner-pulse" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-500 rounded-tr-lg animate-corner-pulse" style={{ animationDelay: '0.25s' }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-500 rounded-bl-lg animate-corner-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-500 rounded-br-lg animate-corner-pulse" style={{ animationDelay: '0.75s' }} />
          
          {/* Scanning line - moves up and down */}
          <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-scan-line" />
          
          {/* QR icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode className="w-12 h-12 text-white/20" />
          </div>
        </div>
        
        <p className="mt-4 text-stone-400 text-xs">
          {phase === 'processing' ? 'Processing...' : 'Scan gym QR code'}
        </p>
        
        {/* Status pill */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center">
          <div className="px-3 py-1.5 bg-stone-800/90 rounded-full border border-stone-700">
            <span className="text-emerald-400 text-xs">● {phase === 'processing' ? 'Checking in...' : 'Ready to scan'}</span>
          </div>
        </div>
      </div>
      
      {/* Success overlay */}
      <div className={`absolute inset-0 bg-stone-900 flex flex-col items-center justify-center transition-opacity duration-500 ${isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="absolute top-8 left-0 right-0 px-3 text-center">
          <span className="font-display text-emerald-500 text-base">gymsense</span>
        </div>
        
        {/* Success content */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4 animate-scale-in">
            <Check className="w-8 h-8 text-white" />
          </div>
          <div className="text-stone-50 font-semibold text-lg mb-1">Checked In!</div>
          <div className="text-stone-400 text-xs">Welcome to The Atlas Gym</div>
        </div>
        
        {/* Time */}
        <div className="absolute bottom-6 text-stone-500 text-xs">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

function MemberPaymentScreen({ phase }: { phase: string }) {
  const showQR = phase === 'qr-display' || phase === 'scanning';
  const isSuccess = phase === 'success' || phase === 'hold';

  return (
    <div className="h-full w-full relative">
      {/* QR Display view */}
      <div className={`absolute inset-0 bg-stone-900 flex flex-col transition-opacity duration-500 ${showQR && !isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="pt-8 px-3 flex items-center justify-between">
          <span className="font-display text-emerald-500 text-base">gymsense</span>
          <div className="w-7 h-7 rounded-full bg-stone-700" />
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-stone-200 font-medium text-sm mb-1">Scan to Pay</div>
          <div className="text-stone-500 text-xs mb-4">Show this to complete purchase</div>
          
          {/* QR Code */}
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/10">
              <QrCode className="w-24 h-24 text-stone-900" />
            </div>
            {/* Animated corners */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br animate-pulse" />
          </div>
          
          <div className="mt-4 text-stone-500 text-xs">Expires in 4:59</div>
        </div>
      </div>
      
      {/* Success overlay */}
      <div className={`absolute inset-0 bg-stone-900 flex flex-col transition-opacity duration-500 ${isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="pt-8 px-3 text-center">
          <span className="font-display text-emerald-500 text-base">gymsense</span>
        </div>
        
        {/* Success content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4 animate-scale-in">
            <Check className="w-8 h-8 text-white" />
          </div>
          <div className="text-stone-50 font-semibold text-lg mb-1">Payment Complete!</div>
          <div className="text-stone-400 text-xs mb-4">Paid to The Atlas Gym</div>
          
          {/* Order summary card */}
          <div className="w-full bg-stone-800 rounded-xl p-3 border border-stone-700">
            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-xs">Total</span>
              <span className="text-emerald-400 font-semibold">$45.00</span>
            </div>
          </div>
        </div>
        
        {/* Done button placeholder */}
        <div className="px-4 pb-6">
          <div className="w-full py-2.5 bg-emerald-950 border border-emerald-900 rounded-xl text-center text-white text-sm font-medium">
            Done
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberSessionScreen() {
  return (
    <div className="h-full bg-stone-900 p-3 pt-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-emerald-500 text-base">gymsense</span>
        <div className="w-7 h-7 rounded-full bg-stone-700" />
      </div>
      
      {/* Welcome */}
      <div className="mb-4">
        <div className="text-stone-200 font-medium text-sm mb-0.5">Welcome back, Sarah!</div>
        <div className="text-stone-500 text-xs">Your upcoming sessions</div>
      </div>
      
      {/* Upcoming Session Card - Highlighted */}
      <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-400 text-xs font-medium">Tomorrow</span>
        </div>
        <div className="text-stone-50 font-medium text-sm mb-0.5">Personal Training</div>
        <div className="text-stone-400 text-xs">with Marcus • 9:00 AM - 10:00 AM</div>
      </div>
      
      {/* Session details */}
      <div className="bg-stone-800/50 rounded-xl p-3 mb-3">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500">Duration</span>
            <span className="text-stone-300">60 min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Location</span>
            <span className="text-stone-300">The Atlas Gym</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Sessions Left</span>
            <span className="text-emerald-400">4 of 10</span>
          </div>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="text-stone-500 text-xs mb-2">Recent Activity</div>
      <div className="space-y-2">
        <div className="bg-stone-800/30 rounded-lg p-2 flex items-center gap-2">
          <Check className="w-3 h-3 text-emerald-500" />
          <span className="text-stone-400 text-xs">Completed session • Dec 28</span>
        </div>
      </div>
    </div>
  );
}

// ===== PRO APP SCREENS =====

function ProAppScreen({ scene, phase }: { scene: string; phase: string }) {
  if (scene === 'check-in') {
    return <ProCheckInScreen phase={phase} />;
  }
  if (scene === 'payment') {
    return <ProPaymentScreen phase={phase} />;
  }
  if (scene === 'session') {
    return <ProSessionScreen />;
  }
  return null;
}

function ProCheckInScreen({ phase }: { phase: string }) {
  const showNewCheckIn = phase === 'success' || phase === 'hold';

  return (
    <div className="h-full bg-stone-900 p-3 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-emerald-500 text-base">gymsense</span>
        <div className="w-7 h-7 rounded-full bg-stone-700" />
      </div>
      
      <div className="text-stone-200 font-medium text-sm mb-3">Today&apos;s Check-ins</div>
      
      {/* Check-in list */}
      <div className="space-y-2">
        {/* Existing check-ins */}
        <CheckInRow name="Mike R." time="8:15 AM" />
        <CheckInRow name="Jessica L." time="8:32 AM" />
        <CheckInRow name="David K." time="8:45 AM" />
        
        {/* New check-in - animated */}
        <div className={`transition-all duration-500 overflow-hidden ${showNewCheckIn ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-emerald-600/20 border border-emerald-600/40 rounded-lg p-2.5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="text-stone-50 text-sm font-medium">Sarah M.</div>
              <div className="text-emerald-400 text-xs">Just now</div>
            </div>
            <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats at bottom */}
      <div className="absolute bottom-4 left-3 right-3">
        <div className="flex gap-2">
          <div className="flex-1 bg-stone-800/50 rounded-lg p-2 text-center">
            <div className="text-stone-200 font-semibold text-sm">{showNewCheckIn ? '4' : '3'}</div>
            <div className="text-stone-500 text-xs">Today</div>
          </div>
          <div className="flex-1 bg-stone-800/50 rounded-lg p-2 text-center">
            <div className="text-stone-200 font-semibold text-sm">28</div>
            <div className="text-stone-500 text-xs">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckInRow({ name, time }: { name: string; time: string }) {
  return (
    <div className="bg-stone-800/50 rounded-lg p-2.5 flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center">
        <User className="w-4 h-4 text-stone-400" />
      </div>
      <div className="flex-1">
        <div className="text-stone-200 text-sm">{name}</div>
        <div className="text-stone-500 text-xs">{time}</div>
      </div>
    </div>
  );
}

function ProPaymentScreen({ phase }: { phase: string }) {
  const isScanning = phase === 'scanning';
  const isSuccess = phase === 'success' || phase === 'hold';

  return (
    <div className="h-full w-full relative">
      {/* Camera/Scanning view */}
      <div className={`absolute inset-0 bg-stone-950 flex flex-col items-center justify-center transition-opacity duration-500 ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
        {/* Simulated camera background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-800/40 via-stone-900/60 to-stone-950/80" />
        
        {/* Header */}
        <div className="absolute top-8 left-0 right-0 px-3">
          <span className="font-display text-emerald-500 text-base">gymsense</span>
        </div>
        
        {/* Scanning frame */}
        <div className="relative w-28 h-28">
          {/* Animated corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-500 rounded-tl-lg animate-corner-pulse" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-500 rounded-tr-lg animate-corner-pulse" style={{ animationDelay: '0.25s' }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-500 rounded-bl-lg animate-corner-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-500 rounded-br-lg animate-corner-pulse" style={{ animationDelay: '0.75s' }} />
          
          {/* Scanning line - moves up and down */}
          <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-scan-line" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <ScanLine className="w-8 h-8 text-emerald-500/40" />
          </div>
        </div>
        
        <p className="mt-4 text-stone-400 text-xs">
          {isScanning ? 'Processing payment...' : 'Scan member QR code'}
        </p>
        
        {/* Cart summary */}
        <div className="absolute bottom-4 left-3 right-3">
          <div className="bg-stone-800/90 rounded-xl p-2.5 border border-stone-700">
            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-xs">Cart Total</span>
              <span className="text-emerald-400 font-semibold text-sm">$45.00</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success overlay */}
      <div className={`absolute inset-0 bg-stone-900 flex flex-col transition-opacity duration-500 ${isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="pt-8 px-3 text-center">
          <span className="font-display text-emerald-500 text-base">gymsense</span>
        </div>
        
        {/* Success content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4 animate-scale-in">
            <Check className="w-8 h-8 text-white" />
          </div>
          <div className="text-stone-50 font-semibold text-lg mb-1">Payment Complete!</div>
          <div className="text-stone-400 text-xs mb-4">Charged to Sarah M.</div>
          
          {/* Order summary */}
          <div className="w-full bg-stone-800 rounded-xl p-3 border border-stone-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-stone-300 text-xs">5-Pack PT Sessions</span>
              <span className="text-stone-300 text-xs">$45.00</span>
            </div>
            <div className="border-t border-stone-700 pt-2 flex justify-between items-center">
              <span className="text-stone-400 text-xs">Total</span>
              <span className="text-emerald-400 font-semibold">$45.00</span>
            </div>
          </div>
        </div>
        
        {/* Done button */}
        <div className="px-4 pb-6">
          <div className="w-full py-2.5 bg-emerald-600 rounded-xl text-center text-white text-sm font-medium">
            Done
          </div>
        </div>
      </div>
    </div>
  );
}

function ProSessionScreen() {
  return (
    <div className="h-full bg-stone-900 p-3 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-emerald-500 text-base">gymsense</span>
        <div className="w-7 h-7 rounded-full bg-stone-700" />
      </div>
      
      {/* Session Detail Card */}
      <div className="bg-stone-800 rounded-xl border border-stone-700 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600/20 px-3 py-2 border-b border-stone-700">
          <div className="text-emerald-400 text-xs font-medium">Tomorrow • 9:00 AM</div>
        </div>
        
        {/* Content */}
        <div className="p-3">
          <div className="text-stone-50 font-medium mb-3">Personal Training</div>
          
          {/* Client */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center">
              <User className="w-5 h-5 text-stone-400" />
            </div>
            <div>
              <div className="text-stone-200 text-sm font-medium">Sarah M.</div>
              <div className="text-stone-500 text-xs">Member since 2024</div>
            </div>
          </div>
          
          {/* Details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500">Duration</span>
              <span className="text-stone-300">60 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Trainer</span>
              <span className="text-stone-300">Marcus</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Sessions Left</span>
              <span className="text-emerald-400">4 of 10</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <div className="flex-1 py-2 bg-stone-800 rounded-lg text-center text-stone-300 text-xs">
          Reschedule
        </div>
        <div className="flex-1 py-2 bg-emerald-600 rounded-lg text-center text-white text-xs">
          Start Session
        </div>
      </div>
    </div>
  );
}

// ===== SHARED COMPONENTS =====

function PhoneMockup({ 
  children, 
  label, 
  sublabel,
  variant = 'primary'
}: { 
  children: React.ReactNode;
  label: string;
  sublabel: string;
  variant?: 'primary' | 'secondary';
}) {
  const isPrimary = variant === 'primary';
  
  return (
    <div className="flex flex-col items-center">
      {/* Phone frame */}
      <div className="relative">
        {/* Outer bezel */}
        <div className="w-[180px] md:w-[220px] h-[360px] md:h-[440px] bg-stone-800 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
          {/* Inner bezel */}
          <div className="w-full h-full bg-stone-900 rounded-[2rem] overflow-hidden relative">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-stone-950 rounded-full z-10" />
            
            {/* Screen content */}
            <div className="w-full h-full">
              {children}
            </div>
          </div>
        </div>
        
        {/* Highlight effect */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
      
      {/* Label */}
      <div className="mt-4 text-center">
        <div className={`font-semibold ${isPrimary ? 'text-emerald-400' : 'text-stone-300'}`}>
          {label}
        </div>
        <div className="text-stone-500 text-sm">{sublabel}</div>
      </div>
    </div>
  );
}

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

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-stone-300">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  );
}
