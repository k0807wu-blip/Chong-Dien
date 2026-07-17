import type { Metadata } from 'next';
import CartView from '@/components/CartView';

export const metadata: Metadata = {
  title: '購物車 | 蟲殿 - 昆蟲生態館',
};

export default function CartPage() {
  return <CartView />;
}
