'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GlassCard from '@/components/ui/GlassCard';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup, isSigningUp, signupError } = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = '이메일을 입력하세요';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '유효한 이메일을 입력하세요';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력하세요';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    signup({ email, password, passwordConfirm });
  };

  const getErrorMessage = () => {
    if (!signupError) return null;
    const axiosError = signupError as AxiosError<ApiError>;
    return axiosError.response?.data?.error?.message || '회원가입에 실패했습니다';
  };

  return (
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#F1F5F9] mb-2">회원가입</h1>
        <p className="text-[#94A3B8]">새 계정을 만드세요</p>
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
              error={errors.email}
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
              placeholder="비밀번호 (6자 이상)"
              className="pl-10"
              error={errors.password}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#94A3B8] mb-2">
            비밀번호 확인
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
            <Input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              className="pl-10"
              error={errors.passwordConfirm}
            />
          </div>
        </div>

        <Button type="submit" loading={isSigningUp} className="w-full">
          회원가입
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#12121A] text-[#475569]">또는</span>
          </div>
        </div>

        <GoogleLoginButton />
      </form>

      <p className="mt-6 text-center text-sm text-[#94A3B8]">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-[#3B82F6] hover:underline">
          로그인
        </Link>
      </p>
    </GlassCard>
  );
}
