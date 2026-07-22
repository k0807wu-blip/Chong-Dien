import { z } from 'zod';

export const PRODUCT_TYPE_VALUES = ['SUPPLY', 'LIVE'] as const;
export const PRODUCT_TYPE_LABELS: Record<(typeof PRODUCT_TYPE_VALUES)[number], string> = {
  SUPPLY: '養育用品',
  LIVE: '活體訂購',
};

export const LIVE_CATEGORIES = ['促銷商品', '大兜蟲', '鍬形蟲', '小孩最愛'] as const;

export const LIVE_GENDER_VALUES = ['MALE', 'FEMALE', 'PAIR'] as const;
export const LIVE_GENDER_LABELS: Record<(typeof LIVE_GENDER_VALUES)[number], string> = {
  MALE: '單公',
  FEMALE: '單母',
  PAIR: '成對',
};

const sizeSchema = z.object({
  key: z.string().trim().min(1),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
});

const optionalText = z
  .string()
  .trim()
  .min(1)
  .nullable()
  .optional()
  .transform((v) => v ?? null);

export const productSchema = z
  .object({
    type: z.enum(PRODUCT_TYPE_VALUES),
    category: z.string().trim().min(1),
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    listNote: z.string().trim().min(1),
    image: optionalText,
    icon: optionalText,
    badge: optionalText,
    origin: optionalText,
    generation: optionalText,
    careNote: optionalText,
    specNote: optionalText,
    price: z.number().int().nonnegative().nullable().optional(),
    stock: z.number().int().nonnegative().nullable().optional(),
    sizes: z.array(sizeSchema).optional().default([]),
  })
  .refine(
    (data) => {
      const hasSizes = data.sizes.length > 0;
      const hasFlat = data.price != null && data.stock != null;
      return hasSizes !== hasFlat;
    },
    { message: '請擇一設定：單一價格／庫存，或多規格價格／庫存，不可同時或都不設定。' }
  )
  .refine((data) => new Set(data.sizes.map((s) => s.key)).size === data.sizes.length, {
    message: '規格代號不可重複。',
  });

export type ProductInput = z.infer<typeof productSchema>;
