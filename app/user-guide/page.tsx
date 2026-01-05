'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
  memberScanning?: boolean;
  proScanning?: boolean;
  scanningBackground?: string;
  scanningBackgroundScale?: number;
  scanningVariant?: 'dark' | 'light';
  showMemberPhone?: boolean;
  showProPhone?: boolean;
  memberDimmed?: boolean;
  proDimmed?: boolean;
}

interface Flow {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'onboarding' | 'transactions' | 'operations' | 'admin';
  displayMode: 'single-member' | 'single-pro' | 'dual' | 'dynamic';
  memberPhoneLabel?: string;
  steps: Step[];
}

// ============================================================================
// FLOWS DATA
// ============================================================================

const FLOWS: Flow[] = [
  // ==================== ONBOARDING ====================
  {
    id: 'pro-app-login',
    title: 'Pro App Login',
    description: 'Log into the Pro app as a staff member',
    icon: LogIn,
    category: 'onboarding',
    displayMode: 'single-pro',
    steps: [
      {
        id: 'pro-login-1',
        narrative: 'Open the Pro app and enter the four-digit code from your welcome email.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/pro-app-login/step-1.png',
      },
      {
        id: 'pro-login-2',
        narrative: 'Enter your phone number and tap Send Verification Text to receive an SMS with your six-digit verification code.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/pro-app-login/step-2.png',
      },
      {
        id: 'pro-login-3',
        narrative: 'Enter the verification code to continue.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/pro-app-login/step-3.png',
      },
      {
        id: 'pro-login-4',
        narrative: "Onboarding is complete! You'll be directed to the Pro app home screen.",
        activeApp: 'pro',
        proScreenshot: '/user-guide/pro-app-login/step-4.png',
      },
    ],
  },
  {
    id: 'customer-onboarding',
    title: 'Customer Onboarding',
    description: 'Onboard a customer to the Member app',
    icon: UserPlus,
    category: 'onboarding',
    displayMode: 'single-member',
    steps: [
      {
        id: 'customer-onboarding-1',
        narrative: 'Open the Member app and enter the four-digit code from your welcome email.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/customer-onboarding/step-1.png',
      },
      {
        id: 'customer-onboarding-2',
        narrative: 'Enter your phone number and tap Send Verification Text to receive an SMS with your six-digit verification code.',
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
        narrative: "Onboarding is complete! You'll be directed to the Member app home screen.",
        activeApp: 'member',
        memberScreenshot: '/user-guide/customer-onboarding/step-6.png',
      },
    ],
  },

  // ==================== TRANSACTIONS ====================
  {
    id: 'new-member-signup',
    title: 'New Member Signup',
    description: 'Sign up a new member via QR checkout',
    icon: Users,
    category: 'transactions',
    displayMode: 'dynamic',
    memberPhoneLabel: "Customer's Phone",
    steps: [
      {
        id: 'new-member-signup-1',
        narrative: 'Navigate to the Shop and add the desired membership product to the cart, then tap the Cart button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/new-member-signup/step-1-pro.png',
        showMemberPhone: false,
        showProPhone: true,
      },
      {
        id: 'new-member-signup-2',
        narrative: 'Set a custom price if desired, otherwise tap Proceed to Checkout.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/new-member-signup/step-2-pro.png',
        showMemberPhone: false,
        showProPhone: true,
      },
      {
        id: 'new-member-signup-3',
        narrative: "Tap the Generate Payment QR button to display a QR code for the customer to scan with their phone's camera.",
        activeApp: 'pro',
        proScreenshot: '/user-guide/new-member-signup/step-3-pro.png',
        showMemberPhone: false,
        showProPhone: true,
      },
      {
        id: 'new-member-signup-4',
        narrative: 'The Pro app displays the QR code; the customer (Sarah) scans the QR code with their phone.',
        activeApp: 'both',
        proScreenshot: '/user-guide/new-member-signup/step-4-pro.png',
        memberScanning: true,
        scanningVariant: 'light',
        showMemberPhone: true,
        showProPhone: true,
      },
      {
        id: 'new-member-signup-5',
        narrative: 'Sarah reviews and agrees to the membership agreement terms, then taps Continue to Payment.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/new-member-signup/step-5-member.png',
        proScreenshot: '/user-guide/new-member-signup/step-4-pro.png',
        showMemberPhone: true,
        showProPhone: true,
        proDimmed: true,
      },
      {
        id: 'new-member-signup-6',
        narrative: 'Sarah enters her email, phone and payment method and taps Subscribe.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/new-member-signup/step-6-member.png',
        proScreenshot: '/user-guide/new-member-signup/step-4-pro.png',
        showMemberPhone: true,
        showProPhone: true,
        proDimmed: true,
      },
      {
        id: 'new-member-signup-7',
        narrative: 'Payment is confirmed immediately; Sarah will receive the welcome email to onboard to the Member app.',
        activeApp: 'both',
        memberScreenshot: '/user-guide/new-member-signup/step-7-member.png',
        proScreenshot: '/user-guide/new-member-signup/step-7-pro.png',
        showMemberPhone: true,
        showProPhone: true,
      },
    ],
  },
  {
    id: 'customer-checkout',
    title: 'Customer Checkout',
    description: 'Accept payment by scanning member QR code',
    icon: CreditCard,
    category: 'transactions',
    displayMode: 'dual',
    steps: [
      {
        id: 'customer-checkout-1',
        narrative: 'Add the desired products to the cart and tap Proceed to Checkout.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/customer-checkout/step-1-pro.png',
        memberScreenshot: '/user-guide/customer-checkout/step-1-member.png',
        memberDimmed: true,
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
        narrative: "Use the Pro app to scan the member's QR code.",
        activeApp: 'both',
        proScanning: true,
        scanningVariant: 'light',
        memberScreenshot: '/user-guide/customer-checkout/step-2-member.png',
      },
      {
        id: 'customer-checkout-4',
        narrative: 'Confirm the customer name and total and tap Charge Card.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/customer-checkout/step-4-pro.png',
        memberScreenshot: '/user-guide/customer-checkout/step-2-member.png',
        memberDimmed: true,
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
    displayMode: 'dynamic',
    steps: [
      {
        id: 'member-check-in-1',
        narrative: 'From the Member app home screen, swipe right on the screen (or tap Check-In from the navigation menu) to open the camera.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/member-check-in/step-1-member.png',
        showMemberPhone: true,
        showProPhone: false,
      },
      {
        id: 'member-check-in-2',
        narrative: "Scan the QR code posted at the gym's entrance to check-in.",
        activeApp: 'member',
        memberScanning: true,
        scanningBackground: '/user-guide/member-check-in/step-2-qr-code.png',
        scanningBackgroundScale: 0.5,
        showMemberPhone: true,
        showProPhone: false,
      },
      {
        id: 'member-check-in-3',
        narrative: 'Check-in confirmed! The Pro app updates in real-time.',
        activeApp: 'both',
        memberScreenshot: '/user-guide/member-check-in/step-3-member.png',
        proScreenshot: '/user-guide/member-check-in/step-3-pro.png',
        showMemberPhone: true,
        showProPhone: true,
      },
    ],
  },
  {
    id: 'schedule-training-session',
    title: 'Schedule a Training Session',
    description: 'Book a personal training session for a client',
    icon: Calendar,
    category: 'operations',
    displayMode: 'dynamic',
    steps: [
      {
        id: 'schedule-session-1',
        narrative: 'From the Schedule screen, tap the View Clients button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/schedule-training-session/step-1-pro.png',
        showMemberPhone: false,
        showProPhone: true,
      },
      {
        id: 'schedule-session-2',
        narrative: "Tap on the desired client's card to open their profile.",
        activeApp: 'pro',
        proScreenshot: '/user-guide/schedule-training-session/step-2-pro.png',
        showMemberPhone: false,
        showProPhone: true,
      },
      {
        id: 'schedule-session-3',
        narrative: 'Tap the Schedule Session button.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/schedule-training-session/step-3-pro.png',
        showMemberPhone: false,
        showProPhone: true,
      },
      {
        id: 'schedule-session-4',
        narrative: 'Select the desired date, time and session duration, then tap Schedule Session.',
        activeApp: 'pro',
        proScreenshot: '/user-guide/schedule-training-session/step-4-pro.png',
        showMemberPhone: false,
        showProPhone: true,
      },
      {
        id: 'schedule-session-5',
        narrative: 'Both apps instantly display the scheduled session.',
        activeApp: 'both',
        proScreenshot: '/user-guide/schedule-training-session/step-5-pro.png',
        memberScreenshot: '/user-guide/schedule-training-session/step-5-member.png',
        showMemberPhone: true,
        showProPhone: true,
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
    displayMode: 'single-pro',
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
    displayMode: 'single-pro',
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
    displayMode: 'single-pro',
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
    displayMode: 'single-pro',
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
// COLLECT ALL IMAGES FOR PRELOADING
// ============================================================================

function getAllImagePaths(): string[] {
  const paths: string[] = [];
  FLOWS.forEach(flow => {
    flow.steps.forEach(step => {
      if (step.memberScreenshot) paths.push(step.memberScreenshot);
      if (step.proScreenshot) paths.push(step.proScreenshot);
      if (step.scanningBackground) paths.push(step.scanningBackground);
    });
  });
  return Array.from(new Set(paths));
}

// ============================================================================
// IMAGE PRELOADER HOOK
// ============================================================================

function useImagePreloader(imagePaths: string[]) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (imagePaths.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedImages = 0;
    const totalImages = imagePaths.length;

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          loadedImages++;
          setLoadedCount(loadedImages);
          resolve();
        };
        img.onerror = () => {
          loadedImages++;
          setLoadedCount(loadedImages);
          resolve();
        };
        img.src = src;
      });
    };

    Promise.all(imagePaths.map(preloadImage)).then(() => {
      setImagesLoaded(true);
    });
  }, [imagePaths]);

  return { imagesLoaded, loadedCount, totalCount: imagePaths.length };
}

