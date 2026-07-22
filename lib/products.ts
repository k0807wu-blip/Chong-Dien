import { prisma } from '@/lib/prisma';
import type { ProductType } from '@prisma/client';

export type { ProductType };

export type ProductSize = {
  id: number;
  key: string;
  price: number;
  stock: number;
};

export type Product = {
  id: number;
  type: ProductType;
  category: string;
  name: string;
  description: string;
  listNote: string;
  image: string | null;
  icon: string | null;
  badge: string | null;
  origin: string | null;
  generation: string | null;
  careNote: string | null;
  specNote: string | null;
  price: number | null;
  stock: number | null;
  sizes: ProductSize[];
};

export async function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    include: { sizes: true },
    orderBy: { id: 'asc' },
  });
}

export async function getProductsByType(type: ProductType): Promise<Product[]> {
  return prisma.product.findMany({
    where: { type },
    include: { sizes: true },
    orderBy: { id: 'asc' },
  });
}

export async function getProduct(id: number): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
    include: { sizes: true },
  });
}

export function priceLabel(p: Product): number {
  return p.sizes.length > 0 ? Math.min(...p.sizes.map((s) => s.price)) : (p.price ?? 0);
}
