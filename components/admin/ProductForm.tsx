'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Product } from '@/lib/products';
import {
  LIVE_CATEGORIES,
  LIVE_GENDER_LABELS,
  LIVE_GENDER_VALUES,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_VALUES,
} from '@/lib/product-schema';

type GenderValue = (typeof LIVE_GENDER_VALUES)[number];
type SizeRow = { key: string; price: string; stock: string; mm: string; allSize: boolean; gender: GenderValue };
type ProductTypeValue = (typeof PRODUCT_TYPE_VALUES)[number];

const DEFAULT_MM = '60';
const MM_MIN = 20;
const MM_MAX = 150;

function isProductType(value: string | null): value is ProductTypeValue {
  return (PRODUCT_TYPE_VALUES as readonly string[]).includes(value ?? '');
}

function isLiveCategory(value: string): value is (typeof LIVE_CATEGORIES)[number] {
  return (LIVE_CATEGORIES as readonly string[]).includes(value);
}

function liveKeyFromRow(row: Pick<SizeRow, 'allSize' | 'mm' | 'gender'>): string {
  const genderLabel = LIVE_GENDER_LABELS[row.gender];
  return row.allSize ? `All Size・${genderLabel}` : `${row.mm || DEFAULT_MM}mm・${genderLabel}`;
}

function parseLiveKey(key: string): { allSize: boolean; mm: string; gender: GenderValue } {
  const genderEntry = LIVE_GENDER_VALUES.find((g) => key.includes(LIVE_GENDER_LABELS[g]));
  const gender = genderEntry ?? 'PAIR';
  if (key.startsWith('All Size')) return { allSize: true, mm: DEFAULT_MM, gender };
  const match = key.match(/(\d+)\s*mm/);
  return { allSize: false, mm: match ? match[1] : DEFAULT_MM, gender };
}

function toSizeRows(product?: Product): SizeRow[] {
  if (!product || product.sizes.length === 0) return [];
  return product.sizes.map((s) => {
    const live = parseLiveKey(s.key);
    return { key: s.key, price: String(s.price), stock: String(s.stock), ...live };
  });
}

