# Pura Batuan Kaler 360

Platform virtual tour 360° kawasan Pura Batuan Kaler. Proyek ini terdiri dari public website dan admin dashboard yang akan dikelola melalui satu akun administrator.

Dokumen produk dan aturan implementasi:

- [`PRD.md`](./PRD.md) — kebutuhan produk, data model, route, dan acceptance criteria.
- [`AGENTS.md`](./AGENTS.md) — aturan kerja, layer, type safety, validasi, keamanan, dan konvensi kode.

## Status Implementasi

- [x] Fase 1 — fondasi SvelteKit, Tailwind, layout publik, route `/[lang]`, beranda, dan halaman placeholder.
- [x] Fase 2 (spike) — integrasi Marzipano, panorama uji, kontrol zoom/reset/fullscreen, dan cleanup viewer.
- [x] Fase 3 — multi-scene, hotspot navigasi, hotspot informasi, scene list, panel informasi, dan deep link `/[lang]/tour/[scene]`.
- [ ] Fase 4 — PostgreSQL, Drizzle schema domain, Better Auth, login admin, dan CRUD.
- [ ] Fase 5 — upload aset panorama, preview, validasi publikasi, dan pengelolaan media.
- [ ] Fase 6 — deployment VPS, HTTPS, backup, dan smoke test.

Catatan: dashboard admin dan database belum aktif. Route `/admin` belum tersedia; integrasi Better Auth akan diaktifkan kembali pada Fase 4.

## Stack

- SvelteKit 3 + Svelte 5 (runes)
- TypeScript strict
- Tailwind CSS 4
- Marzipano
- PostgreSQL + Drizzle ORM + Postgres.js (Fase 4)
- Better Auth (Fase 4)
- Vitest + Playwright

## Menjalankan Proyek

Prasyarat: Node.js dan pnpm.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Buka `http://localhost:5173`. Root `/` akan mengarah ke `/id`.

Variabel environment:

```dotenv
DATABASE_URL="postgres://user:password@localhost:5432/batuankaler_360"
ORIGIN="http://localhost:5173"
BETTER_AUTH_SECRET=""
```

Database belum diperlukan untuk halaman publik pada fase ini. Isi `DATABASE_URL` dan `BETTER_AUTH_SECRET` sebelum mengerjakan Fase 4, lalu jalankan `pnpm auth:schema`.

## Perintah

```bash
pnpm dev              # development server
pnpm build            # production build
pnpm preview          # preview production build
pnpm check            # svelte-check + TypeScript
pnpm lint             # prettier + eslint
pnpm format           # format kode
pnpm test:unit        # Vitest
pnpm test:e2e         # Playwright
pnpm test             # unit + e2e

pnpm db:generate      # generate migrasi Drizzle
pnpm db:migrate       # jalankan migrasi
pnpm db:studio        # Drizzle Studio
pnpm auth:schema      # generate schema Better Auth
```

## Route

```text
/                       redirect ke /id
/[lang]                 beranda (id/en)
/[lang]/tour            viewer multi-scene
/[lang]/tour/[scene]    deep link ke scene tertentu
/[lang]/sejarah         placeholder sejarah
/[lang]/area            placeholder area
/[lang]/galeri          placeholder galeri
/[lang]/panduan         placeholder panduan kunjungan
```

`[lang]` hanya menerima `id` atau `en`.

## Struktur

```text
src/
├── lib/
│   ├── components/
│   │   ├── public/     header, footer, kartu, dan elemen publik
│   │   └── tour/       PanoramaViewer dan TourExperience
│   ├── i18n/           locale helper dan dictionary ID/EN
│   ├── server/         auth, database, service, dan storage (Fase 4+)
│   ├── tour/           data scene, hotspot, dan helper DOM
│   └── types/          tipe bersama
├── routes/
│   ├── [lang]/         route publik
│   ├── layout.css      token Tailwind dan style global
│   └── +page.server.ts redirect root
└── types/              deklarasi tipe Marzipano
static/
└── images/             ilustrasi hero dan panorama uji
tests/
└── public.e2e.ts       smoke test halaman publik dan tour
```

## Panorama Uji

Panorama di `static/images/panoramas/scene-*.jpg` adalah aset sintetis untuk mengembangkan viewer multi-scene. Aset ini bukan dokumentasi final kawasan dan harus diganti dengan panorama hasil kamera 360° yang telah mendapat izin serta melalui proses validasi pengelola. Data scene dan hotspot masih statis di `src/lib/tour/scenes.ts` sampai integrasi database pada Fase 4.

## Keamanan

- Jangan commit `.env` atau secret.
- Registrasi publik akan dinonaktifkan pada integrasi Better Auth (`disableSignUp: true`).
- Semua route admin wajib diperiksa di server, bukan hanya disembunyikan di UI.
- Upload aset harus divalidasi berdasarkan MIME type, ekstensi, ukuran, dan nama file.
