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
ANTHROPIC_API_KEY=<在 console.anthropic.com 申請的 API key，後台商品說明 AI 生成功能需要，沒設也不影響其他功能>
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

- **Next.js 16** App Router，`proxy.ts`（原 `middleware.ts`，Next 16 已更名）保護 `/account/:path*`；同時依 hostname 是否以 `admin.` 開頭，把後台（`app/admin/**`）分流到獨立子網域，見下方「後台子網域」
- **Prisma 7 + `@prisma/adapter-pg`**：Prisma 7 起，`PrismaClient` 不再自動從 schema 讀取連線字串，需透過 driver adapter 明確傳入（見 `lib/prisma.ts`）。CLI（`prisma migrate`）則透過 `prisma.config.ts` 讀取 `DATABASE_URL`
- **會員系統**：`bcryptjs` 雜湊密碼、`jose` 簽發 7 天效期的 stateless JWT，存在 httpOnly cookie（`lib/auth.ts` / `lib/auth-edge.ts`）。沒有 Session 資料表，登出僅清除 cookie，無法強制撤銷單一 token
- **購物車**：純 `localStorage`（`lib/cart.ts`），與會員帳號無關聯
- **商品圖片**：後台上傳的圖片存在 PostgreSQL 的 `ProductImage` 資料表（`Bytes` 欄位），不是存到檔案系統。這樣本機開發跟 Zeabur 部署後行為完全一致，不需要額外設定 volume 或物件儲存——`Product.image` 欄位存的是 `/api/images/{id}` 這種路徑，由 `app/api/images/[id]/route.ts` 直接從資料庫讀出來 serve
- **AI 生成商品說明**：後台輸入題詞後，`app/api/admin/generate-description/route.ts` 呼叫 Anthropic Messages API（`claude-sonnet-5`）產生繁體中文文案，生成後仍可在文字框手動調整。需要設定 `ANTHROPIC_API_KEY` 環境變數（本機 `.env` 跟 Zeabur 都要設），沒設定的話會顯示清楚的錯誤訊息，不影響其他後台功能

## 部署到 Zeabur

1. 在 Zeabur 建立專案，連接 GitHub repo 對應分支，push 後會自動部署
2. 在同一個 Zeabur 專案內加一個 **PostgreSQL** service，並把它的連線字串設定到 Next.js service 的 `DATABASE_URL` 環境變數
3. 設定 `JWT_SECRET` 環境變數（正式環境請重新產生一組，不要沿用本機開發用的值）；如果要用後台的 AI 生成商品說明功能，也要設定 `ANTHROPIC_API_KEY`
4. `package.json` 已經設定好：
   - `"postinstall": "prisma generate"` — 因為 `node_modules/@prisma/client` 不會進 git，每次安裝套件後都要重新產生。這一步不需要連到資料庫，所以 `prisma.config.ts` 用 `process.env.DATABASE_URL`（沒設定時是 `undefined`）而不是會直接丟錯的 `env()` helper
   - `"start": "prisma migrate deploy && next start"` — migration 特意放在 **啟動階段**、不是 build 階段。像 Zeabur 這類平台的 build container 通常連不到其他 service（資料庫要到 runtime 才會被接上網路），把 `migrate deploy` 放進 `build` 會在那個階段直接連線失敗
5. `prisma/migrations/` 目錄已經進 git（沒有被 gitignore），Zeabur build 時才讀得到
6. Next.js 會自動讀取平台提供的 `PORT` 環境變數，不需要額外設定

## 後台子網域

後台（`/admin` 底下的頁面）不是走 `你的網域/admin/...`，而是完全獨立的子網域，網址本身也是乾淨的（`admin.你的網域/orders`，不會看到 `/admin` 字樣）。原理是 `proxy.ts` 檢查請求的 hostname：
- hostname 以 `admin.` 開頭 → 內部把乾淨路徑 rewrite 到 `app/admin/**` 對應的檔案，同時檢查 session 是不是 `ADMIN`，不是的話導去（同樣是子網域上的）乾淨 `/login`
- 其他 hostname（主網域）→ `/admin/**` 一律回 404，完全不透露後台存在

程式碼本身不寫死任何特定網域字串，只認 hostname 是不是 `admin.` 開頭，所以不管接的是 Zeabur 給的網域還是之後買的自訂網域都能用。要讓子網域真的生效，還需要：

1. **Zeabur 網域綁定**：進 `chong-dien` 這個 service 的網域設定，嘗試加一個 `admin.chong-dien.zeabur.app`（或之後買了自訂網域的話是 `admin.你的網域.com`）指到**同一個** service。Zeabur 的免費 `*.zeabur.app` 網域是否支援這樣加子網域要自己在後台確認
2. **自訂網域到手後**：去你的網域註冊商 / DNS 服務商加一筆 CNAME 記錄，把 `admin.你的網域.com` 指到 Zeabur 提供的目標網址（Zeabur 網域設定頁面會給）
3. 這兩步都設定好之前，`admin.` 子網域當然連不上；主網域跟現有功能完全不受影響

本機開發沒有真的子網域，可以用 `curl -H "Host: admin.localhost:3000" http://localhost:3000/orders` 假冒 Host header 來測後台，或是直接在瀏覽器打開 `http://admin.localhost:3000`（多數瀏覽器對 `*.localhost` 會自動解析到本機，不需要額外設定 `/etc/hosts`）。
