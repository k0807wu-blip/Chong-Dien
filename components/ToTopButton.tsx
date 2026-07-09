'use client';

import { useEffect, useState } from 'react';

export default function ToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all"
      aria-label="回到頂部"
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}
