/**
 * GymSense Landing Page
 * 
 * Mobile-optimized landing page showcasing the Pro and Member apps.
 * Design tokens match the native apps (stone palette, emerald accent, Hanken/Pacifico fonts).
 */

import { 
  Calendar, 
  Users, 
  CreditCard, 
  Smartphone, 
  BarChart3, 
  UserCheck,
  QrCode,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
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
        
        {/* Phone Mockups - Hero Preview */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto animate-fade-in-up delay-500">
          <div className="flex justify-center items-end gap-4 md:gap-8">
            {/* Pro App Phone */}
            <PhoneMockup 
              label="Pro App"
              sublabel="For gym owners & staff"
              variant="primary"
            >
              <div className="h-full bg-stone-900 p-4">
                {/* Mock schedule screen */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-emerald-500 text-lg">gymsense</span>
                  <div className="w-8 h-8 rounded-full bg-stone-800" />
                </div>
                <div className="text-stone-400 text-xs mb-2">Today&apos;s Schedule</div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-stone-800 rounded-lg p-3 border-l-2 border-emerald-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-stone-200 text-sm font-medium">Personal Training</div>
                          <div className="text-stone-500 text-xs">9:00 AM - 10:00 AM</div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-emerald-600/20 flex items-center justify-center">
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PhoneMockup>
            
            {/* Member App Phone */}
            <PhoneMockup 
              label="Member App"
              sublabel="For gym members"
              variant="secondary"
            >
              <div className="h-full bg-stone-900 p-4 flex flex-col">
                {/* Mock member home screen */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-emerald-500 text-lg">gymsense</span>
                  <div className="w-8 h-8 rounded-full bg-stone-800" />
                </div>
                <div className="text-stone-200 text-lg font-medium mb-1">Welcome back!</div>
                <div className="text-stone-500 text-sm mb-6">Ready for your workout?</div>
                
                {/* QR Code placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mb-4">
                    <QrCode className="w-20 h-20 text-stone-900" />
                  </div>
                  <div className="text-stone-400 text-xs">Tap to check in</div>
                </div>
              </div>
            </PhoneMockup>
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

// Phone Mockup Component
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
    <div className={`flex flex-col items-center ${isPrimary ? 'scale-100 md:scale-110' : 'scale-90 md:scale-100 opacity-90'}`}>
      {/* Phone frame */}
      <div className="relative">
        {/* Outer bezel */}
        <div className="w-[180px] md:w-[220px] h-[360px] md:h-[440px] bg-stone-800 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
          {/* Inner bezel */}
          <div className="w-full h-full bg-stone-900 rounded-[2rem] overflow-hidden relative">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-stone-950 rounded-full z-10" />
            
            {/* Screen content */}
            <div className="w-full h-full pt-10">
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

// Feature Card Component
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

// List Item Component
function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-stone-300">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  );
}
