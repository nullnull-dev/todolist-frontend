'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

function OAuth2RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      return;
    }

    if (token) {
      setToken(token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.replace('/dashboard');
    } else {
      setError('인증 토큰을 받지 못했습니다');
    }
  }, [searchParams, router, queryClient]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="text-[#EF4444] mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#F1F5F9] mb-2">로그인 실패</h1>
          <p className="text-[#94A3B8] mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 text-center">
        <Loader2 className="w-12 h-12 mx-auto text-[#3B82F6] animate-spin mb-4" />
        <h1 className="text-xl font-bold text-[#F1F5F9] mb-2">로그인 처리 중</h1>
        <p className="text-[#94A3B8]">잠시만 기다려주세요...</p>
      </GlassCard>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto text-[#3B82F6] animate-spin mb-4" />
            <h1 className="text-xl font-bold text-[#F1F5F9] mb-2">로딩 중</h1>
            <p className="text-[#94A3B8]">잠시만 기다려주세요...</p>
          </GlassCard>
        </div>
      }
    >
      <OAuth2RedirectContent />
    </Suspense>
  );
}
