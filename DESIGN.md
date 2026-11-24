# Design Direction: Pura Batuan Kaler 360

Dokumen ini adalah arah visual resmi untuk situs publik dan panel admin. Fungsinya memberi "jiwa" pada desain, sementara `antislop` berperan sebagai filter yang membuang teknik tanpa tujuan.

## 1. Tujuan dan audiens

Situs ini mendokumentasikan kawasan Pura Batuan Kaler sebagai tur panorama 360 derajat. Audiensnya adalah calon pengunjung, pengelola pura, dan peneliti budaya yang ingin memahami tata ruang serta etika kunjungan sebelum datang.

Prioritas desain:

1. Membantu orientasi: di mana area ini, apa fungsinya, dan bagaimana berpindah scene.
2. Menjaga rasa hormat: bahasa tenang, tidak berlebihan, dan tidak mengklaim lebih dari yang terverifikasi.
3. Bertahan di perangkat sederhana: halaman harus cepat, terbaca, dan bisa dioperasikan dengan keyboard maupun sentuhan.

## 2. Kepribadian merek

**Arsip editorial yang tenang, presisi, dan hormat.**

Bukan:

- futuristik atau "AI startup"
- ramai, penuh glow, dan gradien neon
- mewah secara berlebihan

Kesan yang dituju adalah lembar dokumentasi budaya: kertas cream, tinta navy, dan aksen emas yang dipakai hemat.

## 3. Dial desain

**Dial: ENERGY 2 / RHYTHM 2 / MOTION 1**

- **ENERGY 2**: cukup hadir untuk terasa penting, tetapi tidak berteriak. Tidak ada animasi hero yang agresif.
- **RHYTHM 2**: beberapa pola section berbeda (split editorial, panel gelap, daftar bernomor, grid galeri), tetapi tetap konsisten.
- **MOTION 1**: hanya hover, transisi warna, dan animasi menu. Tidak ada scroll-jacking atau loop tanpa henti.

## 4. Palet warna

Komposisi 60-30-10:

| Token           | Hex       | Porsi     | Peran                              |
| --------------- | --------- | --------- | ---------------------------------- |
| `--color-paper` | `#FBF7E9` | 60%       | Latar utama dan permukaan terang   |
| `--color-navy`  | `#21294C` | 30%       | Hero, footer, sidebar, panel gelap |
| `--color-gold`  | `#F2DEA8` | 10%       | CTA, aksen, dan penanda interaksi  |
| `--color-ink`   | `#141829` | pendukung | Teks utama dan kontras tegas       |

Warna pendukung: `--color-body` untuk teks isi, `--color-muted` untuk metadata, dan warna feedback (`success`, `warning`, `danger`) hanya untuk status.

Aturan:

- Maksimal dua warna inti plus satu aksen dalam satu komposisi.
- Emas tidak dipakai sebagai latar teks panjang.
- Semua teks wajib memenuhi WCAG AA: 4.5:1 untuk teks normal, 3:1 untuk teks besar dan batas kontrol.
- Teks di atas panorama memakai latar solid atau scrim yang cukup, bukan teks polos di atas gambar.

## 5. Tipografi

- **Display:** Playfair Display Variable. Alasan: memberi karakter arsip dan seremonial yang sesuai konteks pura, tanpa meniru produk teknologi.
- **Body:** Inter Variable. Alasan: keterbacaan tinggi pada ukuran kecil, dukungan aksara Latin yang baik, dan netral terhadap konten.

Aturan:

- Maksimal dua keluarga font.
- Heading memakai `text-wrap: balance`; paragraf memakai `text-wrap: pretty`.
- Skala fluid dengan `clamp()` agar tidak pecah di 320px.
- Label uppercase hanya untuk metadata pendek, bukan untuk paragraf.

## 6. Spasi dan layout

- Base unit: 4px.
- Container halaman: maksimal 1320px dengan padding `clamp(1.25rem, 4vw, 2.5rem)`.
- Container editorial: maksimal 860px.
- Section padding: `clamp(4.5rem, 9vw, 8rem)`; versi ketat `clamp(3rem, 6vw, 5rem)`.
- Grid memakai `minmax(0, 1fr)` pada kolom agar anak grid boleh menyusut dan tidak overflow.
- Breakpoint mengikuti titik konten rusak, bukan daftar perangkat.

## 7. Bentuk dan elevasi

- Radius: 2px (kontrol), 4px (permukaan kecil), 8px (kartu), 14px (panel besar).
- Badge dan hotspot boleh pill karena bentuknya menandai status atau titik interaktif.
- Garis rambut (hairline) memakai warna charcoal atau ivory dengan opasitas rendah.
- Shadow hanya untuk elevasi nyata: dialog, panel mengambang, dan hotspot di atas panorama.
- Tidak ada glassmorphism pada navbar, kartu, dan modal sekaligus. Permukaan utama solid.

