import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { getProductsByType } from '@/lib/products';

export const metadata: Metadata = {
  title: '活體訂購 | 蟲殿 - 昆蟲生態館',
};

export default async function LivesPage() {
  const products = await getProductsByType('LIVE');

  return (
    <>
      <section className="pt-32 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[#c5a059] font-bold tracking-[0.2em] mb-2 uppercase">Live Order</h2>
              <h1 className="text-4xl md:text-5xl font-black text-primary title-line">活體訂購</h1>
            </div>
          </div>
        </div>
      </section>

      <main className="py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm p-10 text-center text-gray-500">
              目前尚無上架的活體商品，敬請期待。
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} delay={idx * 0.1} basePath="/lives" />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer variant="primary" />
    </>
  );
}
