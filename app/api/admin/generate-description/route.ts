import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(500),
  name: z.string().trim().max(200).optional(),
  category: z.string().trim().max(100).optional(),
});

const SYSTEM_PROMPT =
  '你是「蟲殿」昆蟲／甲蟲專賣店的商品文案寫手。請根據使用者提供的重點，用繁體中文寫一段吸引人的商品說明，語氣專業但親切，長度約 60-120 字，不要使用條列符號或標題，直接輸出一段話即可，不要加上任何前綴、引號或額外說明文字。';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: '沒有權限。' }, { status: 403 });
  }

  const { allowed, retryAfterSeconds } = await checkRateLimit(`ai-desc:${user.id}`, 20, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: '生成次數過多，請稍後再試。' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: '請輸入題詞。' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: '尚未設定 ANTHROPIC_API_KEY，請聯繫管理員。' }, { status: 500 });
  }

  const { prompt, name, category } = parsed.data;
  const contextLines = [
    name ? `商品名稱：${name}` : null,
    category ? `分類：${category}` : null,
    `重點：${prompt}`,
  ].filter(Boolean);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: contextLines.join('\n') }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'AI 服務暫時無法使用，請稍後再試。' }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text?.trim();
    if (!text) {
      return NextResponse.json({ error: 'AI 未回傳內容，請再試一次。' }, { status: 502 });
    }

    return NextResponse.json({ description: text });
  } catch {
    return NextResponse.json({ error: 'AI 服務連線失敗，請稍後再試。' }, { status: 502 });
  }
}
