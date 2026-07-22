import type { Metadata } from 'next';
import CheckoutView from '@/components/CheckoutView';
import { getSessionUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: '結帳 | 蟲殿 - 昆蟲生態館',
};

export default async function CheckoutPage() {
  const user = await getSessionUser();
  return <CheckoutView isMember={!!user} />;
}
