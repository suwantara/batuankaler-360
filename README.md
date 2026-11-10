# Pura Batuan Kaler 360

Platform virtual tour 360° kawasan Pura Batuan Kaler. Proyek ini terdiri dari public website dan admin dashboard untuk mengelola scene, hotspot, dan aset panorama.

Dokumen produk dan aturan implementasi:

- [`PRD.md`](./PRD.md) — kebutuhan produk, data model, route, dan acceptance criteria.
- [`AGENTS.md`](./AGENTS.md) — aturan kerja, layer, type safety, validasi, keamanan, dan konvensi kode.

## Status Implementasi

- [x] Fase 1 — fondasi SvelteKit, Tailwind, layout publik, route `/[lang]`, beranda, dan halaman placeholder.
- [x] Fase 2 — integrasi Marzipano, panorama uji, kontrol zoom/reset/fullscreen, dan cleanup viewer.
- [x] Fase 3 — multi-scene, hotspot navigasi/informasi, scene list, panel informasi, dan deep link scene.
- [x] Fase 4 — PostgreSQL, Drizzle schema domain, Better Auth, login admin, CRUD scene/hotspot, status draft/published, dan panel admin.
- [x] Fase 5 — upload aset panorama, thumbnail/preview, preview admin, validasi publikasi, dan pengelolaan media.
- [ ] Fase 6 — deployment VPS, HTTPS, backup, dan smoke test.

Public tour membaca scene **published** dari database. Halaman sejarah, area, galeri, dan panduan masih placeholder sampai fase konten berikutnya.

## Stack

- SvelteKit 3 + Svelte 5 (runes)
- TypeScript strict
- Tailwind CSS 4
- Marzipano
- PostgreSQL + Drizzle ORM + Postgres.js
- Better Auth
- Zod
- Vitest + Playwright

## Palet

Implementasi menggunakan komposisi **60-30-10**:

| Warna | Hex       | Porsi     | Peran                                       |
| ----- | --------- | --------- | ------------------------------------------- |
| Cream | `#F9F2D7` | 60%       | Latar utama, permukaan, dan kartu           |
| Navy  | `#21294C` | 30%       | Hero, footer, sidebar, dan bagian gelap     |
| Gold  | `#F2DEA8` | 10%       | CTA, aksen, dan detail interaksi            |
| Ink   | `#141829` | pendukung | Teks utama, border tegas, dan kontras dalam |

Token Tailwind didefinisikan di `src/routes/layout.css`.

## Menjalankan Proyek

Prasyarat: Node.js, pnpm, dan PostgreSQL yang berjalan.

```bash
pnpm install
cp .env.example .env
```

Sesuaikan `.env`:

```dotenv
DATABASE_URL="postgres://batuankaler:password@localhost:5432/batuankaler_360"
ORIGIN="http://localhost:5173"
BETTER_AUTH_SECRET=""
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
ADMIN_NAME="Administrator"
UPLOAD_DIR="uploads"
```

Siapkan database dan konten awal:

```bash
pnpm db:migrate
pnpm db:seed
ADMIN_EMAIL=admin@contoh.id ADMIN_PASSWORD='password-kuat-minimal-12' pnpm admin:create
pnpm dev
```

Buka `http://localhost:5173`. Root `/` akan mengarah ke `/id`. Panel admin tersedia di `/admin/login`.

Catatan pengembangan: database lokal saat ini menggunakan role `batuankaler` dan database `batuankaler_360`. Jangan commit `.env`; kredensial hanya untuk lingkungan lokal.

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

