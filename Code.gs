/**
 * =========================================================================
 * SANTOSO DIGITAL IDENTITY — BACKEND GOOGLE APPS SCRIPT
 * =========================================================================
 * File: Code.gs
 * Spreadsheet: https://docs.google.com/spreadsheets/d/155Ixmb121EaJjoxUbw9nXNL-LUcctzAmj2WFsrFKkkU
 *
 * FITUR UTAMA:
 * - REST API Web App (doGet & doPost) untuk Portal Publik & Dashboard Admin
 * - Full CRUD: Portofolio Sekolah (9 modul + Kategori Kustom), Musik, Usaha, Profil
 * - Custom Menu Google Sheets: "Santoso Biopage"
 * - Batch operations (setValues) & SpreadsheetApp.flush() compliant
 *
 * PANDUAN INSTALASI & UPDATE:
 * 1. Buka Google Sheets > Extensions > Apps Script
 * 2. Hapus isi lama, lalu tempel seluruh kode file ini > Simpan (Ctrl+S)
 * 3. Pilih fungsi 'setupDatabase' di toolbar atas > Klik 'Run'
 *    * Otorisasi Pertama Kali: Klik 'Advanced' > 'Go to Santoso Biopage (unsafe)' > 'Allow'
 * 4. Deploy Web App:
 *    - Untuk update: Klik 'Deploy' > 'Manage deployments' > Edit (Pensil) > Version: 'New version' > 'Deploy'
 *    - Pertama kali: Klik 'Deploy' > 'New deployment' > Web App (Execute as: Me, Access: Anyone)
 * 5. Reload halaman Google Spreadsheet untuk memunculkan menu 'Santoso Biopage'
 * =========================================================================
 */

var SPREADSHEET_ID = "155Ixmb121EaJjoxUbw9nXNL-LUcctzAmj2WFsrFKkkU";

var SHEETS = {
  PROFILE:          "profile",
  TIMELINE:         "timeline",
  EDU_KARYA:        "edu_karya",
  EDU_PUBLIKASI:    "edu_publikasi",
  EDU_PKB:          "edu_pkb",
  EDU_PRESTASI:     "edu_prestasi",
  MUSIC_EVENT:      "music_event",
  MUSIC_GALLERY:    "music_gallery",
  MUSIC_VIDEO:      "music_video",
  MUSIC_PRESTASI:   "music_prestasi",
  BIZ_LIST:         "business_list",
  BIZ_GALLERY:      "business_gallery",
  TESTIMONIALS:     "testimonials",
  ACHIEVEMENTS:     "achievements",
  MESSAGES:         "messages",
  CONFIG:           "_config",

  // PORTOFOLIO SEKOLAH (9 MODUL KHUSUS)
  SCHOOL_IMPLEMENTASI: "school_implementasi",
  SCHOOL_PRESTASI:     "school_prestasi",
  SCHOOL_KARYA:        "school_karya",
  SCHOOL_PKB:          "school_pkb",
  SCHOOL_MENTORING:    "school_mentoring",
  SCHOOL_AI:           "school_ai",
  SCHOOL_ORPROF:       "school_orprof",
  SCHOOL_PROFIL_EDU:   "school_profil_edu",

  // PORTOFOLIO SEKOLAH (CMS KATEGORI KUSTOM TEMPLATIZED)
  SCHOOL_CUSTOM_CATS:  "school_custom_categories",
  SCHOOL_CUSTOM_ITEMS: "school_custom_items"
};

// Kolom per sheet
var SCHEMA = {
  profile:         ["id","name","title","bio","photo_url","tagline","philosophy","school","whatsapp","email","instagram","facebook","youtube","updated_at"],
  timeline:        ["id","year","title","description","category","active"],
  edu_karya:       ["id","title","description","year","proof_url","category","active"],
  edu_publikasi:   ["id","title","journal","year","link","cover_url","active"],
  edu_pkb:         ["id","title","organizer","year","cert_url","hours","active"],
  edu_prestasi:    ["id","title","organizer","year","level","cert_url","active"],
  music_event:     ["id","event_name","date","venue","city","photo_url","description","active"],
  music_gallery:   ["id","photo_url","caption","event_ref","active"],
  music_video:     ["id","title","embed_url","platform","date","active"],
  music_prestasi:  ["id","title","organizer","year","level","cert_url","active"],
  business_list:   ["id","name","tagline","description","type","ig_url","wa_number","active"],
  business_gallery:["id","business_id","photo_url","caption","active"],
  testimonials:    ["id","business_id","client_name","review","rating","active"],
  achievements:    ["id","title","category","organizer","year","level","cert_url","active"],
  messages:        ["id","name","email","purpose","message","created_at","is_read"],
  _config:         ["key","value"],

  // PORTOFOLIO SEKOLAH SCHEMA
  school_implementasi:     ["id","title","type","description","app_url","media_url","caption","order","active"],
  school_prestasi:         ["id","title","event","organizer","year","level","cert_title","cert_url","photo_url","order","active"],
  school_karya:            ["id","title","type","description","media_id","url","date","hashtag","order","active"],
  school_pkb:              ["id","title","type","organizer","year","role","cert_name","cert_url","photo_url","order","active"],
  school_mentoring:        ["id","title","date","year","role","target","material","photo_url","order","active"],
  school_ai:               ["id","type","code","title","subtitle","body","usage","order","active"],
  school_orprof:           ["id","role","organization","period","sk_filename","sk_url","photo_url","order","active"],
  school_profil_edu:       ["id","period","institution","degree","major","order","active"],
  school_custom_categories:["id","slug","title","description","icon","order","active"],
  school_custom_items:     ["id","category_slug","title","subtitle","description","date_or_period","media_type","media_url","extra_link","order","active"]
};

// =========================================================================
// MENU GOOGLE SHEETS
// =========================================================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Santoso Biopage")
    .addItem("Setup Database (Inisialisasi Sheet)", "setupDatabase")
    .addSeparator()
    .addItem("Buka Web Portal Publik", "openWebPortalDialog")
    .addItem("Buka Dashboard Admin", "openAdminDialog")
    .addToUi();
}

function openWebPortalDialog() {
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;padding:20px;text-align:center;">' +
    '<h3 style="color:#1B3A6B;margin-top:0;">Santoso Digital Identity</h3>' +
    '<p style="color:#6B6560;font-size:13px;">Portal biopage telah live di Cloudflare Pages.</p>' +
    '<div style="margin:20px 0;display:flex;gap:8px;justify-content:center;">' +
    '<a href="https://santoso-504.pages.dev" target="_blank" style="background:#1B3A6B;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">Web Utama &rarr;</a>' +
    '<a href="https://santoso-504.pages.dev/portosekolah" target="_blank" style="background:#1B3A6B;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">Porto Sekolah &rarr;</a>' +
    '</div></div>'
  ).setWidth(400).setHeight(190);
  SpreadsheetApp.getUi().showModalDialog(html, "Portal Santoso");
}

function openAdminDialog() {
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;padding:20px;text-align:center;">' +
    '<h3 style="color:#1B3A6B;margin-top:0;">Dashboard Admin Santoso</h3>' +
    '<p style="color:#6B6560;font-size:13px;">Kelola konten musik, usaha, dan seluruh portofolio sekolah.</p>' +
    '<div style="margin:20px 0;">' +
    '<a href="https://santoso-504.pages.dev/admin.html" target="_blank" style="background:#1C1A17;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">Buka Admin Dashboard &rarr;</a>' +
    '</div></div>'
  ).setWidth(380).setHeight(180);
  SpreadsheetApp.getUi().showModalDialog(html, "Admin Dashboard");
}

