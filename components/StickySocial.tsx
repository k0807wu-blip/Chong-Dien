import Link from 'next/link';
import ToTopButton from '@/components/ToTopButton';

export default function StickySocial() {
  return (
    <div className="sticky-social flex flex-col space-y-3">
      <a
        href="https://www.facebook.com/p/%E8%9F%B2%E6%AE%BF-100057642511788/?locale=zh_TW"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#0084FF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <i className="fa-brands fa-facebook-messenger text-2xl"></i>
      </a>
      <Link
        href="/cart"
        className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <i className="fa-solid fa-cart-shopping text-xl"></i>
      </Link>
      <ToTopButton />
    </div>
  );
}
