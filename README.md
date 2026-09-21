# Traktirin – Studi Kasus Deployment Next.js

Studi kasus Pertemuan 13 mata kuliah **Pemrograman Web Expert** (STMIK IKMI Cirebon).

**Traktirin** adalah aplikasi dukungan kreator sederhana: pengunjung memilih kreator,
menulis pesan, lalu mengirim "traktiran". Aplikasinya sengaja dibuat kecil supaya
fokus praktikum ada pada **build, deployment, environment variables, dan monitoring**.

Gaya tampilan: neo brutalism (border tegas, bayangan keras, warna cerah, font monospace).

---

## 1. Menjalankan di komputer sendiri

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm run dev                     # http://localhost:3000
```

Uji mode produksi secara lokal:

```bash
npm run build
npm run start
```

## 2. Struktur proyek

```
app/
├─ page.js                        Beranda + daftar kreator
├─ kreator/[slug]/page.js         Profil kreator
├─ kreator/[slug]/SupportForm.js  Form traktiran (client component)
├─ deployment-status/page.js      ★ LATIHAN 1
├─ api/health/route.js            ★ LATIHAN 2
├─ production-checklist/          ★ LATIHAN 3
├─ api/creators/route.js          GET daftar kreator
└─ api/support/route.js           GET/POST dukungan
lib/
├─ config.js        Satu-satunya tempat membaca environment variables
├─ creators.js      Sumber data: file lokal atau API production
├─ health.js        Logika health check (dipakai Latihan 1 & 2)
└─ supportStore.js  Penyimpanan dukungan sementara (in-memory)
data/creators.json  Data contoh
```

## 3. Environment variables

| Nama | Terlihat oleh | Wajib | Keterangan |
|---|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Browser | Ya | Nama aplikasi |
| `NEXT_PUBLIC_APP_VERSION` | Browser | Ya | Versi yang tampil di status & footer |
| `API_BASE_URL` | Server | Tidak | Jika diisi, data kreator diambil dari `GET {API_BASE_URL}/creators` |
| `API_SECRET` | Server | Tidak | Dikirim sebagai `Authorization: Bearer ...` ke API |

Aturan penting:

- Secret **tidak boleh** memakai prefix `NEXT_PUBLIC_`, karena nilainya ikut masuk ke JavaScript browser.
- Nilai `NEXT_PUBLIC_*` ditanam saat build. Setelah mengubahnya di Vercel, lakukan **redeploy**.
- `.env.local` sudah diabaikan oleh `.gitignore`. Yang di-commit hanya `.env.example`.

---

## 4. Latihan praktikum

### Latihan 1 – Halaman status deployment (`/deployment-status`)

File: `app/deployment-status/page.js`

Halaman menampilkan nama aplikasi, environment, versi, platform, region, commit,
status sumber data, dan status environment variables (hanya **Terisi/Kosong**, tidak pernah nilainya).

Poin yang perlu dipahami:

- `export const dynamic = "force-dynamic"` membuat status dicek setiap kali halaman dibuka, bukan sekali saat build.
- `VERCEL_ENV` bernilai `production` / `preview` / `development` ketika berjalan di Vercel.
- Halaman memanggil `getHealthReport()` langsung, bukan `fetch("/api/health")`, sehingga tidak butuh URL absolut aplikasi sendiri.

Tugas mahasiswa:

1. Ubah `NEXT_PUBLIC_APP_VERSION` menjadi `1.0.1`, deploy ulang, dan pastikan versi berubah.
2. Buat deployment preview (push ke branch lain) dan bandingkan nilai Environment di preview vs production.
3. Tambahkan satu kartu baru, misalnya **Waktu build** atau **Jumlah kreator**.

### Latihan 2 – Health check API (`/api/health`)

File: `app/api/health/route.js` dan `lib/health.js`

Contoh respons:

```json
{
  "status": "ok",
  "service": "traktirin-nextjs",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2026-09-16T13:56:46.603Z",
  "uptimeSeconds": 12,
  "checks": {
    "dataSource": { "status": "ok", "source": "local", "items": 4, "latencyMs": 0 },
    "env": [{ "name": "NEXT_PUBLIC_APP_NAME", "configured": true }]
  }
}
```

| `status` | Arti | HTTP |
|---|---|---|
| `ok` | Semua pemeriksaan lolos | 200 |
| `degraded` | Aplikasi jalan, tetapi env wajib belum diisi | 200 |
| `error` | Sumber data gagal diakses | 503 |

Tugas mahasiswa:

1. Uji lokal: `curl http://localhost:3000/api/health`
2. Uji production: buka `https://<url-kamu>/api/health`, simpan screenshot.
3. Simulasikan kegagalan: isi `API_BASE_URL` dengan URL yang salah, redeploy, lalu amati status `error`, HTTP 503, dan runtime log di Vercel. Kembalikan nilainya setelah selesai.

### Latihan 3 – Production checklist (`/production-checklist`)

File: `app/production-checklist/Checklist.js`

Checklist interaktif berisi 7 bukti deployment dan 9 skenario smoke test. Setiap item bisa
dicentang dan diberi catatan bukti. Data tersimpan di `localStorage` browser.
Tombol **Salin untuk laporan** menyalin tabel Markdown yang bisa ditempel ke laporan.

Tugas mahasiswa:

1. Selesaikan semua item pada URL production.
2. Salin hasilnya dan lampirkan di laporan mini project.

---

## 5. Deploy ke Vercel

1. Push proyek ke GitHub (pastikan `.env.local` tidak ikut).
2. Di Vercel pilih **Add New Project** lalu import repository.
3. Pastikan framework terdeteksi sebagai **Next.js**.
4. Isi **Environment Variables** untuk Production (dan Preview):
   `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_VERSION`, serta `API_BASE_URL` / `API_SECRET` bila dipakai.
5. Klik **Deploy**, lalu buka `/`, `/deployment-status`, `/api/health`, dan `/production-checklist`.

## 6. Catatan dan tantangan lanjutan

- Dukungan yang dikirim disimpan **di memori server**. Di Vercel (serverless) datanya bisa hilang
  saat instance berganti. Ini disengaja sebagai bahan diskusi.
  Tantangan: ganti `lib/supportStore.js` dengan database (misalnya Postgres melalui `DATABASE_URL`).
- Tambahkan pemeriksaan database ke `lib/health.js` setelah database terpasang.

## 7. Troubleshooting singkat

| Gejala | Cek |
|---|---|
| Build gagal | Jalankan `npm run build` lokal dan baca error pertama |
| `/api/health` → 503 | Nilai `API_BASE_URL`, akses ke API, runtime log |
| Versi tidak berubah | Nilai `NEXT_PUBLIC_*` butuh redeploy |
| Status `degraded` | Env wajib belum diisi di Vercel |
| 404 di `/kreator/...` | Slug tidak ada di sumber data |

# Traktirin

Aplikasi traktir kopi untuk kreator.

## 🔗 Live Demo
https://traktirin-sriwati.vercel.app

## 🚀 Cara Menjalankan Lokal
1. Clone repo
2. `npm install`
3. Copy `.env.example` → `.env.local`, isi sesuai kebutuhan
4. `npm run dev`
5. Buka http://localhost:3000

## 🔧 Environment Variables
- `NEXT_PUBLIC_APP_NAME` — nama aplikasi (browser)
- `NEXT_PUBLIC_APP_VERSION` — versi aplikasi (browser)
- `API_BASE_URL` — opsional, URL API eksternal (server)
- `API_SECRET` — opsional, secret API (server)

## ☁️ Deployment
Deploy otomatis via Vercel dari branch `main`.