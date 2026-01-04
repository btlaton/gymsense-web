'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  User,
  LogIn,
  Users,
  UserPlus,
  CreditCard,
  MapPinCheck,
  Calendar,
  ShieldCheck,
  Mail,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

// ============================================================================
// FLOW DATA STRUCTURE
// ============================================================================

interface Step {
  id: string;
  narrative: string;
  activeApp: 'member' | 'pro' | 'both';
  memberScreenshot?: string;  // Path to screenshot image
  proScreenshot?: string;     // Path to screenshot image
  hotspot?: { app: 'member' | 'pro'; x: string; y: string }; // Optional tap indicator
}

interface Flow {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'onboarding' | 'transactions' | 'operations' | 'admin';
  steps: Step[];
}

// TODO: Replace placeholder steps with actual screenshots and content
const FLOWS: Flow[] = [
  {
    id: 'pro-login',
    title: 'Pro App Login',
    description: 'Log into the Pro app as a staff member',
    icon: LogIn,
    category: 'onboarding',
    steps: [
      {
        id: 'pro-login-1',
        narrative: 'Open the Pro app and tap "Sign In" to begin.',
        activeApp: 'pro',
        // proScreenshot: '/user-guide/pro-login/step-1.png',
      },
      {
        id: 'pro-login-2',
        narrative: 'Enter your credentials and authenticate.',
        activeApp: 'pro',
        // proScreenshot: '/user-guide/pro-login/step-2.png',
      },
    ],
  },
  {
    id: 'member-onboarding-before-billing',
    title: 'Member Onboarding (Before Billing Date)',
    description: 'Onboard an existing member before their billing anchor date',
    icon: UserPlus,
    category: 'onboarding',
    steps: [
      {
        id: 'onboard-before-1',
        narrative: 'Send onboarding email from Pro app or via CLI command.',
        activeApp: 'pro',
      },
      {
        id: 'onboard-before-2',
        narrative: 'Member receives email with onboarding link.',
        activeApp: 'member',
      },
      {
        id: 'onboard-before-3',
        narrative: 'Member opens the app and enters their setup code.',
        activeApp: 'member',
      },
      {
        id: 'onboard-before-4',
        narrative: 'Member authenticates via phone number verification.',
        activeApp: 'member',
      },
      {
        id: 'onboard-before-5',
        narrative: 'Member adds payment method. No charge occurs until billing date.',
        activeApp: 'member',
      },
      {
        id: 'onboard-before-6',
        narrative: 'Onboarding complete! Member can now use the app.',
        activeApp: 'both',
      },
    ],
  },
  {
    id: 'member-onboarding-after-billing',
    title: 'Member Onboarding (After Billing Date)',
    description: 'Onboard an existing member who has an outstanding invoice',
    icon: UserPlus,
    category: 'onboarding',
    steps: [
      {
        id: 'onboard-after-1',
        narrative: 'In Pro app, notice the "No Card" warning on the customer.',
        activeApp: 'pro',
      },
      {
        id: 'onboard-after-2',
        narrative: 'Member opens the app and completes setup code entry.',
        activeApp: 'member',
      },
      {
        id: 'onboard-after-3',
        narrative: 'Member adds payment method. Outstanding invoice is automatically charged.',
        activeApp: 'member',
      },
      {
        id: 'onboard-after-4',
        narrative: 'Both apps update in real-time. Pro app shows Active status and the transaction.',
        activeApp: 'both',
      },
    ],
  },
  {
    id: 'new-member-signup',
    title: 'New Member Signup',
    description: 'Sign up a brand new member via QR checkout',
    icon: Users,
    category: 'transactions',
    steps: [
      {
        id: 'new-member-1',
        narrative: 'In Pro app, add a membership product to the cart.',
        activeApp: 'pro',
      },
      {
        id: 'new-member-2',
        narrative: 'Tap "Generate Payment QR" to create a checkout link.',
        activeApp: 'pro',
      },
      {
        id: 'new-member-3',
        narrative: 'New member scans QR code with their phone camera.',
        activeApp: 'both',
      },
      {
        id: 'new-member-4',
        narrative: 'Member reviews and accepts the agreement terms.',
        activeApp: 'member',
      },
      {
        id: 'new-member-5',
        narrative: 'Member enters email and phone number for their account.',
        activeApp: 'member',
      },
      {
        id: 'new-member-6',
        narrative: 'Payment completes. Transaction appears in Pro app Financials.',
        activeApp: 'both',
      },
    ],
  },
  {
    id: 'member-checkin',
    title: 'Member Check-In',
    description: 'Touchless QR check-in at the gym',
    icon: MapPinCheck,
    category: 'operations',
    steps: [
      {
        id: 'checkin-1',
        narrative: 'Member opens the app and swipes right to access the scanner.',
        activeApp: 'member',
      },
      {
        id: 'checkin-2',
        narrative: 'Member scans the QR code posted at the front desk.',
        activeApp: 'member',
      },
      {
        id: 'checkin-3',
        narrative: 'Check-in confirmed! Pro app updates in real-time.',
        activeApp: 'both',
      },
    ],
  },
  {
    id: 'customer-checkout',
    title: 'Customer Checkout (QR Payment)',
    description: 'Accept payment by scanning member QR code',
    icon: CreditCard,
    category: 'transactions',
    steps: [
      {
        id: 'checkout-1',
        narrative: 'In Pro app, add items to the cart.',
        activeApp: 'pro',
      },
      {
        id: 'checkout-2',
        narrative: 'Tap "Scan Member QR" to begin payment.',
        activeApp: 'pro',
      },
      {
        id: 'checkout-3',
        narrative: 'Member swipes left in their app to reveal their payment QR.',
        activeApp: 'member',
      },
      {
        id: 'checkout-4',
        narrative: 'Staff scans the member\'s QR code.',
        activeApp: 'both',
      },
      {
        id: 'checkout-5',
        narrative: 'Payment confirmed on both devices instantly.',
        activeApp: 'both',
      },
    ],
  },
  {
    id: 'schedule-session',
    title: 'Schedule a PT Session',
    description: 'Book a personal training session for a client',
    icon: Calendar,
    category: 'operations',
    steps: [
      {
        id: 'schedule-1',
        narrative: 'Open the Schedule tab in Pro app.',
        activeApp: 'pro',
      },
      {
        id: 'schedule-2',
        narrative: 'Select the client and choose a time slot.',
        activeApp: 'pro',
      },
      {
        id: 'schedule-3',
        narrative: 'Confirm the session booking.',
        activeApp: 'pro',
      },
      {
        id: 'schedule-4',
        narrative: 'Member receives notification and sees session in their app.',
        activeApp: 'both',
      },
    ],
  },
  {
    id: 'create-product',
    title: 'Create a New Product',
    description: 'Add a new product to your catalog',
    icon: CreditCard,
    category: 'admin',
    steps: [
      {
        id: 'product-1',
        narrative: 'Navigate to Admin > Products in Pro app.',
        activeApp: 'pro',
      },
      {
        id: 'product-2',
        narrative: 'Tap "Add Product" and fill in the details.',
        activeApp: 'pro',
      },
      {
        id: 'product-3',
        narrative: 'Product is now available in the Shop for checkout.',
        activeApp: 'pro',
      },
    ],
  },
  {
    id: 'trainer-rbac',
    title: 'Trainer Role (Limited Access)',
    description: 'See how the app appears for trainer role',
    icon: ShieldCheck,
    category: 'admin',
    steps: [
      {
        id: 'rbac-1',
        narrative: 'Log out of the owner account.',
        activeApp: 'pro',
      },
      {
        id: 'rbac-2',
        narrative: 'Log in as a trainer.',
        activeApp: 'pro',
      },
      {
        id: 'rbac-3',
        narrative: 'Notice: Financials tab is hidden, Admin access is restricted.',
        activeApp: 'pro',
      },
    ],
  },
];

