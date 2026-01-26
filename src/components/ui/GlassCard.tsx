import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}
    >
      {children}
    </div>
  );
}