pnpm db:generate      # generate migrasi Drizzle setelah schema berubah
pnpm db:migrate       # jalankan migrasi
pnpm db:seed          # seed scene, area, aset, dan hotspot awal
pnpm admin:create     # provisioning akun admin
pnpm db:studio        # Drizzle Studio
pnpm auth:schema      # generate ulang schema Better Auth
```

Jangan menggunakan `db:push` untuk produksi.

## Route

### Public

```text
/                       redirect ke /id
/[lang]                 beranda (id/en)
/[lang]/tour            viewer multi-scene dari database
/[lang]/tour/[scene]    deep link ke scene published
/[lang]/sejarah         placeholder sejarah
/[lang]/area            placeholder area
/[lang]/galeri          placeholder galeri
/[lang]/panduan         placeholder panduan kunjungan
```

`[lang]` hanya menerima `id` atau `en`.

### Admin

```text
/admin/login            login administrator
/admin/dashboard        ringkasan konten
/admin/scenes           daftar scene
/admin/scenes/new       tambah scene
/admin/scenes/[id]      edit scene, publish/unpublish, hapus
/admin/scenes/[id]/hotspots  kelola hotspot
/admin/media            daftar dan metadata aset panorama
/admin/media/upload     upload panorama, thumbnail, dan preview
/admin/media/[id]       preview panorama aset
/admin/content          placeholder konten
/admin/settings         informasi akun admin
/uploads/[...path]      penyajian file aset upload (publik, read-only)
```

Semua route admin diperiksa sesinya di server melalui `hooks.server.ts`. Registrasi publik dinonaktifkan (`disableSignUp: true`).

## Struktur

```text
src/
├── lib/
│   ├── components/
│   │   ├── admin/      SceneForm, HotspotForm
│   │   ├── public/     header, footer, kartu, dan elemen publik
│   │   └── tour/       PanoramaViewer, TourExperience
│   ├── i18n/           locale helper dan dictionary ID/EN
│   ├── schemas/        schema validasi Zod
│   ├── server/
│   │   ├── db/         schema, migrasi, seed, provisioning admin
│   │   ├── services/   scene, hotspot, panorama, tour, dashboard
│   │   ├── storage/    validasi dan penyimpanan file upload
│   │   └── errors.ts   error domain
│   ├── upload/         batas upload yang aman dipakai client dan server
│   ├── tour/           data scene awal, hotspot, helper DOM
│   └── types/          tipe bersama
├── routes/
│   ├── [lang]/         route publik
│   ├── admin/          route panel admin
│   ├── layout.css      token Tailwind dan style global
│   └── +page.server.ts redirect root
└── types/              deklarasi tipe Marzipano
drizzle/                migrasi SQL dan metadata
static/
└── images/             ilustrasi hero dan panorama uji
tests/
└── public.e2e.ts       smoke test publik dan admin
```

## Database

Schema domain berada di `src/lib/server/db/app.schema.ts`; schema Better Auth digenerate di `src/lib/server/db/auth.schema.ts`. Migrasi awal berada di `drizzle/0000_init.sql`.

Aturan penting:

- Scene published wajib memiliki aset panorama.
- Hotspot navigasi wajib memiliki scene tujuan yang valid.
- Scene yang masih menjadi tujuan hotspot tidak dapat dihapus.
- `panorama_asset_id` menggunakan `ON DELETE RESTRICT`; hotspot milik scene menggunakan `ON DELETE CASCADE`.
- Terjemahan unik per `scene_id + locale` dan `hotspot_id + locale`.
- Yaw/pitch disimpan dalam radian; form admin menggunakan derajat.

Setelah mengubah schema:

```bash
pnpm db:generate --name nama_perubahan
pnpm db:migrate
```

## Aset dan Upload

- File upload disimpan di `UPLOAD_DIR` (default `uploads/panoramas/`).
- Hanya JPG, PNG, dan WebP yang diterima; tipe file diperiksa dari isi gambar, bukan hanya ekstensi.
- Batas ukuran: panorama asli 50 MB, thumbnail 5 MB, preview 10 MB.
- Panorama asli harus equirectangular dengan rasio sekitar 2:1 dan lebar minimal 2000 piksel.
- Nama file dibuat ulang menggunakan UUID; nama file dari client tidak dipakai sebagai path.
- File disajikan melalui route `/uploads/panoramas/...` dengan cache immutable dan `X-Content-Type-Options: nosniff`.
- Preview admin tersedia di `/admin/media/[id]`.
- Scene hanya dapat dipublikasikan jika aset panorama berstatus `processed`, terjemahan ID/EN lengkap, dan hotspot navigasi memiliki scene tujuan yang valid.
- Aset yang masih digunakan scene tidak dapat dihapus.
- Untuk produksi, `UPLOAD_DIR` dapat diarahkan ke volume persisten; penyajian file sebaiknya dialihkan ke Nginx/object storage dan panorama asli dipertimbangkan untuk dibuat privat.

## Panorama Uji

Panorama di `static/images/panoramas/scene-*.jpg` adalah aset sintetis untuk pengembangan viewer. Aset ini bukan dokumentasi final kawasan dan harus diganti dengan panorama hasil kamera 360° yang telah mendapat izin serta melalui proses validasi pengelola.

Data awal di `src/lib/tour/scenes.ts` dipakai oleh `pnpm db:seed`; setelah di-seed, public tour membaca data dari PostgreSQL.

## Testing

- Unit test memeriksa integritas data scene statis (target hotspot, pitch, dan terjemahan).
- E2E memeriksa halaman publik, viewer multi-scene, hotspot, deep link, login admin, daftar scene, media, upload aset, preview, validasi file, path traversal, serta alur create/update/publish/delete scene dan hotspot.
- Kredensial admin E2E dibaca dari `ADMIN_EMAIL` dan `ADMIN_PASSWORD` di `.env`.

## Keamanan

- Jangan commit `.env` atau secret.
- Registrasi publik dinonaktifkan; akun admin dibuat melalui `pnpm admin:create`.
- Semua route `/admin/**` diperiksa sesi di server, bukan hanya disembunyikan di UI.
- Rate limit login diaktifkan melalui konfigurasi Better Auth.
- Upload aset divalidasi berdasarkan isi gambar, ekstensi, ukuran, rasio panorama, dan nama file yang dibuat ulang.
- Route `/uploads/panoramas/...` hanya menyajikan gambar dan menolak path traversal.
- Ganti `BETTER_AUTH_SECRET` dan password admin sebelum deployment produksi.
