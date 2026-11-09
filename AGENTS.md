# AGENTS.md

Panduan kerja untuk AI coding agent pada proyek **Pura Batuan Kaler 360**.

## 0. Sumber Kebenaran

- `PRD.md` adalah sumber utama untuk kebutuhan produk, ruang lingkup, data model, route, dan acceptance criteria.
- Dokumen ini mengatur **cara implementasi**: layer, type safety, validasi, error handling, keamanan, dan konvensi kode.
- Jika ada konflik: perilaku produk mengikuti `PRD.md`; gaya dan struktur kode mengikuti dokumen ini.
- Jangan menambah fitur di luar MVP (`PRD.md` §2.3) tanpa persetujuan eksplisit.
- Jangan mengubah `PRD.md` atau `AGENTS.md` tanpa permintaan eksplisit dari user.

## 1. Ringkasan Proyek

Pura Batuan Kaler 360 adalah aplikasi web virtual tour 360° kawasan pura dengan dua sisi:

1. **Public website** — beranda, tour multi-scene, hotspot, sejarah, area, galeri, panduan kunjungan, dan dwibahasa ID/EN.
2. **Admin dashboard** — login, CRUD scene/hotspot, pengelolaan aset panorama, status draft/published, dan pratinjau.

Arsitektur: **SvelteKit fullstack monolith** + PostgreSQL + Drizzle ORM + Better Auth + Marzipano. Satu administrator utama, tanpa registrasi publik.

## 2. Stack dan Versi Aktual

| Komponen     | Versi / Catatan                                      |
| ------------ | ---------------------------------------------------- |
| SvelteKit    | `@sveltejs/kit` **3.1.1**                            |
| Svelte       | **5.57.3**, runes mode dipaksa oleh `vite.config.ts` |
| Vite         | **8.3.6**                                            |
| TypeScript   | **6.0.3**, `strict: true`                            |
| Tailwind CSS | **4.3.5**, CSS-first (tanpa `tailwind.config.js`)    |
| Node adapter | `@sveltejs/adapter-node` **6.0.1**                   |
| Drizzle ORM  | **0.45.4** + `postgres` **3.4.9**                    |
| Better Auth  | **1.7.18**                                           |
| Testing      | Vitest 4 (browser + node), Playwright 1.65           |
| Marzipano    | **Belum terpasang** — rencana integrasi di Fase 2    |

Catatan: `PRD.md` §5.1 masih menulis "SvelteKit 5". Yang terpasang adalah **SvelteKit 3 + Svelte 5**. Gunakan API yang benar-benar ada di proyek ini, bukan pola SvelteKit lama. Konfigurasi SvelteKit berada di `vite.config.ts`, bukan `svelte.config.js`.

## 3. Perintah Wajib

```bash
pnpm dev              # development server
pnpm build            # production build
pnpm preview          # preview build
pnpm check            # svelte-check + TypeScript
pnpm lint             # prettier --check + eslint
pnpm format           # perbaiki format
pnpm test:unit        # Vitest
pnpm test:e2e         # Playwright
pnpm test             # unit + e2e

pnpm db:generate      # generate migrasi Drizzle
pnpm db:migrate       # jalankan migrasi
pnpm db:studio        # Drizzle Studio
pnpm db:push          # HANYA untuk development lokal
pnpm auth:schema      # generate schema Better Auth
```

Sebelum menyelesaikan tugas, jalankan minimal `pnpm check` dan test yang relevan. Jangan menggunakan `db:push` untuk produksi.

## 4. Struktur dan Layer

Struktur target mengikuti `PRD.md` §9.3:

```text
src/
├── lib/
│   ├── components/
│   │   ├── public/
│   │   ├── tour/
│   │   └── admin/
│   ├── server/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── services/
│   │   └── storage/
│   ├── schemas/
│   ├── i18n/
│   └── types/
├── routes/
│   ├── [lang]/
│   └── admin/
├── app.css
└── app.html
```

