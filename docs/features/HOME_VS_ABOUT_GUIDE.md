# Panduan: Home Section vs About Section

## 🏠 HOME SECTION (Paling Atas)

### Tampilan di Homepage
```
┌─────────────────────────────────────────────────────┐
│                    HOME SECTION                      │
│                   (Hero/Landing)                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────────────┐                                  │
│   │              │    Hi, I'm John Doe              │
│   │   [FOTO]     │    QA Engineer                   │
│   │   PROFIL     │                                  │
│   │              │    Short bio here...             │
│   └──────────────┘                                  │
│                      [React] [Node.js] [SQL]        │
│                      [Download CV] [Contact]        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 📂 Dikelola di Admin
**Lokasi:** `Home Section → Profile`  
**URL:** `http://localhost:8080/admin/profile`

### 📝 Field yang Bisa Diisi
1. **Title** - Jabatan/posisi Anda (contoh: "QA Engineer", "Full Stack Developer")
2. **Bio** - Deskripsi singkat tentang Anda (1-2 kalimat)
3. **Profile Image** - Upload foto profil Anda
4. **Resume URL** - Link atau upload file CV

### 💡 Karakteristik
- ✅ Tampil di **paling atas** homepage
- ✅ Foto profil **besar**
- ✅ Bio **singkat** (1-2 kalimat)
- ✅ Menampilkan **top 3 skills** sebagai badges
- ✅ Tombol Download CV dan Contact

---

## 📖 ABOUT SECTION (Scroll ke Bawah)

### Tampilan di Homepage
```
┌─────────────────────────────────────────────────────┐
│                   ABOUT SECTION                      │
│              (Setelah scroll ke bawah)              │
├─────────────────────────────────────────────────────┤
│                                                      │
│                    About Me                          │
│         QA Engineer & Problem Solver                │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────┐   │
│  │  BIO PANJANG     │  │  Skills & Expertise  │   │
│  │                  │  │                      │   │
│  │  Use words like  │  │  Selenium      90%   │   │
│  │  "passionate,"   │  │  ████████████░░      │   │
│  │  "raising the    │  │                      │   │
│  │  bar"...         │  │  SQL           90%   │   │
│  │                  │  │  ████████████░░      │   │
│  │  📍 Karawang     │  │                      │   │
│  │  📧 email@...    │  │  JavaScript    90%   │   │
│  │                  │  │  ████████████░░      │   │
│  └──────────────────┘  └──────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 📂 Dikelola di Admin (3 Tempat Berbeda!)

#### 1. Title & Bio Panjang
**Lokasi:** `Home Section → Profile`  
**URL:** `http://localhost:8080/admin/profile`

**Field:**
- **Title** - Sama dengan yang di Home (contoh: "QA Engineer & Problem Solver")
- **Bio** - Deskripsi **panjang** tentang Anda (beberapa paragraf)

#### 2. Email & Location
**Lokasi:** `Contact Section → Contact Info`  
**URL:** `http://localhost:8080/admin/contact`

**Field:**
- **Email** - Email Anda (contoh: zogi.ani.sulvahmi@gmail.com)
- **Location** - Lokasi Anda (contoh: Karawang)

#### 3. Skills dengan Progress Bar
**Lokasi:** `About Section → Skills`  
**URL:** `http://localhost:8080/admin/skills`

**Field untuk setiap skill:**
- **Name** - Nama skill (contoh: Selenium, SQL, JavaScript)
- **Level** - Tingkat keahlian 0-100% (contoh: 90%)
- **Category** - Kategori skill (contoh: Testing, Programming)

### 💡 Karakteristik
- ✅ Tampil **setelah scroll** ke bawah
- ✅ **Tidak ada** foto profil
- ✅ Bio **panjang** (beberapa paragraf)
- ✅ Menampilkan **semua skills** dengan progress bar animasi
- ✅ Menampilkan email dan location dari Contact Info

---

## 🔄 Alur Data

### Home Section (Hero)
```
Admin Profile → Database → Home Section (Atas)
├─ Title
├─ Bio Singkat
├─ Profile Image
└─ Top 3 Skills (badges)
```

### About Section
```
Admin Profile → Database ─┐
                          ├─→ About Section (Bawah)
Contact Info → Database ──┤   ├─ Title
                          │   ├─ Bio Panjang
Skills → Database ────────┘   ├─ Email & Location
                              └─ All Skills (progress bars)
```

---

## 📊 Perbandingan

