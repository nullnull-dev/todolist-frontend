'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GlassCard from '@/components/ui/GlassCard';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const getErrorMessage = () => {
    if (!loginError) return null;
    const axiosError = loginError as AxiosError<ApiError>;
    return axiosError.response?.data?.error?.message || '로그인에 실패했습니다';
  };

  return (
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#F1F5F9] mb-2">로그인</h1>
        <p className="text-[#94A3B8]">계정에 로그인하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {getErrorMessage() && (
          <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444]">
            {getErrorMessage()}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">
            이메일
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">
            비밀번호
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" loading={isLoggingIn} className="w-full">
          로그인
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#94A3B8]">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-[#3B82F6] hover:underline">
          회원가입
        </Link>
      </p>
    </GlassCard>
  );
}
