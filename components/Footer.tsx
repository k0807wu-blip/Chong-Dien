export default function Footer({
  variant = 'primary',
  showTagline = false,
}: {
  variant?: 'dark' | 'primary';
  showTagline?: boolean;
}) {
  const bgClass = variant === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-[#1a3a3a]';

  return (
    <footer className={`${bgClass} text-gray-400 py-12`}>
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-8 text-2xl">
          <a href="#" className="hover:text-white">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a href="#" className="hover:text-white">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="#" className="hover:text-white">
            <i className="fa-brands fa-line"></i>
          </a>
        </div>
        <p className="mb-4">
          Designed by <span className="text-white">蟲殿團隊</span> &copy; 2026 All Rights Reserved.
        </p>
        {showTagline && (
          <div className="text-[10px] tracking-widest opacity-30 flex justify-center gap-2">
            <span>甲蟲專賣</span>|<span>台北甲蟲</span>|<span>標本代工</span>|<span>生態課程</span>
          </div>
        )}
      </div>
    </footer>
  );
}
