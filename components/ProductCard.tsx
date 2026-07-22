import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { priceLabel, type Product } from '@/lib/products';

export default function ProductCard({
  product,
  delay,
  basePath = '/supplies',
}: {
  product: Product;
  delay?: number;
  basePath?: string;
}) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`${basePath}/${product.id}`}
        className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
      >
        <div className={`aspect-square relative ${product.image ? 'overflow-hidden' : 'image-placeholder'}`}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <i
              className={`fa-solid ${product.icon} text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500`}
            ></i>
          )}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-6">
          <p className="text-xs text-secondary font-bold mb-1 tracking-widest">{product.category}</p>
          <h3 className="text-xl font-black text-primary mb-2">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{product.listNote}</p>
          <div className="flex items-center justify-between">
            <div className="text-primary">
              <span className="text-sm font-bold">TWD</span>
              <span className="text-2xl font-black ml-1 tracking-tighter">{priceLabel(product)}</span>
            </div>
            <span className="w-10 h-10 bg-primary text-white rounded-full hover:bg-secondary transition-all flex items-center justify-center">
              <i className="fa-solid fa-arrow-right"></i>
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
