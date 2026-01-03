# 📝 PANDUAN ADMIN TESTIMONIALS

## ✅ Update Terbaru

Menu **Testimonials** sudah ditambahkan ke sidebar admin!

---

## 🎯 Cara Mengisi Testimonials di Admin

### Step 1: Login ke Admin Panel

```
URL: http://localhost:8080/admin/login
Email: admin@portfolio.com
Password: admin123
```

### Step 2: Buka Menu Testimonials

Di **sidebar kiri**, klik menu **"Testimonials"** (icon 💬)

```
Sidebar Menu:
├─ 📊 Dashboard
├─ 🏠 Home
├─ 👨 About
├─ ⏰ Experience
├─ 📁 Projects
├─ 💬 Testimonials  ← KLIK DI SINI!
├─ 📞 Contact
├─ 📝 Blog
├─ 👥 Newsletter
└─ ⚙️  Settings
```

**URL:** `http://localhost:8080/admin/testimonials`

### Step 3: Create Testimonial

1. Klik tombol **"New Testimonial"**

2. Isi form:
   ```
   Name: John Doe
   Position: CEO
   Company: Tech Corp
   
   Link to Project: [Pilih project dari dropdown]
   ↓
   - No Project (untuk testimonial umum)
   - E-Commerce Platform
   - Portfolio Website
   - Task Management App
   - ... (list projects Anda)
   
   Testimonial Content: "Excellent work! Highly recommended."
   
   Avatar Image: [Upload foto] (optional)
   
   Rating: 5 Stars
   Order: 0
   Featured: ☐ (checkbox)
   ```

3. Klik **"Create Testimonial"**

4. ✅ Testimonial berhasil dibuat!

### Step 4: Verify

Lihat testimonial card di list:
- Nama, position, company ditampilkan
- Rating stars ditampilkan
- Content ditampilkan
- Badge **"Linked to: [Project Name]"** muncul (jika di-link ke project)

---

## 📊 Struktur Menu Admin

```
┌─────────────────────────────────────┐
│  Portfolio Admin Panel              │
├─────────────────────────────────────┤
│                                     │
│  📊 Dashboard                       │
│  🏠 Home                            │
│  👨 About                           │
│  ⏰ Experience                      │
│  📁 Projects                        │
│  💬 Testimonials  ← BARU!           │
│  📞 Contact                         │
│  📝 Blog                            │
│  👥 Newsletter                      │
│  ⚙️  Settings                       │
│                                     │
│  🚪 Logout                          │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎨 Tampilan Frontend

### Struktur Portfolio (Horizontal Slider)

Portfolio Anda menggunakan **horizontal slider** (swipe kiri-kanan):

```
[Home] → [About] → [Experience] → [Projects] → [Contact]
```

### Cara Lihat Testimonials di Frontend

1. **Buka Homepage:** `http://localhost:8080`

2. **Navigate ke Projects Section:**
   - **Desktop:** Klik "Projects" di navigation bar ATAU tekan arrow right 3x
   - **Mobile:** Swipe kiri 3x
   - **Keyboard:** Tekan arrow right 3x

3. **Klik tombol "Reviews"** di project card

4. **Popup Testimonials Muncul:**
   ```
   ┌─────────────────────────────────────┐
   │  Testimonials                    [X]│
   │  E-Commerce Platform                │
   ├─────────────────────────────────────┤
   │                                     │
   │  ⭐⭐⭐⭐⭐                          │
   │                                     │
   │  "Excellent work! The platform is   │
   │   fast, secure, and user-friendly." │
   │                                     │
   │  ─────────────────────────────      │
   │  👤 John Doe                        │
   │     CEO at Tech Corp                │
   │                                     │
   │  ◀  1 / 3  ▶                       │
   │                                     │
   └─────────────────────────────────────┘
   ```

---

## ❓ FAQ

### Q: Kenapa popup muncul di home?

**A:** Popup **TIDAK** muncul di home. Popup muncul di tengah layar (viewport) dengan backdrop blur. 

**Cara benar untuk lihat popup:**
1. Navigate dulu ke **Projects section** (swipe kiri 3x atau klik Projects di nav)
2. Baru klik tombol **"Reviews"** di project card
3. Popup akan muncul di tengah layar

**Catatan:** Karena portfolio menggunakan horizontal slider, Anda harus berada di section Projects dulu sebelum klik Reviews.

---

### Q: Popup tidak muncul?

**Troubleshooting:**
1. Pastikan sudah di **Projects section** (bukan Home section)
2. Pastikan testimonial sudah di-link ke project tersebut
3. Check console browser untuk errors (F12)
4. Pastikan migration sudah dijalankan

---

### Q: Testimonials tidak muncul di popup?

**Troubleshooting:**
1. Pastikan testimonial sudah di-link ke project yang benar
2. Check di admin: badge "Linked to: [Project]" harus muncul
3. Verify di database: `project_id` harus terisi
4. Check API response di Network tab (F12)

---

### Q: Bagaimana cara unlink testimonial dari project?

**A:** 
1. Edit testimonial di admin
2. Ubah dropdown "Link to Project" ke **"No Project"**
3. Save
4. Testimonial tidak akan muncul di Reviews popup manapun

---

## 🎯 Use Cases

### 1. Testimonial untuk Project Tertentu

**Scenario:** Client memberikan review untuk project "E-Commerce Platform"

**Steps:**
1. Create testimonial
2. Pilih "E-Commerce Platform" dari dropdown
3. Save
4. Testimonial muncul di Reviews popup project E-Commerce Platform

---

### 2. Testimonial Umum (General)

**Scenario:** Client memberikan review umum (tidak spesifik ke project)

**Steps:**
1. Create testimonial
2. Pilih "No Project" dari dropdown
3. Save
4. Testimonial tidak muncul di Reviews popup (bisa digunakan untuk section lain)

---

### 3. Multiple Testimonials untuk 1 Project

**Scenario:** 1 project punya 3 testimonials

**Steps:**
1. Create 3 testimonials
2. Link semua ke project yang sama
3. Save
4. Di frontend: popup menampilkan 3 testimonials dengan navigation prev/next

---

## ✅ Checklist

### Admin Panel:
- [x] Menu Testimonials ada di sidebar
- [x] URL `/admin/testimonials` berfungsi
- [x] Bisa create testimonial
- [x] Dropdown "Link to Project" muncul
- [x] Bisa link testimonial ke project
- [x] Badge "Linked to: [Project]" muncul

### Frontend:
- [ ] Navigate ke Projects section
- [ ] Tombol "Reviews" muncul di project cards
- [ ] Klik Reviews → popup muncul
- [ ] Testimonials ditampilkan dengan benar
- [ ] Navigation prev/next berfungsi

---

## 🚀 Quick Start

```bash
# 1. Jalankan migration (jika belum)
cd backend
node src/database/migrate-project-testimonials.js

# 2. Start backend
npm start

# 3. Start frontend (terminal baru)
cd porto
npm run dev

# 4. Test
# - Login: http://localhost:8080/admin/login
# - Testimonials: http://localhost:8080/admin/testimonials
# - Create testimonial dengan project link
# - Frontend: Navigate ke Projects → klik Reviews
```

---

## 📝 Summary

**Admin:**
- ✅ Menu Testimonials di sidebar
- ✅ URL: `/admin/testimonials`
- ✅ Create/Edit testimonials dengan project link

**Frontend:**
- ✅ Navigate ke Projects section (swipe/arrow/click)
- ✅ Klik "Reviews" button
- ✅ Popup muncul di tengah layar
- ✅ Testimonials ditampilkan per project

**Status: COMPLETE ✅**

