# Panduan: Hero Headline vs Bio

## 🎯 Masalah yang Diperbaiki

Sebelumnya, teks **"Crafting Digital Experiences That Inspire"** di Hero Section (Home paling atas) itu **hardcoded** dan tidak bisa diubah dari admin panel.

Sekarang sudah diperbaiki! Anda bisa mengelola headline ini secara terpisah dari bio.

---

## 📍 Lokasi Pengaturan

**Semua dikelola di:** `Home Section → Profile` (`/admin/profile`)

Tapi sekarang ada **3 field terpisah**:

### 1. **Title / Role**
- Contoh: "QA Engineer", "Full Stack Developer"
- Ditampilkan di:
  - ✅ Hero Section (badge di atas headline)
  - ✅ Hero Section (di nametag card)
  - ✅ About Section (judul)

### 2. **Hero Headline** ⭐ BARU!
- Contoh: "Crafting Digital Experiences That Inspire"
- Ditampilkan di:
  - ✅ Hero Section (headline besar di tengah)
  - ❌ TIDAK ditampilkan di About Section

### 3. **Bio / About Me**
- Contoh: "Use words like passionate, raising the bar..."
- Ditampilkan di:
  - ✅ Hero Section (teks di bawah headline - versi singkat)
  - ✅ About Section (deskripsi lengkap - versi panjang)

---

## 🏠 Struktur Hero Section (Home)

```
┌─────────────────────────────────────────────────────┐
│                  HERO SECTION                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│   [🎯 QA Engineer]  ← Title (badge)                │
│                                                      │
│   Crafting Digital                                  │
│   Experiences        ← Hero Headline (BARU!)       │
│   That Inspire                                      │
│                                                      │
│   Use words like "passionate,"                      │
│   "raising the bar"...  ← Bio (singkat)            │
│                                                      │
│   [View Projects] [Download CV]                     │
│                                                      │
│   ┌──────────────┐                                  │
│   │   [FOTO]     │  ← Profile Image                │
│   │   QA Eng.    │  ← Title (di card)              │
│   │   [Skills]   │                                  │
│   └──────────────┘                                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📖 Struktur About Section

```
┌─────────────────────────────────────────────────────┐
│                 ABOUT SECTION                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│              About Me                                │
│       QA Engineer & Problem Solver  ← Title         │
│                                                      │
│   Use words like "passionate,"                      │
│   "raising the bar," "creating                      │
│   solutions," "building trust,"                     │
│   and "transforming challenges."    ← Bio (panjang) │
│                                                      │
│   📧 email@example.com                              │
│   📍 Karawang                                       │
│                                                      │
│   Skills & Expertise:                               │
│   Selenium      90% ████████████░░                  │
│   SQL           90% ████████████░░                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Catatan:** Hero Headline **TIDAK** ditampilkan di About Section!

---

## ✏️ Cara Mengisi di Admin

### Buka `/admin/profile`

