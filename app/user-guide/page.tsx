'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  LogIn,
  UserPlus,
  CreditCard,
  MapPinCheck,
  Calendar,
  ShieldCheck,
  Mail,
  Package,
  Users,
  MessageSquare,
  FileText,
  ScanLine
} from 'lucide-react';
import Image from 'next/image';

// ============================================================================
// FLOW DATA STRUCTURE
// ============================================================================

interface Step {
  id: string;
  narrative: string;
  activeApp: 'member' | 'pro' | 'both';
  memberScreenshot?: string;
  proScreenshot?: string;
  // Special rendering modes
  memberScanning?: boolean;  // Show scanning animation instead of screenshot
  proScanning?: boolean;     // Show scanning animation instead of screenshot
  scanningBackground?: string; // Optional background image for scanning effect
  webCheckout?: boolean;     // Note that this happens on customer's phone (web), not member app
}

interface Flow {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'onboarding' | 'transactions' | 'operations' | 'admin';
  steps: Step[];
}

// ============================================================================
// FLOWS DATA - Updated with real screenshots and narratives
// ============================================================================

const FLOWS: Flow[] = [
  // ==================== ONBOARDING ====================
  {
    id: 'pro-app-login',
    title: 'Pro App Login',
    description: 'Log into the Pro app as a staff member',
    icon: LogIn,
    category: 'onboarding',
    steps: [
      {
        id: 'pro-login-1',
        narrative: 'Open the Pro app and enter the four-digit code from your welcome email.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/pro-app-login/step-1.png',
      },
      {
        id: 'pro-login-2',
        narrative: 'Enter your phone number to receive a six-digit verification code.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/pro-app-login/step-2.png',
      },
      {
        id: 'pro-login-3',
        narrative: 'Enter the verification code to complete onboarding.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/pro-app-login/step-3.png',
      },
    ],
  },
  {
    id: 'customer-onboarding',
    title: 'Customer Onboarding',
    description: 'Onboard a customer to the Member app',
    icon: UserPlus,
    category: 'onboarding',
    steps: [
      {
        id: 'customer-onboarding-1',
        narrative: 'Open the Member app and enter the four-digit code from your welcome email.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/customer-onboarding/step-1.png',
      },
      {
        id: 'customer-onboarding-2',
        narrative: 'Enter your phone number to receive a six-digit verification code.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/customer-onboarding/step-2.png',
      },
      {
        id: 'customer-onboarding-3',
        narrative: 'Enter the verification code to continue.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/customer-onboarding/step-3.png',
      },
      {
        id: 'customer-onboarding-4',
        narrative: 'Enter your preferred payment method using either Apple Pay or typing in your card number, expiration date and CVC, then tap Continue.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/customer-onboarding/step-4.png',
      },
      {
        id: 'customer-onboarding-5',
        narrative: 'Your account and payment method will be verified by Stripe.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/customer-onboarding/step-5.png',
      },
      {
        id: 'customer-onboarding-6',
        narrative: "Onboarding is complete and you'll be directed to the Member App home screen.",
        activeApp: 'member',
        memberScreenshot: '/user-guide/customer-onboarding/step-6.png',
      },
    ],
  },

  // ==================== TRANSACTIONS ====================
  {
    id: 'new-member-signup',
    title: 'New Member Signup',
    description: 'Sign up a brand new member via QR checkout',
    icon: Users,
    category: 'transactions',
    steps: [
      {
        id: 'new-member-signup-1',
        narrative: 'Navigate to the Shop screen and add the desired membership product to the cart.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/new-member-signup/step-1-pro.png',
      },
      {
        id: 'new-member-signup-2',
        narrative: 'Tap the Cart button to review the cart and tap Proceed to Checkout.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/new-member-signup/step-2-pro.png',
      },
      {
        id: 'new-member-signup-3',
        narrative: "Tap the Generate Payment QR button to display a QR code for the customer to scan with their phone's camera.",
        activeApp: 'pro',
        proScreenshot: '/user-guide/new-member-signup/step-3-pro.png',
      },
      {
        id: 'new-member-signup-4',
        narrative: 'The Pro app displays the QR code; the customer (Sarah) scans the QR code with their phone.',
        activeApp: 'both',
        proScreenshot: '/user-guide/new-member-signup/step-4-pro.png',
        memberScanning: true,
      },
      {
        id: 'new-member-signup-5',
        narrative: 'Sarah reviews and agrees to the membership agreement terms, then taps Continue to Payment.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/new-member-signup/step-5-member.png',
        webCheckout: true,
      },
      {
        id: 'new-member-signup-6',
        narrative: 'Sarah enters her email, phone and payment method and taps Subscribe.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/new-member-signup/step-6-member.png',
        webCheckout: true,
      },
      {
        id: 'new-member-signup-7',
        narrative: 'Payment is confirmed immediately; Sarah will receive the welcome email to onboard to the Member app.',
        activeApp: 'both',
        memberScreenshot: '/user-guide/new-member-signup/step-7-member.png',
        proScreenshot: '/user-guide/new-member-signup/step-7-pro.png',
        webCheckout: true,
      },
    ],
  },
  {
    id: 'customer-checkout',
    title: 'Customer Checkout',
    description: 'Accept payment by scanning member QR code',
    icon: CreditCard,
    category: 'transactions',
    steps: [
      {
        id: 'customer-checkout-1',
        narrative: 'Add the desired products to the cart and tap Proceed to Checkout.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/customer-checkout/step-1-pro.png',
      },
      {
        id: 'customer-checkout-2',
        narrative: "Tap the Scan Member QR button to open the camera; Customer swipes left on the Member app home screen to reveal their unique payment QR code.",
        activeApp: 'both',
        proScreenshot: '/user-guide/customer-checkout/step-2-pro.png',
        memberScreenshot: '/user-guide/customer-checkout/step-2-member.png',
      },
      {
        id: 'customer-checkout-3',
        narrative: "Scan the member's QR code.",
        activeApp: 'both',
        proScanning: true,
        memberScreenshot: '/user-guide/customer-checkout/step-2-member.png',
      },
      {
        id: 'customer-checkout-4',
        narrative: 'Confirm the customer name and total and tap Charge Card.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/customer-checkout/step-4-pro.png',
      },
      {
        id: 'customer-checkout-5',
        narrative: 'Payment is confirmed on both devices instantly.',
        activeApp: 'both',
        proScreenshot: '/user-guide/customer-checkout/step-5-pro.png',
        memberScreenshot: '/user-guide/customer-checkout/step-5-member.png',
      },
      {
        id: 'customer-checkout-6',
        narrative: 'Transaction immediately appears in Member app (Recent Activity) and Pro app (Transactions).',
        activeApp: 'both',
        proScreenshot: '/user-guide/customer-checkout/step-6-pro.png',
        memberScreenshot: '/user-guide/customer-checkout/step-6-member.png',
      },
    ],
  },

  // ==================== OPERATIONS ====================
  {
    id: 'member-check-in',
    title: 'Member Check-In',
    description: 'Touchless QR check-in at the gym',
    icon: MapPinCheck,
    category: 'operations',
    steps: [
      {
        id: 'member-check-in-1',
        narrative: 'From the Member app home screen, swipe right on the screen (or tap Check-In from the navigation menu) to open the camera.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/member-check-in/step-1-member.png',
      },
      {
        id: 'member-check-in-2',
        narrative: "Scan the QR code posted at the gym's entrance to check-in.",
        activeApp: 'member',
        memberScanning: true,
        scanningBackground: '/user-guide/member-check-in/step-2-qr-code.png',
      },
      {
        id: 'member-check-in-3',
        narrative: 'Check-in confirmed! The Pro app updates in real-time.',
        activeApp: 'both',
        memberScreenshot: '/user-guide/member-check-in/step-3-member.png',
        proScreenshot: '/user-guide/member-check-in/step-3-pro.png',
      },
    ],
  },
  {
    id: 'schedule-training-session',
    title: 'Schedule a Training Session',
    description: 'Book a personal training session for a client',
    icon: Calendar,
    category: 'operations',
    steps: [
      {
        id: 'schedule-session-1',
        narrative: 'From the Schedule screen, tap the View Clients button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/schedule-training-session/step-1-pro.png',
      },
      {
        id: 'schedule-session-2',
        narrative: "Tap on the desired client's card to open their profile.",
        activeApp: 'pro',
        proScreenshot: '/user-guide/schedule-training-session/step-2-pro.png',
      },
      {
        id: 'schedule-session-3',
        narrative: 'Tap the Schedule Session button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/schedule-training-session/step-3-pro.png',
      },
      {
        id: 'schedule-session-4',
        narrative: 'Select the desired date, time and session duration, then tap Schedule Session.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/schedule-training-session/step-4-pro.png',
      },
      {
        id: 'schedule-session-5',
        narrative: 'Both apps instantly display the scheduled session.',
        activeApp: 'both',
        proScreenshot: '/user-guide/schedule-training-session/step-5-pro.png',
        memberScreenshot: '/user-guide/schedule-training-session/step-5-member.png',
      },
    ],
  },

  // ==================== ADMIN ====================
  {
    id: 'create-new-product',
    title: 'Create a New Product',
    description: 'Add a new product to your catalog',
    icon: Package,
    category: 'admin',
    steps: [
      {
        id: 'create-product-1',
        narrative: 'Navigate to the Admin -> Products screen and tap the Add Product button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/create-new-product/step-1.png',
      },
      {
        id: 'create-product-2',
        narrative: 'Enter the product name, description (optional), and price then tap Create Product.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/create-new-product/step-2.png',
      },
      {
        id: 'create-product-3',
        narrative: 'The product is now available for sale in the Shop.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/create-new-product/step-3.png',
      },
    ],
  },
  {
    id: 'add-team-member',
    title: 'Add a Team Member',
    description: 'Invite a new staff member to your gym',
    icon: UserPlus,
    category: 'admin',
    steps: [
      {
        id: 'add-team-1',
        narrative: 'Navigate to the Admin -> Team screen and tap the Add User button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/add-team-member/step-1.png',
      },
      {
        id: 'add-team-2',
        narrative: 'Enter the team member\'s name, email and select the desired role. Tap Add User & Send Invite.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/add-team-member/step-2.png',
      },
      {
        id: 'add-team-3',
        narrative: 'Team member is added to the Team roster and immediately receives the onboarding email.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/add-team-member/step-3.png',
      },
    ],
  },
  {
    id: 'submit-support-request',
    title: 'Submit a Support Request',
    description: 'Get help or request a new feature',
    icon: MessageSquare,
    category: 'admin',
    steps: [
      {
        id: 'support-1',
        narrative: 'Navigate to the Admin -> Profile screen and tap the Get Help button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/submit-support-request/step-1.png',
      },
      {
        id: 'support-2',
        narrative: 'Select the appropriate category for the issue.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/submit-support-request/step-2.png',
      },
      {
        id: 'support-3',
        narrative: 'Enter request details and tap Send.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/submit-support-request/step-3.png',
      },
      {
        id: 'support-4',
        narrative: 'Support request is immediately sent to the gymsense support team inbox for review.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/submit-support-request/step-4.png',
      },
    ],
  },
  {
    id: 'view-membership-agreements',
    title: 'View/Edit Membership Agreements',
    description: 'Manage your membership agreement terms',
    icon: FileText,
    category: 'admin',
    steps: [
      {
        id: 'agreements-1',
        narrative: 'Navigate to the Admin -> Agreements screen.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/view-membership-agreements/step-1.png',
      },
      {
        id: 'agreements-2',
        narrative: 'Select the desired agreement terms and tap the Edit button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/view-membership-agreements/step-2.png',
      },
      {
        id: 'agreements-3',
        narrative: 'Review and edit the terms as desired, then tap Save.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/view-membership-agreements/step-3.png',
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
// SCANNING ANIMATION COMPONENT
// ============================================================================

function ScanningScreen({ 
  variant = 'dark',
  backgroundImage,
}: { 
  variant?: 'dark' | 'light';
  backgroundImage?: string;
}) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`h-full flex flex-col items-center justify-center p-3 relative ${
      isDark ? 'bg-stone-900' : 'bg-stone-100'
    }`}>
      {/* Optional background image (e.g., QR code stand) */}
      {backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          <Image 
            src={backgroundImage} 
            alt="Scanning context"
            fill
            className="object-cover object-center"
          />
        </div>
      )}
      
      {/* Header */}
      <div className="absolute top-1 sm:top-2 left-3 right-3 flex items-center justify-between z-10">
        <span className={`font-display text-sm ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
          gymsense
        </span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isDark ? 'bg-stone-700' : 'bg-stone-300'
        }`}>
          <ScanLine className={`w-3 h-3 ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
        </div>
      </div>
      
      <p className={`text-xs font-medium mb-3 z-10 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
        Scanning...
      </p>
      
      {/* Scanning frame */}
      <div className="relative w-24 sm:w-28 h-24 sm:h-28 z-10">
        {/* Animated border */}
        <motion.div 
          className={`absolute inset-0 border-2 rounded-xl ${
            isDark ? 'border-emerald-500' : 'border-emerald-600'
          }`}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Corner accents */}
        <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        
        {/* Scanning line */}
        <motion.div 
          className={`absolute inset-x-2 h-0.5 ${isDark ? 'bg-emerald-500' : 'bg-emerald-600'}`}
          animate={{ top: ['10%', '85%', '10%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* QR Code placeholder */}
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <QRCodeDisplay size="small" dark={!isDark} />
        </div>
      </div>
      
      <p className={`mt-3 text-[10px] z-10 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
        Point camera at QR code
      </p>
    </div>
  );
}

// ============================================================================
// QR CODE DISPLAY COMPONENT
// ============================================================================

function QRCodeDisplay({ size = 'small', dark = false }: { size?: 'small' | 'medium'; dark?: boolean }) {
  const sizeClasses = {
    small: 'w-14 h-14',
    medium: 'w-20 h-20',
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
      <rect x="40" y="35" width="5" height="5" fill={color} />
      <rect x="50" y="35" width="5" height="5" fill={color} />
      <rect x="35" y="50" width="5" height="5" fill={color} />
      <rect x="50" y="50" width="5" height="5" fill={color} />
      <rect x="65" y="50" width="5" height="5" fill={color} />
      <rect x="80" y="50" width="5" height="5" fill={color} />
      <rect x="70" y="70" width="5" height="5" fill={color} />
      <rect x="80" y="70" width="5" height="5" fill={color} />
      <rect x="90" y="70" width="5" height="5" fill={color} />
      <rect x="70" y="80" width="5" height="5" fill={color} />
      <rect x="90" y="80" width="5" height="5" fill={color} />
      <rect x="70" y="90" width="5" height="5" fill={color} />
      <rect x="80" y="90" width="5" height="5" fill={color} />
    </svg>
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
  isScanning,
  scanningBackground,
  webCheckout,
}: {
  screenshot?: string;
  variant: 'dark' | 'light';
  label: string;
  isScanning?: boolean;
  scanningBackground?: string;
  webCheckout?: boolean;
}) {
  // Show scanning animation
  if (isScanning) {
    return <ScanningScreen variant={variant} backgroundImage={scanningBackground} />;
  }
  
  // Show screenshot
  if (screenshot) {
    return (
      <div className="h-full w-full relative">
        <Image 
          src={screenshot} 
          alt={label}
          fill
          className="object-cover object-top"
        />
        {/* Web checkout indicator */}
        {webCheckout && variant === 'dark' && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="bg-stone-800/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
              <p className="text-[8px] text-stone-400">
                📱 Customer&apos;s phone (web checkout)
              </p>
            </div>
          </div>
        )}
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
            <a href="/" className="font-display text-2xl text-emerald-500 hover:text-emerald-400 transition-colors">
              gymsense
            </a>
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
                    isScanning={currentStep.memberScanning}
                    scanningBackground={currentStep.scanningBackground}
                    webCheckout={currentStep.webCheckout}
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
                    isScanning={currentStep.proScanning}
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
