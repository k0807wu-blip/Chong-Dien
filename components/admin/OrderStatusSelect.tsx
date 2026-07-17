'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { OrderStatus } from '@prisma/client';
import { ORDER_STATUS_LABELS, ORDER_STATUS_VALUES } from '@/lib/orders';

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = e.target.value;
    setUpdating(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? '更新失敗，請稍後再試。');
        setUpdating(false);
        return;
      }
      router.refresh();
    } catch {
      setError('網路異常，請稍後再試。');
      setUpdating(false);
    }
  }

  return (
    <div>
      <select
        defaultValue={status}
        onChange={handleChange}
        disabled={updating}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
      >
        {ORDER_STATUS_VALUES.map((value) => (
          <option key={value} value={value}>
            {ORDER_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
