'use client';

interface TodoFilterProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export default function TodoFilter({ filter, onFilterChange }: TodoFilterProps) {
  const filters = [
    { key: 'all' as const, label: '전체' },
    { key: 'active' as const, label: '진행중' },
    { key: 'completed' as const, label: '완료' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === key
              ? 'bg-[#3B82F6] text-white'
              : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