// ============================================================================
// SKELETON LOADING COMPONENT
// ============================================================================

function LoadingSkeleton({ progress }: { progress: number }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <span className="font-display text-3xl text-emerald-600 mb-4 block">gymsense</span>
        <p className="text-stone-500 text-sm mb-6">Loading User Guide...</p>
        
        <div className="w-64 h-2 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-stone-400 text-xs mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

// ============================================================================
// PHONE MOCKUP COMPONENT - Responsive sizing based on mode
// ============================================================================

function PhoneMockup({ 
  variant = 'dark',
  isActive = true,
  isDimmed = false,
  isDualMode = false,
  children,
}: { 
  variant?: 'dark' | 'light';
  isActive?: boolean;
  isDimmed?: boolean;
  isDualMode?: boolean;
  children: React.ReactNode;
}) {
  // Responsive sizing: smaller when in dual mode on mobile
  const sizeClasses = isDualMode
    ? 'w-[145px] sm:w-[180px] md:w-[220px] lg:w-[260px] h-[314px] sm:h-[390px] md:h-[476px] lg:h-[563px]'
    : 'w-[200px] sm:w-[240px] md:w-[280px] h-[433px] sm:h-[520px] md:h-[607px]';
  
  const roundingClasses = isDualMode
    ? 'rounded-[1.75rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem]'
    : 'rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem]';
  
  const innerRoundingClasses = isDualMode
    ? 'rounded-[1.5rem] sm:rounded-[1.75rem] md:rounded-[2.25rem] lg:rounded-[2.75rem]'
    : 'rounded-[1.75rem] sm:rounded-[2.25rem] md:rounded-[2.75rem]';

  return (
    <motion.div 
      className="relative transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isDimmed ? 0.5 : (isActive ? 1 : 0.6), 
        scale: isDimmed ? 0.97 : (isActive ? 1 : 0.97)
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Active indicator glow */}
      {isActive && !isDimmed && (
        <div className={`absolute -inset-2 sm:-inset-3 ${isDualMode ? 'rounded-[2.5rem]' : 'rounded-[3rem]'} blur-xl ${
          variant === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-600/10'
        }`} />
      )}
      
      {/* Phone frame */}
      <div className={`relative ${sizeClasses} bg-stone-800 ${roundingClasses} p-[4px] sm:p-[5px] md:p-[6px] shadow-2xl`}>
        <div className={`w-full h-full ${innerRoundingClasses} overflow-hidden relative ${
          variant === 'dark' ? 'bg-stone-900' : 'bg-stone-100'
        }`}>
          <div className="w-full h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// SCANNING ANIMATION COMPONENT
// ============================================================================

function ScanningScreen({ 
  variant = 'dark',
  backgroundImage,
  backgroundScale = 1,
}: { 
  variant?: 'dark' | 'light';
  backgroundImage?: string;
  backgroundScale?: number;
}) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`h-full flex flex-col items-center justify-center p-4 relative ${
      isDark ? 'bg-stone-900' : 'bg-stone-100'
    }`}>
      {backgroundImage && (
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-20"
          style={{ transform: `scale(${backgroundScale})` }}
        >
          <Image 
            src={backgroundImage} 
            alt="Scanning context"
            fill
            className="object-contain object-center"
          />
        </div>
      )}
      
      <div className="absolute top-8 sm:top-12 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-10">
        <span className={`font-display text-sm sm:text-base ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
          gymsense
        </span>
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
          isDark ? 'bg-stone-700' : 'bg-stone-300'
        }`}>
          <ScanLine className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
        </div>
      </div>
      
      <p className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 z-10 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
        Scanning...
      </p>
      
      <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 z-10">
        <motion.div 
          className={`absolute inset-0 border-2 rounded-xl sm:rounded-2xl ${
            isDark ? 'border-emerald-500' : 'border-emerald-600'
          }`}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        <div className={`absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-[3px] border-l-[3px] rounded-tl-lg sm:rounded-tl-xl ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-[3px] border-r-[3px] rounded-tr-lg sm:rounded-tr-xl ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-[3px] border-l-[3px] rounded-bl-lg sm:rounded-bl-xl ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-[3px] border-r-[3px] rounded-br-lg sm:rounded-br-xl ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        
        <motion.div 
          className={`absolute inset-x-2 sm:inset-x-3 h-0.5 ${isDark ? 'bg-emerald-500' : 'bg-emerald-600'}`}
          animate={{ top: ['10%', '85%', '10%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
          <QRCodeDisplay size="responsive" dark={isDark} />
        </div>
      </div>
      
      <p className={`mt-3 sm:mt-4 text-[10px] sm:text-xs z-10 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
        Point camera at QR code
      </p>
    </div>
  );
}

