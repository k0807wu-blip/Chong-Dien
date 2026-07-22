import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '溫控寄放 | 蟲殿 - 昆蟲生態館',
};

const PLANS = [
  { icon: 'fa-calendar-days', label: '月租方案', value: '600 元' },
  { icon: 'fa-ruler-combined', label: '欄位大小', value: '90×180 cm' },
  { icon: 'fa-layer-group', label: '可堆疊數量', value: '90 隻窄口菌瓶' },
  { icon: 'fa-gift', label: '年租方案', value: '6,000 元', note: '贈送一包 AK 木屑' },
];

export default function StoragePage() {
  return (
    <>
      <section className="pt-32 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[#c5a059] font-bold tracking-[0.2em] mb-2 uppercase">Climate-Controlled Storage</h2>
          <h1 className="text-4xl md:text-5xl font-black text-primary title-line">溫控寄放區</h1>
        </div>
      </section>

      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <Reveal className="w-full md:w-1/2 grid grid-cols-1 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video">
                <Image
                  src="/images/climate-storage-1.jpg"
                  alt="溫控寄放區菌瓶架"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video">
                <Image
                  src="/images/climate-storage-2.jpg"
                  alt="溫控寄放區作業空間"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal className="w-full md:w-1/2" delay={0.3}>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                蟲殿提供全年恆溫的菌瓶寄放空間，讓您安心存放繁殖用菌瓶，不用擔心溫度波動影響幼蟲成長，方便管理與定期查看。
              </p>
              <div className="grid grid-cols-2 gap-4">
                {PLANS.map((plan) => (
                  <div key={plan.label} className="p-5 bg-accent rounded-2xl">
                    <i className={`fa-solid ${plan.icon} text-2xl text-secondary mb-2`}></i>
                    <p className="text-xs text-gray-500 mb-1">{plan.label}</p>
                    <p className="font-black text-primary text-xl">{plan.value}</p>
                    {plan.note && <p className="text-xs text-gray-400 mt-1">{plan.note}</p>}
                  </div>
                ))}
              </div>
              <Link
                href="/#contact"
                className="inline-block mt-8 px-8 py-3 bg-primary text-white rounded-full hover:bg-secondary transition-all"
              >
                洽詢租借
              </Link>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer variant="primary" />
    </>
  );
}
