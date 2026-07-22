import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const MAX_SIZE_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: '沒有權限。' }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: '請選擇圖片檔案。' }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: '僅支援 PNG、JPEG、WebP、GIF 格式。' }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: '檔案大小不可超過 4MB。' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const image = await prisma.productImage.create({
    data: { data: buffer, mimeType: file.type },
  });

  return NextResponse.json({ url: `/api/images/${image.id}` }, { status: 201 });
}