| Layer       | Lokasi                                        | Tanggung jawab                                                         |
| ----------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| Route/HTTP  | `src/routes/**/+page.server.ts`, `+server.ts` | Parsing request, validasi awal, memanggil service, membentuk response. |
| Service     | `src/lib/server/services/**`                  | Business logic, aturan domain, transaksi, publish/delete validation.   |
| Data access | `src/lib/server/db/**`                        | Schema Drizzle, query, relasi, migrasi.                                |
| Storage     | `src/lib/server/storage/**`                   | Upload, validasi file, path/URL aset, penghapusan file.                |
| Auth        | `src/lib/server/auth/**`                      | Konfigurasi Better Auth, session guard, provisioning admin.            |
| Schema      | `src/lib/schemas/**`                          | Schema Zod untuk input eksternal dan tipe turunannya.                  |
| Types       | `src/lib/types/**`                            | Tipe bersama yang aman dipakai client dan server.                      |

Aturan layer:

- Route **tidak boleh** mengakses database langsung; panggil service.
- Service **tidak boleh** bergantung pada `Request`, `Response`, atau `event.locals` SvelteKit; terima data bertipe sebagai parameter.
- Query database tidak boleh tersebar di komponen `.svelte`.
- `src/lib/server/**` tidak boleh diimpor oleh komponen client.
- Jangan menaruh secret, kredensial database, atau akses storage privat di modul yang dikirim ke browser.
- Gunakan alias `#lib` untuk modul internal, konsisten dengan scaffold saat ini.

## 5. Aturan Backend TypeScript (WAJIB)

Aturan ini diadaptasi dari Tomislav Likakur, _Follow these rules for a MAINTAINABLE Typescript Backend_ (27 Maret 2025), https://medium.com/@tomislav.likakur/follow-these-rules-for-a-maintainable-typescript-backend-94470a80d21f, dan dijabarkan untuk proyek ini.

### 5.1 Strong typing di semua tempat

- Beri tipe eksplisit pada parameter dan return value untuk fungsi yang diekspor, service, dan fungsi publik.
- Gunakan utility types (`Partial`, `Omit`, `Pick`, `Readonly`, `ReturnType`, `Awaited`) daripada duplikasi atau inheritance yang tidak perlu.
- **Dilarang menggunakan `any`.** Gunakan `unknown` lalu lakukan narrowing atau validasi.
- Pertahankan `strict: true` di `tsconfig.json`. Jangan menonaktifkan pengecekan individual tanpa alasan yang didokumentasikan.
- Manfaatkan tipe turunan Drizzle (`typeof scene.$inferSelect`, `typeof scene.$inferInsert`) dan Zod (`z.infer`) agar tipe database, validasi, dan API tidak menyimpang.
- Hindari type assertion (`as`) sebagai jalan pintas; gunakan type guard atau schema parsing.

### 5.2 Layer yang jelas

- Route hanya boleh: membaca input, memvalidasi, memanggil service, dan mengembalikan response/`fail`/`redirect`.
- Service memegang business logic dan transaksi. Contoh aturan yang harus ada di service: publish scene harus punya panorama valid; hotspot navigasi harus punya target scene published; scene yang masih menjadi target hotspot tidak boleh dihapus.
- Data access hanya berisi schema dan query Drizzle.
- Storage menangani file dan path; jangan mencampur logika upload dengan route.
- Auth menangani konfigurasi Better Auth dan provisioning; route admin tetap memeriksa sesi di server.

### 5.3 Validasi input wajib

TypeScript hanya memeriksa compile time; semua input eksternal wajib divalidasi runtime.

- Gunakan **Zod** untuk form action, endpoint, query string, parameter route, body JSON, dan metadata upload.
- Lakukan validasi di server, bukan hanya di client.
- Terapkan _parse, don't validate_: hasil parsing harus menghasilkan data bertipe yang aman.
- Validasi `[lang]` hanya `id` atau `en`; validasi slug, status, locale, yaw/pitch, FOV, dan `target_scene_id`.
- Validasi upload: MIME type, ekstensi, ukuran, dan nama file. Jangan mempercayai path dari client.
- Kembalikan error per field; jangan menyimpan data parsial.
- Zod belum terpasang. Tambahkan sebelum implementasi Fase 4, dan gunakan satu sumber schema untuk validasi + tipe.

