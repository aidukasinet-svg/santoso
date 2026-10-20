# DESIGN SYSTEM — Santoso Digital Identity & Portfolio

---

## Design Read

> **"Reading this as: multi-persona creative professional portfolio for diverse Indonesian audiences (educators, event organizers, general public), with a warm-premium + authoritative language, leaning toward editorial identity design with purposeful domain-specific color coding."**

### Dial Settings
| Dial | Value | Reasoning |
|---|---|---|
| `DESIGN_VARIANCE` | **7** | Cukup ekspresif untuk personal brand, tidak lebay |
| `MOTION_INTENSITY` | **6** | Scroll reveals, hero animation — terasa hidup, tidak distraktif |
| `VISUAL_DENSITY` | **4** | Portofolio butuh ruang napas, tapi bukan art-gallery |

---

## 1. Brand Identity

### Konsep: Tiga Dunia, Satu Pribadi

Pak Santoso hidup di tiga ranah yang berbeda tapi saling menguatkan. Sistem warna mencerminkan ini dengan **warna netral sebagai fondasi** dan **tiga accent domain** yang muncul kontekstual sesuai halaman.

```
Pendidikan   →  Deep Navy     (kepercayaan, otoritas, intelektual)
Musik        →  Deep Crimson  (passion, panggung, emosi)
Usaha        →  Deep Forest   (pertumbuhan, profesional, kepercayaan bisnis)
```

**Domain accent TIDAK muncul bersamaan** — setiap halaman konsisten dalam 1 accent.

---

## 2. Color System

### 2.1 Base Palette (Seluruh Site)

```css
/* Foundation — Warm Off-White & Deep Charcoal */
--color-bg:            #F9F7F4;   /* warm off-white, bukan pure white */
--color-bg-subtle:     #F2EFE9;   /* section tints */
--color-surface:       #FFFFFF;   /* cards, modals */
--color-border:        #E4DED6;   /* hairline borders */
--color-text-primary:  #1C1A17;   /* warm near-black, bukan pitch black */
--color-text-secondary:#6B6560;   /* muted body text */
--color-text-muted:    #A09890;   /* captions, helpers */
```

### 2.2 Domain Accent Colors

```css
/* PENDIDIKAN — Deep Navy */
--accent-edu:          #1B3A6B;   /* primary */
--accent-edu-light:    #2D5AA0;   /* hover state */
--accent-edu-soft:     #EEF2F9;   /* soft bg, badges */
--accent-edu-border:   #C5D4ED;   /* border accent */

/* MUSIK — Deep Crimson */
--accent-music:        #7B1E2E;   /* primary */
--accent-music-light:  #A5263A;   /* hover state */
--accent-music-soft:   #F9EEEF;   /* soft bg, badges */
--accent-music-border: #E8BFBF;   /* border accent */

/* USAHA — Deep Forest */
--accent-biz:          #1E4A3A;   /* primary */
--accent-biz-light:    #2A6450;   /* hover state */
--accent-biz-soft:     #EEF5F2;   /* soft bg, badges */
--accent-biz-border:   #BCDDD3;   /* border accent */
```

### 2.3 Admin Dashboard Colors

```css
/* Admin menggunakan Slate palette — terasa tools/professional */
--admin-bg:            #0F172A;   /* dark sidebar */
--admin-surface:       #1E293B;   /* cards, panels */
--admin-surface-2:     #334155;   /* hover states */
--admin-border:        #475569;   /* dividers */
--admin-text:          #F1F5F9;   /* primary text */
--admin-text-muted:    #94A3B8;   /* muted */
--admin-accent:        #3B82F6;   /* blue CTA di admin */
--admin-success:       #22C55E;
--admin-warning:       #F59E0B;
--admin-error:         #EF4444;
```

### 2.4 Semantic Colors

```css
--color-success:       #166534;
--color-warning:       #92400E;
--color-error:         #991B1B;
--color-info:          #1E40AF;
```

---

## 3. Typography

### 3.1 Font Families

