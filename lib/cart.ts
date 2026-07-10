import { useSyncExternalStore } from 'react';

export { twd } from '@/lib/currency';

export const CART_KEY = 'chongdien_cart';
export const CART_UPDATED_EVENT = 'cart:updated';

export type CartItem = {
  id: number;
  name: string;
  category: string;
  size: string | null;
  price: number;
  qty: number;
};

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

export function setCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const index = cart.findIndex((i) => i.id === item.id && (i.size || '') === (item.size || ''));
  if (index >= 0) cart[index].qty += item.qty;
  else cart.push(item);
  setCart(cart);
}

let cachedCart: CartItem[] = [];
let cachedRaw: string | null = null;

function readCartSnapshot(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedCart = raw ? JSON.parse(raw) : [];
  }
  return cachedCart;
}

const EMPTY_CART: CartItem[] = [];

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribeCart(callback: () => void) {
  window.addEventListener(CART_UPDATED_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

/** Reactive cart state — safe to read during render, updates on any addToCart/setCart call. */
export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribeCart, readCartSnapshot, getServerSnapshot);
}
