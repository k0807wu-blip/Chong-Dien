import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import { getProduct, getProductsByType } from '@/lib/products';

export const metadata: Metadata = {
  title: '活體商品 | 蟲殿 - 昆蟲生態館',
};

export default async function LiveProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getProduct(Number(id));
  const product = found && found.type === 'LIVE' ? found : null;

  const related = product
    ? (await getProductsByType('LIVE'))
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4)
    : [];

  return (
    <>
      <section className="pt-28 pb-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[#c5a059] font-bold tracking-[0.2em] mb-2 uppercase">Live Order</h2>
              <h1 className="text-4xl md:text-5xl font-black text-primary title-line">
                {product ? product.name : '活體商品'}
              </h1>
            </div>
            {product && product.sizes.length === 0 ? (
              <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-bold">
                庫存：{product.stock}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <main className="py-16">
        <div className="container mx-auto px-4">
          <Reveal className="active max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl">
            {product ? (
              <ProductDetail product={product} backHref="/lives" />
            ) : (
              <div className="p-10">
                <h2 className="text-3xl font-black text-primary mb-3">找不到商品</h2>
                <p className="text-gray-600">請返回列表重新選擇。</p>
                <div className="mt-8">
                  <Link
                    href="/lives"
                    className="inline-block px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-all"
                  >
                    返回活體訂購
                  </Link>
                </div>
              </div>
            )}
          </Reveal>

          {related.length > 0 && (
            <div className="max-w-4xl mx-auto mt-12">
              <h2 className="text-xl font-black text-primary mb-6">同分類其他商品</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((p, idx) => (
                  <ProductCard key={p.id} product={p} delay={idx * 0.1} basePath="/lives" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer variant="primary" />
    </>
  );
}