// ============================================================================
// QR CODE DISPLAY COMPONENT
// ============================================================================

function QRCodeDisplay({ size = 'small', dark = false }: { size?: 'small' | 'medium' | 'responsive'; dark?: boolean }) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    responsive: 'w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24',
  };
  
  const color = dark ? '#1c1917' : '#fafaf9';
  
  return (
    <svg className={sizeClasses[size]} viewBox="0 0 100 100">
      <rect x="5" y="5" width="25" height="25" fill={color} />
      <rect x="8" y="8" width="19" height="19" fill={dark ? '#fafaf9' : '#1c1917'} />
      <rect x="12" y="12" width="11" height="11" fill={color} />
      
      <rect x="70" y="5" width="25" height="25" fill={color} />
      <rect x="73" y="8" width="19" height="19" fill={dark ? '#fafaf9' : '#1c1917'} />
      <rect x="77" y="12" width="11" height="11" fill={color} />
      
      <rect x="5" y="70" width="25" height="25" fill={color} />
      <rect x="8" y="73" width="19" height="19" fill={dark ? '#fafaf9' : '#1c1917'} />
      <rect x="12" y="77" width="11" height="11" fill={color} />
      
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
// PLACEHOLDER SCREEN
// ============================================================================

function PlaceholderScreen({ 
  variant = 'dark', 
}: { 
  variant?: 'dark' | 'light';
}) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`h-full flex flex-col items-center justify-center ${
      isDark ? 'bg-stone-900' : 'bg-stone-100'
    }`}>
      <span className={`font-display text-xl sm:text-2xl md:text-3xl ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
        gymsense
      </span>
    </div>
  );
}

function ScreenshotDisplay({
  screenshot,
  variant,
  label,
  isScanning,
  scanningBackground,
  scanningBackgroundScale,
  scanningVariant,
}: {
  screenshot?: string;
  variant: 'dark' | 'light';
  label: string;
  isScanning?: boolean;
  scanningBackground?: string;
  scanningBackgroundScale?: number;
  scanningVariant?: 'dark' | 'light';
}) {
  if (isScanning) {
    return (
      <ScanningScreen 
        variant={scanningVariant || variant} 
        backgroundImage={scanningBackground}
        backgroundScale={scanningBackgroundScale}
      />
    );
  }
  
  if (screenshot) {
    return (
      <div className="h-full w-full relative">
        <Image 
          src={screenshot} 
          alt={label}
          fill
          className="object-cover object-top"
          priority
        />
      </div>
    );
  }
  
  return <PlaceholderScreen variant={variant} />;
}

// ============================================================================
// HELPER: Determine phone visibility for a step
// ============================================================================

function getPhoneVisibility(flow: Flow, step: Step): { showMember: boolean; showPro: boolean } {
  if (flow.displayMode === 'dynamic') {
    return {
      showMember: step.showMemberPhone ?? false,
      showPro: step.showProPhone ?? false,
    };
  }
  
  switch (flow.displayMode) {
    case 'single-member':
      return { showMember: true, showPro: false };
    case 'single-pro':
      return { showMember: false, showPro: true };
    case 'dual':
    default:
      return { showMember: true, showPro: true };
  }
}

// ============================================================================
// SWIPE THRESHOLD CONFIG
// ============================================================================

const SWIPE_THRESHOLD = 50; // minimum distance to trigger navigation
const SWIPE_VELOCITY_THRESHOLD = 500; // minimum velocity to trigger navigation

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function UserGuidePage() {
  const [selectedFlowId, setSelectedFlowId] = useState(FLOWS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<number>(0);
  
  const allImagePaths = getAllImagePaths();
  const { imagesLoaded, loadedCount, totalCount } = useImagePreloader(allImagePaths);
  
  const selectedFlow = FLOWS.find(f => f.id === selectedFlowId) || FLOWS[0];
  const currentStep = selectedFlow.steps[currentStepIndex];
  const { showMember, showPro } = getPhoneVisibility(selectedFlow, currentStep);
  const isDualMode = showMember && showPro;
  
  const memberPhoneLabel = selectedFlow.memberPhoneLabel || 'Member App';
  
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < selectedFlow.steps.length - 1) {
      setDragDirection(-1);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, selectedFlow.steps.length]);
  
  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setDragDirection(1);
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);
  
  const selectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setCurrentStepIndex(0);
    setDragDirection(0);
  };
  
  // Handle swipe gesture
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Check if swipe was significant enough
    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD) {
      if (offset.x > 0) {
        // Swiped right -> go to previous
        goToPrevStep();
      } else {
        // Swiped left -> go to next
        goToNextStep();
      }
    }
  }, [goToNextStep, goToPrevStep]);
  
  if (!imagesLoaded) {
    const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;
    return <LoadingSkeleton progress={progress} />;
  }
  
  // Animation variants for step transitions
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
  };
  
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950 overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-stone-200 px-4 py-3 sm:py-4 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/" className="font-display text-xl sm:text-2xl text-emerald-600 hover:text-emerald-500 transition-colors">
              gymsense
            </a>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span className="text-stone-500 text-xs sm:text-sm font-medium hidden sm:inline">User Guide</span>
          </div>
          <a 
            href="mailto:support@gymsense.io"
            className="text-stone-500 hover:text-emerald-600 transition-colors text-sm flex items-center gap-1"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Need help?</span>
          </a>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar Navigation - Hidden on mobile */}
        <aside className="w-64 border-r border-stone-200 min-h-[calc(100vh-57px)] p-4 hidden lg:block bg-white">
          <nav className="space-y-6">
            {CATEGORIES.map(category => {
              const categoryFlows = FLOWS.filter(f => f.category === category.id);
              const CategoryIcon = category.icon;
              
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold uppercase tracking-wider mb-2">
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
                                ? 'bg-emerald-50 text-emerald-700 font-medium' 
                                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
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
        <div className="flex-1 p-3 sm:p-4 lg:p-8 bg-stone-50 min-h-[calc(100vh-57px)]">
          {/* Mobile Flow Selector */}
          <div className="lg:hidden mb-4">
            <select
              value={selectedFlowId}
              onChange={(e) => selectFlow(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
          <div className="mb-4 sm:mb-6 text-center">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-stone-900 mb-1">
              {selectedFlow.title}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm">
              {selectedFlow.description}
            </p>
          </div>
          
          {/* Step Progress */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {selectedFlow.steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setDragDirection(idx > currentStepIndex ? -1 : 1);
                    setCurrentStepIndex(idx);
                  }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    isActive ? 'w-6 sm:w-8 bg-emerald-600' :
                    isPast ? 'w-1.5 sm:w-2 bg-emerald-300 hover:bg-emerald-400' :
                    'w-1.5 sm:w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              );
            })}
          </div>
          
          {/* Swipeable Phones Display */}
          <motion.div 
            className="flex flex-col items-center touch-pan-y"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ cursor: 'grab' }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            {/* Phones Container */}
            <AnimatePresence mode="wait" custom={dragDirection}>
              <motion.div
                key={currentStep.id}
                custom={dragDirection}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`flex justify-center items-start mb-4 sm:mb-6 ${
                  isDualMode ? 'gap-2 sm:gap-4 md:gap-6 lg:gap-10' : 'gap-6'
                }`}
              >
                {/* Member Phone */}
                {showMember && (
                  <div className="flex flex-col items-center">
                    <PhoneMockup 
                      variant="dark" 
                      isActive={currentStep.activeApp === 'member' || currentStep.activeApp === 'both'}
                      isDimmed={currentStep.memberDimmed}
                      isDualMode={isDualMode}
                    >
                      <ScreenshotDisplay
                        screenshot={currentStep.memberScreenshot}
                        variant="dark"
                        label={memberPhoneLabel}
                        isScanning={currentStep.memberScanning}
                        scanningBackground={currentStep.scanningBackground}
                        scanningBackgroundScale={currentStep.scanningBackgroundScale}
                        scanningVariant={currentStep.scanningVariant}
                      />
                    </PhoneMockup>
                    <div className="mt-2 sm:mt-3 text-center">
                      <span className={`text-xs sm:text-sm font-medium ${
                        !currentStep.memberDimmed && (currentStep.activeApp === 'member' || currentStep.activeApp === 'both')
                          ? 'text-emerald-600'
                          : 'text-stone-400'
                      }`}>
                        {memberPhoneLabel}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Pro Phone */}
                {showPro && (
                  <div className="flex flex-col items-center">
                    <PhoneMockup 
                      variant="light" 
                      isActive={currentStep.activeApp === 'pro' || currentStep.activeApp === 'both'}
                      isDimmed={currentStep.proDimmed}
                      isDualMode={isDualMode}
                    >
                      <ScreenshotDisplay
                        screenshot={currentStep.proScreenshot}
                        variant="light"
                        label="Pro App"
                        isScanning={currentStep.proScanning}
                        scanningVariant={currentStep.scanningVariant}
                      />
                    </PhoneMockup>
                    <div className="mt-2 sm:mt-3 text-center">
                      <span className={`text-xs sm:text-sm font-medium ${
                        !currentStep.proDimmed && (currentStep.activeApp === 'pro' || currentStep.activeApp === 'both')
                          ? 'text-stone-700'
                          : 'text-stone-400'
                      }`}>
                        Pro App
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Narrative */}
            <div className="max-w-lg text-center mb-4 sm:mb-6 px-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id + '-narrative'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Active App Indicator */}
                  {isDualMode && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {(currentStep.activeApp === 'member' || currentStep.activeApp === 'both') && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                          {memberPhoneLabel}
                        </span>
                      )}
                      {(currentStep.activeApp === 'pro' || currentStep.activeApp === 'both') && (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-medium">
                          Pro
                        </span>
                      )}
                    </div>
                  )}
                  
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
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
                    ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300 hover:text-stone-800 active:scale-95'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-stone-500 text-xs sm:text-sm min-w-[80px] text-center">
                Step {currentStepIndex + 1} of {selectedFlow.steps.length}
              </span>
              
              <button
                onClick={goToNextStep}
                disabled={currentStepIndex === selectedFlow.steps.length - 1}
                className={`p-2 rounded-full transition-colors ${
                  currentStepIndex === selectedFlow.steps.length - 1
                    ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300 hover:text-stone-800 active:scale-95'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Swipe hint - mobile only */}
            <p className="text-stone-400 text-[10px] mt-3 lg:hidden">
              Swipe left or right to navigate
            </p>
          </motion.div>
        </div>
        
        {/* Right Sidebar - Hidden on mobile/tablet */}
        <aside className="w-72 border-l border-stone-200 min-h-[calc(100vh-57px)] p-4 hidden xl:block bg-white">
          <h3 className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Steps
          </h3>
          <ol className="space-y-2">
            {selectedFlow.steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              const stepVisibility = getPhoneVisibility(selectedFlow, step);
              
              return (
                <li key={step.id}>
                  <button
                    onClick={() => {
                      setDragDirection(idx > currentStepIndex ? -1 : 1);
                      setCurrentStepIndex(idx);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-emerald-50 border border-emerald-200' 
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                        isActive ? 'bg-emerald-600 text-white' :
                        isPast ? 'bg-emerald-200 text-emerald-800' :
                        'bg-stone-200 text-stone-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${
                          isActive ? 'text-stone-800' : 'text-stone-500'
                        }`}>
                          {step.narrative}
                        </p>
                        {stepVisibility.showMember && stepVisibility.showPro && (
                          <div className="flex items-center gap-1 mt-1">
                            {(step.activeApp === 'member' || step.activeApp === 'both') && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500" title={memberPhoneLabel} />
                            )}
                            {(step.activeApp === 'pro' || step.activeApp === 'both') && (
                              <span className="w-2 h-2 rounded-full bg-stone-400" title="Pro App" />
                            )}
                          </div>
                        )}
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
