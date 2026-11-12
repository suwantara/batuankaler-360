# Design System — Pura Batuan Kaler 360

- **Status:** diterapkan pada situs publik dan panel admin
- **Sumber arah visual:** `PRD.md` §6.1
- **Implementasi token:** `src/routes/layout.css`
- **Komponen bersama:** `src/lib/components/ui/`

---

## 1. Arah Visual

Sistem ini mengambil posisi sebagai **arsip editorial**, bukan landing page SaaS.

Kata kunci:

- tenang, presisi, dan hormat terhadap konteks tempat;
- tipografi sebagai struktur utama, bukan dekorasi;
- permukaan seperti kertas dengan garis rambut tipis;
- emas dipakai hemat untuk menandai interaksi dan informasi penting;
- fotografi/ilustrasi menjadi fokus, antarmuka tidak bersaing dengannya.

Prinsip yang dipegang:

1. **Satu aksi utama per area.** Setiap section punya satu CTA yang jelas.
2. **Hierarki sebelum ornamen.** Ukuran, kontras, dan ruang kosong menentukan urutan baca.
3. **Konsisten, bukan seragam.** Pola yang sama berperilaku sama di publik dan admin.
4. **Hemat gerak.** Animasi hanya untuk umpan balik, bukan pertunjukan.
5. **Aksesibel sejak awal.** Kontras, fokus, label, dan struktur semantik bukan tambahan.

---

## 2. Foundation

### 2.1 Warna

Palet mengikuti komposisi 60-30-10 dari PRD.

| Token             | Nilai     | Peran                                      |
| ----------------- | --------- | ------------------------------------------ |
| `--color-ivory`   | `#f9f2d7` | Latar section terang, kartu, permukaan     |
| `--color-paper`   | `#fbf7e9` | Latar utama halaman                        |
| `--color-sand`    | `#eee4c5` | Section alternatif dan panel lembut        |
| `--color-navy`    | `#21294c` | Surface gelap, sidebar, footer, teks kuat  |
| `--color-navy-deep` | `#161c36` | Latar imersif viewer dan hero            |
| `--color-gold`    | `#f2dea8` | CTA di atas gelap, aksen                   |
| `--color-gold-dark` | `#7d6230` | Teks aksen di atas terang                |
| `--color-charcoal` / `--color-ink` | `#141829` | Teks utama dan kontras inti |
| `--color-body`    | `#45454b` | Teks paragraf                              |
| `--color-muted`   | `#625d53` | Metadata dan teks sekunder                 |
| `--color-stone`   | `#d9ceb2` | Garis dan pemisah                          |

Warna status:

| Token                  | Nilai     | Penggunaan              |
| ---------------------- | --------- | ----------------------- |
| `--color-success`      | `#1f6b4a` | Status published/tayang |
| `--color-warning`      | `#8a5c12` | Draft, peringatan       |
| `--color-danger`       | `#9a3328` | Hapus, error            |
| `--color-*-soft`       | turunan   | Latar alert dan badge   |

Aturan:

- Jangan memakai emas untuk teks paragraf di atas kertas.
- Gunakan `--color-gold-dark` untuk aksen di permukaan terang.
- Gunakan `--color-gold-light` untuk aksen di permukaan gelap.
- Jangan menyampaikan status hanya lewat warna; badge selalu punya teks.
- Teks normal minimal 4.5:1; elemen UI minimal 3:1.

### 2.2 Tipografi

Dua keluarga font, sesuai PRD:

- **Display:** Playfair Display Variable (normal + italic asli).
- **Body/UI:** Inter Variable.

Skala:

| Kelas            | Ukuran                          | Penggunaan                     |
| ---------------- | ------------------------------- | ------------------------------ |
| `.display-hero`  | `clamp(2.85rem, 5.5vw, 5.2rem)` | H1 beranda                     |
| `.display-xl`    | `clamp(2.7rem, 5.2vw, 4.75rem)` | H1 halaman dalam, H2 section   |
| `.display-lg`    | `clamp(2.05rem, 3.7vw, 3.35rem)`| H1 admin, judul panel          |
| `.display-md`    | `clamp(1.6rem, 2.4vw, 2.25rem)` | Judul kartu besar              |
| `.title-sm`      | `clamp(1.2rem, 1.5vw, 1.4rem)`  | Judul kartu/panel              |
| `.lede`          | `clamp(1.0625rem, 1.25vw, 1.25rem)` | Paragraf pembuka          |
| `.body-copy`     | `0.9375rem / 1.78`              | Paragraf umum                  |
| `.meta`          | `0.6875rem`, tracking `0.2em`   | Label, nomor, metadata         |
| `.eyebrow`       | `0.6875rem`, tracking `0.24em`  | Label section dengan garis     |

