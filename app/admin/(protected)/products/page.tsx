import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, priceLabel } from '@/lib/products';
import { PRODUCT_TYPE_LABELS, PRODUCT_TYPE_VALUES } from '@/lib/product-schema';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import type { ProductType } from '@prisma/client';

export const metadata: Metadata = {
  title: '商品管理 | 蟲殿後台',
};

function isProductType(value: string | undefined): value is ProductType {
  return (PRODUCT_TYPE_VALUES as readonly string[]).includes(value ?? '');
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filterType = isProductType(type) ? type : undefined;

  const allProducts = await getProducts();
  const products = filterType ? allProducts.filter((p) => p.type === filterType) : allProducts;

  const filters: { label: string; value?: ProductType }[] = [
    { label: '全部' },
    ...PRODUCT_TYPE_VALUES.map((value) => ({ label: PRODUCT_TYPE_LABELS[value], value })),
  ];

  const newProductHref = filterType ? `/products/new?type=${filterType}` : '/products/new';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-black text-primary">商品管理</h1>
        <Link
          href={newProductHref}
          className="px-4 py-2 rounded-full text-sm font-bold bg-primary text-white hover:bg-secondary transition-all"
        >
          新增商品
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/products?type=${f.value}` : '/products'}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filterType === f.value ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500">還沒有商品。</div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">類型</th>
                <th className="text-left px-4 py-3">分類</th>
                <th className="text-left px-4 py-3">名稱</th>
                <th className="text-left px-4 py-3">價格</th>
                <th className="text-left px-4 py-3">庫存</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold">
                      {PRODUCT_TYPE_LABELS[product.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.category}</td>
                  <td className="px-4 py-3 font-bold text-primary">{product.name}</td>
                  <td className="px-4 py-3">TWD {priceLabel(product)}</td>
                  <td className="px-4 py-3">
                    {product.sizes.length > 0
                      ? product.sizes.map((s) => `${s.key}:${s.stock}`).join(' ')
                      : product.stock}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/products/${product.id}`} className="text-secondary text-sm font-bold hover:underline">
                        編輯
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
