import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/lib/products';

export const metadata: Metadata = {
  title: '養育用品 | 蟲殿 - 昆蟲生態館',
};

export default function SuppliesPage() {
  return (
    <>
      <section className="pt-32 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[#c5a059] font-bold tracking-[0.2em] mb-2 uppercase">Supplies & Hardware</h2>
              <h1 className="text-4xl md:text-5xl font-black text-primary title-line">養育用品</h1>
            </div>
            {/* 分類篩選 (示範用，未串接後端) */}
            <div className="flex flex-wrap gap-2">
              <button className="px-6 py-2 bg-primary text-white rounded-full text-sm">全部商品</button>
              <button className="px-6 py-2 bg-gray-100 text-gray-500 hover:bg-secondary hover:text-white rounded-full text-sm transition-all">
                飼育箱
              </button>
              <button className="px-6 py-2 bg-gray-100 text-gray-500 hover:bg-secondary hover:text-white rounded-full text-sm transition-all">
                發酵木屑
              </button>
              <button className="px-6 py-2 bg-gray-100 text-gray-500 hover:bg-secondary hover:text-white rounded-full text-sm transition-all">
                營養果凍
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {PRODUCTS.map((product, idx) => (
              <ProductCard key={product.id} product={product} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </main>

      <Footer variant="primary" />
    </>
  );
}
