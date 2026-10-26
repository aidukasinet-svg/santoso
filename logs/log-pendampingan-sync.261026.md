# Log Pembaruan & Konteks: Sinkronisasi 40 Kegiatan Pendampingan & Perbaikan Mismatch Foto

- **Tanggal Log**: 26 Oktober 2026
- **Format Berkas**: `/logs/log-[context].[ddmmyy].md` (`log-pendampingan-sync.261026.md`)
- **Proyek**: Santoso Digital Biopage & Portofolio Sekolah
- **Target URL Live**: https://santoso-504.pages.dev/portosekolah/pendampingan
- **Target Admin**: https://santoso-504.pages.dev/admin.html
- **Status Git**: Commit `bf18d5b` di branch `main` (Pushed to GitHub)

---

## 1. Latar Belakang & Masalah yang Dilaporkan

1. **Mismatch Foto dan Keterangan Kegiatan**:
   - Di tab publik "Pendampingan Rekan Sejawat", foto kegiatan seminar parenting di SDS Muhammadiyah Bancar tertampil dengan keterangan "Seminar Transformasi Kepemimpinan Sekolah".
   - Klien kesulitan mengedit foto dan keterangan yang mismatch tersebut melalui Dashboard Admin.
2. **Anomali Jumlah Item (Publik 44 vs Admin 4)**:
   - Halaman publik menampilkan 44 kegiatan pendampingan.
   - Dashboard Admin hanya menampilkan 4 item data.
   - Klien mengkhawatirkan apakah modul lain juga bersifat hardcoded, dan menghindari penginputan manual satu-persatu karena situs web akan segera digunakan untuk keperluan lomba.

---

## 2. Hasil Investigasi & Temuan Akar Masalah

1. **Akar Selisih Jumlah (44 vs 4)**:
   - Database Google Sheets pada sheet `school_mentoring` awalnya hanya diinisialisasi (*seeded*) sebanyak 4 baris data dummy/sampel oleh fungsi `seedSchoolData()` di `Code.gs`.
   - Di file frontend `portosekolah/pendampingan.html`, terdapat array bawaan (`DEFAULT_DATA`) berisi 40 kegiatan ter-hardcode.
   - Logika pemuatan lama menggabungkan kedua sumber: `DATA = [...customItems, ...DEFAULT_DATA]`, sehingga menghasilkan $4 + 40 = 44$ item.
   - Sementara itu, Dashboard Admin membaca langsung tabel `school_mentoring` di Google Sheets via API `getAll`, sehingga hanya menemukan 4 baris data awal tersebut.
2. **Audit Seluruh Modul Lain**:
   - Dilakukan audit menyeluruh terhadap tab lain: `school_implementasi`, `school_prestasi`, `school_karya`, `school_pkb`, `school_ai`, `school_orprof`, dan `school_profil_edu`.
   - **Hasil Audit**: Seluruh modul lainnya sudah ter-seeding secara penuh dan berjalan dinamis dari database Google Sheets. Hanya modul `school_mentoring` yang mengalami keterpotongan data seed dan penggabungan array fallback frontend.
3. **Penyebab Mismatch Foto vs Teks**:
   - Terjadi pergeseran indeks antara urutan berkas foto fisik `assets/portosekolah/pendampingan/01.jpg` s/d `40.jpg` dengan array `DEFAULT_DATA`.
   - Contoh: Foto `08.jpg` secara fisik adalah dokumentasi Seminar Parenting di SDS Muhammadiyah Bancar, tetapi pada array index ke-8 terpasang keterangan "Seminar Transformasi Kepemimpinan Sekolah" (keterangan parenting tergeser ke index ke-10).

---

## 3. Rencana Aksi & Eksekusi (Opsi B)

Dipilih **Opsi B**: Melakukan sinkronisasi batch 40 kegiatan terstruktur ke spreadsheet secara otomatis, memetakan kembali seluruh foto 01–40 secara presisi, dan menyediakan tombol satu-klik sinkronisasi di Admin serta Google Sheets.

