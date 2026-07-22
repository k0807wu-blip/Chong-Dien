import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await prisma.productImage.findUnique({ where: { id } });
  if (!image) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(image.data, {
    headers: {
      'Content-Type': image.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
