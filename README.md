# Peptide Vendor Marketplace

A Next.js marketplace app for comparing research peptide vendors, prices, and community discussions.

## Features

- **Product catalog** — Browse 6 research peptides (BPC-157, TB-500, CJC-1295, Ipamorelin, Semaglutide, Tirzepatide)
- **Vendor comparison** — Per-product price, purity, quantity, and stock status table
- **Vendor directory** — Browse and compare trusted suppliers with star ratings
- **Reddit integration** — Community discussions from r/Peptides per product
- **Authentication** — Login/register with NextAuth.js (JWT strategy)
- **Favorites** — Save favorite vendors (requires login, stored in localStorage)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo credentials

- Email: `alice@example.com`
- Password: `password`

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router and TypeScript
- [Tailwind CSS](https://tailwindcss.com) for styling (system fonts)
- [NextAuth.js](https://next-auth.js.org) for authentication
- Static mock data in `src/lib/data.ts`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXTAUTH_SECRET` | JWT signing secret | `dev-secret-change-in-production` |
| `NEXTAUTH_URL` | App base URL | `http://localhost:3000` |

> **Note:** Always set `NEXTAUTH_SECRET` to a strong random value in production.