### Pemetaan Presisi 40 Foto & Kegiatan Pendampingan
Setiap file foto `assets/portosekolah/pendampingan/XX.jpg` dipetakan 100% tepat terhadap dokumen kegiatan aslinya:
- `01.jpg`: Penyusunan Buku Kerja Satu (BKS) Tahun Pelajaran 2025/2026 (Narsum/Pemateri)
- `02.jpg`: Penyusunan Buku Kerja Satu (BKS) Tahun Pelajaran 2024/2025 (Narsum/Pemateri)
- `03.jpg`: Fasilitator Pembelajaran Digital — Aktivasi Akun Belajar.id Guru & Siswa se-Kec. Bancar
- `04.jpg`: Coaching & Observasi Pembelajaran Rekan Sejawat (Observer Pembelajaran)
- `05.jpg`: Coaching Supervisi Akademik Guru Kelas (Coach Supervisi)
- `06.jpg`: Coaching Perencanaan Pembelajaran Berdiferensiasi (Coach Pendamping)
- `07.jpg`: Transformasi Kepemimpinan Sekolah Angkatan 1 di UPT SDN Latsari 2 Bancar
- `08.jpg`: **Seminar Parenting di SDS Muhammadiyah Bancar (Narasumber)** *(Mismatch teratasi)*
- `09.jpg`: Narasumber Berbagi Praktik Baik di Komunitas Belajar SDN Latsari 2
- `10.jpg`: Narasumber Workshop Pemanfaatan Platform Merdeka Mengajar (PMM)
- `11.jpg`: Narasumber Temu Pendidik Daerah 24: Transisi PAUD-SD
- `12.jpg`: Google Master Trainer Level 1
- `13.jpg`: TOT Pembelajaran Mendalam (Deep Learning)
- `14.jpg`: Narasumber Implementasi P5: Antara Miskonsepsi dan Aksi Nyata
- `15.jpg`: Rapat Kerja Komunitas Guru Penggerak (KGP) Kabupaten Tuban
- `16.jpg`–`40.jpg`: Rangkaian kegiatan IHT Kurikulum Merdeka, Aktivasi Belajar.id lintas kecamatan/jenjang, Gugus Sekolah, Temu Komunitas Guru Penggerak, Pelatihan Read Aloud, hingga Pembina Seni Tari SFW.

---

## 4. Rincian Pembaruan Kode

### A. Backend: `Code.gs`
1. **Fungsi Data Seed Lengkap (`getAllSchoolMentoringSeeds`)**:
   - Memuat ke-40 item pendampingan lengkap dengan kolom skema: `["id", "title", "date", "year", "role", "target", "material", "photo_url", "order", "active"]`.
2. **Fungsi Batch Sync (`syncAllSchoolMentoring`)**:
   - Menghapus data lama pada sheet `school_mentoring`, memastikan header skema benar, dan menuliskan 40 baris data secara instan via `batchAppend`.
3. **Menu Google Sheets (`onOpen`)**:
   - Menambahkan menu `Santoso Biopage > ⚡ Sync 40 Kegiatan Pendampingan (Lengkap)`.
4. **API Endpoint (`handleRequest`)**:
   - Menambahkan handler `case "syncMentoring":` dengan proteksi `checkAdminKey`.
5. **Update Default Database Seeder (`seedSchoolData`)**:
   - Memanggil `getAllSchoolMentoringSeeds()` saat setup database awal.

### B. Frontend Publik: `portosekolah/pendampingan.html`
1. **Pembaruan `DEFAULT_DATA`**:
   - Memuat 40 data yang telah dicocokkan dengan gambar fisik `01.jpg`–`40.jpg` sebagai fallback instan bebas mismatch.
2. **Kategorisasi Cerdas Otomatis (`getCatFromItem`)**:
   - Menentukan kategori filter tab (`bks`, `belajarid`, `coaching`, `komunitas`, `narsum`) berdasarkan kata kunci judul, peran, dan materi kegiatan.
