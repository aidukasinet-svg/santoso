# PRD — Santoso Digital Identity & Portfolio

> **Version:** 1.0 · **Tanggal:** Oktober 2026  
> **Client:** Santoso, S.Pd., M.Pd — Guru SD, Professional Singer, Entrepreneur (MUA & Usaha lain)  
> **Referensi:** [Google Sites Lama](https://sites.google.com/admin.sd.belajar.id/portofoliopaksan/home)

---

## 1. Latar Belakang & Visi

Pak Santoso adalah individu multi-dimensi: seorang pendidik berprestasi, penyanyi profesional, dan entrepreneur. Situs Google Sites yang ada saat ini hanya melayani kebutuhan portofolio keprofesian guru (kenaikan pangkat / PKG), dan tampilannya generik serta tidak mencerminkan totalitas identitas beliau.

**Visi:** Membangun sebuah *digital identity hub* — bukan sekadar kartu nama digital, tapi sebuah ruang hidup yang menampilkan **siapa Santoso sebenarnya**: seorang manusia yang mengajar, berkarya, bernyanyi, dan membangun.

**Tagline konsep:** *"Satu nama. Banyak dunia."*

---

## 2. Target Pengguna

| Segmen | Kebutuhan | Ekspektasi Tonalitas |
|---|---|---|
| **Kolega / Atasan Pendidikan** | Lihat portofolio profesi guru (RPP, prestasi, inovasi, PKB) | Formal, terpercaya |
| **Penyelenggara Event / EO** | Cek profil Santoso sebagai penyanyi, booking kontak | Dinamis, impresif |
| **Calon Klien MUA / Usaha** | Lihat portofolio jasa, kontak, testimoni | Elegan, meyakinkan |
| **Masyarakat Umum / Keluarga** | Kenali sosok Santoso secara menyeluruh | Hangat, personal |
| **Admin (Santoso sendiri)** | Kelola semua konten tanpa coding | Efisien, intuitif |

---

## 3. Dua Role Pengguna

### 3.1 Role: Pengunjung (Visitor)
- Akses bebas ke semua halaman publik
- Tidak perlu login
- Bisa kirim pesan/kontak melalui form
- Bisa lihat galeri, video, prestasi, dan semua portofolio

### 3.2 Role: Admin (Santoso)
- Login via halaman `/admin` dengan username + password
- Session disimpan di localStorage (JWT token sederhana)
- Akses penuh ke **Admin Dashboard** untuk mengelola semua konten
- Konten tersimpan di **Google Spreadsheet** sebagai database

---

## 4. Fitur Utama

### 4.1 Public Pages (Visitor)

#### Home
- Hero section: foto Santoso profesional, nama, gelar, dan tiga identitas (Guru / Penyanyi / Entrepreneur)
- Kutipan inspiratif personal
- Preview cepat 3 dunia: Pendidikan, Musik, Usaha
- CTA: tombol ke masing-masing portofolio

#### Tentang Saya (About)
- Foto portrait premium
- Biografi ringkas (latar belakang, pendidikan, karier)
- Timeline hidup interaktif (milestones penting)
- Nilai & filosofi hidup

#### Portofolio Pendidikan (Education Portfolio)
- Identitas Profesi: Guru kelas berapa, sekolah mana, tahun berapa
- Bukti Karya / Inovasi Pembelajaran
- Karya Tulis / Publikasi
- Pengembangan Diri (pelatihan, workshop, sertifikat)
- Pendampingan Rekan Sejawat
- Penggunaan Teknologi / AI dalam Pembelajaran
- Prestasi & Penghargaan (sebagai guru)

#### Portofolio Musik (Music Portfolio)
- Bio singkat sebagai penyanyi
- Galeri foto penampilan (event, festival, dll.)
- Video penampilan (embed YouTube/Drive)
- Daftar event yang pernah diisi
- Prestasi / penghargaan musik
- Cara booking / kontak

#### Portofolio Usaha (Business Portfolio)
- Daftar usaha (MUA dan lainnya)
- Per usaha: deskripsi, galeri karya, harga/paket (opsional), kontak
- Testimoni klien
- CTA: WhatsApp / DM langsung

#### Prestasi (Achievements)
- Timeline prestasi gabungan (pendidikan + musik + usaha)
- Filter berdasarkan kategori
- Sertifikat / bukti (foto atau PDF embed)

#### Kontak
- Form pesan (nama, email, keperluan, pesan)
- WhatsApp button langsung
- Email
- Sosial media links

---

### 4.2 Admin Dashboard (Admin Only)

> **Akses:** `/admin` login dengan username + password

#### Autentikasi
- Login form (username + password)
- Password di-hash sederhana, disimpan di Spreadsheet sheet `_config`
- Session token di localStorage, expire 24 jam
- Logout button

#### Dashboard Overview
- Statistik ringkas: jumlah item per kategori konten
- Shortcut ke semua modul edit
- Preview perubahan terakhir

#### Content Management Modules

Setiap modul memiliki tampilan: tabel data (dari Spreadsheet) + form tambah/edit/hapus.

| Modul Admin | Sheet Spreadsheet | Fungsi |
|---|---|---|
| **Profil** | `profile` | Edit nama, bio, foto URL, gelar, filosofi |
| **Timeline Hidup** | `timeline` | Tambah/edit/hapus milestone hidup |
| **Pendidikan — Karya** | `edu_karya` | CRUD karya & inovasi pembelajaran |
| **Pendidikan — Publikasi** | `edu_publikasi` | CRUD karya tulis & publikasi |
| **Pendidikan — PKB** | `edu_pkb` | CRUD pelatihan, workshop, sertifikat |
| **Pendidikan — Prestasi** | `edu_prestasi` | CRUD penghargaan bidang pendidikan |
| **Musik — Event** | `music_event` | CRUD daftar event penampilan |
| **Musik — Galeri** | `music_gallery` | CRUD foto galeri (URL foto + caption) |
| **Musik — Video** | `music_video` | CRUD embed video YouTube / Drive |
| **Musik — Prestasi** | `music_prestasi` | CRUD penghargaan bidang musik |
| **Usaha — Daftar** | `business_list` | CRUD daftar usaha |
| **Usaha — Galeri** | `business_gallery` | CRUD foto per usaha |
| **Usaha — Testimoni** | `testimonials` | CRUD testimoni klien |
| **Prestasi Gabungan** | `achievements` | CRUD semua prestasi lintas kategori |
| **Pesan Masuk** | `messages` | Lihat & tandai pesan dari form kontak |
| **Pengaturan** | `_config` | Edit password, tagline, sosmed links |

#### Fitur Admin Tambahan
- **Upload Foto:** Menggunakan URL langsung (Google Drive / Imgur / link eksternal)
- **Preview Mode:** Toggle lihat tampilan public sebelum simpan
- **Status Konten:** Setiap item bisa di-toggle aktif/nonaktif tanpa hapus

---

## 5. Database: Google Spreadsheet

### Arsitektur
- **1 file Spreadsheet** dengan banyak sheet (tab)
- Akses via **Google Apps Script Web App** sebagai REST API
- Frontend berkomunikasi ke Web App URL dengan `fetch()`
- Web App mengembalikan JSON

### Alasan Spreadsheet
- Gratis, tidak ada server cost
- Pak Santoso bisa lihat/edit data langsung dari Google Sheets jika perlu
- Tidak perlu maintenance database
- Backup otomatis via Google Drive

### Keamanan
- Web App dilindungi dengan API Key header sederhana
- Operasi tulis (POST/PUT/DELETE) hanya bisa dilakukan jika header `X-Admin-Key` valid
- Operasi baca (GET) untuk public pages bebas (tanpa key)

---

## 6. Deployment

| Komponen | Platform |
|---|---|
| **Frontend** | Cloudflare Pages (deploy dari GitHub) |
| **Backend / API** | Google Apps Script Web App |
| **Database** | Google Spreadsheet |
| **Assets / Gambar** | URL eksternal (Google Drive, Imgur, dll.) |
| **Source Code** | GitHub repository |

### Alur CI/CD
```
Edit kode lokal → git push ke GitHub →
Cloudflare Pages auto-build & deploy → Live dalam ~1 menit
```

---

## 7. Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSG/SSR, optimal untuk SEO |
| **Styling** | Tailwind CSS v4 | Utility-first, cepat |
| **Animation** | Motion (Framer Motion) | Scroll reveal, micro-interactions |
| **Icons** | @phosphor-icons/react | Konsisten, beragam |
| **State** | Zustand (admin) + SWR (public) | Ringan, tepat sasaran |
| **Auth** | Custom JWT di localStorage | Simple, cukup untuk use case ini |

---

## 8. SEO & Aksesibilitas

- Setiap halaman punya `<title>` dan `<meta description>` unik
- Schema.org markup untuk `Person` dan `LocalBusiness`
- Open Graph tags untuk preview media sosial
- Alt text wajib di semua gambar
- Kontras warna WCAG AA minimum
- Mobile-first responsive

---

## 9. Scope & Prioritas

### MVP (Versi 1 — Diluncurkan)
- [ ] Public: Home, About, Portofolio Pendidikan, Portofolio Musik, Prestasi, Kontak
- [ ] Admin: Login, Dashboard, CRUD semua modul, Manajemen Pesan
- [ ] Database Spreadsheet + Apps Script API
- [ ] Deploy Cloudflare Pages + GitHub

### V2 (Pengembangan Lanjutan)
- [ ] Portofolio Usaha (MUA + usaha lain) dengan galeri lengkap
- [ ] Blog / Artikel
- [ ] Galeri Video dengan player embedded
- [ ] Multi-bahasa (ID/EN)

---

## 10. Success Metrics

| Metrik | Target |
|---|---|
| PageSpeed Score | >= 85 (mobile), >= 95 (desktop) |
| Lighthouse Accessibility | >= 90 |
| Admin task completion (CRUD) | < 3 menit per item |
| Mobile responsiveness | Berfungsi penuh di semua ukuran layar |
| Uptime | 99.9% (Cloudflare SLA) |

---

*PRD ini adalah living document. Update seiring perkembangan project.*
