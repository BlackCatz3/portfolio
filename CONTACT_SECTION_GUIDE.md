# Panduan Mengelola Contact Section

## 📍 Lokasi di Frontend
Bagian Contact Section ditampilkan di homepage portfolio Anda di bagian paling bawah (sebelum footer).

## 🎯 Cara Mengelola di Admin Panel

Bagian Contact Section terdiri dari beberapa komponen yang dikelola di tempat berbeda di admin panel:

### 1. **Contact Info** (Email, Location, Phone)
📂 **Lokasi Admin**: `Contact Section → Contact Info`  
🔗 **URL**: `http://localhost:8080/admin/contact`

**Yang bisa dikelola:**
- Email address
- Phone number
- Location/Address

**Contoh:**
```
Email: hello@portfolio.dev
Location: Jakarta, Indonesia
Phone: +62 812 3456 7890
```

---

### 2. **Social Links** (GitHub, LinkedIn, Twitter)
📂 **Lokasi Admin**: `Contact Section → Social Links`  
🔗 **URL**: `http://localhost:8080/admin/social-links`

**Yang bisa dikelola:**
- LinkedIn URL
- GitHub URL
- Twitter URL

**Contoh:**
```
LinkedIn: https://linkedin.com/in/yourprofile
GitHub: https://github.com/yourusername
Twitter: https://twitter.com/yourhandle
```

**Catatan:** Social links hanya akan ditampilkan jika URL-nya diisi. Jika kosong, icon tidak akan muncul.

---

### 3. **Contact Form Messages**
📂 **Lokasi Admin**: `Contact Section → Messages`  
🔗 **URL**: `http://localhost:8080/admin/messages`

**Fungsi:**
- Melihat semua pesan yang dikirim pengunjung melalui contact form
- Menandai pesan sebagai "read" atau "unread"
- Menghapus pesan
- Melihat statistik (total messages, unread, read)

**Form Fields yang dikirim pengunjung:**
- Name
- Email
- Message

---

### 4. **Download CV Button**
📂 **Lokasi Admin**: `Home Section → CV/Resume`  
🔗 **URL**: `http://localhost:8080/admin/cv`

**Yang bisa dikelola:**
- Upload file PDF CV/Resume
- Atau masukkan URL link ke CV online

**Cara kerja:**
- Jika Anda upload file PDF, tombol "Download CV" akan mendownload file tersebut
- Jika Anda masukkan URL, tombol akan membuka link di tab baru

---

## 📋 Struktur Contact Section di Homepage

```
┌─────────────────────────────────────────────────────┐
│                  CONTACT SECTION                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Let's Work Together                                │
│  Have a project in mind? I'd love to hear about it  │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────┐   │
│  │  CONTACT FORM    │  │   CONTACT INFO       │   │
│  │  - Name          │  │   📧 Email           │   │
│  │  - Email         │  │   📍 Location        │   │
│  │  - Message       │  │   📞 Phone           │   │
│  │  [Send Message]  │  │                      │   │
│  │                  │  │   Social Links:      │   │
│  │                  │  │   [GitHub] [LinkedIn]│   │
│  │                  │  │   [Twitter]          │   │
│  │                  │  │                      │   │
│  │                  │  │   Looking for dev?   │   │
│  │                  │  │   [Download CV]      │   │
│  └──────────────────┘  └──────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Alur Data

1. **Pengunjung mengisi form** → Data tersimpan di database → **Admin bisa lihat di Messages**
2. **Admin update Contact Info** → Data tersimpan di database → **Langsung tampil di homepage**
3. **Admin update Social Links** → Data tersimpan di database → **Icon langsung tampil di homepage**
4. **Admin upload CV** → File tersimpan di server → **Tombol Download CV aktif**

---

## ✅ Checklist Pengisian

Untuk Contact Section yang lengkap, pastikan Anda sudah mengisi:

- [ ] Email di Contact Info
- [ ] Phone di Contact Info
- [ ] Location di Contact Info
- [ ] LinkedIn URL di Social Links
- [ ] GitHub URL di Social Links
- [ ] Twitter URL di Social Links (opsional)
- [ ] Upload CV/Resume di CV/Resume page

---

## 💡 Tips

1. **Email**: Gunakan email yang aktif karena pengunjung akan mengirim pesan ke email ini
2. **Phone**: Format bebas, tapi disarankan dengan kode negara (contoh: +62 812 3456 7890)
3. **Location**: Bisa kota, negara, atau alamat lengkap
4. **Social Links**: Pastikan URL lengkap dengan `https://`
5. **CV**: File PDF maksimal 5MB, atau gunakan link Google Drive/Dropbox

---

## 🚨 Troubleshooting

**Q: Social links tidak muncul?**  
A: Pastikan URL sudah diisi lengkap di `/admin/social-links`

**Q: Download CV tidak berfungsi?**  
A: Pastikan sudah upload file atau isi URL di `/admin/cv`

**Q: Pesan dari contact form tidak masuk?**  
A: Cek di `/admin/messages`, semua pesan tersimpan di sana

**Q: Data tidak update di homepage?**  
A: Refresh halaman homepage (F5) untuk melihat perubahan terbaru

---

## 📞 Ringkasan Lokasi Admin

| Komponen | Lokasi di Sidebar | URL |
|----------|-------------------|-----|
| Email, Phone, Location | Contact Section → Contact Info | `/admin/contact` |
| Social Media Links | Contact Section → Social Links | `/admin/social-links` |
| Pesan dari Pengunjung | Contact Section → Messages | `/admin/messages` |
| Download CV Button | Home Section → CV/Resume | `/admin/cv` |

---

**Selamat mengelola Contact Section! 🎉**
