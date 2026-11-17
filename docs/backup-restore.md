# Backup dan Restore

Panduan operasional untuk database PostgreSQL dan aset upload Pura Batuan Kaler 360.

## 1. Yang perlu dibackup

1. **Database PostgreSQL** — scene, hotspot, area, galeri, halaman, pengaturan situs, akun admin, dan sesi.
2. **Aset upload** — file di `UPLOAD_DIR` (default `/app/uploads`), termasuk panorama dan foto galeri.

Backup database saja tidak cukup karena file panorama dan galeri disimpan di luar database.

## 2. Backup database dari admin

Buka **Admin → Pengaturan akun → Backup database**, lalu klik **Unduh backup database**.

Endpoint ini:

- hanya dapat diakses oleh sesi admin yang valid;
- menjalankan `pg_dump` dengan format custom;
- mengirim file `.dump` langsung ke browser;
- tidak menyimpan file backup di server.

Simpan file tersebut di penyimpanan terpisah dari server produksi.

## 3. Backup database + aset upload di server

Skrip tersedia di `docker/backup.sh` dan sudah disalin ke image produksi.

Jalankan dari terminal server atau terminal container:

```bash
DATABASE_URL="postgres://..." \
UPLOAD_DIR="/app/uploads" \
BACKUP_DIR="/app/uploads/backups" \
BACKUP_RETENTION_DAYS=14 \
sh /app/docker/backup.sh
```

Hasil:

- `database-<timestamp>.dump`
- `uploads-<timestamp>.tar.gz`
- `manifest-<timestamp>.txt`

Lokasi default `BACKUP_DIR` berada di dalam volume upload agar bertahan saat container diperbarui. **Salin hasil backup ke luar server** secara berkala; backup yang hanya berada di volume yang sama belum cukup untuk disaster recovery.

Retensi default 14 hari. Ubah dengan `BACKUP_RETENTION_DAYS`.

## 4. Menjadwalkan backup

Gunakan cron di host atau scheduler Dokploy untuk menjalankan:

```bash
sh /app/docker/backup.sh
```

Pastikan environment `DATABASE_URL` dan `UPLOAD_DIR` tersedia. Jalankan minimal satu kali sehari dan verifikasi file hasilnya.

## 5. Restore

Hentikan aplikasi terlebih dahulu agar tidak ada penulisan baru selama restore.

Restore database:

```bash
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname="$DATABASE_URL" \
  database-<timestamp>.dump
```

Restore aset upload:

```bash
mkdir -p /app/uploads
tar -xzf uploads-<timestamp>.tar.gz -C /app/uploads
```

Atau gunakan skrip:

```bash
DATABASE_URL="postgres://..." \
UPLOAD_DIR="/app/uploads" \
sh /app/docker/restore.sh \
  /app/uploads/backups/database-<timestamp>.dump \
  /app/uploads/backups/uploads-<timestamp>.tar.gz
```

Setelah restore, jalankan migrasi dan smoke test:

```bash
node /app/docker/migrate.mjs
curl -I https://batuankaler.xuanjinyu.com/id
```

## 6. Uji restore

Lakukan uji restore ke database terpisah minimal sebelum rilis besar. Backup yang belum pernah diuji restore belum dapat dianggap sebagai backup yang valid.
