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
    ? 'PASTE_YOUR_GAS_URL_HERE'
    : '/api',

  // Identitas Pemilik
  OWNER_NAME: "Santoso, S.Pd., M.Pd.",
  OWNER_SHORT: "Santoso",
  OWNER_TITLE: "Pendidik · Penyanyi · Entrepreneur",
  OWNER_SCHOOL: "SD Negeri — Tuban",
  OWNER_TAGLINE: "Satu nama. Banyak dunia.",
  OWNER_WHATSAPP: "6281234567890", // Ganti dengan nomor WA Pak Santoso
  OWNER_EMAIL: "santoso@gmail.com",    // Ganti dengan email Pak Santoso
  OWNER_INSTAGRAM: "https://instagram.com/santoso", // Ganti

  // Admin
  ADMIN_USERNAME: "admin",

  // Spreadsheet
  SPREADSHEET_ID: "155Ixmb121EaJjoxUbw9nXNL-LUcctzAmj2WFsrFKkkU",
};

window.APP_CONFIG = CONFIG;