function emptySizeRow(): SizeRow {
  return { key: '', price: '', stock: '', mm: DEFAULT_MM, allSize: false, gender: 'PAIR' };
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = !!product;

  const defaultType = isProductType(searchParams.get('type')) ? searchParams.get('type') : null;
  const initialType: ProductTypeValue = product?.type ?? (defaultType as ProductTypeValue) ?? 'SUPPLY';
  const [type, setType] = useState<ProductTypeValue>(initialType);
  const [category, setCategory] = useState(
    product?.category ?? (initialType === 'LIVE' ? LIVE_CATEGORIES[0] : '')
  );

  function handleTypeChange(next: ProductTypeValue) {
    setType(next);
    if (next === 'LIVE' && !isLiveCategory(category)) {
      setCategory(LIVE_CATEGORIES[0]);
    }
  }
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [listNote, setListNote] = useState(product?.listNote ?? '');
  const [image, setImage] = useState(product?.image ?? '');
  const [icon, setIcon] = useState(product?.icon ?? '');
  const [badge, setBadge] = useState(product?.badge ?? '');
  const [origin, setOrigin] = useState(product?.origin ?? '');
  const [generation, setGeneration] = useState(product?.generation ?? '');
  const [careNote, setCareNote] = useState(product?.careNote ?? '');
  const [specNote, setSpecNote] = useState(product?.specNote ?? '');

  const [useSizes, setUseSizes] = useState((product?.sizes.length ?? 0) > 0);
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : '');
  const [stock, setStock] = useState(product?.stock != null ? String(product.stock) : '');
  const [sizes, setSizes] = useState<SizeRow[]>(
    toSizeRows(product).length > 0 ? toSizeRows(product) : [emptySizeRow()]
  );

  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleImageUpload(file: File) {
    setImageUploading(true);
    setImageError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/images', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setImageError(data.error ?? '上傳失敗，請稍後再試。');
        return;
      }
      setImage(data.url);
    } catch {
      setImageError('網路異常，請稍後再試。');
    } finally {
      setImageUploading(false);
    }
  }

  async function handleGenerateDescription() {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/admin/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, name, category }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAiError(data.error ?? '生成失敗，請稍後再試。');
        return;
      }
      setDescription(data.description);
    } catch {
      setAiError('網路異常，請稍後再試。');
    } finally {
      setAiGenerating(false);
    }
  }

  function updateSizeRow<K extends keyof SizeRow>(index: number, field: K, value: SizeRow[K]) {
    setSizes((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function addSizeRow() {
    setSizes((rows) => [...rows, emptySizeRow()]);
  }

  function removeSizeRow(index: number) {
    setSizes((rows) => rows.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      type,
      category,
      name,
      description,
      listNote,
      image: image.trim() || null,
      icon: icon.trim() || null,
      badge: badge.trim() || null,
      origin: type === 'LIVE' ? origin.trim() || null : null,
      generation: type === 'LIVE' ? generation.trim() || null : null,
      careNote: type === 'LIVE' ? careNote.trim() || null : null,
      specNote: type === 'LIVE' ? specNote.trim() || null : null,
      price: useSizes ? null : Number(price),
      stock: useSizes ? null : Number(stock),
      sizes: useSizes
        ? sizes
            .filter((s) => (type === 'LIVE' ? true : s.key.trim()))
            .map((s) => ({
              key: type === 'LIVE' ? liveKeyFromRow(s) : s.key.trim(),
              price: Number(s.price),
              stock: Number(s.stock),
            }))
        : [],
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/products/${product.id}` : '/api/admin/products', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? '發生錯誤，請稍後再試。');
        setSubmitting(false);
        return;
      }
      router.push('/products');
      router.refresh();
    } catch {
      setError('網路異常，請稍後再試。');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 max-w-2xl">
      <div>
        <label className="block text-sm font-bold mb-2">商品類型</label>
        <div className="flex gap-2">
          {PRODUCT_TYPE_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleTypeChange(value)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                type === value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {PRODUCT_TYPE_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-2">分類</label>
          {type === 'LIVE' ? (
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
            >
              {!isLiveCategory(category) && category && <option value={category}>{category}</option>}
              {LIVE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <input
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">商品名稱</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold">商品說明</label>
          <button
            type="button"
            onClick={() => setAiPromptOpen((v) => !v)}
            className="text-xs font-bold text-secondary hover:underline"
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>
            AI 生成說明
          </button>
        </div>

        {aiPromptOpen && (
          <div className="mb-3 p-3 bg-accent/40 rounded-xl space-y-2">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="輸入題詞，例如「體色偏紅，個性溫和，適合新手飼養」"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={aiGenerating || !aiPrompt.trim()}
                onClick={handleGenerateDescription}
                className="px-4 py-2 rounded-full bg-secondary text-white text-sm font-bold disabled:opacity-50"
              >
                {aiGenerating ? '生成中...' : description ? '重新生成' : '生成'}
              </button>
              {aiError && <span className="text-xs text-red-500 font-bold">{aiError}</span>}
            </div>
          </div>
        )}

        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">列表短說明（例如「點擊查看規格與庫存」）</label>
        <input
          required
          value={listNote}
          onChange={(e) => setListNote(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold mb-2">商品圖片（選填）</label>
          <div className="flex items-center gap-3">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="text-sm w-full"
            />
          </div>
          {imageUploading && <p className="text-xs text-gray-400 mt-1">上傳中...</p>}
          {imageError && <p className="text-xs text-red-500 font-bold mt-1">{imageError}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Font Awesome 圖示（無圖片時顯示，選填）</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="fa-vial"
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">標籤（選填）</label>
          <input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="熱銷款式"
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
        </div>
      </div>

      {type === 'LIVE' && (
        <div className="border-t pt-4 space-y-4">
          <p className="text-sm font-bold text-primary">活體資訊</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">產地（選填）</label>
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="南投縣 / 國外"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">累代（選填）</label>
              <input
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                placeholder="WF1 / CB / F2"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">飼育與繁殖說明（選填）</label>
            <textarea
              value={careNote}
              onChange={(e) => setCareNote(e.target.value)}
              rows={4}
              placeholder="例如：產卵箱建議規格、溫度、素材、主食與更換頻率等"
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">規格備註（選填）</label>
            <textarea
              value={specNote}
              onChange={(e) => setSpecNote(e.target.value)}
              rows={2}
              placeholder="例如：因個體差異，體色隨機出貨、少部分可能有極小瑕疵等"
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
            />
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <label className="flex items-center gap-2 text-sm font-bold mb-4">
          <input type="checkbox" checked={useSizes} onChange={(e) => setUseSizes(e.target.checked)} />
          {type === 'LIVE'
            ? '此商品有多種規格（不同體長／性別，各自獨立價格與庫存）'
            : '此商品使用多規格（例如 S/M/L/XL，各自獨立價格與庫存）'}
        </label>

        {useSizes ? (
          <div className="space-y-3">
            {type === 'LIVE'
              ? sizes.map((row, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold">
                        <input
                          type="checkbox"
                          checked={row.allSize}
                          onChange={(e) => updateSizeRow(i, 'allSize', e.target.checked)}
                        />
                        All Size（不限制體長）
                      </label>
                      {sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSizeRow(i)}
                          className="text-red-500 text-sm font-bold px-2"
                        >
                          移除
                        </button>
                      )}
                    </div>

                    {!row.allSize && (
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={MM_MIN}
                          max={MM_MAX}
                          value={row.mm}
                          onChange={(e) => updateSizeRow(i, 'mm', e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-sm font-bold text-primary w-16 shrink-0">{row.mm} mm</span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                      <select
                        value={row.gender}
                        onChange={(e) => updateSizeRow(i, 'gender', e.target.value as GenderValue)}
                        className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                      >
                        {LIVE_GENDER_VALUES.map((g) => (
                          <option key={g} value={g}>
                            {LIVE_GENDER_LABELS[g]}
                          </option>
                        ))}
                      </select>
                      <input
                        required
                        type="number"
                        min={0}
                        value={row.price}
                        onChange={(e) => updateSizeRow(i, 'price', e.target.value)}
                        placeholder="價格"
                        className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                      />
                      <input
                        required
                        type="number"
                        min={0}
                        value={row.stock}
                        onChange={(e) => updateSizeRow(i, 'stock', e.target.value)}
                        placeholder="庫存"
                        className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))
              : sizes.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      required
                      value={row.key}
                      onChange={(e) => updateSizeRow(i, 'key', e.target.value)}
                      placeholder="規格代號 (S)"
                      className="w-28 border border-gray-300 rounded-xl px-3 py-2"
                    />
                    <input
                      required
                      type="number"
                      min={0}
                      value={row.price}
                      onChange={(e) => updateSizeRow(i, 'price', e.target.value)}
                      placeholder="價格"
                      className="w-28 border border-gray-300 rounded-xl px-3 py-2"
                    />
                    <input
                      required
                      type="number"
                      min={0}
                      value={row.stock}
                      onChange={(e) => updateSizeRow(i, 'stock', e.target.value)}
                      placeholder="庫存"
                      className="w-28 border border-gray-300 rounded-xl px-3 py-2"
                    />
                    {sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSizeRow(i)}
                        className="text-red-500 text-sm font-bold px-2"
                      >
                        移除
                      </button>
                    )}
                  </div>
                ))}
            <button type="button" onClick={addSizeRow} className="text-secondary text-sm font-bold">
              + 新增規格
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">價格</label>
              <input
                required
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">庫存</label>
              <input
                required
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

      <div className="flex gap-3">
        <button
          disabled={submitting}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all disabled:opacity-50"
        >
          {submitting ? '儲存中...' : isEdit ? '儲存變更' : '新增商品'}
        </button>
      </div>
    </form>
  );
}
