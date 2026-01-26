import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizes[size]} animate-spin text-[#3B82F6]`} />
    </div>
  );
}
