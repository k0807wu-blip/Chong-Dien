import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '大師課程 | 蟲殿 - 昆蟲生態館',
};

export default function CoursesPage() {
  return (
    <>
      <section className="pt-32 pb-12 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-[#c5a059] font-bold tracking-[0.2em] mb-2 uppercase">Master Workshops</h2>
          <h1 className="text-4xl md:text-5xl font-black text-primary title-line">大師課程與活動</h1>
          <div className="w-16 h-1 bg-[#c5a059] mx-auto mt-6"></div>
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto">
            從專業的標本製作到深度生態探索，蟲殿講師帶領您進入昆蟲美學的核心領域。
          </p>
        </div>
      </section>

      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-20">
            <Reveal className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="relative w-full lg:w-1/2 overflow-hidden rounded-3xl shadow-lg aspect-[4/3] image-placeholder shrink-0">
                <Image
                  src="/images/479057388_1071049448159796_6044251778799757515_n-0ff7a6f1-d81e-4a0e-bf7a-7d859fc394d7.png"
                  alt="大師班課程照片"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-bold">進階大師課</span>
                  <span className="text-gray-400 text-sm font-medium">
                    <i className="fa-solid fa-calendar-day mr-1"></i> 2026/05/20 - 05/22
                  </span>
                </div>
                <h3 className="text-3xl font-black text-primary mb-6">昆蟲美學：進階標本製作大師班</h3>
                <p className="text-gray-600 leading-loose mb-8">
                  這不僅僅是標本製作，更是一場關於生命的藝術重塑。本課程由蟲殿資深講師授課，將深度解析大型兜蟲與鍬形蟲的肌肉結構、展姿美學及長期保存防護技術。適合具備基礎經驗，渴望提升技術細膩度的昆蟲收藏家。
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="fa-solid fa-clock text-secondary"></i> 每日 14:00 - 18:00
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="fa-solid fa-location-dot text-secondary"></i> 蟲殿生態教室
                  </div>
                </div>
                <Link
                  href="/#contact"
                  className="inline-block w-full sm:w-auto text-center bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-secondary transition-all shadow-md"
                >
                  立即報名課程 <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </Reveal>

            <div className="h-px bg-gray-200 w-2/3 mx-auto"></div>

            <Reveal className="flex flex-col lg:flex-row-reverse gap-10 items-center">
              <div className="w-full lg:w-1/2 overflow-hidden rounded-3xl shadow-lg aspect-[4/3] image-placeholder shrink-0">
                <div className="flex flex-col items-center justify-center">
                  <i className="fa-solid fa-children text-5xl mb-4 opacity-30"></i>
                  <p className="text-sm font-bold opacity-40">活動宣傳照預留區</p>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#2d5a27] text-white text-xs px-3 py-1 rounded-full font-bold">生態教育</span>
                  <span className="text-gray-400 text-sm font-medium">
                    <i className="fa-solid fa-calendar-day mr-1"></i> 2026/05/20 - 05/22
                  </span>
                </div>
                <h3 className="text-3xl font-black text-primary mb-6">森林秘境：親子生態探索夏令營</h3>
                <p className="text-gray-600 leading-loose mb-8">
                  放下平板電腦，走入微縮森林！為期三天的親子夏令營，我們將帶領家長與孩子一起觀察甲蟲的一生。從卵、幼蟲到成蟲的羽化過程，透過手作與親身觀察，在孩子心中種下熱愛自然、尊重生命的種子。
                </p>
                <ul className="space-y-2 mb-8 text-sm text-gray-500">
                  <li>
                    <i className="fa-solid fa-check text-secondary mr-2"></i> 專業教案引導，從遊戲中學習
                  </li>
                  <li>
                    <i className="fa-solid fa-check text-secondary mr-2"></i> 親手佈置幼蟲觀察缸
                  </li>
                  <li>
                    <i className="fa-solid fa-check text-secondary mr-2"></i> 贈送完整飼育入門套組
                  </li>
                </ul>
                <Link
                  href="/#contact"
                  className="inline-block w-full sm:w-auto text-center bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-secondary transition-all shadow-md"
                >
                  立即報名參加 <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black mb-6">找不到適合的課程？</h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto">
            我們也提供學校社團、企業團體或私人小班制的客製化課程需求，歡迎隨時洽詢官方 LINE。
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary transition-all"
          >
            <i className="fa-brands fa-line text-xl"></i> 私訊諮詢客製課程
          </a>
        </div>
      </section>

      <Footer variant="dark" />
    </>
  );
}
