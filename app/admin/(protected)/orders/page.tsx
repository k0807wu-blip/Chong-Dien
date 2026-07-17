import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { twd } from '@/lib/currency';
import {
  ORDER_STATUS_BADGE_CLASSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VALUES,
  PAYMENT_METHOD_LABELS,
} from '@/lib/orders';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import type { OrderStatus } from '@prisma/client';

export const metadata: Metadata = {
  title: '訂單管理 | 蟲殿後台',
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function isOrderStatus(value: string | undefined): value is OrderStatus {
  return (ORDER_STATUS_VALUES as readonly string[]).includes(value ?? '');
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = isOrderStatus(status) ? status : undefined;

  const orders = await prisma.order.findMany({
    where: filterStatus ? { status: filterStatus } : undefined,
    include: { items: true, user: true },
    orderBy: { createdAt: 'desc' },
  });

  const filters: { label: string; value?: OrderStatus }[] = [
    { label: '全部' },
    ...ORDER_STATUS_VALUES.map((value) => ({ label: ORDER_STATUS_LABELS[value], value })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-black text-primary">訂單管理</h1>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={f.value ? `/admin/orders?status=${f.value}` : '/admin/orders'}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filterStatus === f.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500">沒有符合條件的訂單。</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">訂單編號 {order.id}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    會員：{order.user ? order.user.email : '訪客'}
                  </p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div>
                  <p>
                    <span className="font-bold text-primary">收件人：</span>
                    {order.recipientName}
                  </p>
                  <p>
                    <span className="font-bold text-primary">電話：</span>
                    {order.phone}
                  </p>
                  <p>
                    <span className="font-bold text-primary">地址：</span>
                    {order.address}
                  </p>
                  {order.note && (
                    <p>
                      <span className="font-bold text-primary">備註：</span>
                      {order.note}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
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
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="font-black text-primary">總計 {twd(order.totalAmount)}</div>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
