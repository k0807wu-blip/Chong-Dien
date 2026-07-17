import { prisma } from '@/lib/prisma';

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  await prisma.rateLimitAttempt.deleteMany({ where: { key, createdAt: { lt: windowStart } } });

  const count = await prisma.rateLimitAttempt.count({ where: { key, createdAt: { gte: windowStart } } });

  if (count >= limit) {
    const oldest = await prisma.rateLimitAttempt.findFirst({
      where: { key, createdAt: { gte: windowStart } },
      orderBy: { createdAt: 'asc' },
    });
    const retryAfterSeconds = oldest
      ? Math.max(1, Math.ceil((oldest.createdAt.getTime() + windowMs - now.getTime()) / 1000))
      : Math.ceil(windowMs / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  await prisma.rateLimitAttempt.create({ data: { key } });
  return { allowed: true };
}
