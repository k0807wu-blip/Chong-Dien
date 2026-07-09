import type { Metadata } from 'next';
import { getSessionUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: '會員專區 | 蟲殿 - 昆蟲生態館',
};

export default async function AccountPage() {
  const user = await getSessionUser();

  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm p-8">
          <h1 className="text-2xl font-black text-primary mb-6">會員專區</h1>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-bold text-primary">姓名：</span>
              {user?.name}
            </p>
            <p>
              <span className="font-bold text-primary">Email：</span>
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
