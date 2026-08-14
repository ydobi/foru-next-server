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

账号 `admin`、`user`。密码明文不进仓库。

### GET /api/me

`Authorization: Bearer <access_token>`，返回 `{ "username", "role" }`。

生产环境请设置 `JWT_SECRET`。
