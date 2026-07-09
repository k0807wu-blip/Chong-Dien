'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const body = mode === 'register' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '發生錯誤，請稍後再試。');
        setSubmitting(false);
        return;
      }
      const redirectTo = searchParams.get('from') || '/account';
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('網路異常，請稍後再試。');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm p-8">
      <h1 className="text-2xl font-black text-primary mb-6">{mode === 'register' ? '會員註冊' : '會員登入'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-bold mb-2">姓名</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">密碼</label>
          <input
            type="password"
            required
            minLength={mode === 'register' ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
          {mode === 'register' && <p className="mt-1 text-xs text-gray-400">至少 8 個字元</p>}
        </div>
        {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
        <button
          disabled={submitting}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-all disabled:opacity-50"
        >
          {mode === 'register' ? '註冊' : '登入'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        {mode === 'register' ? (
          <>
            已經有帳號了？{' '}
            <Link href="/login" className="text-secondary font-bold">
              前往登入
            </Link>
          </>
        ) : (
          <>
            還沒有帳號？{' '}
            <Link href="/register" className="text-secondary font-bold">
              前往註冊
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
