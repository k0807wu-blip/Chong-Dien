import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: '會員註冊 | 蟲殿 - 昆蟲生態館',
};

export default function RegisterPage() {
  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        <Suspense>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </main>
  );
}
