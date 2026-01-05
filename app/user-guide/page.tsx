'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
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
  scanningHideHeader?: boolean; // Hide gymsense logo for camera-style view
  showMemberPhone?: boolean;
  showProPhone?: boolean;
  memberDimmed?: boolean;
  proDimmed?: boolean;
}

interface Flow {
  id: string;
  title: string;
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
        scanningBackground: '/user-guide/new-member-signup/qr-code.png',
        scanningHideHeader: true,
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
        scanningVariant: 'dark',
        scanningBackground: '/user-guide/customer-checkout/qr-code.png',
        scanningHideHeader: true,
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
        scanningBackgroundScale: 0.75, // Scaled up from 0.5
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
// IMAGE PRELOADER HOOK - Enhanced to ensure true loading
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
      // Add a small delay to ensure browser has cached
      setTimeout(() => {
        setImagesLoaded(true);
      }, 100);
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
// HIDDEN IMAGE PRELOADER - Renders all images in DOM to ensure caching
// ============================================================================

function HiddenImagePreloader({ imagePaths }: { imagePaths: string[] }) {
  return (
    <div className="hidden" aria-hidden="true">
      {imagePaths.map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={1}
          height={1}
          priority
        />
      ))}
    </div>
  );
}

// ============================================================================
// PHONE MOCKUP COMPONENT - 10% larger frames
// ============================================================================

function PhoneMockup({ 
  variant = 'dark',
  isActive = true,
  isDimmed = false,
  isDualMode = false,
  isVisible = true,
  children,
}: { 
  variant?: 'dark' | 'light';
  isActive?: boolean;
  isDimmed?: boolean;
  isDualMode?: boolean;
  isVisible?: boolean;
  children: React.ReactNode;
}) {
  // 10% larger frames
  const sizeClasses = isDualMode
    ? 'w-[182px] sm:w-[220px] md:w-[264px] lg:w-[308px] h-[394px] sm:h-[476px] md:h-[572px] lg:h-[667px]'
    : 'w-[242px] sm:w-[286px] md:w-[330px] h-[524px] sm:h-[619px] md:h-[715px]';
  
  const roundingClasses = isDualMode
    ? 'rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem]'
    : 'rounded-[2.5rem] sm:rounded-[3rem]';
  
  const innerRoundingClasses = isDualMode
    ? 'rounded-[1.75rem] sm:rounded-[2.25rem] md:rounded-[2.75rem]'
    : 'rounded-[2.25rem] sm:rounded-[2.75rem]';

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`relative transition-all duration-150 ${
        isDimmed ? 'opacity-50 scale-[0.98]' : (isActive ? 'opacity-100' : 'opacity-60 scale-[0.98]')
      }`}
    >
      {isActive && !isDimmed && (
        <div className={`absolute -inset-2 sm:-inset-3 ${isDualMode ? 'rounded-[2.5rem]' : 'rounded-[3rem]'} blur-xl ${
          variant === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-600/10'
        }`} />
      )}
      
      <div className={`relative ${sizeClasses} bg-stone-800 ${roundingClasses} p-[4px] sm:p-[5px] md:p-[6px] shadow-2xl`}>
        <div className={`w-full h-full ${innerRoundingClasses} overflow-hidden relative ${
          variant === 'dark' ? 'bg-stone-900' : 'bg-stone-100'
        }`}>
          <div className="w-full h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SCANNING ANIMATION COMPONENT - With optional header hiding
// ============================================================================

