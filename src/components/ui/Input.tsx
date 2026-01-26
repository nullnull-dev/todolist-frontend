'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors ${
            error ? 'border-[#EF4444]' : 'border-white/10'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