Aturan:

- Heading memakai `font-display`; body dan kontrol memakai `font-body`.
- Maksimal dua keluarga font dalam satu halaman.
- Jangan memakai huruf kapital penuh untuk paragraf.
- Maksimal 3–5 tingkat hierarki per halaman.

### 2.3 Spacing dan Layout

| Token/Kelas               | Nilai                                  |
| ------------------------- | -------------------------------------- |
| `.container-page`         | maksimal `1320px`, gutter `clamp(1.25rem, 4vw, 2.5rem)` |
| `.container-editorial`    | maksimal `860px`                       |
| `.section`                | padding vertikal `clamp(4.5rem, 9vw, 8rem)` |
| `.section--tight`         | padding vertikal `clamp(3rem, 6vw, 5rem)` |
| Grid utama                | 12 kolom; penggunaan umum 8/4, 7/5, 6/6 |
| Jarak antarelemen         | kelipatan 4px                          |

Lebar teks paragraf dijaga sekitar 60–75 karakter.

### 2.4 Bentuk, Elevasi, dan Gerak

- Radius: `2px` (kontrol), `4px` (field/alert), `8px` (panel), `14px` (kartu khusus).
- Hindari radius pil untuk kartu atau section. Pil hanya untuk badge dan tombol ikon.
- Elevasi memakai bayangan hangat yang halus; jangan memakai bayangan tajam di semua elemen.
- Durasi transisi: 160–260ms dengan `--ease-editorial`.
- Semua animasi dinonaktifkan/dikurangi saat `prefers-reduced-motion: reduce`.

---

## 3. Komponen

### 3.1 Tombol

Kelas dasar: `.btn`

| Varian          | Penggunaan                                      |
| --------------- | ----------------------------------------------- |
| `.btn--primary` | Aksi utama di permukaan terang                  |
| `.btn--gold`    | Aksi utama di permukaan gelap                   |
| `.btn--outline` | Aksi sekunder                                   |
| `.btn--ghost`   | Aksi tersier berbentuk teks                     |
| `.btn--danger`  | Aksi destruktif                                 |
| `.btn--sm`      | Toolbar, header admin, aksi dalam baris tabel   |

Aturan:

- Satu aksi primer per area/section.
- Teks tombol berupa kata kerja.
- Tombol ikon wajib memiliki `aria-label` dan `title`.
- Target sentuh minimal 44×44px.

### 3.2 Tautan Aksi

`.link-arrow` adalah tautan dengan garis bawah tipis dan panah bergerak saat hover. Gunakan untuk “Lihat semua”, “Baca panduan”, dan sejenisnya. Varian: `.link-arrow--light`, `.link-arrow--muted`.

### 3.3 Permukaan

| Kelas              | Penggunaan                                       |
| ------------------ | ------------------------------------------------ |
| `.surface`         | Panel/kartu kertas dengan border tipis           |
| `.surface--ivory`  | Permukaan kertas lebih terang                    |
| `.surface--sand`   | Panel lembut untuk catatan                       |
| `.surface--dark`   | Panel di dalam section gelap                     |
| `.surface--flat`   | Baris tanpa kartu, hanya pemisah bawah           |

Jangan menumpuk `.surface` di dalam `.surface` tanpa alasan hierarki.

### 3.4 Badge dan Alert

- `.badge` dengan varian `--published`, `--draft`, `--quiet`, `--gold`.
- `.alert` dengan varian `--error`, `--success`, `--warning`, `--info`.
- Alert error wajib memiliki `role="alert"`; status sukses memakai `role="status"`.
- Badge status selalu memiliki teks, bukan hanya titik warna.

### 3.5 Form

- Label: `.field-label`
- Input/select/textarea: `.field-input`
- Bantuan: `.field-help`
- Error per field: `.field-error`
- Wajib memakai `<label>` yang mengapit kontrol atau `for`/`id`.
- Semua input eksternal tetap divalidasi di server dengan Zod.

### 3.6 Navigasi

- `.nav-link` untuk navigasi publik; status aktif memakai `aria-current="page"`.
- `.admin-nav-link` untuk sidebar admin; status aktif memakai `aria-current="page"`.
- Menu mobile berupa dialog layar penuh dengan fokus awal pada tombol tutup, penanganan `Escape`, dan pengembalian fokus ke pemicu.
- Jangan menyembunyikan tautan sebagai satu-satunya mekanisme otorisasi.

### 3.7 Komponen Bersama

