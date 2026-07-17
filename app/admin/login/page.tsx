import type { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: '後台登入 | 蟲殿後台',
};

export default function AdminLoginPage() {
  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        <AdminLoginForm />
      </div>
    </main>
  );
}
