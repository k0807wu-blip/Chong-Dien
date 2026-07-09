'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCart, twd, useCart } from '@/lib/cart';

export default function CheckoutView() {
  const router = useRouter();
  const cart = useCart();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => router.push('/'), 1500);
    return () => clearTimeout(timer);
  }, [submitted, router]);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart.length) {
      setError('購物車目前是空的。');
      return;
    }
    setCart([]);
    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-10 text-center">
            <h1 className="text-2xl font-black text-primary mb-3">訂單已送出，感謝你的訂購！</h1>
            <p className="text-gray-500">即將帶你回到首頁...</p>
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
              <input required className="w-full border border-gray-300 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">聯絡電話</label>
              <input required className="w-full border border-gray-300 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">收件地址</label>
              <input required className="w-full border border-gray-300 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">付款方式</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-3">
                <option>ATM 匯款</option>
                <option>LINE Pay</option>
                <option>門市取貨付款</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">備註</label>
              <textarea rows={4} className="w-full border border-gray-300 rounded-xl px-4 py-3"></textarea>
            </div>
            {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-all">
              送出訂單
            </button>
          </form>
        </section>

        <aside className="bg-white rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-black text-primary mb-4">訂單摘要</h2>
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