```
┌─────────────────────────────────────────────────────┐
│                  PROFILE FORM                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Title / Role:                                      │
│  [QA Engineer & Problem Solver]                     │
│  ℹ️ Displayed in Hero Section and About Section     │
│                                                      │
│  Hero Headline:  ⭐ FIELD BARU!                     │
│  [Crafting Digital                                  │
│   Experiences                                       │
│   That Inspire]                                     │
│  ℹ️ Main headline text displayed in Hero Section    │
│     Use line breaks for multi-line headlines        │
│                                                      │
│  Bio / About Me:                                    │
│  [Use words like "passionate," "raising the bar,"   │
│   "creating solutions," "building trust," and       │
│   "transforming challenges." I am a dedicated QA    │
│   Engineer with extensive experience...]           │
│  ℹ️ Short version for Hero, long version for About  │
│                                                      │
│  Profile Image:                                     │
│  [Choose File]                                      │
│                                                      │
│  Resume URL:                                        │
│  [/uploads/resume.pdf]                              │
│                                                      │
│  [💾 Save Profile]                                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 💡 Tips Pengisian

### 1. Title / Role
- **Singkat dan jelas**
- Contoh yang baik:
  - ✅ "QA Engineer"
  - ✅ "Full Stack Developer"
  - ✅ "UI/UX Designer & Developer"
- Contoh yang kurang baik:
  - ❌ "I am a QA Engineer who loves testing" (terlalu panjang)

### 2. Hero Headline ⭐
- **Inspiratif dan menarik perhatian**
- **Bisa multi-line** (tekan Enter untuk baris baru)
- Kata terakhir di setiap baris akan otomatis diberi gradient warna
- Contoh yang baik:
  ```
  Crafting Digital
  Experiences
  That Inspire
  ```
  ```
  Building Quality
  Software
  Solutions
  ```
  ```
  Transforming Ideas
  Into Reality
  ```
- Tips:
  - Gunakan 2-4 baris
  - Kata terakhir biasanya kata kunci (Inspire, Solutions, Reality)
  - Hindari terlalu panjang (max 5-6 kata per baris)

### 3. Bio / About Me
- **Dua versi dalam satu field:**
  
  **Untuk Hero (singkat):**
  - 1-2 kalimat pertama
  - Langsung to the point
  - Contoh: "Passionate QA Engineer with 5+ years experience in automation testing."
  
  **Untuk About (panjang):**
  - Lanjutkan dengan paragraf lengkap
  - Cerita detail tentang Anda
  - Contoh: "Use words like 'passionate,' 'raising the bar,' 'creating solutions,' 'building trust,' and 'transforming challenges.' I specialize in..."

---

## 📊 Perbandingan Field

| Field | Hero Section | About Section | Panjang |
|-------|--------------|---------------|---------|
| **Title** | ✅ Badge + Card | ✅ Judul | Singkat |
| **Headline** | ✅ Headline besar | ❌ Tidak tampil | 2-4 baris |
| **Bio** | ✅ Teks singkat | ✅ Deskripsi lengkap | Fleksibel |

---

## 🎯 Contoh Pengisian Lengkap

### Untuk QA Engineer

```
Title / Role:
QA Engineer & Problem Solver

Hero Headline:
Crafting Quality
Software
Solutions

Bio / About Me:
Passionate QA Engineer with 5+ years experience in automation testing.

Use words like "passionate," "raising the bar," "creating solutions," 
"building trust," and "transforming challenges." I am a dedicated QA 
Engineer with extensive experience in test automation, API testing, 
and quality assurance processes. I specialize in creating robust test 
frameworks using Selenium, Cypress, and SOAP UI that ensure software 
reliability and performance.

With a strong background in both manual and automated testing, I help 
teams deliver high-quality software products. My expertise includes 
SQL database testing, JavaScript-based automation, and continuous 
integration pipelines.
```

### Untuk Full Stack Developer

```
Title / Role:
Full Stack Developer

Hero Headline:
Building Modern
Web Applications
That Scale

Bio / About Me:
Full Stack Developer specializing in React, Node.js, and cloud technologies.

I'm passionate about creating scalable web applications that solve real 
business problems. With expertise in both frontend and backend development, 
I build end-to-end solutions using modern technologies like React, TypeScript, 
Node.js, and PostgreSQL.

My approach combines clean code principles with user-centric design, ensuring 
that every application I build is not only functional but also delightful to use.
```

---

## 🔄 Alur Data

```
Admin Profile Form
├─ Title → Hero (badge + card) + About (judul)
├─ Headline → Hero (headline besar) ONLY
└─ Bio → Hero (singkat) + About (panjang)
```

---

## ✅ Checklist

Untuk Hero Section yang lengkap:

- [ ] Isi **Title** (singkat, jelas)
- [ ] Isi **Hero Headline** (inspiratif, 2-4 baris)
- [ ] Isi **Bio** (singkat untuk Hero, panjang untuk About)
- [ ] Upload **Profile Image**
- [ ] Upload atau isi **Resume URL**

---

## 🚨 Penting!

1. **Hero Headline** dan **Bio** itu **BERBEDA**:
   - Headline = Judul besar yang menarik perhatian
   - Bio = Deskripsi tentang Anda

2. **Bio digunakan di 2 tempat**:
   - Hero: Hanya 1-2 kalimat pertama yang ditampilkan
   - About: Semua teks ditampilkan

3. **Headline hanya di Hero**:
   - Tidak ditampilkan di About Section
   - Fokus pada kata-kata inspiratif

---

## 📞 Ringkasan

| Data | Tampil di | Contoh |
|------|-----------|--------|
| **Title** | Hero + About | "QA Engineer" |
| **Headline** | Hero ONLY | "Crafting Digital Experiences That Inspire" |
| **Bio** | Hero (singkat) + About (panjang) | "Passionate developer..." |

---

**Sekarang Hero Headline terpisah dan bisa dikelola! 🎉**

Anda bisa mengubah headline sesuai keinginan tanpa mengubah bio Anda.
