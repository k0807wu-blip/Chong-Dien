import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { productSchema } from '@/lib/product-schema';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: '沒有權限。' }, { status: 403 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: '商品不存在。' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? '資料格式錯誤。' }, { status: 400 });
  }

  const { sizes, ...rest } = parsed.data;
  const hasSizes = sizes.length > 0;

  try {
    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          ...rest,
          price: hasSizes ? null : rest.price,
          stock: hasSizes ? null : rest.stock,
        },
      });

      if (hasSizes) {
        const existing = await tx.productSize.findMany({ where: { productId: id } });
        const incomingKeys = new Set(sizes.map((s) => s.key));
        const toDelete = existing.filter((e) => !incomingKeys.has(e.key)).map((e) => e.id);
        if (toDelete.length > 0) {
          await tx.productSize.deleteMany({ where: { id: { in: toDelete } } });
        }
        for (const s of sizes) {
          await tx.productSize.upsert({
            where: { productId_key: { productId: id, key: s.key } },
            create: { productId: id, key: s.key, price: s.price, stock: s.stock },
            update: { price: s.price, stock: s.stock },
          });
        }
      } else {
        await tx.productSize.deleteMany({ where: { productId: id } });
      }

      return tx.product.findUnique({ where: { id: updated.id }, include: { sizes: true } });
    });

    return NextResponse.json({ product });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: '商品不存在。' }, { status: 404 });
    }
    throw err;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: '沒有權限。' }, { status: 403 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: '商品不存在。' }, { status: 404 });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      return NextResponse.json(
        { error: '此商品已有訂單紀錄，無法刪除。可改為編輯商品並將庫存設為 0 來下架。' },
        { status: 409 }
      );
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: '商品不存在。' }, { status: 404 });
    }
    throw err;
  }
}
