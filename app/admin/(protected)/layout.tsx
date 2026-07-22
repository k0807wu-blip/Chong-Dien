import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-black tracking-widest">蟲殿後台</span>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/orders" className="hover:text-secondary transition-colors">
                訂單管理
              </Link>
              <Link href="/products" className="hover:text-secondary transition-colors">
                商品管理
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
