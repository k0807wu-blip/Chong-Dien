'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { addToCart } from '@/lib/cart';
import type { Product } from '@/lib/products';
import Modal from '@/components/Modal';

function formatTwd(n: number) {
  return new Intl.NumberFormat('zh-TW').format(n);
}

type AddedItem = { name: string; size: string | null };

export default function ProductDetail({ product, backHref = '/supplies' }: { product: Product; backHref?: string }) {
  const [selectedSizeKey, setSelectedSizeKey] = useState<string | null>(null);
  const [addedItem, setAddedItem] = useState<AddedItem | null>(null);

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

  const originGenerationRow =
    product.origin || product.generation ? (
      <div className="mt-3 flex flex-wrap gap-2">
        {product.origin && (
          <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold">
            <i className="fa-solid fa-location-dot mr-1"></i>產地：{product.origin}
          </span>
        )}
        {product.generation && (
          <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold">
            <i className="fa-solid fa-dna mr-1"></i>累代：{product.generation}
          </span>
        )}
      </div>
    ) : null;

  const specNoteText = product.specNote ? (
    <p className="mt-3 text-xs text-gray-400 whitespace-pre-line">
      <i className="fa-solid fa-circle-info mr-1"></i>
      {product.specNote}
    </p>
  ) : null;

  const careNoteBlock = product.careNote ? (
    <div className="mt-6 p-4 bg-accent/40 rounded-xl">
      <p className="text-sm font-bold text-primary mb-2">
        <i className="fa-solid fa-leaf mr-1"></i>飼育與繁殖說明
      </p>
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.careNote}</p>
    </div>
  ) : null;

  const addedModal = (
    <Modal open={!!addedItem} onClose={() => setAddedItem(null)}>
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary text-3xl mx-auto mb-4">
        <i className="fa-solid fa-check"></i>
      </div>
      <h2 className="text-xl font-black text-primary mb-2">已成功加入購物車！</h2>
      <p className="text-gray-600">
        {addedItem?.name}
        {addedItem?.size ? `（${addedItem.size}）` : ''}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setAddedItem(null)}
          className="flex-1 text-center py-3 rounded-full border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"
        >
          繼續選購
        </button>
        <Link
          href="/cart"
          className="flex-1 text-center py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-all"
        >
          前往購物車
        </Link>
      </div>
    </Modal>
  );

  if (product.sizes.length > 0) {
    const selected = product.sizes.find((s) => s.key === selectedSizeKey) ?? null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`aspect-square relative ${product.image ? 'overflow-hidden' : 'image-placeholder'}`}>
          {media}
        </div>
        <div className="p-8 md:p-12">
          <p className="text-xs text-secondary font-bold mb-2 tracking-widest">{product.category}</p>
          {originGenerationRow}

          <div className="mt-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">選擇規格 Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSelectedSizeKey(s.key)}
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
          {specNoteText}

          <p className="mt-6 text-gray-600 leading-loose">{product.description}</p>
          {careNoteBlock}

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
                setAddedItem({ name: product.name, size: selected.key });
              }}
              className={`flex-1 text-center py-3 rounded-full bg-primary text-white font-bold transition-all ${
                selected ? 'hover:bg-secondary' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-cart-shopping mr-2"></i>加入購物車
            </button>
            <Link
              href={backHref}
              className="flex-1 text-center py-3 rounded-full border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"
            >
              返回列表
            </Link>
          </div>
        </div>
        {addedModal}
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
        {originGenerationRow}
        <div className="flex items-center justify-between gap-4 flex-wrap mt-6">
          <div className="text-primary">
            <span className="text-sm font-bold">TWD</span>
            <span className="text-3xl font-black ml-1 tracking-tighter">{formatTwd(product.price ?? 0)}</span>
          </div>
          <span className="px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-bold">
            目前庫存：{product.stock}
          </span>
        </div>
        {specNoteText}

        <p className="mt-6 text-gray-600 leading-loose">{product.description}</p>
        {careNoteBlock}

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
              setAddedItem({ name: product.name, size: null });
            }}
            className="flex-1 text-center py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-all"
          >
            <i className="fa-solid fa-cart-shopping mr-2"></i>加入購物車
          </button>
          <Link
            href={backHref}
            className="flex-1 text-center py-3 rounded-full border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"
          >
            返回列表
          </Link>
        </div>
      </div>
      {addedModal}
    </div>
  );
}
