import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      {/* 主視覺 Banner */}
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(26, 58, 58, 0.8), rgba(26, 58, 58, 0.8)), url('/images/474303400_1056484336282974_4465244766951162280_n-49b1eb8c-59e8-4731-a006-325bc19ad963.png') center/cover",
          }}
        />
        <div className="relative z-10 px-4">
          <Reveal>
            <h2 className="text-secondary font-bold tracking-[0.3em] mb-4">WELCOME TO THE PALACE</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              開啟您的
              <br />
              <span className="text-secondary">昆蟲探索</span>之旅
            </h1>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="max-w-xl mx-auto text-lg text-gray-200 mb-10">
              在蟲殿，我們不只提供昆蟲，更為您打造一個專業、潔淨且充滿生命美學的生態空間。
            </p>
          </Reveal>
          <Reveal delay={0.6}>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                href="/news"
                className="bg-secondary text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-primary transition-all shadow-lg"
              >
                立即探索
              </Link>
              <Link
                href="/#contact"
                className="border border-white/50 backdrop-blur-sm px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
              >
                聯絡門市
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <i className="fa-solid fa-chevron-down text-2xl text-white/50"></i>
        </div>
      </section>

      {/* 快速導覽功能區 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-2 gap-8">
          {[
            { icon: 'fa-bug', title: '最新消息', sub: 'Beetle Shop' },
            { icon: 'fa-flask-vial', title: '養育耗材', sub: 'Supplies' },
          ].map((item) => (
            <a key={item.title} href="#" className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary transition-all">
                <i className={`fa-solid ${item.icon} text-3xl text-primary group-hover:text-white`}></i>
              </div>
              <span className="font-bold text-lg">{item.title}</span>
              <span className="text-xs text-gray-400 mt-1 uppercase">{item.sub}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 關於我們 */}
      <section id="about" className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <Reveal className="w-full md:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white h-[500px]">
              <Image
                src="/images/481075123_1085406190057455_2215299867964849935_n-830a2275-e4cb-44ae-b2b9-6e281308bfc5.png"
                alt="蟲殿環境"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary rounded-full -z-10 opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary rounded-full -z-10 opacity-10"></div>
          </Reveal>
          <Reveal className="w-full md:w-1/2" delay={0.3}>
            <h4 className="text-secondary font-bold tracking-widest mb-2 uppercase">About Insect Palace</h4>
            <h2 className="text-4xl font-black mb-6 title-underline">關於蟲殿</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                各位昆蟲愛好者大家好！歡迎來到座落於城市的自然綠洲 —— <strong>「蟲殿」</strong>。我們致力於打破傳統昆蟲店昏暗擁擠的印象，打造一個明亮、通風且充滿殿堂質感的生態館。
              </p>
              <p>
                「蟲殿」提供全方位的專業服務，包含珍稀成蟲與幼蟲銷售、專業配比飼育耗材、標本代工製作，以及由資深講師授課的生態體驗課程。無論您是初入昆蟲世界的新手，還是尋求珍品的資深蟲友，我們都能為您提供最細緻的諮詢與服務。
              </p>
              <p>在這裡，每一隻昆蟲都是大自然的藝術品。我們期待與您在蟲殿相遇，一同領略昆蟲生命的奧妙。</p>
            </div>
            <button className="mt-8 px-8 py-3 bg-primary text-white rounded-full hover:bg-secondary transition-all">
              了解更多故事
            </button>
          </Reveal>
        </div>
      </section>

      {/* 訂購須知 */}
      <section className="py-20 bg-[#1a3a3a] text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <Reveal className="md:w-1/2">
            <h4 className="text-secondary font-bold mb-2">PURCHASE NOTICE</h4>
            <h2 className="text-4xl font-black mb-8">訂購與配送須知</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary shrink-0">
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
                <div>
                  <h5 className="font-bold text-xl mb-1">付款方式</h5>
                  <p className="text-gray-300">支援 ATM 匯款、門市現金及 LINE Pay 支付。</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary shrink-0">
                  <i className="fa-solid fa-truck"></i>
                </div>
                <div>
                  <h5 className="font-bold text-xl mb-1">配送說明</h5>
                  <p className="text-gray-300">
                    一般耗材：7-11店到店 ($60) / 郵寄 ($80)
                    <br />
                    活體寄送：黑貓低溫/常溫宅配 ($170) 以確保昆蟲安全。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary shrink-0">
                  <i className="fa-brands fa-facebook-messenger"></i>
                </div>
                <div>
                  <h5 className="font-bold text-xl mb-1">匯款後通知</h5>
                  <p className="text-gray-300">請私訊官方 Messenger 提供匯款末五碼及收件資訊。</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal className="md:w-1/2 grid grid-cols-2 gap-4" delay={0.3}>
            {[
              { icon: 'fa-shield-cat', label: '活體抵達保固' },
              { icon: 'fa-leaf', label: '天然高品質耗材' },
              { icon: 'fa-microscope', label: '專業生態諮詢' },
              { icon: 'fa-heart', label: '完善售後教育' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-center hover:bg-white/10 transition-all"
              >
                <i className={`fa-solid ${item.icon} text-4xl text-secondary mb-4`}></i>
                <p className="font-bold">{item.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 地圖與聯絡資訊 */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Reveal className="rounded-3xl overflow-hidden h-[450px] shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=羅斯福路五段170巷39號,%20Taipei,%20Taiwan&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="text-4xl font-black mb-8">門市資訊</h2>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <a
                href="https://www.facebook.com/p/%E8%9F%B2%E6%AE%BF-100057642511788/?locale=zh_TW"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <i className="fa-brands fa-facebook text-3xl text-blue-600 mr-4"></i>
                <div>
                  <p className="text-xs text-gray-400">Facebook</p>
                  <p className="font-bold">蟲殿昆蟲館</p>
                </div>
              </a>
              <a href="tel:0289310007" className="flex items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
                <i className="fa-solid fa-phone text-3xl text-primary mr-4"></i>
                <div>
                  <p className="text-xs text-gray-400">電話聯絡</p>
                  <p className="font-bold">02 8931 0007</p>
                </div>
              </a>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl">
              <h5 className="font-bold text-xl mb-4 flex items-center">
                <i className="fa-solid fa-clock text-secondary mr-2"></i> 營業時間
              </h5>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>星期三：</span>
                  <span className="font-bold">15:00–22:00</span>
                </li>
                <li className="flex justify-between">
                  <span>星期四：</span>
                  <span className="font-bold">15:00–22:00</span>
                </li>
                <li className="flex justify-between">
                  <span>星期五：</span>
                  <span className="font-bold">15:00–22:00</span>
                </li>
                <li className="flex justify-between">
                  <span>星期六：</span>
                  <span className="font-bold">14:00–21:00</span>
                </li>
                <li className="flex justify-between">
                  <span>星期日：</span>
                  <span className="font-bold">14:00–19:00</span>
                </li>
                <li className="flex justify-between text-red-500">
                  <span>星期一：</span>
                  <span className="font-bold underline">休息</span>
                </li>
                <li className="flex justify-between">
                  <span>星期二：</span>
                  <span className="font-bold">15:00–22:00</span>
                </li>
              </ul>
              <p className="mt-6 text-sm text-gray-400">
                <i className="fa-solid fa-location-dot mr-1"></i> 地址：台北市羅斯福路五段170巷39號, Taipei, Taiwan
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer variant="dark" showTagline />
    </>
  );
}