function batchAppend(sheet, rows) {
  if (!sheet || !rows || rows.length === 0) return;
  var startRow = Math.max(1, sheet.getLastRow()) + 1;
  sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
}

// =========================================================================
// SETUP DATABASE — Jalankan sekali untuk inisialisasi semua sheet
// =========================================================================
function setupDatabase() {
  try {
    var ss = getDatabase();

    // Buat semua sheet jika belum ada & pasang header bergaya
    for (var sheetKey in SHEETS) {
      var sheetName = SHEETS[sheetKey];
      var headers = SCHEMA[sheetName];
      var sheet = getOrCreateSheet(ss, sheetName);
      styleHeader(sheet, headers, "#1C1A17", "#F9F7F4");
    }

    // 1. Config
    var configSheet = ss.getSheetByName("_config");
    if (configSheet.getLastRow() <= 1) {
      var configDefaults = [
        ["admin_username", "admin"],
        ["admin_password_hash", "admin123"],
        ["site_title", "Santoso, S.Pd., M.Pd."],
        ["site_tagline", "Satu nama. Banyak dunia."],
        ["owner_whatsapp", "6281234567890"],
        ["owner_email", "santoso@gmail.com"],
        ["api_key", generateApiKey()]
      ];
      configSheet.getRange(2, 1, configDefaults.length, 2).setValues(configDefaults);
    }

    // 2. Profile
    var profileSheet = ss.getSheetByName("profile");
    if (profileSheet.getLastRow() <= 1) {
      profileSheet.appendRow([
        "1",
        "Santoso, S.Pd., M.Pd.",
        "Pendidik · Penyanyi · Entrepreneur",
        "Saya adalah seorang pendidik yang berdedikasi, penyanyi profesional, dan entrepreneur. Selama lebih dari satu dekade, saya telah membentuk generasi penerus bangsa di kelas, menyebarkan kebahagiaan lewat musik di panggung, dan membangun usaha tata rias serta busana dengan sepenuh hati.",
        "",
        "Satu nama. Banyak dunia.",
        "Mengajar adalah panggilan. Bernyanyi adalah jiwa. Berwirausaha adalah bukti bahwa hidup bisa terus tumbuh.",
        "SD Negeri — Tuban, Jawa Timur",
        "6281234567890",
        "santoso@gmail.com",
        "https://instagram.com/santoso",
        "https://youtube.com/@santoso",
        "",
        new Date().toISOString()
      ]);
    }

    // 3. Timeline
    var timelineSheet = ss.getSheetByName("timeline");
    if (timelineSheet.getLastRow() <= 1) {
      var tlSeeds = [
        ["1", "2012", "Lulus S.Pd. & Mulai Mengabdi", "Menyelesaikan studi Sarjana Pendidikan Guru SD dan memulai pengabdian mengajar di Kabupaten Tuban.", "Pendidikan", "", true],
        ["2", "2015", "Debut Panggung Musik Profesional", "Aktif tampil solo vocal di berbagai panggung festival seni dan event resmi daerah Jawa Timur.", "Musik", "", true],
        ["3", "2018", "Mendirikan Unit Usaha MUA & Wardrobe", "Mengembangkan keahlian tata rias dan busana pengantin menjadi unit usaha profesional berbadan layanan.", "Usaha", "", true],
        ["4", "2021", "Meraih Gelar Magister Pendidikan (M.Pd.)", "Menuntaskan studi pascasarjana dengan fokus inovasi media pembelajaran interaktif tingkat sekolah dasar.", "Pendidikan", "", true],
        ["5", "2023", "Guru Inovatif & Pembina Seni Vokal", "Meraih apresiasi pendidik inovatif dinas pendidikan serta aktif melatih paduan suara dan seni vokal pelajar.", "Pendidikan", "", true]
      ];
      batchAppend(timelineSheet, tlSeeds);
    }

    // 4. Edu Karya
    var eduKaryaSheet = ss.getSheetByName("edu_karya");
    if (eduKaryaSheet.getLastRow() <= 1) {
      var ekSeeds = [
        ["1", "Media Interaktif Gamifikasi Tematik SD", "Media ajar berbasis digital interaktif untuk meningkatkan minat belajar dan pemahaman materi IPAS siswa SD.", "2023", "https://drive.google.com", "Inovasi Digital", true],
        ["2", "Modul Ajar Berbasis Kearifan Lokal Tuban", "Perangkat pembelajaran kontekstual mengintegrasikan budaya pesisir Tuban dalam kurikulum sekolah.", "2022", "https://drive.google.com", "Perangkat Ajar", true],
        ["3", "Gerakan Gemar Membaca & Pojok Literasi Kelas", "Inovasi manajemen kelas menghidupkan ruang baca ramah anak yang mendongkrak minat baca hingga 90%.", "2021", "https://drive.google.com", "Metode Belajar", true]
      ];
      batchAppend(eduKaryaSheet, ekSeeds);
    }

    // 5. Edu Publikasi
    var eduPublikasiSheet = ss.getSheetByName("edu_publikasi");
    if (eduPublikasiSheet.getLastRow() <= 1) {
      var epSeeds = [
        ["1", "Pengembangan Media Interaktif Gamifikasi untuk Siswa Sekolah Dasar", "Jurnal Inovasi & Riset Pendidikan Dasar", "2023", "https://ejournal.kemdikbud.go.id", "", true],
        ["2", "Pendekatan Humanis dalam Pendidikan Karakter Anak Usia Sekolah Dasar", "Prosiding Seminar Nasional Pendidikan", "2022", "https://ejournal.kemdikbud.go.id", "", true]
      ];
      batchAppend(eduPublikasiSheet, epSeeds);
    }

    // 6. Edu PKB
    var eduPkbSheet = ss.getSheetByName("edu_pkb");
    if (eduPkbSheet.getLastRow() <= 1) {
      var pkbSeeds = [
        ["1", "Program Pendidikan Guru Penggerak", "Kemendikbudristek RI", "2022", "https://drive.google.com", "310", true],
        ["2", "Bimtek Implementasi Kurikulum Merdeka & Asesmen Autentik", "Dinas Pendidikan Kab. Tuban", "2023", "https://drive.google.com", "64", true],
        ["3", "Pelatihan Pemanfaatan AI & Teknologi Digital dalam Pembelajaran", "Balai Guru Penggerak Jawa Timur", "2024", "https://drive.google.com", "32", true]
      ];
      batchAppend(eduPkbSheet, pkbSeeds);
    }

    // 7. Edu Prestasi
    var eduPrestasiSheet = ss.getSheetByName("edu_prestasi");
    if (eduPrestasiSheet.getLastRow() <= 1) {
      var edpSeeds = [
        ["1", "Juara 1 Lomba Inovasi Pembelajaran Guru SD", "Dinas Pendidikan Kab. Tuban", "2023", "Kabupaten", "https://drive.google.com", true],
        ["2", "Pendidik Berdedikasi dan Kreatif", "Gugus Sekolah Dasar Tuban", "2022", "Kecamatan", "https://drive.google.com", true]
      ];
      batchAppend(eduPrestasiSheet, edpSeeds);
    }

    // 8. Music Event
    var musicEventSheet = ss.getSheetByName("music_event");
    if (musicEventSheet.getLastRow() <= 1) {
      var meSeeds = [
        ["1", "Festival Lagu Nusantara & Pesta Seni Pendidik", "2024-05-18", "Gedung Graha Kencana", "Tuban", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", "Penampilan solo vocal membawakan medley lagu pop dan tembang nusantara aransemen akustik.", true],
        ["2", "Gala Dinner & Annual Celebration Soloist", "2024-02-14", "Grand Ballroom Hotel Aston", "Tuban", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80", "Solois utama membawakan repertoar lagu jazz dan pop akustik pengiring jamuan makan malam.", true],
        ["3", "Konser Amal & Nada Peduli Pendidikan", "2023-11-25", "Taman Budaya Pesisir", "Tuban", "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80", "Konser musik amal bersama musisi daerah penggalangan beasiswa siswa prasejahtera.", true]
      ];
      batchAppend(musicEventSheet, meSeeds);
    }

    // 9. Music Gallery
    var musicGallerySheet = ss.getSheetByName("music_gallery");
    if (musicGallerySheet.getLastRow() <= 1) {
      var mgSeeds = [
        ["1", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", "Penampilan panggung solo vokal Festival Musik Nusantara", "1", true],
        ["2", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80", "Sesi rekaman audio dan take vocal di studio akustik", "2", true],
        ["3", "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80", "Apresiasi penonton setelah konser amal bertema pendidikan", "3", true]
      ];
      batchAppend(musicGallerySheet, mgSeeds);
    }

    // 10. Music Video
    var musicVideoSheet = ss.getSheetByName("music_video");
    if (musicVideoSheet.getLastRow() <= 1) {
      var mvSeeds = [
        ["1", "Santoso — Menghujam Jantung (Live Vocal Acoustic Cover)", "https://www.youtube.com/embed/dQw4w9WgXcQ", "YouTube", "2024", true],
        ["2", "Santoso — Medley Tembang Jawa & Pop Nusantara Akustik", "https://www.youtube.com/embed/dQw4w9WgXcQ", "YouTube", "2023", true]
      ];
      batchAppend(musicVideoSheet, mvSeeds);
    }

    // 11. Music Prestasi
    var musicPrestasiSheet = ss.getSheetByName("music_prestasi");
    if (musicPrestasiSheet.getLastRow() <= 1) {
      var mpSeeds = [
        ["1", "Juara 1 Lomba Solo Vokal Pop Pria Dewasa", "Dewan Kesenian Tuban", "2023", "Kabupaten", "https://drive.google.com", true],
        ["2", "Penyanyi Favorit Festival Musik Akustik Pesisir", "Komunitas Musisi Jawa Timur", "2022", "Provinsi", "https://drive.google.com", true]
      ];
      batchAppend(musicPrestasiSheet, mpSeeds);
    }

    // 12. Business List
    var businessListSheet = ss.getSheetByName("business_list");
    if (businessListSheet.getLastRow() <= 1) {
      var blSeeds = [
        ["1", "Santoso Wedding & MUA", "Kecantikan Elegan di Momen Terindah Anda", "Layanan Make Up Artist (MUA) profesional melayani rias pengantin adat Jawa paes modern, wisuda, siraman, dan makeup pesta dengan kosmetik premium tahan lama.", "MUA & Tata Rias", "https://instagram.com/santoso", "6281234567890", true],
        ["2", "Santoso Wardrobe & Kebaya Rental", "Koleksi Busana Pengantin, Kebaya & Gaun Elegan", "Penyewaan busana pengantin tradisional modern, kebaya wisuda kekinian, beskap adat Jawa, dan jas formal dengan kondisi sangat prima dan bersih.", "Persewaan Busana", "https://instagram.com/santoso", "6281234567890", true]
      ];
      batchAppend(businessListSheet, blSeeds);
    }

    // 13. Business Gallery
    var businessGallerySheet = ss.getSheetByName("business_gallery");
    if (businessGallerySheet.getLastRow() <= 1) {
      var bgSeeds = [
        ["1", "1", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80", "Makeup pengantin muslimah modern flawless glowing", true],
        ["2", "1", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", "Tata rias paes ageng pengantin adat Jawa anggun", true],
        ["3", "2", "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80", "Koleksi kebaya brokat wisuda modern warna sage green", true]
      ];
      batchAppend(businessGallerySheet, bgSeeds);
    }

    // 14. Testimonials
    var testimonialsSheet = ss.getSheetByName("testimonials");
    if (testimonialsSheet.getLastRow() <= 1) {
      var tSeeds = [
        ["1", "1", "Dina & Rian (Pengantin)", "Pak Santoso sangat telaten dan sabar! Riasan pernikahanku tahan seharian dan hasilnya flawless natural, semua keluarga serta tamu memuji keanggunannya. Sangat puas!", "5", true],
        ["2", "1", "Siti Nurjanah, S.Kom. (Wisudawati)", "Make up wisuda Pak Santoso juara banget! Nggak dempul, foto hasilnya cantik banget dan nggak bikin jerawatan. Pasti rekomendasiin ke adik tingkat!", "5", true],
        ["3", "2", "Ibu Ratih (Panitia Acara Seni)", "Busana adat dan kebaya yang disewa bersih, wangi, dan jahitannya sangat rapi. Pelayanan ramah dan harga sangat bersahabat.", "5", true]
      ];
      batchAppend(testimonialsSheet, tSeeds);
    }

    // 15. Achievements
    var achievementsSheet = ss.getSheetByName("achievements");
    if (achievementsSheet.getLastRow() <= 1) {
      var achSeeds = [
        ["1", "Juara 1 Lomba Inovasi Pembelajaran Guru SD", "Pendidikan", "Dinas Pendidikan Kab. Tuban", "2023", "Kabupaten", "https://drive.google.com", true],
        ["2", "Juara 1 Lomba Solo Vokal Pop Pria", "Musik", "Dewan Kesenian Tuban", "2023", "Kabupaten", "https://drive.google.com", true],
        ["3", "Pendidik Berdedikasi dan Kreatif", "Pendidikan", "Gugus SD Kab. Tuban", "2022", "Kecamatan", "https://drive.google.com", true],
        ["4", "Penyanyi Favorit Festival Musik Akustik Pesisir", "Musik", "Komunitas Seni Jawa Timur", "2022", "Provinsi", "https://drive.google.com", true],
        ["5", "MUA Terfavorit Kategori Rias Modern", "Usaha", "Asosiasi Rias Pengantin Tuban", "2023", "Kabupaten", "https://drive.google.com", true]
      ];
      batchAppend(achievementsSheet, achSeeds);
    }

    // 16. Portofolio Sekolah — Bukti Implementasi
    var siSheet = ss.getSheetByName("school_implementasi");
    if (siSheet.getLastRow() <= 1) {
      var siSeeds = [
        ["1", "LAPIS LADA — Digitalisasi Pelayanan Informasi Sekolah", "app", "Layanan Informasi Sekolah terpadu untuk meningkatkan mutu layanan publik di UPT SDN Latsari 2 Kecamatan Bancar.", "https://lapislada.pages.dev/", "", "", 1, true],
        ["2", "Fitur Layanan", "gallery", "", "", "/assets/portosekolah/bukti-implementasi/01.jpg", "Tampilan fitur-fitur pada aplikasi LAPIS LADA", 2, true],
        ["3", "Fitur Layanan", "gallery", "", "", "/assets/portosekolah/bukti-implementasi/02.jpg", "Tampilan fitur-fitur pada aplikasi LAPIS LADA", 3, true],
        ["4", "Tampilan Mobile", "gallery", "", "", "/assets/portosekolah/bukti-implementasi/03.jpg", "Tampilan LAPIS LADA menggunakan HP", 4, true],
        ["5", "Tampilan Desktop", "gallery", "", "", "/assets/portosekolah/bukti-implementasi/04.jpg", "Tampilan LAPIS LADA menggunakan PC", 5, true],
        ["6", "Penghubung Guru & Ortu", "gallery", "", "", "/assets/portosekolah/bukti-implementasi/05.jpg", "Tampilan salah satu fitur LAPIS LADA yang menjadi penghubung guru dan orang tua", 6, true],
        ["7", "Entri Data Guru", "gallery", "", "", "/assets/portosekolah/bukti-implementasi/06.jpg", "Contoh tampilan halaman entry data pada akun guru untuk disampaikan kepada orang tua", 7, true],
        ["8", "Sosialisasi Tim", "gallery", "", "", "/assets/portosekolah/bukti-implementasi/07.jpg", "Sosialisasi dan pembentukan tim pengembang aplikasi LAPIS LADA", 8, true],
        ["9", "Sosialisasi Komite & Wali Murid", "gallery", "", "", "/assets/portosekolah/bukti-implementasi/08.jpg", "Sosialisasi kepada komite dan wali murid aplikasi LAPIS LADA", 9, true],
        ["10", "Pembelajaran Berdiferensiasi Bahasa Indonesia", "video", "Pembelajaran Berdiferensiasi pada pelajaran Bahasa Indonesia kelas 1 melalui metode Fun Learning", "", "RIqK9fA7OSM", "", 10, true],
        ["11", "Inovasi Asesmen Metode ASSA", "video", "Inovasi Asesmen pada Pembelajaran Bahasa Indonesia Kelas 1 dengan Metode ASSA (Aku Suka, Suka Aku)", "", "CKsJadhw1S8", "", 11, true],
        ["12", "Workshop LAPIS LADA", "document", "Workshop aplikasi LAPIS LADA", "", "", "Workshop lapis lada (Dokumen)", 12, true]
      ];
      batchAppend(siSheet, siSeeds);
    }

    // 17. Portofolio Sekolah — Prestasi
    var spSheet = ss.getSheetByName("school_prestasi");
    if (spSheet.getLastRow() <= 1) {
      var spSeeds = [
        ["1", "Juara 1 Lomba Read Aloud (Membaca Nyaring) tahun 2025", "Lomba Read Aloud 2025", "Dinas Perpustakaan Daerah dan Kearsipan Kabupaten Tuban", "2025", "Kabupaten", "sertifikat juara 1 Read loud.pdf", "", "/assets/portosekolah/prestasi/01.jpg", 1, true],
        ["2", "Peraih Level 4 'Pengembara' Cerdas Cermat Guru", "Temu Pendidik Nusantara KGBN", "Komunitas Guru Belajar Nusantara (KGBN)", "2024", "Nasional", "", "", "/assets/portosekolah/prestasi/03.jpg", 2, true],
        ["3", "Juara 1 Lomba Cipta Lagu Branding Tuban tahun 2016", "Lomba Cipta Lagu Branding Tuban", "Pemerintah Kabupaten Tuban", "2016", "Kabupaten", "", "https://www.tubankab.go.id/entry/jawara-lomba-cipta-lagu-masuk-dapur-rekaman", "/assets/portosekolah/prestasi/06.jpg", 3, true]
      ];
      batchAppend(spSheet, spSeeds);
    }

    // 18. Portofolio Sekolah — Karya Tulis & Inovasi
    var skSheet = ss.getSheetByName("school_karya");
    if (skSheet.getLastRow() <= 1) {
      var skSeeds = [
        ["1", "Inovasi Asesmen ASSA (Aku Suka, Suka Aku)", "video", "Inovasi asesmen pada pembelajaran Bahasa Indonesia kelas 1", "CKsJadhw1S8", "https://youtu.be/CKsJadhw1S8", "2024", "", 1, true],
        ["2", "Pembelajaran Berdiferensiasi Fun Learning", "video", "Pembelajaran Berdiferensiasi Pelajaran Bahasa Indonesia kelas 1", "RIqK9fA7OSM", "https://youtu.be/RIqK9fA7OSM", "2024", "", 2, true],
        ["3", "Penulis Buku 'Jalan Langit Anak Tuban'", "buku", "Buku kumpulan cerita anak bersama tim IGPT Kab. Tuban", "", "", "2023", "", 3, true],
        ["4", "Jurnal Ilmiah Pendidikan", "jurnal", "Publikasi artikel dan riset ilmiah guru", "", "https://share.google/9fFH04YI6xXA2ThOe", "2024", "", 4, true],
        ["5", "Strategi Kepala Sekolah Berbasis Komitmen Berprestasi", "jurnal", "Studi Multisitus di UPT SDN Sukolilo dan UPT SDN Tenggerkulon Bancar", "", "http://elibs.unigres.ac.id/3763/", "2025", "", 5, true],
        ["6", "Tari Capil Buyuk", "tari", "Juara Harapan 2 FLS2N Kab. Tuban — Pencipta Tari", "J9_wq0Z79K8", "https://youtu.be/J9_wq0Z79K8", "2022", "", 6, true],
        ["7", "Tari Sluku Bathok", "tari", "Juara 1 tingkat kecamatan — Tari Kreasi Baru", "nBJh0asPt40", "https://youtu.be/nBJh0asPt40", "2023", "", 7, true],
        ["8", "Reels: Aku dan Teman-temanku", "reels", "Kelas 1, Pendidikan Pancasila Bab 1: wawancara perbedaan identitas teman", "", "https://www.instagram.com/reel/DOU4dNBCX1i/", "7 September 2025", "#mindfull #meaningfull #joyfull #uptsdnlatsari2bancar", 8, true],
        ["9", "Reels: Read Aloud 'Aku Ingin'", "reels", "Melatih fokus siswa pada pelajaran Bahasa Indonesia melalui Read Aloud", "", "https://www.instagram.com/reel/DWiICtaCb28/", "30 Maret 2026", "#mindfull #meaningfull #joyfull #uptsdnlatsari2bancar", 9, true],
        ["10", "Reels: Aturan Bermain Bersama Teman", "reels", "Pendidikan Pancasila strategi direct lesson, aturan ketika bermain", "", "https://www.instagram.com/reel/DdQUVkOI1Lc/", "13 September 2026", "#mindfull #meaningfull #joyfull #uptsdnlatsari2bancar", 10, true],
        ["11", "Reels: SELASI (Selasa Literasi)", "reels", "Pembiasaan membaca pagi di UPT SDN Latsari 2 Bancar", "", "https://www.instagram.com/reel/DbBEm7tIn1q/", "20 Juli 2026", "#mindfull #meaningfull #joyfull #uptsdnlatsari2bancar", 11, true],
        ["12", "Lagu Branding Tuban — Bagian 1", "lagu", "Lagu cipta yang menjadi lagu branding Kabupaten Tuban", "6htg71t8hk8", "https://youtu.be/6htg71t8hk8", "2016", "", 12, true],
        ["13", "Lagu Branding Tuban — Bagian 2", "lagu", "Lagu cipta yang menjadi lagu branding Kabupaten Tuban", "uiZB8h_ymPg", "https://youtu.be/uiZB8h_ymPg", "2016", "", 13, true],
        ["14", "Lagu Branding Tuban — Bagian 3", "lagu", "Lagu cipta yang menjadi lagu branding Kabupaten Tuban", "-UcZyfPPAOQ", "https://youtu.be/-UcZyfPPAOQ", "2016", "", 14, true]
      ];
      batchAppend(skSheet, skSeeds);
    }

    // 19. Portofolio Sekolah — Pengembangan Diri
    var spkbSheet = ss.getSheetByName("school_pkb");
    if (spkbSheet.getLastRow() <= 1) {
      var spkbSeeds = [
        ["1", "Guru Penggerak Angkatan 5", "kegiatan", "Kemendikbudristek", "", "Peserta", "", "", "/assets/portosekolah/pengembangan-diri/01.jpg", 1, true],
        ["2", "Pendidikan Inklusif Tingkat Lanjut", "kegiatan", "Kemendikbudristek", "", "Peserta", "", "", "/assets/portosekolah/pengembangan-diri/02.jpg", 2, true],
        ["3", "Pembatik", "kegiatan", "Pusdatin Kemendikbudristek", "", "Peserta", "", "", "/assets/portosekolah/pengembangan-diri/03.jpg", 3, true],
        ["4", "Pelatihan Mengajar Dimana Saja (GWE)", "kegiatan", "Google Workspace for Education", "", "Peserta", "", "", "/assets/portosekolah/pengembangan-diri/04.jpg", 4, true],
        ["5", "Kunjungan ke Kemendikbudristek", "kegiatan", "Kemendikbudristek RI", "", "Delegasi", "", "", "/assets/portosekolah/pengembangan-diri/05.jpg", 5, true],
        ["6", "Menjadi Anggota Perpustakaan Republik Indonesia", "kegiatan", "Perpusnas RI", "", "Anggota", "", "", "/assets/portosekolah/pengembangan-diri/06.jpg", 6, true],
        ["7", "Undangan Refleksi Merdeka Belajar di Jakarta", "kegiatan", "Kemendikbudristek RI", "", "Undangan", "", "", "/assets/portosekolah/pengembangan-diri/07.jpg", 7, true],
        ["8", "Bersama Bu Dirjen GTK Kemendikdasmen RI", "kegiatan", "Ditjen GTK Kemendikdasmen", "", "Apresiasi", "", "", "/assets/portosekolah/pengembangan-diri/08.jpg", 8, true],
        ["9", "Bersama Bapak Menteri Pendidikan RI", "kegiatan", "Kemendikbudristek RI", "", "Audiensi", "", "", "/assets/portosekolah/pengembangan-diri/09.jpg", 9, true],
        ["10", "Pelatihan Calon Kepala Sekolah", "kegiatan", "Dinas Pendidikan Kab. Tuban", "", "Peserta Diklat", "", "", "/assets/portosekolah/pengembangan-diri/10.jpg", 10, true],
        ["11", "Pendidikan Narasumber Berbagi Praktik Baik PMM (NSBPB)", "kegiatan", "Ditjen GTK PMM", "", "Narasumber", "", "", "/assets/portosekolah/pengembangan-diri/11.jpg", 11, true],
        ["12", "Sertifikat berbagi praktik baik.pdf", "berkas", "", "", "", "Sertifikat berbagi praktik baik.pdf", "", "", 12, true],
        ["13", "Santoso Narasumber TPD 24 Senin 30 September 2024.pdf", "berkas", "", "", "", "Santoso Narasumber TPD 24 Senin 30 September 2024.pdf", "", "", 13, true],
        ["14", "sertifikat safari literasi.pdf", "berkas", "", "", "", "sertifikat safari literasi.pdf", "", "", 14, true],
        ["15", "sertifikat ayo menulis.pdf", "berkas", "", "", "", "sertifikat ayo menulis.pdf", "", "", 15, true],
        ["16", "sertifikat ikm.pdf", "berkas", "", "", "", "sertifikat ikm.pdf", "", "", 16, true],
        ["17", "sertifikat juara 1 Read loud.pdf", "berkas", "", "", "", "sertifikat juara 1 Read loud.pdf", "", "", 17, true],
        ["18", "Sertifikat Workshop September P.San.pdf", "berkas", "", "", "", "Sertifikat Workshop September P.San.pdf", "", "", 18, true],
        ["19", "SK_PIM_NARSUM.pdf", "berkas", "", "", "", "SK_PIM_NARSUM.pdf", "", "", 19, true],
        ["20", "sertiifikat tari.pdf", "berkas", "", "", "", "sertiifikat tari.pdf", "", "", 20, true]
      ];
      batchAppend(spkbSheet, spkbSeeds);
    }

    // 20. Portofolio Sekolah — Pendampingan Rekan Sejawat (40 Kegiatan)
    var smSheet = ss.getSheetByName("school_mentoring");
    if (smSheet.getLastRow() <= 1) {
      var smSeeds = [
        ["1", "Berbagi Praktik Baik Pembelajaran Berdiferensiasi di Gugus 02 Bancar", "2024", "2024", "Narasumber", "Guru Gugus 02 Bancar", "Penerapan strategi berdiferensiasi konten dan proses", "/assets/portosekolah/pendampingan/01.jpg", 1, true],
        ["2", "Pendampingan Pemanfaatan Platform Merdeka Mengajar (PMM)", "2024", "2024", "Fasilitator", "Dewan Guru SDN Latsari 2", "Optimalisasi aksi nyata dan pengelolaan kinerja guru", "/assets/portosekolah/pendampingan/02.jpg", 2, true],
        ["3", "Workshop Pembuatan Media Pembelajaran Digital Interaktif", "2023", "2023", "Pemateri", "Kombel Ki Hadjar Dewantara", "Canva for Education dan integrasi kuis interaktif", "/assets/portosekolah/pendampingan/03.jpg", 3, true],
        ["4", "Diseminasi Program Guru Penggerak: Budaya Positif di Sekolah", "2023", "2023", "Narasumber", "Warga UPT SDN Latsari 2", "Keyakinan kelas dan segitiga restitusi", "/assets/portosekolah/pendampingan/04.jpg", 4, true]
      ];
      batchAppend(smSheet, smSeeds);
    }

    // 21. Portofolio Sekolah — Penggunaan AI (Prompts & Gemini Codes)
    var saiSheet = ss.getSheetByName("school_ai");
    if (saiSheet.getLastRow() <= 1) {
      var saiSeeds = [
        ["1", "prompt", "", "Soal Pilihan Ganda", "4 pilihan jawaban dengan kunci & pembahasan", "Buatkan soal ulangan [MATA PELAJARAN] untuk siswa [KELAS/JENJANG] dengan materi [MATERI].\n\nBuat [JUMLAH] soal pilihan ganda dengan 4 pilihan jawaban (A, B, C, D). Variasikan tingkat kesulitan menjadi mudah, sedang, dan sulit. Gunakan bahasa yang sesuai usia siswa dan jangan membuat soal yang ambigu.\n\nSetelah semua soal, buat kunci jawaban dan pembahasan singkat untuk setiap nomor.", "", 1, true],
        ["2", "prompt", "", "Soal Isian Singkat", "Pertanyaan jelas dengan jawaban pasti", "Buatkan [JUMLAH] soal isian singkat untuk mata pelajaran [MATA PELAJARAN], kelas [KELAS], materi [MATERI].\n\nBuat pertanyaan yang jawabannya jelas dan tidak memiliki terlalu banyak kemungkinan. Variasikan tingkat kesulitan. Gunakan bahasa sederhana dan sesuai tingkat pemahaman siswa.\n\nDi bagian akhir berikan kunci jawaban lengkap.", "", 2, true],
        ["3", "prompt", "", "Soal Benar atau Salah", "Pernyataan penguji pemahaman konsep", "Buat [JUMLAH] pernyataan benar atau salah untuk [MATA PELAJARAN] kelas [KELAS] dengan materi [MATERI].\n\nBuat pernyataan yang menguji pemahaman siswa, bukan sekadar hafalan. Seimbangkan jumlah pernyataan benar dan salah. Hindari kalimat yang membingungkan.\n\nBuat tabel dengan kolom No, Pernyataan, Benar/Salah, lalu berikan kunci jawaban dan penjelasan singkat.", "", 3, true],
        ["4", "prompt", "", "Soal Uraian", "Mendorong analisis & rubrik penskoran", "Buatkan [JUMLAH] soal uraian untuk mata pelajaran [MATA PELAJARAN], kelas [KELAS], materi [MATERI].\n\nSoal harus mendorong siswa menjelaskan dengan kata-kata sendiri, memberikan alasan, membandingkan, menganalisis, atau memberikan contoh. Gunakan tingkat kesulitan yang sesuai dengan kelas.\n\nSetelah soal, buat jawaban ideal/pedoman jawaban dan rubrik penilaian dengan skor [SKOR] per soal.", "", 4, true],
        ["5", "prompt", "", "Soal HOTS", "Konteks nyata pemecahan masalah", "Buat [JUMLAH] soal HOTS untuk [MATA PELAJARAN], kelas [KELAS], materi [MATERI].\n\nSoal harus menggunakan situasi, kasus, data, ilustrasi, atau masalah yang dekat dengan kehidupan siswa. Fokus pada kemampuan menganalisis, mengevaluasi, dan menciptakan solusi, bukan sekadar menghafal.\n\nBuat pilihan jawaban yang masuk akal jika bentuknya pilihan ganda. Sertakan kunci jawaban dan alasan mengapa jawaban tersebut benar.", "", 5, true],
        ["6", "prompt", "", "Soal Campuran", "Format komprehensif bertahap", "Buat paket ulangan [MATA PELAJARAN] kelas [KELAS] materi [MATERI] dengan format:\n\n- [JUMLAH] pilihan ganda\n- [JUMLAH] isian singkat\n- [JUMLAH] benar/salah\n- [JUMLAH] uraian\n\nAtur tingkat kesulitan secara bertahap dari mudah, sedang, hingga sulit. Pastikan setiap soal sesuai materi dan tidak ada pertanyaan yang memiliki jawaban ambigu.\n\nBuat kunci jawaban lengkap dan pedoman penilaian di bagian paling akhir.", "", 6, true],
        ["7", "prompt", "", "Soal Berdasarkan Kisi-Kisi", "Sesuai indikator kognitif", "Saya akan memberikan kisi-kisi soal berikut:\n\n[TEMPEL KISI-KISI DI SINI]\n\nBerdasarkan kisi-kisi tersebut, buat [JUMLAH] soal ulangan sesuai indikator, materi, kompetensi, dan tingkat kognitif yang tercantum.\n\nJangan keluar dari kisi-kisi. Variasikan bentuk soal sesuai kebutuhan. Setelah selesai, tampilkan kunci jawaban dan buat tabel yang menunjukkan nomor soal, materi, indikator, bentuk soal, dan tingkat kognitif.", "", 7, true],
        ["8", "prompt", "", "Soal Berdasarkan Buku / Materi", "Berpijak ketat pada materi teks", "Saya akan mengunggah atau menempelkan materi pelajaran [MATERI].\n\nBerdasarkan materi tersebut, buat [JUMLAH] soal ulangan untuk siswa [KELAS/JENJANG]. Jangan menggunakan informasi yang tidak terdapat dalam materi kecuali diperlukan untuk membuat soal HOTS yang masih relevan.\n\nGunakan variasi soal pilihan ganda, isian, benar/salah, dan uraian sesuai kebutuhan. Setelah soal selesai, berikan kunci jawaban dan pembahasan singkat.", "", 8, true],
        ["9", "prompt", "", "Soal Remedial", "Fokus penguatan konsep dasar", "Buatkan soal remedial untuk siswa [KELAS] pada mata pelajaran [MATA PELAJARAN], materi [MATERI].\n\nBuat [JUMLAH] soal dengan tingkat kesulitan bertahap. Fokuskan soal pada konsep dasar yang kemungkinan belum dipahami siswa. Gunakan bahasa yang lebih sederhana tetapi tetap mengukur kompetensi yang sama.\n\nSertakan kunci jawaban, pembahasan sederhana, dan indikator kompetensi yang diuji pada setiap soal.", "", 9, true],
        ["10", "prompt", "", "Paket Ulangan Lengkap", "Siap salin ke naskah ujian", "Buat paket ulangan lengkap untuk:\n\nSekolah: [NAMA SEKOLAH]\nMata Pelajaran: [MATA PELAJARAN]\nKelas: [KELAS]\nMateri: [MATERI]\nJumlah Siswa: [JUMLAH]\nJumlah Soal: [JUMLAH]\n\nBuat soal dengan kombinasi pilihan ganda, isian, benar/salah, uraian, dan beberapa soal HOTS. Sesuaikan seluruh soal dengan jenjang siswa dan materi yang diberikan.\n\nSusun dalam format yang rapi dan siap disalin ke dokumen ujian. Sediakan bagian identitas siswa, petunjuk pengerjaan, soal, kunci jawaban, pembahasan, serta pedoman penskoran. Jangan memasukkan materi di luar topik yang diberikan.", "", 10, true],
        ["11", "gemini_code", "/mindmap", "Peta Pikiran", "", "", "Memvisualisasikan struktur materi secara hierarkis; merancang RPP, kerangka bab, atau hubungan antar-konsep yang kompleks.", 11, true],
        ["12", "gemini_code", "/summary", "Ringkasan", "", "", "Menyarikan teks, artikel, atau bab panjang; membuat rangkuman catatan belajar, poin penting, atau bahan review cepat sebelum ujian.", 12, true],
        ["13", "gemini_code", "/simple", "Penyederhanaan Bahasa", "", "", "Mengubah materi rumit, akademis, atau penuh istilah teknis menjadi bahasa sederhana yang sesuai fase siswa.", 13, true],
        ["14", "gemini_code", "/explain", "Penjelasan Mendalam", "", "", "Mendalami konsep yang belum dikuasai, atau menyiapkan narasi penjelasan yang sistematis untuk mengajar di kelas.", 14, true],
        ["15", "gemini_code", "/example", "Pemberian Contoh", "", "", "Menyediakan contoh nyata, studi kasus, atau ilustrasi kontekstual agar teori abstrak mudah diaplikasikan.", 15, true],
        ["16", "gemini_code", "/analogy", "Pembuatan Analogi", "", "", "Menemukan perumpamaan yang akurat antara konsep sulit dan hal yang akrab bagi siswa (misalnya arus listrik dengan aliran air).", 16, true],
        ["17", "gemini_code", "/steps", "Langkah-langkah Sistematis", "", "", "Menguraikan proses atau prosedur rumit menjadi urutan langkah terstruktur; cocok untuk panduan praktikum, rumus, atau instruksi proyek.", 17, true],
        ["18", "gemini_code", "/flashcards", "Kartu Tunjuk Cepat", "", "", "Membuat media belajar kilat berupa pasangan pertanyaan/konsep dan jawaban singkat untuk latihan hafalan.", 18, true],
        ["19", "gemini_code", "/quiz", "Kuis Interaktif", "", "", "Menyediakan bank soal cepat (pilihan ganda atau benar-salah) lengkap dengan kunci jawaban untuk penilaian formatif.", 19, true],
        ["20", "gemini_code", "/questions", "Pertanyaan Pemantik/Diskusi", "", "", "Merumuskan pertanyaan terbuka yang merangsang berpikir kritis; cocok untuk diskusi kelompok, tanya jawab, atau asesmen diagnostik awal.", 20, true],
        ["21", "gemini_code", "/compare", "Perbandingan", "", "", "Menyajikan perbedaan dan persamaan dua konsep atau lebih secara berdampingan, biasanya dalam tabel.", 21, true],
        ["22", "gemini_code", "/review", "Ulasan & Evaluasi", "", "", "Mengevaluasi materi yang telah diajarkan, merangkum umpan balik, atau merancang kisi-kisi dan materi pengayaan/remedial.", 22, true]
      ];
      batchAppend(saiSheet, saiSeeds);
    }

    // 22. Portofolio Sekolah — Organisasi Profesi (Orprof)
    var soSheet = ss.getSheetByName("school_orprof");
    if (soSheet.getLastRow() <= 1) {
      var soSeeds = [
        ["1", "Seksi Bidang Kerajinan dan Patung", "KKGS Kabupaten Tuban", "2023–2025", "", "", "/assets/portosekolah/orprof/01.jpg", 1, true],
        ["2", "Sekretaris 1", "KKGS Kabupaten Tuban", "2025–2030", "SK KKGS TUBAN.pdf", "", "", 2, true],
        ["3", "Ketua", "KKGS Kecamatan Bancar", "2020–2025 dan 2025–2030", "", "", "/assets/portosekolah/orprof/03.jpg", 3, true],
        ["4", "Seksi Bidang Humas", "Komunitas Guru Penggerak Kabupaten Tuban", "2023–2028", "5. SK KGP_2024.pdf", "https://drive.google.com/file/d/13QNHVe5hWuvKGQde7RBCbxHirGNfg6MK/view", "", 4, true],
        ["5", "Seksi Bidang Pengembangan Seni", "PGRI Cabang Kecamatan Bancar", "", "SK PENGURUS PGRI CABANG BANCAR.pdf", "", "", 5, true],
        ["6", "Tim Bidang Pengembangan Anggota dan Penggerak", "KGBN Tuban", "2023–2025", "SK KGBN 2023-2025.pdf", "", "", 6, true],
        ["7", "Ketua Kombel Ki Hadjar Dewantara", "UPT SDN Latsari 2 Bancar", "", "SK Kombel_UPT SDN Latsari 2.pdf", "", "", 7, true]
      ];
      batchAppend(soSheet, soSeeds);
    }

    // 23. Portofolio Sekolah — Riwayat Pendidikan Profil
    var spEduSheet = ss.getSheetByName("school_profil_edu");
    if (spEduSheet.getLastRow() <= 1) {
      var spEduSeeds = [
        ["1", "1989–1995", "SDN Sukolilo, Kecamatan Bancar", "SD", "", 1, true],
        ["2", "1995–1999", "SMPN 1 Kerek", "SMP", "", 2, true],
        ["3", "1999–2001", "SMAN 1 Jatirogo", "SMA", "", 3, true],
        ["4", "2001–2005", "IKIP PGRI Tuban", "S1", "Pendidikan Bahasa Inggris", 4, true],
        ["5", "2009–2013", "Universitas Terbuka", "S1", "Pendidikan Guru Sekolah Dasar (PGSD)", 5, true],
        ["6", "2023–2025", "Universitas Gresik", "S2", "Manajemen Pendidikan", 6, true]
      ];
      batchAppend(spEduSheet, spEduSeeds);
    }

    // 24. Portofolio Sekolah — Kategori Kustom & Items (Starter Demo)
    var sCatSheet = ss.getSheetByName("school_custom_categories");
    if (sCatSheet.getLastRow() <= 1) {
      var sCatSeeds = [
        ["1", "karya-siswa", "Karya Siswa & Ekstrakurikuler", "Wadah publikasi karya kreativitas seni dan inovasi proyek pelajar UPT SDN Latsari 2 Bancar.", "sparkles", 1, true]
      ];
      batchAppend(sCatSheet, sCatSeeds);
    }

    var sItemSheet = ss.getSheetByName("school_custom_items");
    if (sItemSheet.getLastRow() <= 1) {
      var sItemSeeds = [
        ["1", "karya-siswa", "Pameran Karya Seni Rupa & Daur Ulang P5", "Proyek Penguatan Profil Pelajar Pancasila", "Karya kolaboratif peserta didik memanfaatkan bahan daur ulang ramah lingkungan menjadi produk seni fungsional.", "2024", "image", "/assets/portosekolah/bukti-implementasi/01.jpg", "", 1, true]
      ];
      batchAppend(sItemSheet, sItemSeeds);
    }

    SpreadsheetApp.flush();
    Logger.log("Setup database selesai! Spreadsheet: " + ss.getUrl());
    try {
      var activeSs = SpreadsheetApp.getActiveSpreadsheet();
      if (activeSs) {
        activeSs.toast("Inisialisasi database Santoso Biopage berhasil! Seluruh sheet dan data awal siap digunakan.", "Santoso Biopage", 6);
      }
    } catch (toastErr) {}
    try {
      var ui = SpreadsheetApp.getUi();
      if (ui) {
        ui.alert(
          "Setup Database Selesai!",
          "Database Santoso Biopage berhasil diinisialisasi beserta seluruh data starter.\n\nLangkah berikutnya:\n1. Klik tombol 'Deploy' > 'Manage deployments' > Edit > New version.\n2. Buka web portal publik atau admin dashboard.",
          ui.ButtonSet.OK
        );
      }
    } catch (uiErr) {}
    return { status: "success", url: ss.getUrl() };
  } catch (err) {
    Logger.log("Error setupDatabase: " + err.toString());
    return { status: "error", message: err.toString() };
  }
}

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function styleHeader(sheet, headers, bgColor, textColor) {
  if (!headers) return;
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  var r = sheet.getRange(1, 1, 1, headers.length);
  r.setBackground(bgColor)
   .setFontColor(textColor)
   .setFontWeight("bold")
   .setFontFamily("Arial")
   .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function generateApiKey() {
  return Utilities.getUuid().replace(/-/g, "").substring(0, 24);
}

function getDatabase() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// =========================================================================
// HTTP HANDLER UTAMA
// =========================================================================
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
    "Content-Type": "application/json"
  };

  try {
    var params = e.parameter || {};
    var action = params.action || "";
    // Parse body jika ada
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (ex) { body = {}; }
    }

    var result;

    switch (action) {
      // ---- PUBLIC ENDPOINTS (no auth) ----
      case "ping":
        result = { status: "ok", timestamp: new Date().toISOString() };
        break;

      case "getProfile":
        result = getProfile();
        break;

      case "getAll":
        var sheet = params.sheet || "";
        result = getAllData(sheet, true);
        break;

      case "getOne":
        result = getOneData(params.sheet, params.id);
        break;

      case "sendMessage":
        result = saveMessage(body);
        break;

      // ---- ADMIN ENDPOINTS (requires X-Admin-Key or adminKey param) ----
      case "login":
        var loginU = (body && body.username !== undefined ? body.username : params.username) || "";
        var loginP = (body && body.password !== undefined ? body.password : params.password) || "";
        result = adminLogin(loginU, loginP);
        break;

      case "add":
        checkAdminKey(params, body);
        result = addItem(params.sheet, body);
        break;

      case "update":
        checkAdminKey(params, body);
        result = updateItem(params.sheet, params.id || body.id, body);
        break;

      case "delete":
        checkAdminKey(params, body);
        result = deleteItem(params.sheet, params.id || body.id);
        break;

      case "toggle":
        checkAdminKey(params, body);
        result = toggleActive(params.sheet, params.id || body.id);
        break;

      case "getAllAdmin":
        checkAdminKey(params, body);
        result = getAllData(params.sheet, false);
        break;

      case "getMessages":
        checkAdminKey(params, body);
        result = getAllData("messages", false);
        break;

      case "markRead":
        checkAdminKey(params, body);
        result = markMessageRead(params.id || body.id);
        break;

      case "getConfig":
        checkAdminKey(params, body);
        result = getConfig();
        break;

      case "updateConfig":
        checkAdminKey(params, body);
        result = updateConfig(body);
        break;

      case "getDashboardStats":
        checkAdminKey(params, body);
        result = getDashboardStats();
        break;

      default:
        result = { status: "error", message: "Action tidak dikenal: " + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// =========================================================================
// AUTHENTICATION
// =========================================================================
function checkAdminKey(params, body) {
  var provided = params.adminKey || (body && body.adminKey) || "";
  var storedKey = getConfigValue("api_key");
  if (!storedKey || provided !== storedKey) {
    throw new Error("Akses ditolak: API key tidak valid.");
  }
}

function adminLogin(username, password) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName("_config") || ss.getSheetByName("config");
  if (!sheet) {
    return { status: "error", message: "Sheet _config tidak ditemukan." };
  }
  var data = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < data.length; i++) {
    var k = String(data[i][0] || "").trim();
    var v = String(data[i][1] || "").trim();
    if (k) config[k] = v;
  }

  var storedUser = (config["admin_username"] || "admin").trim();
  var storedPass = (config["admin_password_hash"] || "admin123").trim();

  var inputUser = String(username || "").trim();
  var inputPass = String(password || "").trim();

  if (inputUser === storedUser && inputPass === storedPass) {
    return {
      status: "success",
      apiKey: config["api_key"] || "",
      message: "Login berhasil"
    };
  } else {
    return { status: "error", message: "Username atau password salah. Coba lagi." };
  }
}

// =========================================================================
// CRUD HELPERS
// =========================================================================
function getAllData(sheetName, activeOnly) {
  if (!sheetName) return { status: "error", message: "Parameter 'sheet' diperlukan." };
  var ss = getDatabase();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet tidak ditemukan: " + sheetName };

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { status: "success", data: [] };

  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    if (activeOnly && row.hasOwnProperty("active") && row.active === false) continue;
    if (activeOnly && row.hasOwnProperty("active") && row.active === "FALSE") continue;
    rows.push(row);
  }

  // Urutkan berdasarkan order (jika ada) atau id numerik
  rows.sort(function(a, b) {
    if (a.order !== undefined && b.order !== undefined && a.order !== "" && b.order !== "") {
      return (parseInt(a.order) || 0) - (parseInt(b.order) || 0);
    }
    return (parseInt(b.id) || 0) - (parseInt(a.id) || 0);
  });

  return { status: "success", data: rows, count: rows.length };
}

function getOneData(sheetName, id) {
  var result = getAllData(sheetName, false);
  if (result.status !== "success") return result;
  var item = result.data.find(function(r) { return String(r.id) === String(id); });
  if (!item) return { status: "error", message: "Item tidak ditemukan" };
  return { status: "success", data: item };
}

function addItem(sheetName, body) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet tidak ditemukan: " + sheetName };

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Generate ID
  var lastRow = sheet.getLastRow();
  var newId = lastRow; // simple incrementing id

  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    if (key === "id") {
      row.push(newId);
    } else if (key === "active") {
      row.push(true);
    } else if (key === "created_at" || key === "updated_at") {
      row.push(new Date().toISOString());
    } else if (key === "is_read") {
      row.push(false);
    } else {
      row.push(body[key] !== undefined ? body[key] : "");
    }
  }

  sheet.appendRow(row);
  SpreadsheetApp.flush();
  return { status: "success", message: "Item berhasil ditambahkan", id: newId };
}

function updateItem(sheetName, id, body) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet tidak ditemukan" };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIdx = headers.indexOf("id");

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]) === String(id)) {
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        if (key === "id") continue;
        if (key === "updated_at") {
          sheet.getRange(i + 1, j + 1).setValue(new Date().toISOString());
        } else if (body[key] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(body[key]);
        }
      }
      SpreadsheetApp.flush();
      return { status: "success", message: "Item berhasil diupdate" };
    }
  }
  return { status: "error", message: "Item tidak ditemukan" };
}

