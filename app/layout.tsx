import type { Metadata } from 'next';
import { Noto_Sans_TC, Outfit } from 'next/font/google';
import './globals.css';

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '600', '800'],
});

export const metadata: Metadata = {
  title: '蟲殿 - 昆蟲生態館 | 甲蟲專賣、標本製作、生態課程',
  description:
    '歡迎來到蟲殿昆蟲生態館。我們提供專業的甲蟲買賣、優質飼育耗材、標本代工製作及深度的昆蟲生態課程，為您打造最專業的昆蟲愛好者殿堂。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${notoSansTC.variable} ${outfit.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
