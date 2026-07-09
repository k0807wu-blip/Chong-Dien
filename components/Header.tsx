'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CART_UPDATED_EVENT, getCartCount } from '@/lib/cart';
import type { SessionUser } from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/#about', label: '關於蟲殿' },
  { href: '/news', label: '最新消息' },
  { href: '/supplies', label: '養育用品' },
  { href: '/lives', label: '活體訂購' },
  { href: '/#hotel', label: '蟲蟲旅館' },
  { href: '/courses', label: '大師課程' },
  { href: '/#contact', label: '關於我們' },
];

export default function Header({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const refresh = () => setCartCount(getCartCount());
    refresh();
    window.addEventListener(CART_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMobileOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm ${
          scrolled ? 'scrolled py-2' : ''
        }`}
        id="navbar"
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#1a3a3a] rounded-full flex items-center justify-center text-white text-xl font-bold">
              蟲
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-widest text-[#1a3a3a]">蟲殿</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                Insect Palace Ecology
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8 font-medium">
            {NAV_ITEMS.map((item) => {
              const isActive = !item.href.includes('#') && pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'text-[#c5a059]' : 'hover:text-[#c5a059] transition-colors'}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/account" className="text-sm font-medium hover:text-secondary transition-colors">
                  {user.name} 會員
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-secondary transition-colors"
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium hover:text-secondary transition-colors"
              >
                登入 / 註冊
              </Link>
            )}

            <Link
              href="/cart"
              className="bg-[#1a3a3a] text-white px-4 py-2 rounded-full text-sm hover:bg-[#c5a059] transition-all"
            >
              <i className="fa-solid fa-basket-shopping mr-2"></i>
              購物車 (<span id="cart-count">{cartCount}</span>)
            </Link>

            <button className="md:hidden text-2xl" onClick={() => setMobileOpen(true)} aria-label="開啟選單">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 bg-[#1a3a3a] z-[60] flex flex-col items-center justify-center text-white space-y-8 text-2xl">
          <button
            className="absolute top-6 right-6 text-4xl"
            onClick={() => setMobileOpen(false)}
            aria-label="關閉選單"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/account" onClick={() => setMobileOpen(false)}>
                {user.name} 會員
              </Link>
              <button onClick={handleLogout}>登出</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              登入 / 註冊
            </Link>
          )}
        </div>
      )}
    </>
  );
}
