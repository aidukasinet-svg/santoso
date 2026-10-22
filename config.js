/**
 * =========================================================================
 * KONFIGURASI GLOBAL FRONTEND - SANTOSO DIGITAL IDENTITY
 * =========================================================================
 * File: config.js
 */

const CONFIG = {
  // Bila di-deploy di Cloudflare Pages, gunakan '/api' (diteruskan via _worker.js)
  // Bila dibuka secara lokal (file://), masukkan URL langsung Google Apps Script Web App
  API_URL: window.location.protocol === 'file:'
    ? 'https://script.google.com/macros/s/AKfycbwBU6IumXIHOpIS_kw3bINs2HpIpn5dyqIWw8olQafiUS-LfNyYYY2xKnAZ1ajTE_sVsw/exec'
    : '/api',

  // Identitas Pemilik
  OWNER_NAME: "Santoso, S.Pd., M.Pd.",
  OWNER_SHORT: "Santoso",
  OWNER_TITLE: "Pendidik · Penyanyi · Entrepreneur",
  OWNER_SCHOOL: "UPT SDN Latsari 2 Bancar",
  OWNER_TAGLINE: "Satu nama. Banyak dunia.",
  OWNER_WHATSAPP: "6282230898376",
  OWNER_EMAIL: "santoso@gmail.com",
  OWNER_INSTAGRAM: "https://www.instagram.com/pak_sanlatsari2",
  OWNER_YOUTUBE: "https://www.youtube.com/@santosokece3010",

  // Admin
  ADMIN_USERNAME: "admin",

  // Spreadsheet
  SPREADSHEET_ID: "155Ixmb121EaJjoxUbw9nXNL-LUcctzAmj2WFsrFKkkU",
};

window.APP_CONFIG = CONFIG;
