# Vijaya Magazine

A creative magazine platform for children. Kids submit drawings, stories and poems.
The best work is curated by the editor and published in the printed magazine.

## Tech stack

- **React 19** + TypeScript
- **TanStack Router** — file-based routing, type-safe navigation
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible component primitives
- **i18next** — English (EN), Sinhala (සිං), Tamil (தமி)
- **Vite** — fast dev server and build tool

---

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:5173      (public site)
# → http://localhost:5173/admin.html  (admin panel)
```

---

## Credentials

| Role  | Email              | Password     | Redirects to        |
|-------|--------------------|--------------|---------------------|
| Admin | admin@vijaya.lk    | Vijaya@2025  | /admin.html         |
| User  | any other email    | min 6 chars  | /dashboard          |

---

## Buy magazine

Public users can purchase printed or PDF copies at `/buy`:
- Physical copy: **Rs. 350/copy** + delivery (Colombo Rs. 300 / Outside Rs. 500)
- PDF download: **Rs. 150** flat
- Payment: Credit/Debit Card, Bank Transfer, Cash on Delivery

---

## Project structure

```
src/
  routes/           Public pages (TanStack Router)
    buy.tsx         Payment portal
    ...
  admin/            Standalone admin SPA
    AdminApp.tsx    Admin entry point
    components/     AdminNavbar, AdminLayout
    pages/          Overview, Drawings, Stories, Top30,
                    Top3, Builder, Reviews, Users,
                    Issues, Content, Inbox, Audit, Revenue
  components/       Shared UI components (Navbar, Footer…)
  lib/              auth.ts, i18n.ts, mock-data.ts
  locales/          en.json  si.json  ta.json
  styles.css        Tailwind theme + custom utilities
index.html          Public SPA entry
admin.html          Admin SPA entry
```

---

## Build for production

```bash
npm run build
# Outputs:
#   dist/index.html      → public site
#   dist/admin.html      → admin panel
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

For Vercel: `vercel --prod`