```css
/* Display / Headlines: Outfit — modern, warm, confident */
--font-display: 'Outfit', 'Cabinet Grotesk', sans-serif;

/* Accent / Quote: DM Serif Display — untuk kutipan & highlights saja */
/* Penggunaan TERBATAS: hanya di quote section dan 1-2 display callout */
--font-accent: 'DM Serif Display', serif;

/* Body: Outfit (same family, lighter weight) */
--font-body: 'Outfit', sans-serif;

/* Admin / Mono: JetBrains Mono */
--font-mono: 'JetBrains Mono', monospace;
```

**Import (self-hosted via next/font):**
```tsx
import { Outfit } from 'next/font/google';
import { DM_Serif_Display } from 'next/font/google';
```

### 3.2 Type Scale

```css
/* Display */
--text-display-xl:  clamp(3rem, 6vw, 5rem);    /* Hero H1 */
--text-display-lg:  clamp(2.25rem, 4vw, 3.5rem); /* Section H1 */
--text-display-md:  clamp(1.75rem, 3vw, 2.5rem); /* Sub-section H2 */

/* Heading */
--text-h3:          1.375rem;   /* 22px */
--text-h4:          1.125rem;   /* 18px */

/* Body */
--text-body-lg:     1.125rem;   /* 18px — intro paragraphs */
--text-body:        1rem;       /* 16px — standard body */
--text-body-sm:     0.875rem;   /* 14px — captions, helpers */

/* Labels */
--text-label:       0.75rem;    /* 12px — eyebrows, badges */
```

### 3.3 Type Weights

```css
--weight-light:    300;
--weight-regular:  400;
--weight-medium:   500;
--weight-semibold: 600;
--weight-bold:     700;
--weight-black:    900;  /* hanya untuk display impact */
```

### 3.4 Line Heights & Letter Spacing

```css
--leading-tight:   1.1;
--leading-snug:    1.25;
--leading-normal:  1.5;
--leading-relaxed: 1.7;

--tracking-tight:  -0.03em;   /* display headlines */
--tracking-normal: -0.01em;   /* body */
--tracking-wide:   0.08em;    /* eyebrow labels */
--tracking-widest: 0.15em;    /* ALL CAPS badges */
```

---

## 4. Spacing Scale

Based on 4px base unit:

```css
--space-1:   0.25rem;   /* 4px */
--space-2:   0.5rem;    /* 8px */
--space-3:   0.75rem;   /* 12px */
--space-4:   1rem;      /* 16px */
--space-5:   1.25rem;   /* 20px */
--space-6:   1.5rem;    /* 24px */
--space-8:   2rem;      /* 32px */
--space-10:  2.5rem;    /* 40px */
--space-12:  3rem;      /* 48px */
--space-16:  4rem;      /* 64px */
--space-20:  5rem;      /* 80px */
--space-24:  6rem;      /* 96px */
--space-32:  8rem;      /* 128px */
```

**Section padding:** `py-16 md:py-24` (min 64px, optimal 96px)  
**Container:** `max-w-[1280px] mx-auto px-4 md:px-8`

---

## 5. Border Radius Scale

**Satu skema untuk seluruh site (Shape Consistency Lock):**

```css
--radius-sm:   6px;    /* inputs, small badges */
--radius-md:   12px;   /* cards, content panels */
--radius-lg:   20px;   /* large cards, image frames */
--radius-xl:   28px;   /* feature hero tiles */
--radius-full: 9999px; /* pills, avatar bubbles */
```

**Buttons:** `border-radius: var(--radius-sm)` — bukan full pill  
**Cards:** `border-radius: var(--radius-md)` atau `--radius-lg`  
**Avatar:** `border-radius: var(--radius-full)`

---

## 6. Shadow System

```css
/* Tinted shadows — bukan black drop */
--shadow-sm:   0 1px 3px rgba(28, 26, 23, 0.08);
--shadow-md:   0 4px 16px rgba(28, 26, 23, 0.10);
--shadow-lg:   0 12px 40px rgba(28, 26, 23, 0.12);
--shadow-xl:   0 24px 64px rgba(28, 26, 23, 0.15);

/* Accent shadows — dipakai pada hover state tombol domain */
--shadow-edu:   0 8px 24px rgba(27, 58, 107, 0.25);
--shadow-music: 0 8px 24px rgba(123, 30, 46, 0.25);
--shadow-biz:   0 8px 24px rgba(30, 74, 58, 0.25);
```

