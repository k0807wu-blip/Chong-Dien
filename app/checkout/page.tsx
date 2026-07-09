import type { Metadata } from 'next';
import CheckoutView from '@/components/CheckoutView';

export const metadata: Metadata = {
  title: '結帳 | 蟲殿 - 昆蟲生態館',
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