function ScanningScreen({ 
  variant = 'dark',
  backgroundImage,
  backgroundScale = 1,
  hideHeader = false,
}: { 
  variant?: 'dark' | 'light';
  backgroundImage?: string;
  backgroundScale?: number;
  hideHeader?: boolean;
}) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`h-full flex flex-col items-center justify-center p-4 relative ${
      isDark ? 'bg-stone-900' : 'bg-stone-100'
    }`}>
      {/* Background image (actual QR code) */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `scale(${backgroundScale})` }}
        >
          <Image 
            src={backgroundImage} 
            alt="QR Code"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      )}
      
      {/* Header - only show if not hidden */}
      {!hideHeader && (
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
      )}
      
      {/* Only show scanning UI elements if no background image (generic scan view) */}
      {!backgroundImage && (
        <>
          <p className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 z-10 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            Scanning...
          </p>
          
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 z-10">
            <motion.div 
              className={`absolute inset-0 border-2 rounded-xl sm:rounded-2xl ${
                isDark ? 'border-emerald-500' : 'border-emerald-600'
              }`}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            
            <div className={`absolute top-0 left-0 w-5 h-5 sm:w-6 sm:h-6 border-t-[3px] border-l-[3px] rounded-tl-lg sm:rounded-tl-xl ${
              isDark ? 'border-emerald-400' : 'border-emerald-500'
            }`} />
            <div className={`absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 border-t-[3px] border-r-[3px] rounded-tr-lg sm:rounded-tr-xl ${
              isDark ? 'border-emerald-400' : 'border-emerald-500'
            }`} />
            <div className={`absolute bottom-0 left-0 w-5 h-5 sm:w-6 sm:h-6 border-b-[3px] border-l-[3px] rounded-bl-lg sm:rounded-bl-xl ${
              isDark ? 'border-emerald-400' : 'border-emerald-500'
            }`} />
            <div className={`absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 border-b-[3px] border-r-[3px] rounded-br-lg sm:rounded-br-xl ${
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
        </>
      )}
      
      {/* Scanning line overlay for camera view with QR background */}
      {backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
            
            {/* Scanning line */}
            <motion.div 
              className="absolute inset-x-4 h-0.5 bg-emerald-400/80"
              animate={{ top: ['5%', '90%', '5%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      )}
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
    responsive: 'w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24',
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

// ============================================================================
// SCREENSHOT DISPLAY
// ============================================================================

function ScreenshotDisplay({
  screenshot,
  variant,
  label,
  isScanning,
  scanningBackground,
  scanningBackgroundScale,
  scanningVariant,
  scanningHideHeader,
}: {
  screenshot?: string;
  variant: 'dark' | 'light';
  label: string;
  isScanning?: boolean;
  scanningBackground?: string;
  scanningBackgroundScale?: number;
  scanningVariant?: 'dark' | 'light';
  scanningHideHeader?: boolean;
}) {
  if (isScanning) {
    return (
      <ScanningScreen 
        variant={scanningVariant || variant} 
        backgroundImage={scanningBackground}
        backgroundScale={scanningBackgroundScale}
        hideHeader={scanningHideHeader}
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
          loading="eager"
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
// SWIPE CONFIG
// ============================================================================

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 300;

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function UserGuidePage() {
  const [selectedFlowId, setSelectedFlowId] = useState(FLOWS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const allImagePaths = getAllImagePaths();
  const { imagesLoaded, loadedCount, totalCount } = useImagePreloader(allImagePaths);
  
  const selectedFlow = FLOWS.find(f => f.id === selectedFlowId) || FLOWS[0];
  const currentStep = selectedFlow.steps[currentStepIndex];
  const { showMember, showPro } = getPhoneVisibility(selectedFlow, currentStep);
  const isDualMode = showMember && showPro;
  
  const memberPhoneLabel = selectedFlow.memberPhoneLabel || 'Member App';
  
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < selectedFlow.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, selectedFlow.steps.length]);
  
  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);
  
  const selectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setCurrentStepIndex(0);
  };
  
  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD) {
      if (offset.x > 0) {
        goToPrevStep();
      } else {
        goToNextStep();
      }
    }
  }, [goToNextStep, goToPrevStep]);
  
  if (!imagesLoaded) {
    const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;
    return <LoadingSkeleton progress={progress} />;
  }
  
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950 overflow-x-hidden">
      {/* Hidden preloader to ensure all images are in DOM */}
      <HiddenImagePreloader imagePaths={allImagePaths} />
      
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
        {/* Sidebar Navigation */}
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
        <div className="flex-1 p-3 sm:p-4 lg:p-6 bg-stone-50 min-h-[calc(100vh-57px)]">
          {/* Mobile Flow Selector */}
          <div className="lg:hidden mb-3">
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
          
          {/* Flow Title */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-stone-900 text-center mb-2">
            {selectedFlow.title}
          </h1>
          
          {/* Step Navigation - Above narrative */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <button
              onClick={goToPrevStep}
              disabled={currentStepIndex === 0}
              className={`p-1.5 rounded-full transition-all duration-150 ${
                currentStepIndex === 0
                  ? 'text-stone-300 cursor-not-allowed'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-stone-600 text-sm font-medium min-w-[100px] text-center">
              Step {currentStepIndex + 1} of {selectedFlow.steps.length}
            </span>
            
            <button
              onClick={goToNextStep}
              disabled={currentStepIndex === selectedFlow.steps.length - 1}
              className={`p-1.5 rounded-full transition-all duration-150 ${
                currentStepIndex === selectedFlow.steps.length - 1
                  ? 'text-stone-300 cursor-not-allowed'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200 active:scale-95'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Narrative Text - Above frames */}
          <div className="max-w-lg mx-auto text-center mb-4 px-2">
            {isDualMode && (
              <div className="flex items-center justify-center gap-2 mb-1">
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
          </div>
          
          {/* Swipeable Phones Area */}
          <motion.div 
            className="flex flex-col items-center touch-pan-y select-none"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ cursor: 'grab' }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            {/* Phones Container */}
            <div className={`flex justify-center items-start ${
              isDualMode ? 'gap-2 sm:gap-3 md:gap-4 lg:gap-6' : ''
            }`}>
              {/* Member Phone */}
              {showMember && (
                <div className="flex flex-col items-center">
                  <PhoneMockup 
                    variant="dark" 
                    isActive={currentStep.activeApp === 'member' || currentStep.activeApp === 'both'}
                    isDimmed={currentStep.memberDimmed}
                    isDualMode={isDualMode}
                    isVisible={showMember}
                  >
                    <ScreenshotDisplay
                      screenshot={currentStep.memberScreenshot}
                      variant="dark"
                      label={memberPhoneLabel}
                      isScanning={currentStep.memberScanning}
                      scanningBackground={currentStep.scanningBackground}
                      scanningBackgroundScale={currentStep.scanningBackgroundScale}
                      scanningVariant={currentStep.scanningVariant}
                      scanningHideHeader={currentStep.scanningHideHeader}
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
                    isVisible={showPro}
                  >
                    <ScreenshotDisplay
                      screenshot={currentStep.proScreenshot}
                      variant="light"
                      label="Pro App"
                      isScanning={currentStep.proScanning}
                      scanningVariant={currentStep.scanningVariant}
                      scanningBackground={currentStep.scanningBackground}
                      scanningHideHeader={currentStep.scanningHideHeader}
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
            </div>
            
            {/* Swipe hint */}
            <p className="text-stone-400 text-[10px] mt-3 lg:hidden">
              Swipe left or right to navigate
            </p>
          </motion.div>
        </div>
        
        {/* Right Sidebar */}
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