---

## 7. Component Patterns

### 7.1 Navigation

```
Desktop: max-height 72px, single line
├── Left: Logo (inisial S dalam lingkaran + "Santoso")
├── Center: Nav links (Home | About | Portofolio | Prestasi | Kontak)
└── Right: CTA tombol "Hubungi" + [Admin icon jika logged in]

Mobile: hamburger menu, full-screen overlay
Scroll behavior: navbar menjadi frosted glass setelah 80px scroll
  backdrop-filter: blur(12px);
  background: rgba(249, 247, 244, 0.85);
```

### 7.2 Hero Section

```
Layout: Asymmetric split
├── Left (60%): Teks — Nama, gelar, identitas pills, CTA
└── Right (40%): Foto portrait Santoso (professional shot)

Background: Subtle warm off-white, tidak full-screen image
Headline: Outfit Black, display-xl, tracking-tight
Sub: 3 pills [Pendidik] [Penyanyi] [Entrepreneur] — color-coded per domain
CTA: Primary button + secondary ghost button
```

### 7.3 Buttons

**Primary Button (Domain-aware):**
```css
/* Di halaman pendidikan: */
.btn-primary {
  background: var(--accent-edu);
  color: #FFFFFF;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-sm);
  font-weight: var(--weight-semibold);
  font-size: var(--text-body);
  transition: background 200ms ease, transform 150ms ease, box-shadow 200ms ease;
}
.btn-primary:hover {
  background: var(--accent-edu-light);
  box-shadow: var(--shadow-edu);
}
.btn-primary:active {
  transform: translateY(1px) scale(0.99);
}
```

**Ghost Button:**
```css
.btn-ghost {
  background: transparent;
  border: 1.5px solid currentColor;
  color: var(--accent-active);  /* matches domain */
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-sm);
}
```

**Admin Button:**
```css
.btn-admin {
  background: var(--admin-accent);
  color: #FFFFFF;
  border-radius: var(--radius-sm);
}
```

### 7.4 Cards

**Content Card (Portfolio items):**
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 250ms ease, transform 250ms ease;
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

**Domain Accent Card (featured items):**
```css
.card-domain {
  border-left: 3px solid var(--accent-active);
  background: var(--accent-soft);
}
```

**Admin Data Row:**
```css
.admin-row {
  background: var(--admin-surface);
  border-bottom: 1px solid var(--admin-border);
  padding: var(--space-4) var(--space-6);
  display: grid;
  /* columns sesuai modul */
}
.admin-row:hover {
  background: var(--admin-surface-2);
}
```

### 7.5 Badges & Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-label);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

/* Domain badges */
.badge-edu   { background: var(--accent-edu-soft);   color: var(--accent-edu);   border: 1px solid var(--accent-edu-border); }
.badge-music { background: var(--accent-music-soft); color: var(--accent-music); border: 1px solid var(--accent-music-border); }
.badge-biz   { background: var(--accent-biz-soft);   color: var(--accent-biz);   border: 1px solid var(--accent-biz-border); }

