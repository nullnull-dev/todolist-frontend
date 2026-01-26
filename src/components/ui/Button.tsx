'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0F] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-[#3B82F6] text-white hover:bg-[#2563EB] focus:ring-[#3B82F6]',
      secondary: 'bg-white/5 text-[#F1F5F9] border border-white/10 hover:bg-white/10 focus:ring-white/20',
      danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444]',
      ghost: 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 focus:ring-white/20',
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-lg',
      lg: 'text-base px-6 py-3 rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
