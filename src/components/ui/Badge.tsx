import { Priority } from '@/types';

interface BadgeProps {
  priority: Priority;
}

export default function Badge({ priority }: BadgeProps) {
  const styles = {
    HIGH: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30',
    MEDIUM: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30',
    LOW: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30',
  };

  const labels = {
    HIGH: '높음',
    MEDIUM: '보통',
    LOW: '낮음',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}