/* Status badges (admin) */
.badge-active   { background: #DCFCE7; color: #166534; }
.badge-inactive { background: #F1F5F9; color: #64748B; }
```

### 7.6 Form Inputs

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-body);
  color: var(--color-text-primary);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.input::placeholder {
  color: var(--color-text-muted);
}
.input:focus {
  outline: none;
  border-color: var(--accent-active);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-active) 15%, transparent);
}
.input-error {
  border-color: var(--color-error);
}
.error-text {
  color: var(--color-error);
  font-size: var(--text-body-sm);
  margin-top: var(--space-1);
}
```

### 7.7 Timeline Component

```
Vertikal timeline dengan:
├── Garis vertikal (1px border di tengah)
├── Per node: titik bulat (warna domain) + tahun + judul + deskripsi
├── Alternating: kiri-kanan di desktop, kiri saja di mobile
└── Hover: node melebar, shadow muncul
```

---

## 8. Admin Dashboard Design

### 8.1 Layout Admin

```
[SIDEBAR — fixed, 280px]
  Logo "Admin Santoso"
  Navigation:
  ├── Dashboard
  ├── Profil & Timeline
  ├── Pendidikan  (dengan submenu)
  ├── Musik       (dengan submenu)
  ├── Usaha       (dengan submenu)
  ├── Prestasi
  ├── Pesan Masuk (badge count)
  └── Pengaturan
  [Bottom] Avatar + Nama + Logout

[MAIN CONTENT — fluid]
  ├── Top bar: breadcrumb + username + notif
  └── Page content
```

### 8.2 Admin Dark Theme Rationale

Admin area menggunakan dark theme (`--admin-*` palette) untuk:
1. Kontras visual yang jelas — admin tidak bisa salah masuk public area
2. Terasa seperti tool profesional
3. Mengurangi eye strain saat sesi kerja panjang

---

## 9. Motion System

### 9.1 Principles

```
1. Motion bercerita — setiap animasi punya tujuan
2. Entrance: scroll-triggered, sekali saja (viewport once: true)
3. Hover: feedback fisik yang halus
4. Tidak ada infinite loop pada konten statis
```

### 9.2 Standard Transitions

```tsx
// Scroll reveal — standar untuk section items
const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// Stagger untuk grid items
const containerVariants = {
  visible: { transition: { staggerChildren: 0.08 } }
};

// Hero entrance
const heroVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
  }
};

// Card hover
// Implementasi via CSS transition (translateY + shadow)
// Bukan JS motion untuk performa
```

### 9.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// Di setiap animated component:
const shouldReduce = useReducedMotion();
initial={shouldReduce ? false : 'hidden'}
```

---

## 10. Responsive Breakpoints

```css
/* Mobile-first */
--bp-sm:  640px;
--bp-md:  768px;
--bp-lg:  1024px;
--bp-xl:  1280px;
--bp-2xl: 1536px;
```

### Grid Patterns per Section

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Tiga Dunia | 1 col | 1 col | 3 col |
| Portfolio grid | 1 col | 2 col | 3 col |
| Gallery | 2 col | 3 col | 4 col |
| Prestasi | 1 col | 2 col | 3 col |
| Admin Table | scroll-x | scroll-x | full |
| Admin Sidebar | bottom nav | overlay | fixed sidebar |

---

## 11. Imagery Guidelines

### Foto Santoso
- Hero: portrait professional, lighting bagus, ekspresi percaya diri
- Musik: foto panggung, high energy — bisa blur motion yang dramatis
- Pendidikan: foto interaksi dengan siswa, natural
- Usaha: foto profesional / behind-the-scenes usaha

### Foto Placeholder (sebelum foto asli tersedia)
```
https://picsum.photos/seed/santoso-hero/1200/800
https://picsum.photos/seed/santoso-stage/800/600
https://picsum.photos/seed/santoso-class/800/600
```

---

## 12. Icon System

**Library:** `@phosphor-icons/react`  
**Stroke weight:** regular (default)  
**Size:** 24px default, 20px untuk inline, 32px untuk feature icons

```tsx
import { GraduationCap, Microphone, Briefcase, Star, Envelope } from '@phosphor-icons/react';
```

**Domain icons:**
- Pendidikan: `GraduationCap`, `BookOpen`, `Certificate`
- Musik: `Microphone`, `MusicNote`, `Star`
- Usaha: `Briefcase`, `Handshake`, `TrendUp`
- Admin: `Gear`, `PencilSimple`, `Trash`, `Eye`, `SignOut`

---

## 13. Tone of Voice

**Visitor-facing copy:**
- Bahasa Indonesia yang hangat, percaya diri, tidak formal kaku
- Personal tapi profesional
- Kalimat pendek, langsung ke inti

**Admin UI copy:**
- Singkat, action-oriented
- Contoh: "Tambah Karya" bukan "Klik untuk menambahkan karya baru"
- Label form langsung: "Judul", "Tahun", "Bukti (URL)"

---

*Design system ini adalah living document. Update seiring refinement desain.*
