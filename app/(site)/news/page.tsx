import type { Metadata } from 'next';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '最新消息 | 蟲殿 - 昆蟲生態館',
};

export default function NewsPage() {
  return (
    <>
      <section
        className="pt-28 pb-12 text-center"
        style={{
          background:
            "linear-gradient(rgba(26, 58, 58, 0.8), rgba(26, 58, 58, 0.8)), url('/images/474303400_1056484336282974_4465244766951162280_n-49b1eb8c-59e8-4731-a006-325bc19ad963.png') center/cover",
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-secondary font-bold tracking-[0.2em] mb-2 uppercase text-white/90">Latest News</h2>
          <h1 className="text-4xl md:text-5xl font-black text-white">最新消息</h1>
          <div className="w-16 h-1 bg-[#c5a059] mx-auto mt-6"></div>
        </div>
      </section>

      <main className="py-16">
        <div className="container mx-auto px-4">
          <Reveal className="active max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl">
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src="/images/643425614_1365809752017096_6510516006847207773_n-1f924d9f-d46f-4263-9ed6-1f89b0136115.png"
                alt="部落格照片"
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-bold">
                  活體情報
                </span>
                <time className="text-gray-400 text-sm">
                  <i className="fa-regular fa-calendar mr-1"></i> 2026/03/20
                </time>
              </div>

              <h2 className="text-3xl font-black mb-6 text-primary">💥新品到貨💥</h2>

              <div className="text-gray-700 leading-loose text-lg">
                <p className="mb-4 font-bold text-primary">
                  WD 泰國雨林蠍🦂
                  <br />
                  <span className="text-lg font-normal italic">heterometrus laoticus</span>
                </p>

                <p className="mb-4">
                  與少量糞金龜活體🪲
                  <br />
                  超霸氣的大螯，喜歡蠍子的不要錯過~
                  <br />
                  目前成、幼體皆有
                  <br />
                  歡迎來店選購
                </p>

                <p className="mt-8 text-sm text-gray-500 flex flex-wrap gap-2">
                  <span className="text-gray-400 hover:text-secondary transition-colors cursor-pointer">#雨林蠍子</span>
                  <span className="text-gray-400 hover:text-secondary transition-colors cursor-pointer">#泰國</span>
                  <span className="text-gray-400 hover:text-secondary transition-colors cursor-pointer">#蟲殿</span>
                  <span className="text-gray-400 hover:text-secondary transition-colors cursor-pointer">#糞金龜</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer variant="primary" />
    </>
  );
}
