import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { productSchema } from '@/lib/product-schema';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: '沒有權限。' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? '資料格式錯誤。' }, { status: 400 });
  }

  const { sizes, ...rest } = parsed.data;
  const hasSizes = sizes.length > 0;

  const product = await prisma.product.create({
    data: {
      ...rest,
      price: hasSizes ? null : rest.price,
      stock: hasSizes ? null : rest.stock,
      sizes: hasSizes ? { create: sizes.map((s) => ({ key: s.key, price: s.price, stock: s.stock })) } : undefined,
    },
    include: { sizes: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}