| Komponen                         | Fungsi                                         |
| -------------------------------- | ---------------------------------------------- |
| `ui/Icon.svelte`                 | Ikon garis 24px dengan nama bertipe            |
| `ui/BrandLockup.svelte`          | Logotype + tagline, varian terang/gelap         |
| `ui/SectionHeading.svelte`       | Eyebrow, judul, deskripsi, slot aksi           |
| `ui/ArrowLink.svelte`            | Tautan aksi dengan panah                       |
| `ui/Ornament.svelte`             | Garis pemisah dengan motif berlian             |
| `public/PageIntro.svelte`        | Hero halaman dalam                             |
| `public/GalleryCard.svelte`      | Pelat dokumentasi dengan ilustrasi garis       |
| `public/AreaCard.svelte`         | Baris area bernomor                            |
| `public/GuideCard.svelte`        | Baris panduan bernomor                         |
| `tour/TourStage.svelte`          | Panggung tour gelap + tips                     |
| `tour/TourExperience.svelte`     | Viewer + panel scene + panel informasi         |
| `tour/PanoramaViewer.svelte`     | Isolasi lifecycle Marzipano dan kontrol viewer |
| `tour/ViewerControl.svelte`      | Tombol kontrol viewer dengan label aksesibel   |

---

## 4. Pola Halaman

### 4.1 Publik

- **Beranda:** hero gelap + arsip pengenalan + preview tour + kutipan sejarah + daftar area + galeri pelat + panduan + footer CTA.
- **Halaman dalam:** `PageIntro` (eyebrow, H1, deskripsi) diikuti satu section editorial.
- **Tour:** intro terang, lalu panggung gelap penuh untuk viewer; tips di bawah viewer.
- **Footer:** CTA besar, identitas, navigasi, catatan kunjungan, dan watermark tipografis.

Ritme section yang disarankan: gelap → kertas → gelap → ivory → sand → kertas → ivory → gelap.

### 4.2 Admin

- **Login:** panel gelap bercerita di kiri, form kertas di kanan; di mobile hanya form.
- **Shell:** sidebar indigo, topbar kertas, konten maksimal `1152px`.
- **Dashboard:** header + empat kartu statistik + daftar scene terbaru + aksi cepat + status publikasi.
- **Daftar:** panel tunggal dengan baris berbagi garis; status dan aksi di kanan.
- **Form:** section bernomor (01, 02, 03) dengan jarak konsisten; aksi simpan di akhir.
- **Media:** metadata dan upload dipisahkan; panel panduan gelap mendampingi form.

Catatan admin:

- Semua route admin tetap dilindungi sesi di server.
- Aksi hapus memakai konfirmasi dan mempertahankan `data-testid` yang diuji E2E.
- Status ditampilkan sebagai teks, bukan warna saja.

---

## 5. Aksesibilitas

- Kontras teks normal minimal 4.5:1. Teks sekunder di atas navy memakai opasitas minimal 55%.
- Fokus terlihat: outline emas 2px dengan offset 3px; di permukaan gelap memakai emas terang.
- Target sentuh minimal 44×44px; kontrol viewer dan menu mobile memenuhi ini.
- Menu mobile: `role="dialog"`, `aria-modal`, fokus terperangkap, `Escape` menutup.
- Gambar dekoratif memakai `alt=""`; gambar informatif memiliki alt bermakna.
- Status dan error tidak boleh disampaikan hanya lewat warna.
- Semua kontrol viewer memiliki `aria-label` yang mengikuti locale.
- Hormati `prefers-reduced-motion`.
- Jangan menonaktifkan outline tanpa pengganti.

---

## 6. Aturan Implementasi

1. Gunakan token dan kelas di `layout.css`; jangan menulis nilai warna baru di komponen.
2. Tailwind 4 bersifat CSS-first; jangan membuat `tailwind.config.js`.
3. Gunakan `font-display` hanya untuk heading dan angka editorial besar.
4. Jangan menambahkan dependency ikon; gunakan `ui/Icon.svelte`.
5. Semua teks UI publik harus tersedia dalam `id` dan `en` melalui dictionary.
6. Jangan memakai `any`; ikuti aturan TypeScript di `AGENTS.md`.
7. Sebelum menutup pekerjaan, jalankan `pnpm check`, `pnpm lint`, dan test yang relevan.
8. Untuk perubahan visual besar, uji minimal pada 390px, 768px, 1024px, dan 1440px.

---

## 7. File Utama

```text
src/routes/layout.css                     token, base, komponen global
src/lib/components/ui/                    primitif bersama
src/lib/components/public/                header, footer, kartu publik
src/lib/components/tour/                  viewer dan pengalaman tour
src/lib/components/admin/                 form admin
src/routes/[lang]/                        halaman publik
src/routes/admin/                         panel admin
docs/design-system.md                     dokumen ini
```
