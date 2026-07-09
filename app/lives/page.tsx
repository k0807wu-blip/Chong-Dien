import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '活體訂購 | 蟲殿 - 昆蟲生態館',
};

export default function LivesPage() {
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
          <Reveal className="active max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-8">
            <h3 className="text-2xl font-black text-primary mb-4">此頁面先做骨架</h3>
            <p className="text-gray-600 leading-loose">
              目前「活體訂購」分頁尚未填入商品列表。
              你接下來可以告訴我：要做哪些品項/類別、以及是否要像「養育用品」一樣使用商品 ID 分頁與庫存顯示。
            </p>
          </Reveal>
        </div>
      </main>

      <Footer variant="primary" />
    </>
  );
}
