# 🚀 Quick Start: Migrasi ke Netlify Functions + Supabase

## ⚡ 5 Langkah Cepat

### 1️⃣ Setup Supabase (5 menit)

1. Buka https://supabase.com dan sign up
2. Klik "New Project"
   - Name: `portfolio-cms`
   - Region: `Southeast Asia (Singapore)`
   - Database Password: [Buat password kuat, SIMPAN!]
3. Tunggu ~2 menit sampai database ready
4. Copy Connection String:
   - Settings > Database > Connection string > URI
   - Format: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`
5. Migrasi Schema:
   - Klik "SQL Editor" > "New Query"
   - Copy paste isi file `backend/src/database/schema.sql`
   - Klik "Run"

### 2️⃣ Setup Netlify Environment Variables (2 menit)

1. Buka https://app.netlify.com
2. Pilih site "4leafclover.id"
3. Site settings > Environment variables > Add variable
4. Tambahkan 3 variables:

```
DATABASE_URL = postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
JWT_SECRET = your-secret-key-here
NODE_ENV = production
```

### 3️⃣ Install Dependencies & Deploy (3 menit)

```bash
# Install dependencies untuk Netlify Functions
cd netlify/functions
npm install

# Kembali ke root dan deploy
cd ../..
git add .
git commit -m "Migrate to Netlify Functions + Supabase"
git push origin main
```

Netlify akan auto-deploy dalam ~2-3 menit.

### 4️⃣ Buat Admin Account (1 menit)

1. Buka Supabase SQL Editor
2. Jalankan query ini (ganti email/password sesuai kebutuhan):

```sql
-- Password: YourAdminPassword123!
INSERT INTO admins (email, password, name) 
VALUES (
  'admin@4leafclover.id',
  '$2a$10$YourBcryptHashHere',
  'Admin'
);
```

**Generate bcrypt hash**:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword123', 10));"
```

### 5️⃣ Test Login (1 menit)

1. Buka https://4leafclover.id/admin/login
2. Login dengan credentials yang Anda buat
3. ✅ Tidak ada Mixed Content Error!
4. ✅ Semua fitur admin panel berfungsi!

---

## ✅ Checklist

- [ ] Supabase database created
- [ ] Schema migrated to Supabase
- [ ] Netlify environment variables configured
- [ ] Dependencies installed
- [ ] Code pushed to GitHub
- [ ] Netlify auto-deployed
- [ ] Admin account created
- [ ] Login successful
- [ ] No Mixed Content Error

---

## 🎉 Done!

**Before**: 
- Frontend: https://4leafclover.id (HTTPS) ✅
- Backend: http://43.228.213.128 (HTTP) ❌ Mixed Content Error

**After**:
- Frontend: https://4leafclover.id (HTTPS) ✅
- Backend: https://4leafclover.id/.netlify/functions/* (HTTPS) ✅
- **No Mixed Content Error!** 🎉

---

## 📞 Need Help?

Jika ada error, check:
1. Netlify Functions logs: https://app.netlify.com > Functions > Logs
2. Supabase logs: https://supabase.com > Project > Logs
3. Browser console: F12 > Console tab

Lihat `NETLIFY_SUPABASE_MIGRATION.md` untuk troubleshooting lengkap.
