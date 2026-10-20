# Santoso Digital Identity & Portfolio
**Santoso, S.Pd., M.Pd. — Pendidik · Penyanyi · Entrepreneur**

> *Satu nama. Banyak dunia.*

---

## Struktur File

```
Code.gs              → Backend Google Apps Script (Setup DB, API CRUD)
_worker.js           → Cloudflare Pages Worker (CORS proxy ke Apps Script)
index.html           → Halaman publik utama (Hero, Tentang, Prestasi, Kontak)
admin.html           → Dashboard admin (Login, CRUD semua modul, Pesan)
config.js            → Konfigurasi endpoint API & data pemilik
.gitignore           → Git ignore rules
README.md            → Panduan ini
```

---

## LANGKAH 1: Setup Google Apps Script & Database

1. Buka [Google Apps Script](https://script.google.com) yang terhubung ke Spreadsheet:
   `https://docs.google.com/spreadsheets/d/155Ixmb121EaJjoxUbw9nXNL-LUcctzAmj2WFsrFKkkU`
2. Salin seluruh isi `Code.gs` dan tempel ke editor Apps Script.
3. Tekan **Save** (Ctrl+S).
4. Pilih fungsi **`setupDatabase`** dari dropdown, lalu klik **Run**.
5. Berikan izin akses saat diminta (Review permissions → pilih akun → Allow).
6. Cek **Execution log** — akan muncul konfirmasi setup berhasil.

---

## LANGKAH 2: Deploy Web App di Google Apps Script

1. Di pojok kanan atas editor, klik **Deploy > New deployment**.
2. Klik ikon gerigi (Select type) → pilih **Web app**.
3. Konfigurasi:
   - **Description:** `Santoso Biopage API v1`
   - **Execute as:** `Me (email Anda)`
   - **Who has access:** `Anyone`
4. Klik **Deploy**.
5. Salin URL **Web app URL** yang muncul (berakhiran `/exec`).

---

## LANGKAH 3: Hubungkan ke Cloudflare Pages

1. Buka `_worker.js` — ganti `DEFAULT_GAS_URL` dengan URL `/exec` Anda:
   ```javascript
   const DEFAULT_GAS_URL = "https://script.google.com/macros/s/URL_ANDA/exec";
   ```
2. Buka `config.js` — ganti `PASTE_YOUR_GAS_URL_HERE` dengan URL yang sama.
3. Sesuaikan data kontak di `config.js` (WhatsApp, email, Instagram Pak Santoso).

---

## LANGKAH 4: Push ke GitHub & Deploy Cloudflare Pages

```bash
git add .
git commit -m "Initial deploy: Santoso Biopage"
git push origin main
```

Di **Cloudflare Pages**:
- Connect ke repo GitHub ini
- Framework preset: **None** (static HTML)
- Build command: (kosongkan)
- Output directory: `/` (root)
- Deploy!

---

## Hak Akses Admin

- **URL Login:** `/admin.html`
- **Username default:** `admin`
- **Password default:** `admin123`
- Ganti password via dashboard **Admin > Pengaturan** setelah deploy.

---

## Spreadsheet Database

URL: `https://docs.google.com/spreadsheets/d/155Ixmb121EaJjoxUbw9nXNL-LUcctzAmj2WFsrFKkkU`

Sheet yang akan dibuat otomatis saat `setupDatabase()` dijalankan:
- `profile` — Data profil pemilik
- `timeline` — Milestone hidup
- `edu_karya`, `edu_publikasi`, `edu_pkb`, `edu_prestasi` — Portofolio Pendidikan
- `music_event`, `music_gallery`, `music_video`, `music_prestasi` — Portofolio Musik
- `business_list`, `business_gallery`, `testimonials` — Portofolio Usaha
- `achievements` — Prestasi Gabungan
- `messages` — Pesan dari form kontak
- `_config` — Konfigurasi sistem

---

## Fitur Utama

1. **Dua Role:** Visitor (public) + Admin (dashboard lengkap)
2. **15 Modul Admin:** CRUD untuk semua konten portofolio
3. **Tiga Domain Warna:** Navy (Pendidikan), Crimson (Musik), Forest (Usaha)
4. **Zero server cost:** Database di Google Spreadsheet, hosting di Cloudflare Pages
5. **CORS-free:** Semua request ke Apps Script melalui `_worker.js` proxy
6. **Mobile responsive:** Tampil baik di semua ukuran layar
