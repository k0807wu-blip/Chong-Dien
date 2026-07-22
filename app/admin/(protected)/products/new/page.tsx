import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductForm from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: '新增商品 | 蟲殿後台',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-primary">新增商品</h1>
      <Suspense>
        <ProductForm />
      </Suspense>
    </div>
  );
}
