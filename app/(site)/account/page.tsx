import type { Metadata } from 'next';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { twd } from '@/lib/currency';
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/orders';

export const metadata: Metadata = {
  title: '會員專區 | 蟲殿 - 昆蟲生態館',
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default async function AccountPage() {
  const user = await getSessionUser();

  const orders = user
    ? await prisma.order.findMany({
        where: { userId: user.id },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4 space-y-8">
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

        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-primary mb-4">歷史訂單</h2>
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-500">目前還沒有訂單紀錄。</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">訂單編號 {order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold">
                        {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_BADGE_CLASSES[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.nameSnapshot}
                          {item.sizeKeySnapshot ? `（${item.sizeKeySnapshot}）` : ''} x {item.qty}
                        </span>
                        <span>{twd(item.unitPrice * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between font-black text-primary">
                    <span>總計</span>
                    <span>{twd(order.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
