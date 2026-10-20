# MAP — Santoso Digital Identity & Portfolio
## Site Map & Information Architecture

---

## 1. Public Route Map

```
/ (Home)
├── /about                    → Tentang Saya
├── /portfolio
│   ├── /portfolio/pendidikan → Portofolio Pendidikan
│   ├── /portfolio/musik      → Portofolio Musik
│   └── /portfolio/usaha      → Portofolio Usaha
├── /prestasi                 → Prestasi & Penghargaan
└── /kontak                   → Kontak
```

---

## 2. Admin Route Map

```
/admin                        → Login Page
└── /admin/dashboard          → Dashboard Overview
    ├── /admin/profil         → Edit Profil & About
    ├── /admin/timeline       → Kelola Timeline Hidup
    ├── /admin/pendidikan
    │   ├── /admin/pendidikan/karya       → Karya & Inovasi
    │   ├── /admin/pendidikan/publikasi   → Karya Tulis
    │   ├── /admin/pendidikan/pkb         → Pengembangan Diri
    │   └── /admin/pendidikan/prestasi    → Prestasi Pendidikan
    ├── /admin/musik
    │   ├── /admin/musik/event            → Daftar Event
    │   ├── /admin/musik/galeri           → Galeri Foto
    │   ├── /admin/musik/video            → Video Penampilan
    │   └── /admin/musik/prestasi         → Prestasi Musik
    ├── /admin/usaha
    │   ├── /admin/usaha/daftar           → Daftar Usaha
    │   ├── /admin/usaha/galeri           → Galeri Usaha
    │   └── /admin/usaha/testimoni        → Testimoni
    ├── /admin/prestasi       → Prestasi Gabungan
    ├── /admin/pesan          → Pesan Masuk
    └── /admin/pengaturan     → Pengaturan & Konfigurasi
```

---

## 3. Page Content Map

### 3.1 Home (`/`)

```
[NAVBAR]
  Logo / Nama   |  Home  About  Portofolio▾  Prestasi  Kontak  [Admin]

[HERO]
  Foto portrait full-screen backdrop
  ├── Nama: Santoso, S.Pd., M.Pd.
  ├── Identitas pills: [Pendidik] [Penyanyi] [Entrepreneur]
  └── CTA: "Kenali Saya" + "Hubungi Saya"

[TIGA DUNIA — Bento 3-col]
  ├── Pendidik: foto kelas, tagline, → /portfolio/pendidikan
  ├── Penyanyi: foto panggung, tagline, → /portfolio/musik
  └── Entrepreneur: foto usaha, tagline, → /portfolio/usaha

[KUTIPAN INSPIRATIF]
  Quote personal Pak Santoso

[PRESTASI HIGHLIGHT]
  3 pencapaian terbaru (carousel/bento)
  → Lihat Semua Prestasi

[KONTAK SINGKAT]
  WA Button + Form email singkat

[FOOTER]
  Copyright + sosmed links
```

---

### 3.2 About (`/about`)

```
[HERO ABOUT]
  Foto portrait + nama + gelar

[BIOGRAFI]
  Paragraf: latar belakang, pendidikan formal, karier

[TIMELINE HIDUP]
  Vertikal timeline interaktif:
  Tahun | Milestone (bisa scroll / klik untuk detail)

[NILAI & FILOSOFI]
  3-4 nilai utama dalam tile/card

[MULTI-IDENTITAS]
  3 persona cards: Guru | Penyanyi | Entrepreneur
  → Link ke masing-masing portfolio
```

---

### 3.3 Portofolio Pendidikan (`/portfolio/pendidikan`)

```
[HEADER]
  Identitas: Nama Sekolah, Mata Pelajaran, Jenjang

[TABS / SECTIONS]
  ├── Karya & Inovasi Pembelajaran
  │     Grid karya (judul, deskripsi, tahun, bukti foto/link)
  ├── Karya Tulis & Publikasi
  │     List jurnal / artikel / buku
  ├── Pengembangan Diri (PKB)
  │     Grid sertifikat / pelatihan (foto, nama, penyelenggara, tahun)
  ├── Pendampingan Rekan Sejawat
  │     Narasi + foto kegiatan
  ├── Penggunaan Teknologi / AI
  │     Showcase tools yang digunakan + manfaat
  └── Prestasi Pendidikan
        Timeline / grid penghargaan
```

---

### 3.4 Portofolio Musik (`/portfolio/musik`)

```
[HERO MUSIK]
  Foto panggung full-width + nama + tagline musik

[BIO PENYANYI]
  Paragraf singkat perjalanan musik

[EVENT PENAMPILAN]
  Grid kartu event (nama event, tanggal, tempat, foto)

[GALERI FOTO]
  Masonry / grid foto penampilan

[VIDEO PENAMPILAN]
  Embed YouTube/Drive (grid 2-3 video)

[PRESTASI MUSIK]
  Timeline penghargaan

[BOOKING / KONTAK]
  CTA box: cara menghubungi untuk booking
```

---

### 3.5 Portofolio Usaha (`/portfolio/usaha`)

```
[INTRO]
  Tagline + deskripsi singkat jiwa entrepreneur

[DAFTAR USAHA]
  Per usaha = 1 section / card besar:
  ├── Nama usaha + tagline
  ├── Deskripsi layanan
  ├── Galeri karya/foto
  ├── Paket / harga (opsional)
  └── CTA: WhatsApp / Instagram / Kontak

[TESTIMONI KLIEN]
  Grid 3-4 testimoni + nama + rating

[CTA UMUM]
  "Konsultasikan Kebutuhan Anda"
```

---