### 5.4 Exception handling prediktif

- Pasang `handleError` terpusat di `src/hooks.server.ts`.
- Gunakan `error(status, ...)` untuk error HTTP yang diharapkan (400, 401, 403, 404, 409).
- Gunakan `fail(400, { errors })` untuk kegagalan validasi form action.
- Buat kelas error domain khusus di `src/lib/server/errors.ts`, misalnya `NotFoundError`, `ValidationError`, `ConflictError`, `StorageError`, dengan kode error yang stabil.
- Jangan menulis `try/catch` hanya untuk melempar ulang error. Biarkan error yang tidak ditangani naik ke handler pusat.
- Jangan membocorkan stack trace, query SQL, path filesystem, atau detail internal ke response publik. Log detail di server; kirim pesan aman ke client.
- Bungkus operasi multi-tabel (publish scene + hotspot, delete scene + relasi) dalam `db.transaction()`.
- Definisikan bentuk error publik di `src/app.d.ts` agar konsisten dengan `App.Error`.

## 6. Aturan Keamanan

- Semua route `/admin/**` wajib memeriksa sesi di server. Gunakan guard di `hooks.server.ts` atau di setiap `load`/action; `+layout.server.ts` saja tidak cukup untuk melindungi form action. Menyembunyikan link di UI bukan otorisasi.
- Registrasi publik wajib dinonaktifkan: `emailAndPassword: { enabled: true, disableSignUp: true }`.
- Hapus seluruh route demo Better Auth yang memiliki action `signUpEmail` sebelum produksi.
- Aktifkan rate limiting login; jangan mengandalkan validasi UI.
- Gunakan HTTPS dan `ORIGIN` yang benar pada produksi.
- Jangan pernah menaruh `BETTER_AUTH_SECRET`, `DATABASE_URL`, atau kredensial storage di kode client.
- Upload file: batasi MIME, ekstensi, ukuran, dan sanitasi nama file; cegah path traversal.
- File panorama asli sebaiknya privat; tile publik boleh di-cache immutable.
- Preview konten draft hanya melalui route admin yang dijaga sesi dan diberi `noindex`.

## 7. Aturan Data dan Konten

- Semua entitas konten yang tampil publik wajib memiliki status `draft`/`published`; query publik hanya mengambil data `published`.
- Terjemahan disimpan per locale (`id`/`en`). Kebijakan fallback: `en → id`; tampilkan indikator bila fallback dipakai.
- Simpan `yaw`/`pitch` dalam **radian** di database; UI admin boleh menampilkan derajat. Clamp pitch ke `[-π/2, π/2]`.
- `target_scene_id` untuk hotspot navigasi wajib menunjuk scene valid dan published.
- Aturan relasi: `scene_id` hotspot `ON DELETE CASCADE`; `target_scene_id` `ON DELETE RESTRICT` (atau `SET NULL` + unpublish hotspot); `panorama_asset_id` `ON DELETE RESTRICT`.
- Scene published wajib memiliki panorama valid; aset yang masih direferensikan tidak boleh dihapus.
- Unique constraint wajib untuk `scene.slug`, `area.slug`, kombinasi `scene_id + locale`, dan `hotspot_id + locale`.
- Gunakan UUID untuk primary key domain, bukan `serial`.

## 8. Aturan SvelteKit dan Svelte