function deleteItem(sheetName, id) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet tidak ditemukan" };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIdx = headers.indexOf("id");

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]) === String(id)) {
      sheet.deleteRow(i + 1);
      SpreadsheetApp.flush();
      return { status: "success", message: "Item berhasil dihapus" };
    }
  }
  return { status: "error", message: "Item tidak ditemukan" };
}

function toggleActive(sheetName, id) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet tidak ditemukan" };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIdx = headers.indexOf("id");
  var activeIdx = headers.indexOf("active");

  if (activeIdx === -1) return { status: "error", message: "Sheet tidak memiliki kolom 'active'" };

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]) === String(id)) {
      var current = data[i][activeIdx];
      var newVal = !(current === true || current === "TRUE" || current === "true");
      sheet.getRange(i + 1, activeIdx + 1).setValue(newVal);
      SpreadsheetApp.flush();
      return { status: "success", active: newVal };
    }
  }
  return { status: "error", message: "Item tidak ditemukan" };
}

// =========================================================================
// PROFILE
// =========================================================================
function getProfile() {
  var ss = getDatabase();
  var sheet = ss.getSheetByName("profile");
  if (!sheet || sheet.getLastRow() <= 1) {
    return { status: "success", data: null };
  }
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var row = {};
  for (var j = 0; j < headers.length; j++) {
    row[headers[j]] = data[1][j];
  }
  return { status: "success", data: row };
}

