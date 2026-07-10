import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

const orderRequestSchema = z.object({
  recipientName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  paymentMethod: z.enum(['ATM_TRANSFER', 'LINE_PAY', 'COD']),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int(),
        size: z.string().nullable().optional(),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
});

class OrderValidationError extends Error {}

type StockShortage = { productId: number; size?: string; requested: number; available: number };

class InsufficientStockError extends Error {
  details: StockShortage[];
  constructor(details: StockShortage[]) {
    super('Insufficient stock');
    this.details = details;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: '請確認訂購資訊皆已正確填寫。' }, { status: 400 });
  }
  const { recipientName, phone, address, paymentMethod, note, items } = parsed.data;

  const sessionUser = await getSessionUser();

  try {
    const order = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: {
        productId: number;
        productSizeId: number | null;
        nameSnapshot: string;
        sizeKeySnapshot: string | null;
        unitPrice: number;
        qty: number;
      }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { sizes: true },
        });
        if (!product) {
          throw new OrderValidationError(`商品不存在（id: ${item.productId}）`);
        }

        if (product.sizes.length > 0) {
          if (!item.size) {
            throw new OrderValidationError(`「${product.name}」需要選擇規格。`);
          }
          const size = product.sizes.find((s) => s.key === item.size);
          if (!size) {
            throw new OrderValidationError(`「${product.name}」找不到規格 ${item.size}。`);
          }

          const updated = await tx.productSize.updateMany({
            where: { id: size.id, stock: { gte: item.qty } },
            data: { stock: { decrement: item.qty } },
          });
          if (updated.count === 0) {
            const current = await tx.productSize.findUnique({ where: { id: size.id } });
            throw new InsufficientStockError([
              {
                productId: product.id,
                size: size.key,
                requested: item.qty,
                available: current?.stock ?? 0,
              },
            ]);
          }

          totalAmount += size.price * item.qty;
          orderItemsData.push({
            productId: product.id,
            productSizeId: size.id,
            nameSnapshot: product.name,
            sizeKeySnapshot: size.key,
            unitPrice: size.price,
            qty: item.qty,
          });
        } else {
          const updated = await tx.product.updateMany({
            where: { id: product.id, stock: { gte: item.qty } },
            data: { stock: { decrement: item.qty } },
          });
          if (updated.count === 0) {
            const current = await tx.product.findUnique({ where: { id: product.id } });
            throw new InsufficientStockError([
              {
                productId: product.id,
                requested: item.qty,
                available: current?.stock ?? 0,
              },
            ]);
          }

          const unitPrice = product.price ?? 0;
          totalAmount += unitPrice * item.qty;
          orderItemsData.push({
            productId: product.id,
            productSizeId: null,
            nameSnapshot: product.name,
            sizeKeySnapshot: null,
            unitPrice,
            qty: item.qty,
          });
        }
      }

      return tx.order.create({
        data: {
          userId: sessionUser?.id ?? null,
          recipientName,
          phone,
          address,
          paymentMethod,
          note,
          totalAmount,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof InsufficientStockError) {
      return NextResponse.json({ error: '庫存不足', details: err.details }, { status: 409 });
    }
    throw err;
  }
}
