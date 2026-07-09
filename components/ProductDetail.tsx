'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { addToCart } from '@/lib/cart';
import type { Product } from '@/lib/products';

function formatTwd(n: number) {
  return new Intl.NumberFormat('zh-TW').format(n);
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedSizeKey, setSelectedSizeKey] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const media = product.image ? (
    <Image
      src={product.image}
      alt={product.name}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      className="object-cover"
    />
  ) : (
    <i className="fa-solid fa-box-open text-6xl opacity-20"></i>
  );

  if (product.sizes && product.sizes.length) {
    const selected = product.sizes.find((s) => s.key === selectedSizeKey) ?? null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`aspect-square relative ${product.image ? 'overflow-hidden' : 'image-placeholder'}`}>
          {media}
        </div>
        <div className="p-8 md:p-12">
          <p className="text-xs text-secondary font-bold mb-2 tracking-widest">{product.category}</p>

          <div className="mt-2">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">選擇規格 Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    setSelectedSizeKey(s.key);
                    setAddedMessage(null);
                  }}
                  className={`size-btn w-16 h-10 border border-gray-200 rounded-lg text-sm font-bold transition-all ${
                    selectedSizeKey === s.key ? 'active' : ''
                  }`}
                >
                  {s.key}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-primary">
              <span className="text-sm font-bold">TWD</span>
              <span className="text-3xl font-black ml-1 tracking-tighter">
                {selected ? formatTwd(selected.price) : '-'}
              </span>
            </div>
          </div>

          {selected && (
            <p className="mt-4 text-sm text-gray-500">
              目前庫存：<span className="font-bold text-primary">{selected.stock}</span>
            </p>
          )}

          <p className="mt-6 text-gray-600 leading-loose">{product.description}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={!selected}
              onClick={() => {
                if (!selected) return;
                addToCart({
                  id: product.id,
                  name: product.name,
                  category: product.category,
                  size: selected.key,
                  price: selected.price,
                  qty: 1,
                });
                setAddedMessage(`已加入購物車：${product.name} (${selected.key})`);
              }}
              className={`flex-1 text-center py-3 rounded-full bg-primary text-white font-bold transition-all ${
                selected ? 'hover:bg-secondary' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-cart-shopping mr-2"></i>加入購物車
            </button>
            <Link
              href="/supplies"
              className="flex-1 text-center py-3 rounded-full border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"
            >
              返回列表
            </Link>
          </div>
          {addedMessage && <p className="mt-3 text-sm text-secondary font-bold">{addedMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className={`aspect-square relative ${product.image ? 'overflow-hidden' : 'image-placeholder'}`}>
        {media}
      </div>
      <div className="p-8 md:p-12">
        <p className="text-xs text-secondary font-bold mb-2 tracking-widest">{product.category}</p>
        <div className="flex items-center justify-between gap-4 flex-wrap mt-2">
          <div className="text-primary">
            <span className="text-sm font-bold">TWD</span>
            <span className="text-3xl font-black ml-1 tracking-tighter">{formatTwd(product.price ?? 0)}</span>
          </div>
          <span className="px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-bold">
            目前庫存：{product.stock}
          </span>
        </div>

        <p className="mt-6 text-gray-600 leading-loose">{product.description}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              addToCart({
                id: product.id,
                name: product.name,
                category: product.category,
                size: null,
                price: product.price ?? 0,
                qty: 1,
              });
              setAddedMessage(`已加入購物車：${product.name}`);
            }}
            className="flex-1 text-center py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-all"
          >
            <i className="fa-solid fa-cart-shopping mr-2"></i>加入購物車
          </button>
          <Link
            href="/supplies"
            className="flex-1 text-center py-3 rounded-full border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"
          >
            返回列表
          </Link>
        </div>
        {addedMessage && <p className="mt-3 text-sm text-secondary font-bold">{addedMessage}</p>}
      </div>
    </div>
  );
}