// =========================================================================
// CONFIG
// =========================================================================
function getConfig() {
  var ss = getDatabase();
  var sheet = ss.getSheetByName("_config");
  var data = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < data.length; i++) {
    config[data[i][0]] = data[i][1];
  }
  return { status: "success", data: config };
}

function getConfigValue(key) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName("_config");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }
  return null;
}

function updateConfig(body) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName("_config");
  var data = sheet.getDataRange().getValues();

  for (var key in body) {
    if (!body.hasOwnProperty(key)) continue;
    var found = false;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(body[key]);
        found = true;
        break;
      }
    }
    if (!found) {
      sheet.appendRow([key, body[key]]);
    }
  }

  SpreadsheetApp.flush();
  return { status: "success", message: "Konfigurasi berhasil diupdate" };
}

// =========================================================================
// MESSAGES
// =========================================================================
function saveMessage(body) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName("messages");
  if (!sheet) return { status: "error", message: "Sheet messages tidak ditemukan" };

  var lastRow = sheet.getLastRow();
  sheet.appendRow([
    lastRow,
    body.name || "",
    body.email || "",
    body.purpose || "",
    body.message || "",
    new Date().toISOString(),
    false
  ]);
  SpreadsheetApp.flush();
  return { status: "success", message: "Pesan berhasil dikirim. Terima kasih!" };
}