3. **Penghindaran Duplikasi (`loadDynamicMentoring`)**:
   - Jika spreadsheet memiliki $\ge 10$ item aktif, frontend merender langsung seluruh data dari sheet (diurutkan berdasarkan `order`).
   - Mencegah inflasi data duplikat $4 + 40 = 44$.

### C. Dashboard Admin: `admin.html`
1. **Tombol "⚡ Sync 40 Data Bawaan"**:
   - Muncul otomatis di topbar saat admin membuka tab navigasi *Pendampingan Rekan Sejawat*.
2. **Handler `triggerSyncMentoring()`**:
   - Mengirim request `POST` ke API `action=syncMentoring`.
   - Menampilkan konfirmasi, indikator proses (*loading*), dan notifikasi toast sukses.
   - Me-refresh tabel secara instan tanpa perlu memuat ulang seluruh halaman web.

---

## 5. Kapabilitas CRUD Mandiri & Media Eksternal

1. **Full CRUD Mandiri untuk Klien**:
   - **Create**: Tombol `+ Tambah Item` membuka modal form untuk menambah kegiatan baru kapan pun dibutuhkan.
   - **Read**: Tabel menampilkan semua data lengkap dengan fitur live search.
   - **Update**: Tombol `Edit` di setiap baris memungkinkan revisi instan untuk teks, sasaran, peran, tanggal, urutan tampil, dan foto.
   - **Delete**: Tombol `Hapus` dengan konfirmasi keamanan.
   - **Status Toggle**: Kemampuan mengaktifkan/menonaktifkan item tanpa menghapus data.
2. **Dukungan Media Gambar Eksternal (FileGarden.com, dsb.)**:
   - Pengguna dapat mengisi field `URL Foto` (`photo_url`) menggunakan URL langsung dari **filegarden.com**, CDN gambar eksternal, atau URL web lainnya.
   - Fungsi `formatMediaUrl`:
     - URL langsung (seperti `https://filegarden.com/...`) langsung di-render oleh browser.
     - URL Google Drive otomatis dikonversi menjadi tautan preview thumbnail resolusi tinggi (`sz=w1200`).
     - Jika kosong, sistem menggunakan foto bawaan `/assets/portosekolah/pendampingan/XX.jpg` sebagai fallback aman.

---

## 6. Verifikasi & Deployment

1. **Uji Validasi Sintaks**:
   - Node.js script execution test pada `Code.gs`, `admin.html`, dan `portosekolah/pendampingan.html`: 100% lolos tanpa syntax error.
2. **Uji Visual Browser Subagent**:
   - Halaman `portosekolah/pendampingan.html` terverifikasi menampilkan counter tepat 40 kegiatan.
   - Item 8 terverifikasi menampilkan foto dan caption Seminar Parenting SDS Muhammadiyah Bancar secara presisi.
3. **Git Version Control**:
   - **Commit**: `bf18d5b`
   - **Pesan**: `fix(portosekolah): sinkronisasi 40 kegiatan pendampingan, perbaiki mismatch foto & tambah fitur batch sync`
   - **Remote**: Berhasil di-push ke `origin/main` (`github.com/aidukasinet-svg/santoso.git`).

---

## 7. Panduan Langkah Klien / Admin

1. **Salin & Deploy Ulang Google Apps Script**:
   - Buka editor Google Apps Script spreadsheet.
   - Tempel isi terbaru dari [`Code.gs`](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/11.%20PAK%20SANS/2.%20biopage/santoso/Code.gs).
   - Lakukan **Deploy > Manage deployments > Edit > New version > Deploy**.
2. **Jalankan Sinkronisasi 40 Data**:
   - Masuk ke [admin.html](file:///d:/1.%20MIZTERGOOD/04%20-%20Keuangan%20dan%20Bisnis/JASA/11.%20PAK%20SANS/2.%20biopage/santoso/admin.html) > menu **Pendampingan Rekan Sejawat** > klik tombol **"⚡ Sync 40 Data Bawaan"**.
   - Atau buka Google Sheets > menu **Santoso Biopage** > **⚡ Sync 40 Kegiatan Pendampingan (Lengkap)**.
