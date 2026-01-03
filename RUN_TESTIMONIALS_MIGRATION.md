# 🔧 Migration: Add project_id to Testimonials

## Langkah-langkah:

### 1. Jalankan Migration
Buka terminal di folder `backend` dan jalankan:

```bash
cd backend
node src/database/migrate-project-testimonials.js
```

### 2. Verifikasi
Setelah migration berhasil, Anda akan melihat:
```
Adding project_id to testimonials table...
✅ Migration completed successfully!
Testimonials table now has project_id field
```

### 3. Restart Backend
Restart backend server jika sedang berjalan:
```bash
# Stop backend (Ctrl+C)
# Start lagi
npm start
```

---

## ⚠️ Penting!
Migration ini menambahkan field `project_id` ke tabel `testimonials` sehingga testimonials bisa dikaitkan dengan project tertentu.

Setelah migration, testimonials bisa:
- Ditampilkan per project
- Dikelola dari halaman admin project
- Muncul di popup saat klik tombol "Testimonials" di project card
