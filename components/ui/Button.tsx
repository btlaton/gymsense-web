'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  // Primary: Inverted style (light on dark) - matches Linear's "Sign up" / "Start building"
  primary: `
    bg-stone-50 text-stone-950 
    hover:bg-stone-200 
    border border-transparent
  `,
  // Secondary: Muted background
  secondary: `
    bg-stone-800 text-stone-50 
    hover:bg-stone-700 
    border border-stone-700
  `,
  // Ghost: Text only with subtle hover
  ghost: `
    bg-transparent text-stone-300 
    hover:text-stone-50 
    border border-transparent
  `,
  // Outline: Border only
  outline: `
    bg-transparent text-stone-50 
    hover:bg-stone-800 
    border border-stone-700
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, children, className = '', ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-full
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-stone-950
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