function markMessageRead(id) {
  var ss = getDatabase();
  var sheet = ss.getSheetByName("messages");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIdx = headers.indexOf("id");
  var readIdx = headers.indexOf("is_read");

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]) === String(id)) {
      sheet.getRange(i + 1, readIdx + 1).setValue(true);
      SpreadsheetApp.flush();
      return { status: "success" };
    }
  }
  return { status: "error", message: "Pesan tidak ditemukan" };
}

// =========================================================================
// DASHBOARD STATS
// =========================================================================
function getDashboardStats() {
  var ss = getDatabase();
  var stats = {};

  var sheetNames = [
    "edu_karya", "edu_publikasi", "edu_pkb", "edu_prestasi",
    "music_event", "music_gallery", "music_video", "music_prestasi",
    "business_list", "testimonials", "achievements", "messages",
    "school_implementasi", "school_prestasi", "school_karya", "school_pkb",
    "school_mentoring", "school_ai", "school_orprof", "school_custom_categories", "school_custom_items"
  ];

  for (var i = 0; i < sheetNames.length; i++) {
    var s = ss.getSheetByName(sheetNames[i]);
    stats[sheetNames[i]] = s ? Math.max(0, s.getLastRow() - 1) : 0;
  }

  // Hitung pesan belum dibaca
  var msgSheet = ss.getSheetByName("messages");
  var unread = 0;
  if (msgSheet && msgSheet.getLastRow() > 1) {
    var msgData = msgSheet.getDataRange().getValues();
    var readIdx = msgData[0].indexOf("is_read");
    for (var j = 1; j < msgData.length; j++) {
      if (!msgData[j][readIdx] || msgData[j][readIdx] === "FALSE") unread++;
    }
  }
  stats.unread_messages = unread;

  return { status: "success", data: stats };
}
