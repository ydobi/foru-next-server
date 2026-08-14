# Next.js Framework Starter

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/foru-next-server)

<!-- dash-content-start -->

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It's deployed on Cloudflare Workers as a [static website](https://developers.cloudflare.com/workers/static-assets/).

<!-- dash-content-end -->

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/foru-next-server
```

A live public deployment of this template is available at [https://foru-next-server.templates.workers.dev](https://foru-next-server.templates.workers.dev)

## Getting Started

First, run:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then run the development server (using the package manager of your choice):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploying To Production

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm run build`   | Build your production site                   |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run deploy`  | Deploy your production site to Cloudflare    |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## foru-tools 登录 API

供 [foru-tools](https://github.com/ydobi/foru-tools) 使用。`/api/login` 与 `/api/me` 不需要 `x-api-key`。

### POST /api/login

```json
{ "username": "admin", "password": "<password>" }
```

成功返回 `{ "access_token": "...", "user": { "username": "admin", "role": "admin" } }`。

账号 `admin`（admin）、`user`（user）。密码以 bcrypt 哈希存在 D1 `users` 表，明文不进仓库。本地 `next dev` 无 D1 时回退到源码内置哈希。

### GET /api/me

`Authorization: Bearer <access_token>`，返回 `{ "username", "role" }`。

### JWT_SECRET

生产环境必须将 `JWT_SECRET` 设为 Cloudflare Worker secret，不要写进 `wrangler.json` 的 vars：

```bash
npx wrangler secret put JWT_SECRET
```

未配置或为空时，`/api/login` 与 `/api/me` 会失败（500），不会使用内置密钥签名。

本地 `next dev`（无 Cloudflare 上下文 / D1）可把 `JWT_SECRET=` 写进已 gitignore 的 `.dev.vars`（模板见 `.dev.vars.example`）。未设置时仅此时使用本地开发回退密钥。

### CORS

浏览器跨域仅允许：

- `https://foru-tools.pages.dev`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

请求 Origin 在白名单内才回显 `Access-Control-Allow-Origin`；否则不发送该头（不会使用 `*`）。

## Cloudflare D1（登录用户）

生产 Worker 从绑定名为 **DB** 的 D1 数据库读取用户：

| | |
| :-- | :-- |
| Database name | `foru-auth` |
| database_id | `08f8745c-8dfd-4c18-89e7-caf64c2fd3f4` |
| Binding | `DB` |
| Migrations | `migrations/` |

`POST /api/login` 调用 `verifyPassword`，通过 `@opennextjs/cloudflare` 的 `getCloudflareContext().env.DB` 执行 `SELECT username, password_hash, role FROM users WHERE username = ?`，再用 bcryptjs 比对密码。JWT 签发与 `/api/me` 不变。

本地 `next dev` 没有 Worker / D1 绑定，`getCloudflareContext` 会失败，此时回退到与 seed 相同的演示账号。生产 Worker 必须使用 D1。

应用远程 migration（需已登录 wrangler）：

```bash
npx wrangler d1 migrations apply foru-auth --remote
```

或在 Cloudflare Dashboard → D1 → `foru-auth` 控制台执行 `migrations/` 下的 SQL。