## 8. Komponen

### Tombol dan tautan

- Aksi memakai `<button>`; navigasi memakai `<a href>`.
- Target minimal 44 x 44 px.
- State hover, active, focus, dan disabled harus terlihat.
- Panah hanya dipakai pada tautan yang memang menunjukkan arah atau membuka halaman lain, bukan pada setiap tombol.

### Badge

- Badge hanya untuk status nyata: published, draft, verifikasi, atau label warisan yang benar-benar diisi pengelola.
- Badge dekoratif seperti "360°" di atas headline dihapus karena headline sudah menyebutkannya.

### Kartu

- Area memakai baris bernomor, galeri memakai plat visual, panduan memakai daftar.
- Variasi bentuk mengikuti hierarki konten, bukan template kartu seragam.

### Navigasi

- Desktop: baris tautan dengan penanda `aria-current`.
- Mobile: dialog layar penuh, bisa ditutup dengan Escape, fokus kembali ke trigger.
- Setiap tautan harus menuju halaman yang benar-benar ada.

### Formulir

- Label terlihat dan terhubung ke input.
- Pesan error memakai teks, bukan hanya warna.
- Placeholder bukan pengganti label.

### Hotspot dan viewer

- Hotspot punya nama aksesibel dan target sentuh 44 px.
- Kontrol viewer memakai latar solid agar kontras tetap terjaga di atas panorama terang.
- Loading, error, dan empty state harus informatif.

## 9. Gerak

- Durasi transisi: 160 sampai 200ms untuk hover, 260ms untuk menu.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Semua gerak non-esensial berhenti saat `prefers-reduced-motion: reduce`.
- Tidak ada animasi yang berjalan terus-menerus tanpa kontrol.

## 10. Aksesibilitas

- Kontras teks minimal 4.5:1; teks besar minimal 3:1.
- Focus indicator terlihat di semua tema.
- `cursor: pointer` pada kontrol aktif; `not-allowed` pada kontrol nonaktif.
- Gambar dekoratif memakai `alt=""`; gambar bermakna memiliki alt.
- Dokumen memakai `lang`, `main`, `header`, `nav`, dan `footer`.
- Tidak ada `outline: none` tanpa pengganti.

## 11. Konten dan bahasa

- Bahasa Indonesia adalah default; Inggris tersedia di `/en`.
- Fallback terjemahan ditampilkan sebagai pemberitahuan, bukan disembunyikan.
- Placeholder ditulis jujur: "sedang disiapkan", "menunggu verifikasi", atau `[REAL DATA]`.
- Tidak ada statistik, testimoni, atau nama yang dikarang.
- Tidak ada em dash di teks UI. Gunakan titik, koma, titik dua, atau tanda kurung.

## 12. Keputusan dan alasan

- **Tekstur kertas halus:** meniru bahan arsip dan menyatukan permukaan cream. Opasitas sangat rendah agar tidak mengganggu keterbacaan.
- **Watermark "360" dan "Batuan Kaler":** motif identitas untuk menandai ruang dokumentasi, bukan hiasan acak. Diletakkan sebagai lapisan rendah dan tidak interaktif.
- **Arch frame pada hero:** mengacu pada bentuk lengkung arsitektur pura, memberi identitas pada pratinjau panorama.
- **Permukaan navy:** memisahkan bagian gelap dari konten editorial dan memberi istirahat visual.
- **Gradient pada hero:** berfungsi sebagai scrim agar teks tetap terbaca di atas foto, bukan sebagai dekorasi.
- **Tanpa glassmorphism:** blur tidak menambah hierarki pada situs arsip dan justru menurunkan kontras.

## 13. Do / Don't

**Do**

- Gunakan token warna dan tipografi yang sudah ada.
- Uji kontras sebelum mengirim.
- Uji 320px, 768px, dan 1440px.
- Tulis alasan untuk setiap teknik dekoratif.

**Don't**

- Menambah badge, glow, atau gradient baru tanpa alasan.
- Menyalin layout produk populer.
- Memakai angka atau testimoni tanpa sumber.
- Menghapus focus outline tanpa pengganti.

## 14. Catatan terbuka

- Arah visual ini diturunkan dari design system yang sudah ada di `src/routes/layout.css` dan PRD.
- Jika pengelola memberikan referensi visual baru, perbarui dokumen ini sebelum mengubah komponen.
- `DESIGN.md` adalah data arah desain, bukan instruksi untuk melanggar aturan aksesibilitas atau kejujuran konten.
