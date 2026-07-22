'use client';

import { useState } from 'react';
import Link from 'next/link';
import { setCart, twd, useCart } from '@/lib/cart';

type StockShortage = { productId: number; size?: string; requested: number; available: number };

type SubmittedOrder = {
  id: string;
  totalAmount: number;
};

const PAYMENT_METHODS = [
  { value: 'ATM_TRANSFER', label: 'ATM 匯款' },
  { value: 'LINE_PAY', label: 'LINE Pay' },
  { value: 'COD', label: '門市取貨付款' },
] as const;

export default function CheckoutView({ isMember }: { isMember: boolean }) {
  const cart = useCart();
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]['value']>('ATM_TRANSFER');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stockShortages, setStockShortages] = useState<StockShortage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart.length) {
      setError('購物車目前是空的。');
      return;
    }

    setSubmitting(true);
    setError(null);
    setStockShortages([]);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          phone,
          address,
          paymentMethod,
          note,
          items: cart.map((i) => ({ productId: i.id, size: i.size, qty: i.qty })),
        }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setStockShortages(data.details ?? []);
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? '訂單送出失敗，請稍後再試。');
        setSubmitting(false);
        return;
      }

      setCart([]);
      setSubmittedOrder({ id: data.order.id, totalAmount: data.order.totalAmount });
    } catch {
      setError('網路異常，請稍後再試。');
      setSubmitting(false);
    }
  }

  if (submittedOrder) {
    return (
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-10 text-center animate-success-in">
            <svg className="mx-auto mb-4" width="88" height="88" viewBox="0 0 88 88" fill="none">
              <circle
                className="success-circle-bg"
                cx="44"
                cy="44"
                r="40"
                stroke="var(--color-secondary)"
                strokeWidth="4"
              />
              <path
                className="success-check-mark"
                d="M24 44 L38 58 L64 30"
                stroke="var(--color-secondary)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-2xl font-black text-primary mb-3">訂單已送出，感謝你的訂購！</h1>
            <p className="text-gray-600">
              訂單編號 <span className="font-bold">{submittedOrder.id}</span>，總計 {twd(submittedOrder.totalAmount)}
            </p>

            {isMember ? (
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/account"
                  className="px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-all"
                >
                  查看我的訂單
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"
                >
                  返回首頁
                </Link>
              </div>
            ) : (
              <div className="mt-8 space-y-3">
                <p className="text-sm text-gray-500">
                  登入會員即可隨時查詢歷史訂單。
                  <Link href="/login" className="text-secondary font-bold hover:underline ml-1">
                    立即登入 / 註冊
                  </Link>
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-all"
                >
                  返回首頁
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8">
          <h1 className="text-3xl font-black text-primary mb-6">結帳資訊</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">收件人姓名</label>
              <input
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">聯絡電話</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">收件地址</label>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">付款方式</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">備註</label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              ></textarea>
            </div>
            {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
            <button
              disabled={submitting}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-all disabled:opacity-50"
            >
              {submitting ? '送出中...' : '送出訂單'}
            </button>
          </form>
        </section>

        <aside className="bg-white rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-black text-primary mb-4">訂單摘要</h2>
          {stockShortages.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-sm text-red-600 space-y-1">
              {stockShortages.map((s) => (
                <p key={`${s.productId}-${s.size ?? ''}`}>
                  {cart.find((i) => i.id === s.productId && (i.size ?? '') === (s.size ?? ''))?.name ?? '商品'}
                  {s.size ? `（${s.size}）` : ''} 庫存不足，目前僅剩 {s.available} 件（要買 {s.requested} 件）
                </p>
              ))}
            </div>
          )}
          <div className="space-y-3 text-sm">
            {!cart.length && <p className="text-gray-500">購物車是空的，請先加入商品。</p>}
            {cart.map((i) => (
              <div key={`${i.id}-${i.size ?? ''}`} className="flex justify-between gap-3">
                <div>
                  <p className="font-bold text-primary">{i.name}</p>
                  <p className="text-gray-500">
                    {i.size ? `規格 ${i.size} / ` : ''}數量 {i.qty}
                  </p>
                </div>
                <p className="font-bold">{twd(i.price * i.qty)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-black text-primary">
            <span>總計</span>
            <span>{twd(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
