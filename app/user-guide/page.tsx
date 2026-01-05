'use client';

import { useState, useEffect } from 'react';
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
  memberScanning?: boolean;
  proScanning?: boolean;
  scanningBackground?: string;
  scanningBackgroundScale?: number; // Scale factor for background (default 1)
  scanningVariant?: 'dark' | 'light'; // Override default scanning theme
  // Per-step visibility overrides
  showMemberPhone?: boolean;
  showProPhone?: boolean;
  // Dimmed state (visible but greyed out)
  memberDimmed?: boolean;
  proDimmed?: boolean;
}

interface Flow {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'onboarding' | 'transactions' | 'operations' | 'admin';
  displayMode: 'single-member' | 'single-pro' | 'dual' | 'dynamic'; // 'dynamic' = per-step control
  memberPhoneLabel?: string; // Custom label (default: "Member App")
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
        proScreenshot: '/user-guide/new-member-signup/step-4-pro.png', // QR persists
        showMemberPhone: true,
        showProPhone: true,
        proDimmed: true,
      },
      {
        id: 'new-member-signup-6',
        narrative: 'Sarah enters her email, phone and payment method and taps Subscribe.',
        activeApp: 'member',
        memberScreenshot: '/user-guide/new-member-signup/step-6-member.png',
        proScreenshot: '/user-guide/new-member-signup/step-4-pro.png', // QR persists
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
        memberScreenshot: '/user-guide/customer-checkout/step-2-member.png', // QR persists
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
  return Array.from(new Set(paths)); // Remove duplicates
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
        
        {/* Progress bar */}
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
// PHONE MOCKUP COMPONENT - Clean frame without Dynamic Island
// ============================================================================

function PhoneMockup({ 
  variant = 'dark',
  isActive = true,
  isDimmed = false,
  children,
}: { 
  variant?: 'dark' | 'light';
  isActive?: boolean;
  isDimmed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div 
      className={`relative transition-all duration-300`}
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
        <div className={`absolute -inset-3 rounded-[3.5rem] blur-xl ${
          variant === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-600/10'
        }`} />
      )}
      
      {/* Phone frame - clean design without Dynamic Island */}
      <div className="relative w-[220px] sm:w-[260px] md:w-[280px] h-[476px] sm:h-[563px] md:h-[607px] bg-stone-800 rounded-[2.5rem] sm:rounded-[3rem] p-[6px] shadow-2xl">
        <div className={`w-full h-full rounded-[2.25rem] sm:rounded-[2.75rem] overflow-hidden relative ${
          variant === 'dark' ? 'bg-stone-900' : 'bg-stone-100'
        }`}>
          {/* Screen Content - full bleed */}
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
      {/* Optional background image (e.g., QR code stand) */}
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
      
      {/* Header */}
      <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
        <span className={`font-display text-base ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
          gymsense
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isDark ? 'bg-stone-700' : 'bg-stone-300'
        }`}>
          <ScanLine className={`w-4 h-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
        </div>
      </div>
      
      <p className={`text-sm font-medium mb-4 z-10 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
        Scanning...
      </p>
      
      {/* Scanning frame */}
      <div className="relative w-32 sm:w-40 h-32 sm:h-40 z-10">
        {/* Animated border */}
        <motion.div 
          className={`absolute inset-0 border-2 rounded-2xl ${
            isDark ? 'border-emerald-500' : 'border-emerald-600'
          }`}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Corner accents */}
        <div className={`absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] rounded-tl-xl ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] rounded-tr-xl ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] rounded-bl-xl ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] rounded-br-xl ${
          isDark ? 'border-emerald-400' : 'border-emerald-500'
        }`} />
        
        {/* Scanning line */}
        <motion.div 
          className={`absolute inset-x-3 h-0.5 ${isDark ? 'bg-emerald-500' : 'bg-emerald-600'}`}
          animate={{ top: ['10%', '85%', '10%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* QR Code placeholder */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <QRCodeDisplay size="medium" dark={isDark} />
        </div>
      </div>
      
      <p className={`mt-4 text-xs z-10 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
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
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
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
// PLACEHOLDER SCREEN - gymsense logo
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
      <span className={`font-display text-3xl ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
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
  // Show scanning animation
  if (isScanning) {
    return (
      <ScanningScreen 
        variant={scanningVariant || variant} 
        backgroundImage={scanningBackground}
        backgroundScale={scanningBackgroundScale}
      />
    );
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
  // For dynamic display mode, use per-step overrides
  if (flow.displayMode === 'dynamic') {
    return {
      showMember: step.showMemberPhone ?? false,
      showPro: step.showProPhone ?? false,
    };
  }
  
  // For fixed display modes
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
// MAIN PAGE COMPONENT
// ============================================================================

export default function UserGuidePage() {
  const [selectedFlowId, setSelectedFlowId] = useState(FLOWS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Preload all images
  const allImagePaths = getAllImagePaths();
  const { imagesLoaded, loadedCount, totalCount } = useImagePreloader(allImagePaths);
  
  const selectedFlow = FLOWS.find(f => f.id === selectedFlowId) || FLOWS[0];
  const currentStep = selectedFlow.steps[currentStepIndex];
  const { showMember, showPro } = getPhoneVisibility(selectedFlow, currentStep);
  
  // Get the label for the member phone
  const memberPhoneLabel = selectedFlow.memberPhoneLabel || 'Member App';
  
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
  
  // Show loading skeleton while images preload
  if (!imagesLoaded) {
    const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;
    return <LoadingSkeleton progress={progress} />;
  }
  
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      {/* Header */}
      <header className="border-b border-stone-200 px-4 py-4 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="font-display text-2xl text-emerald-600 hover:text-emerald-500 transition-colors">
              gymsense
            </a>
            <span className="text-stone-300">|</span>
            <span className="text-stone-500 text-sm font-medium">User Guide</span>
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
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-stone-200 min-h-[calc(100vh-65px)] p-4 hidden lg:block bg-white">
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
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-stone-50">
          {/* Mobile Flow Selector */}
          <div className="lg:hidden mb-6">
            <select
              value={selectedFlowId}
              onChange={(e) => selectFlow(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 mb-2">
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
                    isActive ? 'w-8 bg-emerald-600' :
                    isPast ? 'w-2 bg-emerald-300 hover:bg-emerald-400' :
                    'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              );
            })}
          </div>
          
          {/* Phones Display */}
          <div className="flex flex-col items-center">
            {/* Phones - with AnimatePresence for smooth transitions */}
            <div className="flex justify-center items-start gap-6 sm:gap-10 mb-6 min-h-[520px] sm:min-h-[600px] md:min-h-[650px]">
              <AnimatePresence mode="popLayout">
                {/* Member Phone (Dark) */}
                {showMember && (
                  <motion.div 
                    key="member-phone"
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <PhoneMockup 
                      variant="dark" 
                      isActive={currentStep.activeApp === 'member' || currentStep.activeApp === 'both'}
                      isDimmed={currentStep.memberDimmed}
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
                    <div className="mt-4 text-center">
                      <span className={`text-sm font-medium ${
                        !currentStep.memberDimmed && (currentStep.activeApp === 'member' || currentStep.activeApp === 'both')
                          ? 'text-emerald-600'
                          : 'text-stone-400'
                      }`}>
                        {memberPhoneLabel}
                      </span>
                    </div>
                  </motion.div>
                )}
                
                {/* Pro Phone (Light) */}
                {showPro && (
                  <motion.div 
                    key="pro-phone"
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <PhoneMockup 
                      variant="light" 
                      isActive={currentStep.activeApp === 'pro' || currentStep.activeApp === 'both'}
                      isDimmed={currentStep.proDimmed}
                    >
                      <ScreenshotDisplay
                        screenshot={currentStep.proScreenshot}
                        variant="light"
                        label="Pro App"
                        isScanning={currentStep.proScanning}
                        scanningVariant={currentStep.scanningVariant}
                      />
                    </PhoneMockup>
                    <div className="mt-4 text-center">
                      <span className={`text-sm font-medium ${
                        !currentStep.proDimmed && (currentStep.activeApp === 'pro' || currentStep.activeApp === 'both')
                          ? 'text-stone-700'
                          : 'text-stone-400'
                      }`}>
                        Pro App
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  {/* Active App Indicator - only show for dual/dynamic mode with both phones visible */}
                  {showMember && showPro && (
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
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300 hover:text-stone-800'
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
                    ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300 hover:text-stone-800'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Step List (Desktop) */}
        <aside className="w-72 border-l border-stone-200 min-h-[calc(100vh-65px)] p-4 hidden xl:block bg-white">
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
                    onClick={() => setCurrentStepIndex(idx)}
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
                        {/* App indicators - only for steps with both phones visible */}
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
