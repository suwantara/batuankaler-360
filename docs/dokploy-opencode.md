# Menghubungkan OpenCode ke Dokploy

Dokploy menyediakan MCP server resmi `@dokploy/mcp`. OpenCode dapat memakainya untuk membaca project/application, memicu deployment, memantau status, dan mengambil log build.

## 1. Buat API key di Dokploy

1. Buka dashboard Dokploy.
2. Masuk ke **Settings → API/CLI** (pada versi tertentu: **Settings → API Keys**).
3. Buat API key baru dengan izin minimum yang dibutuhkan untuk deployment.
4. Simpan key di secret manager atau file environment lokal. Jangan commit ke repository.

## 2. Siapkan file environment

OpenCode service sering tidak mewarisi environment dari shell tempat `export` dijalankan. Karena itu project ini memakai wrapper `.opencode/dokploy-mcp.sh` yang membaca file env sendiri.

```bash
mkdir -p ~/.config/opencode
cp docs/dokploy.env.example ~/.config/opencode/dokploy.env
chmod 600 ~/.config/opencode/dokploy.env
```

Edit `~/.config/opencode/dokploy.env`:

```dotenv
DOKPLOY_URL="https://dokploy.domain-anda.com"
DOKPLOY_API_KEY="api-key-dari-dokploy"
DOKPLOY_TOOL_PRESET="deploy"
```

Konfigurasi project `opencode.jsonc` memanggil wrapper tersebut:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "dokploy": {
        "type": "local",
        "command": ["sh", ".opencode/dokploy-mcp.sh"],
        "cwd": ".",
        "environment": {
          "DOKPLOY_TOOL_PRESET": "deploy"
        },
        "timeout": {
          "startup": 60000
        }
      }
    }
  }
}
```

Wrapper membaca `~/.config/opencode/dokploy.env`, mengekspor nilainya, lalu menjalankan `npx -y @dokploy/mcp`. Jadi tidak perlu `export` di shell dan tidak bergantung pada environment service OpenCode.

`DOKPLOY_TOOL_PRESET=deploy` membatasi tool yang dimuat ke area deployment agar konteks model tidak dipenuhi seluruh API Dokploy.

## 3. Verifikasi koneksi

Jalankan dari root repository, karena `opencode.jsonc` adalah konfigurasi project-local:

```bash
cd /path/ke/batuankaler-360
opencode service restart
opencode mcp list
```

Di dalam OpenCode, buka `/mcps`; server `dokploy` harus berstatus connected.

Jika `opencode mcp list` menampilkan `No MCP servers configured`, jalankan perintah dari root repository. `http://127.0.0.1:49374` adalah alamat server OpenCode, bukan alamat Dokploy.

Jika `dokploy` gagal dengan pesan `DOKPLOY_URL is not defined`:

- Pastikan file `~/.config/opencode/dokploy.env` ada.
- Pastikan `DOKPLOY_URL` dan `DOKPLOY_API_KEY` terisi.
- Jalankan wrapper secara manual untuk melihat error:

```bash
sh .opencode/dokploy-mcp.sh
```

Jika MCP gagal dengan `DOKPLOY_CUSTOM_HEADERS must be valid JSON`, komentari atau hapus baris tersebut jika tidak memakai Cloudflare Access, atau perbaiki format JSON-nya.

## Cloudflare Access

Jika MCP berstatus connected tetapi tool Dokploy mengembalikan HTML **“Sign in · Cloudflare Access”** atau data bukan JSON, berarti `DOKPLOY_URL` dilindungi Cloudflare Access. API key Dokploy tidak otomatis melewati Access.

Solusinya gunakan **Cloudflare Access Service Token**:

1. Buka Cloudflare Zero Trust → **Access → Service Auth → Service Tokens**.
2. Buat service token; simpan **Client ID** dan **Client Secret**.
3. Buka Access application untuk Dokploy → **Policies** → tambahkan policy dengan action **Service Auth** dan pilih service token tersebut.
4. Tambahkan header ke `~/.config/opencode/dokploy.env`:

```dotenv
DOKPLOY_CUSTOM_HEADERS='{"CF-Access-Client-Id":"client-id.access","CF-Access-Client-Secret":"client-secret"}'
```

5. Restart OpenCode service dan coba lagi:

```bash
opencode service restart
opencode mcp list
```

Wrapper akan mengekspor `DOKPLOY_CUSTOM_HEADERS` dari file env. Jangan set variabel ini ke string kosong: `@dokploy/mcp` akan gagal mem-parse JSON. Jika tidak memakai Cloudflare Access, biarkan baris tersebut tetap dikomentari.

Alternatif lain: gunakan URL internal Dokploy yang tidak berada di belakang Cloudflare Access, misalnya `http://10.x.x.x:3000`, jika dapat dijangkau dari mesin OpenCode.

## 4. Siapkan application di Dokploy

Sebelum meminta agent melakukan deployment, application sebaiknya sudah dibuat di Dokploy:

- Source: repository GitHub `suwantara/batuankaler-360`
- Branch: `main`
- Build type: **Dockerfile**
- Dockerfile: `Dockerfile`
- Build context: `.`
- Container port: `3000`
- Domain + HTTPS
- Environment: `DATABASE_URL`, `ORIGIN`, `BETTER_AUTH_SECRET`, `UPLOAD_DIR=/app/uploads`, `BODY_SIZE_LIMIT=80M`
- Volume: `/app/uploads`
- Seed/admin sekali lewat `SEED_ON_START`/`CREATE_ADMIN_ON_START` atau `docker exec`

## 5. Meminta deployment

Contoh prompt:

```text
Gunakan Dokploy MCP untuk mencari application batuankaler-360,
pastikan build type-nya Dockerfile dan branch main,
lalu deploy. Pantau status deployment dan tampilkan log jika gagal.
```

Atau gunakan command yang sudah disiapkan:

```text
/deploy-dokploy
```

Agent akan:

1. Mencari project/application yang sesuai.
2. Memastikan build type dan branch.
3. Meminta konfirmasi sebelum deploy.
4. Memicu deployment.
5. Memantau status.
6. Mengambil dan meringkas log bila deployment gagal.

## Keamanan

- Jangan menempelkan API key ke chat atau file yang di-commit.
- Gunakan API key dengan permission minimum; rotasi secara berkala.
- `DOKPLOY_TOOL_PRESET=deploy` mengurangi permukaan tool.
- Tetap minta konfirmasi sebelum deploy, restart, atau tindakan destruktif.
- Jangan menggunakan API key production untuk eksperimen; buat key terpisah.
