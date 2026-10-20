# Log Pembaruan & Konteks: Portofolio Sekolah & Manajemen Aset Lokal

- **Tanggal Log**: 20 Oktober 2026
- **Format Berkas**: `/logs/log-[context].[ddmmyy].md` (`log-portosekolah.201026.md`)
- **Proyek**: Santoso Digital Biopage & Portofolio Sekolah
- **Target URL Live**: https://santoso-504.pages.dev/portosekolah
- **Sumber Data Asli**: 
  - Google Sites: `https://sites.google.com/admin.sd.belajar.id/portofoliopaksan/home`
  - Konten Dokumen: `konten-portosekolah.md`

---

## 1. Ringkasan Eksekutif

Pembaruan ini mencakup transformasi menyeluruh dari Portofolio Sekolah milik Bapak Santoso, S.Pd., M.Pd. untuk kebutuhan portofolio digital lomba guru/sekolah berprestasi, meliputi:
1. **Penyusunan Arsitektur Halaman Lengkap**: 9 tab halaman publik statis dengan desain premium, responsif, dan siap cetak/PDF.
2. **Sistem CRUD Hybrid (Opsi A + Opsi B)**:
   - 9 Halaman utama tetap memiliki tata letak khusus (*custom layout*) yang kaya elemen (video embed, grid sertifikat, lightbox galeri, tabel interaktif).
   - Disediakan *universal template* (`portosekolah/kategori.html`) untuk kategori tambahan di masa depan yang dapat ditambah, diubah, dan dihapus oleh admin via dashboard tanpa perlu coding ulang.
   - Sinkronisasi sub-navigasi dinamis (`syncPortoNav()`) yang otomatis menampilkan tab kategori baru di seluruh halaman portofolio.
3. **Backend Google Apps Script (`Code.gs`) Sesuai Standar**:
   - Skema database spreadsheet `portosekolah_categories` dan `portosekolah_items`.
   - Endpoint CRUD lengkap dengan `batchAppend`, `SpreadsheetApp.flush()`, locking, dan menu kustom `Santoso Biopage`.
4. **Ekstraksi & Unduh Aset Google Sites ke Lokal**:
   - Berhasil mengunduh **83 foto original** (12.26 MB) dari Google Sites asli.
   - Foto terorganisasi ke dalam 8 subdirektori di bawah `assets/portosekolah/` dengan penamaan terstruktur (`01.jpg`, `02.jpg`, dst.).
   - Seluruh foto terverifikasi aktif (HTTP 200) di Cloudflare Pages.

---

## 2. Struktur Data & Pemetaan Aset Foto

Folder penyimpanan lokal: `assets/portosekolah/<subfolder>/<filename>`

### Rincian 83 Foto per Kategori

| No | Kategori | Folder Lokal | Jumlah File | Rincian Berkas & Konteks |
|---|---|---|:---:|---|
| 1 | **Profil & Sosial Media** | `assets/portosekolah/profil/` | 2 | - `01.jpg`: Foto potret utama Pak Santoso<br>- `02.jpg`: Foto bagian riwayat pendidikan |
| 2 | **Penggunaan AI** | `assets/portosekolah/penggunaan-ai/` | 2 | - `01.jpg`: Dokumentasi pelatihan AI guru 1<br>- `02.jpg`: Dokumentasi pelatihan AI guru 2 |
| 3 | **Prestasi** | `assets/portosekolah/prestasi/` | 6 | - `01.jpg`, `02.jpg`: Juara 1 Lomba Read Aloud 2025 (Piala & Piagam)<br>- `03.jpg`–`05.jpg`: Peraih Level 4 Pengembara Cerdas Cermat Guru KGBN Nasional<br>- `06.jpg`: Juara 1 Lomba Cipta Lagu Branding Tuban 2016 |
| 4 | **Bukti Implementasi** | `assets/portosekolah/bukti-implementasi/` | 9 | - `banner.jpg`: Badge link resmi aplikasi LAPIS LADA<br>- `01.jpg`, `02.jpg`: Tampilan fitur aplikasi Lapis Lada<br>- `03.jpg`: Tampilan aplikasi di HP<br>- `04.jpg`: Tampilan aplikasi di PC<br>- `05.jpg`: Fitur penghubung guru dan wali murid<br>- `06.jpg`: Contoh halaman entry data akun guru<br>- `07.jpg`: Sosialisasi dan tim pengembang<br>- `08.jpg`: Sosialisasi komite dan wali murid |
| 5 | **Karya Tulis / Inovasi** | `assets/portosekolah/karya-tulis/` | 2 | - `01.jpg`: Foto pembelajaran berdiferensiasi Fun Learning<br>- `02.jpg`: Foto sampul buku "Jalan Langit Anak Tuban" |
| 6 | **Pengembangan Diri** | `assets/portosekolah/pengembangan-diri/` | 13 | - `01.jpg`: Guru Penggerak Angkatan 5<br>- `02.jpg`: Pendidikan Inklusif Tingkat Lanjut<br>- `03.jpg`: Pembatik<br>- `04.jpg`: Pelatihan Mengajar Dimana Saja (GWE)<br>- `05.jpg`: Kunjungan Kemendikbudristek<br>- `06.jpg`: Anggota Perpustakaan Republik Indonesia<br>- `07.jpg`: Refleksi Merdeka Belajar Jakarta<br>- `08.jpg`: Bersama Bu Dirjen GTK Kemendikdasmen RI<br>- `09.jpg`: Bersama Menteri Pendidikan RI<br>- `10.jpg`–`12.jpg`: Pelatihan Calon Kepala Sekolah (3 foto)<br>- `13.jpg`: Pendidikan NSBPB PMM |
| 7 | **Pengalaman Organisasi Profesi (Orprof)** | `assets/portosekolah/orprof/` | 8 | - `01.jpg`–`03.jpg`: Seksi Kerajinan & Patung KKGS Tuban 2023–2025<br>- `04.jpg`–`06.jpg`: Ketua KKGS Kecamatan Bancar<br>- `07.jpg`: Sekretaris 1 KKGS Tuban 2025–2030<br>- `08.jpg`: Seksi Humas Komunitas Guru Penggerak Tuban |
| 8 | **Pendampingan Rekan Sejawat** | `assets/portosekolah/pendampingan/` | 41 | - `banner.jpg`: Banner utama pendampingan<br>- `01.jpg`–`40.jpg`: Lengkap 40 dokumentasi kegiatan (BKS, Coaching, Narasumber, Aktivasi Belajar.id, Komunitas, dan Pembina Tari SFW) |

