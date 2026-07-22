import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/products';
import ProductForm from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: '編輯商品 | 蟲殿後台',
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(Number(id));
  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-primary">編輯商品</h1>
      <Suspense>
        <ProductForm product={product} />
      </Suspense>
    </div>
  );
}