### 3.6 Prestasi (`/prestasi`)

```
[HEADER]
  Total prestasi + kategori summary

[FILTER BAR]
  [Semua] [Pendidikan] [Musik] [Usaha/Lainnya]

[TIMELINE / GRID PRESTASI]
  Per item: Judul, Kategori badge, Tahun, Penyelenggara, Foto sertifikat

[HIGHLIGHT — TOP 3]
  Sticky 3 prestasi terbaik di atas
```

---

### 3.7 Kontak (`/kontak`)

```
[INFO KONTAK]
  WhatsApp | Email | Sosmed

[FORM PESAN]
  Nama | Email | Keperluan (dropdown) | Pesan | Submit

[MAPS / LOKASI] (opsional)
  Embedded Google Maps wilayah Santoso
```

---

## 4. Admin Dashboard Map

### 4.1 Dashboard Overview (`/admin/dashboard`)

```
[STATS ROW]
  Total Karya Edu | Total Event Musik | Total Prestasi | Pesan Baru

[QUICK LINKS]
  Grid icon links ke semua modul

[ACTIVITY LOG]
  5 perubahan terakhir yang dibuat
```

---

### 4.2 Setiap Modul Admin (Pola Seragam)

```
[HEADER MODUL]
  Nama modul + breadcrumb

[TABEL DATA]
  Kolom sesuai modul | Status (aktif/nonaktif) | Aksi (Edit | Hapus | Toggle)

[FORM TAMBAH / EDIT]
  Muncul sebagai modal atau sidebar
  Input fields sesuai skema sheet
  Simpan | Batal | Pratinjau

[PAGINATION]
  Jika data > 20 item
```

---

## 5. Google Spreadsheet Schema

### Sheet: `profile`
| id | name | title | bio | photo_url | tagline | philosophy | whatsapp | email | instagram | updated_at |

### Sheet: `timeline`
| id | year | title | description | category | icon | active |

### Sheet: `edu_karya`
| id | title | description | year | proof_url | category | active |

### Sheet: `edu_publikasi`
| id | title | journal | year | link | cover_url | active |

### Sheet: `edu_pkb`
| id | title | organizer | year | cert_url | hours | active |

### Sheet: `edu_prestasi`
| id | title | organizer | year | level | cert_url | active |

### Sheet: `music_event`
| id | event_name | date | venue | city | photo_url | description | active |

### Sheet: `music_gallery`
| id | photo_url | caption | event_id | active |

### Sheet: `music_video`
| id | title | embed_url | platform | date | active |

### Sheet: `music_prestasi`
| id | title | organizer | year | level | cert_url | active |

### Sheet: `business_list`
| id | name | tagline | description | type | ig_url | wa_number | active |

### Sheet: `business_gallery`
| id | business_id | photo_url | caption | active |

### Sheet: `testimonials`
| id | business_id | client_name | review | rating | photo_url | active |

### Sheet: `achievements`
| id | title | category | organizer | year | level | cert_url | active |

### Sheet: `messages`
| id | name | email | purpose | message | created_at | is_read |

### Sheet: `_config`
| key | value |
|---|---|
| admin_username | santoso |
| admin_password_hash | [bcrypt hash] |
| site_title | Santoso — Pendidik, Penyanyi, Entrepreneur |
| site_tagline | Satu nama. Banyak dunia. |
| api_key | [random string] |

---

## 6. Apps Script API Endpoint Map

**Base URL:** `https://script.google.com/macros/s/[SCRIPT_ID]/exec`

| Method | Param `action` | Param `sheet` | Auth Required | Keterangan |
|---|---|---|---|---|
| GET | `getAll` | nama sheet | Tidak | Ambil semua data aktif |
| GET | `getOne` | nama sheet + `id` | Tidak | Ambil 1 item by id |
| POST | `add` | nama sheet + body JSON | Ya (X-Admin-Key) | Tambah item baru |
| POST | `update` | nama sheet + `id` + body | Ya | Update item |
| POST | `delete` | nama sheet + `id` | Ya | Hapus item (soft delete) |
| POST | `toggle` | nama sheet + `id` | Ya | Toggle status aktif |
| POST | `login` | - + credentials | - | Verifikasi login admin |
| POST | `sendMessage` | - + form data | Tidak | Simpan pesan kontak |

---

## 7. Component Map (Frontend)

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              → Home
│   │   ├── about/page.tsx        → About
│   │   ├── portfolio/
│   │   │   ├── pendidikan/page.tsx
│   │   │   ├── musik/page.tsx
│   │   │   └── usaha/page.tsx
│   │   ├── prestasi/page.tsx
│   │   └── kontak/page.tsx
│   └── admin/
│       ├── page.tsx              → Login
│       └── dashboard/
│           ├── page.tsx          → Overview
│           ├── profil/page.tsx
│           ├── timeline/page.tsx
│           ├── pendidikan/...
│           ├── musik/...
│           ├── usaha/...
│           ├── prestasi/page.tsx
│           ├── pesan/page.tsx
│           └── pengaturan/page.tsx
├── components/
│   ├── public/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── TimelineInteractive.tsx
│   │   ├── GalleryGrid.tsx
│   │   ├── VideoEmbed.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── ContactForm.tsx
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── AdminSidebar.tsx
│       ├── DataTable.tsx
│       ├── ItemModal.tsx
│       └── StatsCard.tsx
├── lib/
│   ├── api.ts                    → Fetch wrapper ke Apps Script
│   ├── auth.ts                   → Admin auth helpers
│   └── types.ts                  → TypeScript interfaces
└── store/
    └── adminStore.ts             → Zustand store untuk admin
```