| Aspek | Home Section | About Section |
|-------|--------------|---------------|
| **Posisi** | Paling atas | Setelah scroll |
| **Foto** | ✅ Ada (besar) | ❌ Tidak ada |
| **Bio** | Singkat (1-2 kalimat) | Panjang (paragraf) |
| **Skills** | Top 3 (badges) | Semua (progress bars) |
| **Email/Location** | ❌ Tidak tampil | ✅ Tampil |
| **Admin Page** | `/admin/profile` | `/admin/profile` + `/admin/contact` + `/admin/skills` |

---

## ✅ Checklist Pengisian

### Untuk Home Section
- [ ] Isi Title di `/admin/profile`
- [ ] Isi Bio **singkat** di `/admin/profile`
- [ ] Upload Profile Image di `/admin/profile`
- [ ] Upload CV di `/admin/cv`

### Untuk About Section
- [ ] Isi Title di `/admin/profile` (sama dengan Home)
- [ ] Isi Bio **panjang** di `/admin/profile`
- [ ] Isi Email di `/admin/contact`
- [ ] Isi Location di `/admin/contact`
- [ ] Tambah Skills di `/admin/skills` dengan level (%)

---

## 💡 Tips Pengisian

### Title
- **Home & About menggunakan title yang sama**
- Contoh: "QA Engineer", "Full Stack Developer", "UI/UX Designer"

### Bio
- **Home**: Singkat, 1-2 kalimat, langsung to the point
  - Contoh: "Passionate QA Engineer with 5+ years experience in automation testing."
  
- **About**: Panjang, beberapa paragraf, cerita lengkap
  - Contoh: "Use words like 'passionate,' 'raising the bar,' 'creating solutions,' 'building trust,' and 'transforming challenges.' I specialize in..."

### Skills
- Tambahkan **semua skills** yang Anda kuasai
- Set level realistis (0-100%)
- Contoh:
  - Selenium: 90%
  - SQL: 90%
  - JavaScript: 90%
  - Cypress: 90%
  - SOAP UI: 85%

---

## 🎯 Contoh Pengisian

### Di `/admin/profile`
```
Title: QA Engineer & Problem Solver

Bio (untuk About Section - panjang):
Use words like "passionate," "raising the bar," "creating solutions," 
"building trust," and "transforming challenges." I am a dedicated QA 
Engineer with extensive experience in test automation, API testing, 
and quality assurance processes. I specialize in creating robust test 
frameworks that ensure software reliability and performance.
```

### Di `/admin/contact`
```
Email: zogi.ani.sulvahmi@gmail.com
Location: Karawang
Phone: +62 812 3456 7890
```

### Di `/admin/skills`
```
Skill 1:
- Name: Selenium
- Level: 90
- Category: Test Automation

Skill 2:
- Name: SQL
- Level: 90
- Category: Database

Skill 3:
- Name: JavaScript
- Level: 90
- Category: Programming

Skill 4:
- Name: Cypress
- Level: 90
- Category: Test Automation

Skill 5:
- Name: SOAP UI
- Level: 85
- Category: API Testing
```

---

## 🚨 Penting!

1. **Title** di Profile akan muncul di **Home DAN About**
2. **Bio** di Profile:
   - Jika singkat → cocok untuk Home
   - Jika panjang → cocok untuk About
   - **Gunakan bio panjang** agar About Section informatif
3. **Skills** di About Section diambil dari `/admin/skills` (bukan dari Profile)
4. **Email & Location** di About Section diambil dari `/admin/contact`

---

## 📞 Ringkasan Lokasi

| Data | Tampil di | Dikelola di | URL |
|------|-----------|-------------|-----|
| Title | Home + About | Home Section → Profile | `/admin/profile` |
| Bio Singkat | Home | Home Section → Profile | `/admin/profile` |
| Bio Panjang | About | Home Section → Profile | `/admin/profile` |
| Profile Image | Home | Home Section → Profile | `/admin/profile` |
| Email | About | Contact Section → Contact Info | `/admin/contact` |
| Location | About | Contact Section → Contact Info | `/admin/contact` |
| Skills (badges) | Home | About Section → Skills | `/admin/skills` |
| Skills (progress) | About | About Section → Skills | `/admin/skills` |

---

**Sekarang Anda tahu perbedaannya! 🎉**

**Home Section** = Kesan pertama (singkat, dengan foto)  
**About Section** = Cerita lengkap (detail, dengan skills)
