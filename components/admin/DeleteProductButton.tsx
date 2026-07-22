'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProductButton({ productId }: { productId: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? '刪除失敗，請稍後再試。');
        setDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      setError('網路異常，請稍後再試。');
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">確定刪除？</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-500 font-bold disabled:opacity-50"
        >
          {deleting ? '刪除中...' : '確定'}
        </button>
        <button onClick={() => setConfirming(false)} disabled={deleting} className="text-gray-400 font-bold">
          取消
        </button>
        {error && <span className="text-red-500">{error}</span>}
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-red-500 text-sm font-bold hover:underline">
      刪除
    </button>
  );
}
