'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '發生錯誤，請稍後再試。');
        setSubmitting(false);
        return;
      }
      router.push('/admin/orders');
      router.refresh();
    } catch {
      setError('網路異常，請稍後再試。');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm p-8">
      <h1 className="text-2xl font-black text-primary mb-6">後台登入</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>
        {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
        <button
          disabled={submitting}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-all disabled:opacity-50"
        >
          {submitting ? '登入中...' : '登入'}
        </button>
      </form>
    </div>
  );
}
