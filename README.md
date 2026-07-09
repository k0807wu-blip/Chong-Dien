# 蟲殿 Chong Dien

Next.js (App Router + TypeScript) 全端網站，包含商品瀏覽、購物車（localStorage）與會員登入系統（PostgreSQL + Prisma + JWT）。

## 本機開發

### 1. 安裝套件

```bash
npm install
```

### 2. 啟動本機資料庫

專案內附 `docker-compose.yml`，會在 `5433` port 開一個 PostgreSQL 容器（避開本機常見的 5432 佔用）：

```bash
docker compose up -d
```

### 3. 設定環境變數

複製 `.env.example` 為 `.env`，並填入：

```
DATABASE_URL=postgresql://chongdien:chongdien_dev@localhost:5433/chongdien
JWT_SECRET=<openssl rand -base64 32 產生的隨機字串>
```

### 4. 套用資料庫 migration

```bash
npx prisma migrate dev
```

### 5. 啟動開發伺服器

```bash
npm run dev
```

## 技術棧重點

- **Next.js 16** App Router，`proxy.ts`（原 `middleware.ts`，Next 16 已更名）保護 `/account/:path*`
- **Prisma 7 + `@prisma/adapter-pg`**：Prisma 7 起，`PrismaClient` 不再自動從 schema 讀取連線字串，需透過 driver adapter 明確傳入（見 `lib/prisma.ts`）。CLI（`prisma migrate`）則透過 `prisma.config.ts` 讀取 `DATABASE_URL`
- **會員系統**：`bcryptjs` 雜湊密碼、`jose` 簽發 7 天效期的 stateless JWT，存在 httpOnly cookie（`lib/auth.ts` / `lib/auth-edge.ts`）。沒有 Session 資料表，登出僅清除 cookie，無法強制撤銷單一 token
- **購物車**：純 `localStorage`（`lib/cart.ts`），與會員帳號無關聯

## 部署到 Zeabur

1. 在 Zeabur 建立專案，連接 GitHub repo 對應分支，push 後會自動部署
2. 在同一個 Zeabur 專案內加一個 **PostgreSQL** service，並把它的連線字串設定到 Next.js service 的 `DATABASE_URL` 環境變數
3. 設定 `JWT_SECRET` 環境變數（正式環境請重新產生一組，不要沿用本機開發用的值）
4. `package.json` 已經設定好：
   - `"postinstall": "prisma generate"` — 因為 `node_modules/@prisma/client` 不會進 git，每次安裝套件後都要重新產生。這一步不需要連到資料庫，所以 `prisma.config.ts` 用 `process.env.DATABASE_URL`（沒設定時是 `undefined`）而不是會直接丟錯的 `env()` helper
   - `"start": "prisma migrate deploy && next start"` — migration 特意放在 **啟動階段**、不是 build 階段。像 Zeabur 這類平台的 build container 通常連不到其他 service（資料庫要到 runtime 才會被接上網路），把 `migrate deploy` 放進 `build` 會在那個階段直接連線失敗
5. `prisma/migrations/` 目錄已經進 git（沒有被 gitignore），Zeabur build 時才讀得到
6. Next.js 會自動讀取平台提供的 `PORT` 環境變數，不需要額外設定
