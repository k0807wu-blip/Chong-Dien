'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import CartItemRow from '@/components/CartItemRow';
import { setCart, twd, useCart, type CartItem } from '@/lib/cart';

export default function CartView() {
  const cart = useCart();

  function update(next: CartItem[]) {
    setCart(next);
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <>
      <section className="pt-32 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[#c5a059] font-bold tracking-[0.2em] mb-2 uppercase">Shopping Cart</h2>
          <h1 className="text-4xl md:text-5xl font-black text-primary title-line">購物車</h1>
        </div>
      </section>

      <main className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            {cart.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
                購物車目前是空的，先去逛逛商品吧。
              </div>
            )}
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <CartItemRow
                  key={`${item.id}-${item.size ?? ''}`}
                  item={item}
                  onInc={() => {
                    const next = [...cart];
                    next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
                    update(next);
                  }}
                  onDec={() => {
                    const next = [...cart];
                    next[idx] = { ...next[idx], qty: Math.max(1, next[idx].qty - 1) };
                    update(next);
                  }}
                  onRemove={() => {
                    const next = cart.filter((_, i) => i !== idx);
                    update(next);
                  }}
                />
              ))}
            </div>
          </section>
          <aside className="bg-white rounded-2xl p-6 h-fit">
            <h3 className="text-xl font-black text-primary mb-4">訂單摘要</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>商品小計</span>
                <span>{twd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>運費</span>
                <span>TWD 0</span>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-black text-primary text-lg">
              <span>總計</span>
              <span>{twd(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              className={`mt-6 block w-full text-center bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-all ${
                cart.length === 0 ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              前往結帳
            </Link>
            <Link
              href="/supplies"
              className="mt-3 block w-full text-center border border-primary/20 text-primary py-3 rounded-xl font-bold hover:bg-primary/5 transition-all"
            >
              繼續購物
            </Link>
          </aside>
        </div>
      </main>

      <Footer variant="primary" />
    </>
  );
}