// Group flows by category
const CATEGORIES = [
  { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'operations', label: 'Operations', icon: Calendar },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
];

// ============================================================================
// PHONE MOCKUP COMPONENT
// ============================================================================

function PhoneMockup({ 
  variant = 'dark',
  isActive = true,
  children,
}: { 
  variant?: 'dark' | 'light';
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
      {/* Active indicator glow */}
      {isActive && (
        <div className={`absolute -inset-2 rounded-[3rem] blur-xl ${
          variant === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-600/10'
        }`} />
      )}
      
      <div className="relative w-[160px] sm:w-[180px] md:w-[200px] h-[340px] sm:h-[380px] md:h-[420px] bg-stone-800 rounded-[2rem] sm:rounded-[2.5rem] p-1.5 shadow-xl">
        <div className={`w-full h-full rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden relative ${
          variant === 'dark' ? 'bg-stone-900' : 'bg-stone-50'
        }`}>
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-5 sm:h-6 bg-stone-800 rounded-full z-10" />
          
          {/* Screen Content */}
          <div className="w-full h-full pt-8 sm:pt-9 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PLACEHOLDER SCREENS
// ============================================================================

function PlaceholderScreen({ 
  variant = 'dark', 
  label 
}: { 
  variant?: 'dark' | 'light';
  label: string;
}) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`h-full p-4 flex flex-col items-center justify-center ${
      isDark ? 'bg-stone-900' : 'bg-stone-50'
    }`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
        isDark ? 'bg-stone-800' : 'bg-stone-200'
      }`}>
        <span className={`text-2xl ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>📱</span>
      </div>
      <p className={`text-xs text-center ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>
        {label}
      </p>
      <p className={`text-[10px] text-center mt-1 ${isDark ? 'text-stone-700' : 'text-stone-300'}`}>
        Screenshot pending
      </p>
    </div>
  );
}

function ScreenshotDisplay({
  screenshot,
  variant,
  label,
}: {
  screenshot?: string;
  variant: 'dark' | 'light';
  label: string;
}) {
  if (screenshot) {
    return (
      <div className="h-full w-full relative">
        <Image 
          src={screenshot} 
          alt={label}
          fill
          className="object-cover object-top"
        />
      </div>
    );
  }
  
  return <PlaceholderScreen variant={variant} label={label} />;
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function UserGuidePage() {
  const [selectedFlowId, setSelectedFlowId] = useState(FLOWS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const selectedFlow = FLOWS.find(f => f.id === selectedFlowId) || FLOWS[0];
  const currentStep = selectedFlow.steps[currentStepIndex];
  
  const goToNextStep = () => {
    if (currentStepIndex < selectedFlow.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const selectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setCurrentStepIndex(0);
  };
  
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      {/* Header */}
      <header className="border-b border-stone-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl text-emerald-500">gymsense</span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400 text-sm">User Guide</span>
          </div>
          <a 
            href="mailto:support@gymsense.io"
            className="text-stone-500 hover:text-emerald-500 transition-colors text-sm flex items-center gap-1"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Need help?</span>
          </a>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-stone-800 min-h-[calc(100vh-65px)] p-4 hidden lg:block">
          <nav className="space-y-6">
            {CATEGORIES.map(category => {
              const categoryFlows = FLOWS.filter(f => f.category === category.id);
              const CategoryIcon = category.icon;
              
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {category.label}
                  </div>
                  <ul className="space-y-1">
                    {categoryFlows.map(flow => {
                      const isSelected = flow.id === selectedFlowId;
                      return (
                        <li key={flow.id}>
                          <button
                            onClick={() => selectFlow(flow.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              isSelected 
                                ? 'bg-emerald-600/20 text-emerald-400' 
                                : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                            }`}
                          >
                            {flow.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Mobile Flow Selector */}
          <div className="lg:hidden mb-6">
            <select
              value={selectedFlowId}
              onChange={(e) => selectFlow(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-3 text-stone-200"
            >
              {CATEGORIES.map(category => (
                <optgroup key={category.id} label={category.label}>
                  {FLOWS.filter(f => f.category === category.id).map(flow => (
                    <option key={flow.id} value={flow.id}>{flow.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          
          {/* Flow Header */}
          <div className="mb-8 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-stone-50 mb-2">
              {selectedFlow.title}
            </h1>
            <p className="text-stone-500 text-sm">
              {selectedFlow.description}
            </p>
          </div>
          
          {/* Step Progress */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {selectedFlow.steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    isActive ? 'w-8 bg-emerald-500' :
                    isPast ? 'w-2 bg-emerald-700 hover:bg-emerald-600' :
                    'w-2 bg-stone-700 hover:bg-stone-600'
                  }`}
                />
              );
            })}
          </div>
          
          {/* Phones Display */}
          <div className="flex flex-col items-center">
            {/* Phones */}
            <div className="flex justify-center items-start gap-4 sm:gap-8 mb-6">
              {/* Member Phone (Dark) */}
              <div className="flex flex-col items-center">
                <PhoneMockup 
                  variant="dark" 
                  isActive={currentStep.activeApp === 'member' || currentStep.activeApp === 'both'}
                >
                  <ScreenshotDisplay
                    screenshot={currentStep.memberScreenshot}
                    variant="dark"
                    label="Member App"
                  />
                </PhoneMockup>
                <div className="mt-3 text-center">
                  <span className={`text-xs font-medium ${
                    currentStep.activeApp === 'member' || currentStep.activeApp === 'both'
                      ? 'text-emerald-400'
                      : 'text-stone-600'
                  }`}>
                    Member App
                  </span>
                </div>
              </div>
              
              {/* Pro Phone (Light) */}
              <div className="flex flex-col items-center">
                <PhoneMockup 
                  variant="light" 
                  isActive={currentStep.activeApp === 'pro' || currentStep.activeApp === 'both'}
                >
                  <ScreenshotDisplay
                    screenshot={currentStep.proScreenshot}
                    variant="light"
                    label="Pro App"
                  />
                </PhoneMockup>
                <div className="mt-3 text-center">
                  <span className={`text-xs font-medium ${
                    currentStep.activeApp === 'pro' || currentStep.activeApp === 'both'
                      ? 'text-stone-300'
                      : 'text-stone-600'
                  }`}>
                    Pro App
                  </span>
                </div>
              </div>
            </div>
            
            {/* Narrative */}
            <div className="max-w-lg text-center mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Active App Indicator */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {(currentStep.activeApp === 'member' || currentStep.activeApp === 'both') && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 text-[10px] font-medium">
                        Member
                      </span>
                    )}
                    {(currentStep.activeApp === 'pro' || currentStep.activeApp === 'both') && (
                      <span className="px-2 py-0.5 rounded-full bg-stone-700 text-stone-300 text-[10px] font-medium">
                        Pro
                      </span>
                    )}
                  </div>
                  
                  <p className="text-stone-300 text-sm sm:text-base">
                    {currentStep.narrative}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={goToPrevStep}
                disabled={currentStepIndex === 0}
                className={`p-2 rounded-full transition-colors ${
                  currentStepIndex === 0
                    ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-stone-500 text-sm">
                Step {currentStepIndex + 1} of {selectedFlow.steps.length}
              </span>
              
              <button
                onClick={goToNextStep}
                disabled={currentStepIndex === selectedFlow.steps.length - 1}
                className={`p-2 rounded-full transition-colors ${
                  currentStepIndex === selectedFlow.steps.length - 1
                    ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Step List (Desktop) */}
        <aside className="w-72 border-l border-stone-800 min-h-[calc(100vh-65px)] p-4 hidden xl:block">
          <h3 className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-4">
            Steps
          </h3>
          <ol className="space-y-2">
            {selectedFlow.steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              
              return (
                <li key={step.id}>
                  <button
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-emerald-600/20 border border-emerald-600/40' 
                        : 'hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                        isActive ? 'bg-emerald-600 text-white' :
                        isPast ? 'bg-emerald-700 text-emerald-200' :
                        'bg-stone-700 text-stone-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${
                          isActive ? 'text-stone-200' : 'text-stone-400'
                        }`}>
                          {step.narrative}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {(step.activeApp === 'member' || step.activeApp === 'both') && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Member App" />
                          )}
                          {(step.activeApp === 'pro' || step.activeApp === 'both') && (
                            <span className="w-2 h-2 rounded-full bg-stone-400" title="Pro App" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </main>
  );
}

