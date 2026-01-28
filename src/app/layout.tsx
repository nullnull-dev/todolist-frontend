import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TodoList',
  description: '할 일 관리 애플리케이션 - Glass Dark Design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-[#0A0A0F] min-h-screen`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