- Gunakan **Svelte 5 runes**: `$state`, `$derived`, `$effect`, `$props`. Jangan memakai sintaks legacy (`export let`, `on:click`) pada kode baru.
- Data privat dan akses database hanya di `+page.server.ts`, `+server.ts`, atau modul `src/lib/server/**`.
- Gunakan form actions untuk mutasi form; gunakan `+server.ts` untuk JSON atau upload.
- Validasi `[lang]` di server dan redirect `/` ke `/id`.
- Route admin harus memiliki guard sesi di server; jangan mengandalkan `+page.svelte`.
- Tailwind 4 memakai token di `src/routes/layout.css` (`@theme`); jangan membuat `tailwind.config.js`.
- Jaga aksesibilitas: label kontrol, focus state, dialog semantics, dan scene list sebagai alternatif navigasi canvas.

## 9. Aturan Marzipano

- Marzipano **hanya** diinisialisasi di browser; jangan mengimpor di server/SSR.
- Gunakan dynamic import di `onMount` dan bungkus dalam komponen `PanoramaViewer.svelte`.
- Hancurkan viewer dan listener saat komponen di-unmount; pastikan tidak ada error saat route ditinggalkan/dibuka kembali.
- Jangan menyebarkan API Marzipano ke seluruh aplikasi; buat adapter/typed wrapper.
- Kontrak data tile (levels, faceSize, tileSize, format, URL pattern) harus tersimpan di database dan diteruskan ke viewer sebagai data bertipe.
- Lakukan spike integrasi Marzipano sebelum menyentuh database/admin (lihat `PRD.md` §16).

## 10. Testing dan Definition of Done

- `pnpm check` dan `pnpm lint` harus lulus.
- Tambahkan unit test untuk service, validasi schema, dan aturan publish/delete.
- Tambahkan E2E untuk alur kritis: buka tour, pindah scene, buka hotspot informasi, login admin, CRUD scene/hotspot.
- Uji viewer minimal di desktop dan viewport mobile.
- Tidak ada secret di bundle client.
- Tidak ada route admin yang hanya dilindungi UI.
- Perubahan data multi-tabel harus teruji tidak meninggalkan relasi rusak.

## 11. Kondisi Scaffold Saat Ini

Hal-hal berikut masih berupa scaffold dan harus dibersihkan/diganti saat relevan:

- `src/routes/demo/**` — route demo Better Auth dan Playwright; hapus sebelum produksi.
- `src/lib/server/db/schema.ts` — masih berisi tabel demo `task`; ganti dengan schema domain.
- `src/lib/server/db/auth.schema.ts` — masih placeholder; jalankan `pnpm auth:schema`.
- `src/routes/+page.svelte` dan `+layout.svelte` — masih halaman sambutan; ganti dengan layout publik.
- `src/lib/vitest-examples/**` — contoh test; boleh dihapus setelah test domain dibuat.
- `src/lib/components`, `src/lib/schemas`, `src/lib/i18n`, `src/lib/types`, `src/lib/server/services`, `src/lib/server/storage` — belum ada; buat sesuai kebutuhan.
- Marzipano belum terpasang.
- `.env` berisi secret development; jangan commit dan rotasi untuk produksi.

## 12. Gaya Kode

- Prettier: tab, single quote, tanpa trailing comma, `printWidth: 100`.
- Tailwind class diurutkan oleh `prettier-plugin-tailwindcss`.
- ESLint: `no-undef` dimatikan untuk TypeScript; jangan menambah aturan yang melemahkan type safety.
- Nama variabel/fungsi dalam bahasa Inggris; copy UI dalam bahasa Indonesia dan Inggris.
- Ikuti pola file di sekitarnya; jangan menambahkan abstraksi baru jika belum diperlukan.
- Jangan menambahkan dependency di luar stack PRD tanpa alasan dan persetujuan.

## 13. Prinsip Kerja

1. Baca `PRD.md` bagian yang relevan sebelum mengubah kode.
2. Utamakan perubahan kecil, teruji, dan sesuai fase implementasi (`PRD.md` §13).
3. Jika ada keputusan produk yang belum final (`PRD.md` §15), jangan mengarang; tandai sebagai TODO atau tanyakan.
4. Jangan merusak pekerjaan user yang sudah ada; periksa file sebelum menimpa.
5. Setelah selesai, laporkan file yang diubah, perintah yang dijalankan, dan hasil test.
