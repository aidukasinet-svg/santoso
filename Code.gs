/**
 * =========================================================================
 * BACKEND GOOGLE APPS SCRIPT — SANTOSO DIGITAL IDENTITY
 * =========================================================================
 * File: Code.gs
 * Spreadsheet: https://docs.google.com/spreadsheets/d/155Ixmb121EaJjoxUbw9nXNL-LUcctzAmj2WFsrFKkkU
 *
 * CARA DEPLOY:
 * 1. Salin file ini ke Google Apps Script
 * 2. Jalankan fungsi setupDatabase() sekali
 * 3. Deploy sebagai Web App (Execute as: Me, Who has access: Anyone)
 * 4. Salin URL /exec ke config.js dan _worker.js
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
  CONFIG:           "_config"
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
  _config:         ["key","value"]
};

// =========================================================================
// MENU GOOGLE SHEETS
// =========================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Santoso Biopage")
    .addItem("Setup Database (Pertama Kali)", "setupDatabase")
    .addSeparator()
    .addItem("Buka Web Portal", "openWebPortalDialog")
    .addToUi();
}

function openWebPortalDialog() {
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;padding:20px;text-align:center;">' +
    '<h3 style="color:#1B3A6B;margin-top:0;">Santoso Digital Identity</h3>' +
    '<p style="color:#6B6560;font-size:13px;">Portal biopage telah live di Cloudflare Pages.</p>' +
    '<div style="margin:20px 0;">' +
    '<a href="https://santoso.pages.dev" target="_blank" style="background:#1B3A6B;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Buka santoso.pages.dev &rarr;</a>' +
    '</div></div>'
  ).setWidth(380).setHeight(180);
  SpreadsheetApp.getUi().showModalDialog(html, "Portal Santoso");
}

// =========================================================================
// SETUP DATABASE — Jalankan sekali untuk inisialisasi semua sheet
// =========================================================================
function setupDatabase() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

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
      for (var i = 0; i < tlSeeds.length; i++) timelineSheet.appendRow(tlSeeds[i]);
    }

    // 4. Edu Karya
    var eduKaryaSheet = ss.getSheetByName("edu_karya");
    if (eduKaryaSheet.getLastRow() <= 1) {
      var ekSeeds = [
        ["1", "Media Interaktif Gamifikasi Tematik SD", "Media ajar berbasis digital interaktif untuk meningkatkan minat belajar dan pemahaman materi IPAS siswa SD.", "2023", "https://drive.google.com", "Inovasi Digital", true],
        ["2", "Modul Ajar Berbasis Kearifan Lokal Tuban", "Perangkat pembelajaran kontekstual mengintegrasikan budaya pesisir Tuban dalam kurikulum sekolah.", "2022", "https://drive.google.com", "Perangkat Ajar", true],
        ["3", "Gerakan Gemar Membaca & Pojok Literasi Kelas", "Inovasi manajemen kelas menghidupkan ruang baca ramah anak yang mendongkrak minat baca hingga 90%.", "2021", "https://drive.google.com", "Metode Belajar", true]
      ];
      for (var i = 0; i < ekSeeds.length; i++) eduKaryaSheet.appendRow(ekSeeds[i]);
    }

    // 5. Edu Publikasi
    var eduPublikasiSheet = ss.getSheetByName("edu_publikasi");
    if (eduPublikasiSheet.getLastRow() <= 1) {
      var epSeeds = [
        ["1", "Pengembangan Media Interaktif Gamifikasi untuk Siswa Sekolah Dasar", "Jurnal Inovasi & Riset Pendidikan Dasar", "2023", "https://ejournal.kemdikbud.go.id", "", true],
        ["2", "Pendekatan Humanis dalam Pendidikan Karakter Anak Usia Sekolah Dasar", "Prosiding Seminar Nasional Pendidikan", "2022", "https://ejournal.kemdikbud.go.id", "", true]
      ];
      for (var i = 0; i < epSeeds.length; i++) eduPublikasiSheet.appendRow(epSeeds[i]);
    }

    // 6. Edu PKB
    var eduPkbSheet = ss.getSheetByName("edu_pkb");
    if (eduPkbSheet.getLastRow() <= 1) {
      var pkbSeeds = [
        ["1", "Program Pendidikan Guru Penggerak", "Kemendikbudristek RI", "2022", "https://drive.google.com", "310", true],
        ["2", "Bimtek Implementasi Kurikulum Merdeka & Asesmen Autentik", "Dinas Pendidikan Kab. Tuban", "2023", "https://drive.google.com", "64", true],
        ["3", "Pelatihan Pemanfaatan AI & Teknologi Digital dalam Pembelajaran", "Balai Guru Penggerak Jawa Timur", "2024", "https://drive.google.com", "32", true]
      ];
      for (var i = 0; i < pkbSeeds.length; i++) eduPkbSheet.appendRow(pkbSeeds[i]);
    }

    // 7. Edu Prestasi
    var eduPrestasiSheet = ss.getSheetByName("edu_prestasi");
    if (eduPrestasiSheet.getLastRow() <= 1) {
      var edpSeeds = [
        ["1", "Juara 1 Lomba Inovasi Pembelajaran Guru SD", "Dinas Pendidikan Kab. Tuban", "2023", "Kabupaten", "https://drive.google.com", true],
        ["2", "Pendidik Berdedikasi dan Kreatif", "Gugus Sekolah Dasar Tuban", "2022", "Kecamatan", "https://drive.google.com", true]
      ];
      for (var i = 0; i < edpSeeds.length; i++) eduPrestasiSheet.appendRow(edpSeeds[i]);
    }

    // 8. Music Event
    var musicEventSheet = ss.getSheetByName("music_event");
    if (musicEventSheet.getLastRow() <= 1) {
      var meSeeds = [
        ["1", "Festival Lagu Nusantara & Pesta Seni Pendidik", "2024-05-18", "Gedung Graha Kencana", "Tuban", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", "Penampilan solo vocal membawakan medley lagu pop dan tembang nusantara aransemen akustik.", true],
        ["2", "Gala Dinner & Annual Celebration Soloist", "2024-02-14", "Grand Ballroom Hotel Aston", "Tuban", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80", "Solois utama membawakan repertoar lagu jazz dan pop akustik pengiring jamuan makan malam.", true],
        ["3", "Konser Amal & Nada Peduli Pendidikan", "2023-11-25", "Taman Budaya Pesisir", "Tuban", "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80", "Konser musik amal bersama musisi daerah penggalangan beasiswa siswa prasejahtera.", true]
      ];
      for (var i = 0; i < meSeeds.length; i++) musicEventSheet.appendRow(meSeeds[i]);
    }

    // 9. Music Gallery
    var musicGallerySheet = ss.getSheetByName("music_gallery");
    if (musicGallerySheet.getLastRow() <= 1) {
      var mgSeeds = [
        ["1", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", "Penampilan panggung solo vokal Festival Musik Nusantara", "1", true],
        ["2", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80", "Sesi rekaman audio dan take vocal di studio akustik", "2", true],
        ["3", "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80", "Apresiasi penonton setelah konser amal bertema pendidikan", "3", true]
      ];
      for (var i = 0; i < mgSeeds.length; i++) musicGallerySheet.appendRow(mgSeeds[i]);
    }

    // 10. Music Video
    var musicVideoSheet = ss.getSheetByName("music_video");
    if (musicVideoSheet.getLastRow() <= 1) {
      var mvSeeds = [
        ["1", "Santoso — Menghujam Jantung (Live Vocal Acoustic Cover)", "https://www.youtube.com/embed/dQw4w9WgXcQ", "YouTube", "2024", true],
        ["2", "Santoso — Medley Tembang Jawa & Pop Nusantara Akustik", "https://www.youtube.com/embed/dQw4w9WgXcQ", "YouTube", "2023", true]
      ];
      for (var i = 0; i < mvSeeds.length; i++) musicVideoSheet.appendRow(mvSeeds[i]);
    }

    // 11. Music Prestasi
    var musicPrestasiSheet = ss.getSheetByName("music_prestasi");
    if (musicPrestasiSheet.getLastRow() <= 1) {
      var mpSeeds = [
        ["1", "Juara 1 Lomba Solo Vokal Pop Pria Dewasa", "Dewan Kesenian Tuban", "2023", "Kabupaten", "https://drive.google.com", true],
        ["2", "Penyanyi Favorit Festival Musik Akustik Pesisir", "Komunitas Musisi Jawa Timur", "2022", "Provinsi", "https://drive.google.com", true]
      ];
      for (var i = 0; i < mpSeeds.length; i++) musicPrestasiSheet.appendRow(mpSeeds[i]);
    }

    // 12. Business List
    var businessListSheet = ss.getSheetByName("business_list");
    if (businessListSheet.getLastRow() <= 1) {
      var blSeeds = [
        ["1", "Santoso Wedding & MUA", "Kecantikan Elegan di Momen Terindah Anda", "Layanan Make Up Artist (MUA) profesional melayani rias pengantin adat Jawa paes modern, wisuda, siraman, dan makeup pesta dengan kosmetik premium tahan lama.", "MUA & Tata Rias", "https://instagram.com/santoso", "6281234567890", true],
        ["2", "Santoso Wardrobe & Kebaya Rental", "Koleksi Busana Pengantin, Kebaya & Gaun Elegan", "Penyewaan busana pengantin tradisional modern, kebaya wisuda kekinian, beskap adat Jawa, dan jas formal dengan kondisi sangat prima dan bersih.", "Persewaan Busana", "https://instagram.com/santoso", "6281234567890", true]
      ];
      for (var i = 0; i < blSeeds.length; i++) businessListSheet.appendRow(blSeeds[i]);
    }

    // 13. Business Gallery
    var businessGallerySheet = ss.getSheetByName("business_gallery");
    if (businessGallerySheet.getLastRow() <= 1) {
      var bgSeeds = [
        ["1", "1", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80", "Makeup pengantin muslimah modern flawless glowing", true],
        ["2", "1", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", "Tata rias paes ageng pengantin adat Jawa anggun", true],
        ["3", "2", "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80", "Koleksi kebaya brokat wisuda modern warna sage green", true]
      ];
      for (var i = 0; i < bgSeeds.length; i++) businessGallerySheet.appendRow(bgSeeds[i]);
    }

    // 14. Testimonials
    var testimonialsSheet = ss.getSheetByName("testimonials");
    if (testimonialsSheet.getLastRow() <= 1) {
      var tSeeds = [
        ["1", "1", "Dina & Rian (Pengantin)", "Pak Santoso sangat telaten dan sabar! Riasan pernikahanku tahan seharian dan hasilnya flawless natural, semua keluarga serta tamu memuji keanggunannya. Sangat puas!", "5", true],
        ["2", "1", "Siti Nurjanah, S.Kom. (Wisudawati)", "Make up wisuda Pak Santoso juara banget! Nggak dempul, foto hasilnya cantik banget dan nggak bikin jerawatan. Pasti rekomendasiin ke adik tingkat!", "5", true],
        ["3", "2", "Ibu Ratih (Panitia Acara Seni)", "Busana adat dan kebaya yang disewa bersih, wangi, dan jahitannya sangat rapi. Pelayanan ramah dan harga sangat bersahabat.", "5", true]
      ];
      for (var i = 0; i < tSeeds.length; i++) testimonialsSheet.appendRow(tSeeds[i]);
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
      for (var i = 0; i < achSeeds.length; i++) achievementsSheet.appendRow(achSeeds[i]);
    }

    SpreadsheetApp.flush();
    Logger.log("Setup database selesai! Spreadsheet: " + ss.getUrl());
    try {
      Browser.msgBox("Setup Selesai!", "Database Santoso Biopage berhasil diinisialisasi beserta seluruh data starter.\n\nLangkah berikutnya:\n1. Deploy sebagai Web App\n2. Salin URL /exec ke config.js", Browser.Buttons.OK);
    } catch (msgErr) {}
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

  // Urutkan terbaru dulu (berdasarkan id numerik)
  rows.sort(function(a, b) {
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
    "business_list", "testimonials", "achievements", "messages"
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
