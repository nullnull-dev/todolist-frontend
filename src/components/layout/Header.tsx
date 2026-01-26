'use client';

import { LogOut, CheckSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0A0A0F]/80 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-[#3B82F6]" />
          <span className="text-lg font-semibold text-[#F1F5F9]">TodoList</span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#94A3B8]">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
