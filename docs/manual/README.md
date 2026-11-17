# Dokumentasi Sistem Pura Batuan Kaler 360

Dokumen ini berisi panduan pengunjung, panduan admin, dokumentasi teknis, deployment,
backup/restore, dan checklist serah terima.

## Build PDF

Dari root repository:

```bash
node docs/manual/build-pdf.mjs
```

Output:

```text
docs/Dokumentasi-Sistem-Pura-Batuan-Kaler-360.pdf
```

Persyaratan: dependency proyek sudah terpasang dan browser Playwright tersedia.

## Struktur

- `manual.html` — sumber dokumen dan CSS cetak.
- `assets/` — screenshot dan gambar cover.
- `build-pdf.mjs` — renderer HTML → PDF A4.
