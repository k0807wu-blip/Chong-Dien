import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import { getProduct } from '@/lib/products';

export const metadata: Metadata = {
  title: '商品 | 蟲殿 - 昆蟲生態館',
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(Number(id));

  return (
    <>
      <section className="pt-28 pb-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[#c5a059] font-bold tracking-[0.2em] mb-2 uppercase">Product</h2>
              <h1 className="text-4xl md:text-5xl font-black text-primary title-line">
                {product ? product.name : '商品'}
              </h1>
            </div>
            {product?.sizes ? null : product ? (
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
              <ProductDetail product={product} />
            ) : (
              <div className="p-10">
                <h2 className="text-3xl font-black text-primary mb-3">找不到商品</h2>
                <p className="text-gray-600">請返回列表重新選擇。</p>
                <div className="mt-8">
                  <Link
                    href="/supplies"
                    className="inline-block px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-secondary transition-all"
                  >
                    返回養育用品
                  </Link>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </main>

      <Footer variant="primary" />
    </>
  );
}