---

## 3. Catatan Teknis & Solusi Unduh Google Sites

1. **Token Gambar Google Sites Bersifat Ephemeral**:
   - URL gambar Google Sites (`https://sites.google.com/sitesv-images-rt/AMxu...`) memiliki token kedaluwarsa singkat (hanya beberapa menit).
   - Pengunduhan gambar yang disimpan dalam cache daftar teks lama menghasilkan error `HTTP 403 Forbidden`.
   - **Solusi**: Dibuat pipeline *fresh-token download* (`download_fresh.cjs`) yang secara langsung membaca halaman HTML Google Sites per tab, mengekstrak URL gambar aktif, dan mengunduh buffer biner secara instan sebelum token habis.
2. **Kualitas Resolusi**:
   - Seluruh gambar diunduh pada resolusi native Google Sites (`=w1280` / `=s1600`) tanpa kompresi berlebih, menghasilkan detail teks sertifikat dan piagam yang terbaca jelas.

---

## 4. Pembaruan Kode & Sinkronisasi Tampilan

1. **`portosekolah/orprof.html`**:
   - Menghubungkan dokumentasi foto untuk jabatan `Sekretaris 1 KKGS Tuban` (`photos: ['07']`) dan `Seksi Humas KGP Tuban` (`photos: ['08']`).
2. **`portosekolah/pengembangan-diri.html`**:
   - Memperbarui skema array `KEGIATAN` dengan dukungan multi-foto (`photos: ['10', '11', '12']` untuk Pelatihan Calon Kepala Sekolah dan `['13']` untuk NSBPB).
   - Menambahkan galeri thumbnail interaktif yang terhubung langsung ke fitur Lightbox pembesar foto.
3. **Dukungan CRUD & Sub-Navigasi**:
   - Setiap halaman statis menyertakan fungsi `syncPortoNav()` yang mengambil kategori dinamis dari endpoint `Code.gs` (`action=getPortoSekolahData`) dan menyisipkannya ke `subnav-bar` tanpa mengganggu tab default.
   - Halaman `portosekolah/kategori.html` siap menerima parameter URL `?slug=<kategori-baru>` untuk menampilkan data dinamis dari Google Sheets.

---

## 5. Status Deployment & Repositori

- **Git Commit**: `ae52c2c` — *"feat(assets): download and organize 83 photos from Google Sites into assets/portosekolah"*
- **Branch**: `main` terdorong ke `origin/main` (`github.com/aidukasinet-svg/santoso.git`).
- **CDN / Hosting**: Cloudflare Pages otomatis membangun dan memublikasikan pembaruan.
- **Verifikasi Live**:
  - Halaman Prestasi: `https://santoso-504.pages.dev/portosekolah/prestasi` (Status 200, foto ter-render sempurna).
  - Endpoint Aset: Contoh `https://santoso-504.pages.dev/assets/portosekolah/prestasi/01.jpg` (Status 200, 236 KB).

---

## 6. Tindakan Lanjutan untuk Pengguna (Pak Santoso / Admin)

1. **Pembaruan Google Apps Script (`Code.gs`)**:
   - Buka editor Google Apps Script yang terhubung ke spreadsheet database.
   - Salin isi terbaru dari file lokal [`Code.gs`](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/11.%20PAK%20SANS/2.%20biopage/santoso/Code.gs).
   - Lakukan **Deploy > New deployment** (pilih tipe *Web App*, *Execute as: Me*, *Who has access: Anyone*).
   - Jika diperlukan, buka Google Sheets dan klik menu **Santoso Biopage > Inisialisasi Database Portofolio Sekolah** untuk memastikan sheet `portosekolah_categories` dan `portosekolah_items` siap digunakan.
2. **Penyempurnaan Berkas Dokumen (Opsional)**:
   - Mengunggah file PDF sertifikat / SK resmi ke Google Drive dan menautkannya melalui Dashboard Admin pada menu yang sesuai.
