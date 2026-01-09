# ⚡ Quick Deploy Guide - 15 Menit ke Production!

Panduan cepat deploy portfolio ke production menggunakan Railway + Vercel (GRATIS).

---

## 🎯 Yang Anda Butuhkan

- [ ] Akun GitHub
- [ ] Akun Railway (gratis)
- [ ] Akun Vercel (gratis)
- [ ] Repository GitHub dengan code portfolio ini

---

## 📦 Step 1: Push ke GitHub (5 menit)

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Create repository di GitHub, lalu:
git remote add origin https://github.com/username/portfolio.git
git branch -M main
git push -u origin main
```

---

## 🚂 Step 2: Deploy Database ke Railway (3 menit)

1. **Buka Railway**: https://railway.app
2. **Login dengan GitHub**
3. **New Project** → **Provision PostgreSQL**
4. **Catat credentials**:
   - Klik PostgreSQL service
   - Tab "Variables"
   - Copy `DATABASE_URL`

---

## 🔧 Step 3: Deploy Backend ke Railway (5 menit)

1. **Di Railway project yang sama**:
   - Click **"New"** → **"GitHub Repo"**
   - Pilih repository Anda
   - Root Directory: `backend`

2. **Set Environment Variables**:
   - Tab "Variables"
   - Add variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste dari PostgreSQL service>
   JWT_SECRET=<generate random string>
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=<your-password>
   FRONTEND_URL=https://your-site.vercel.app
   ```

3. **Deploy akan otomatis**
   - Tunggu build selesai
   - Copy URL backend: `https://xxx.railway.app`

4. **Run Migrations**:
   - Tab "Settings" → "Deploy"
   - Atau jalankan lokal dengan DATABASE_URL dari Railway:
   ```bash
   cd backend
   DATABASE_URL="<railway-url>" node src/database/migrate-all.js
   ```

---

## 🚀 Step 4: Deploy Frontend ke Vercel (2 menit)

1. **Buka Vercel**: https://vercel.com
2. **Login dengan GitHub**
3. **New Project** → Pilih repository
4. **Configure**:
   - Root Directory: `porto`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

6. **Deploy!**
   - Vercel akan auto-deploy
   - URL: `https://your-site.vercel.app`

---

## ✅ Step 5: Update CORS (1 menit)

1. **Kembali ke Railway**
2. **Backend service** → **Variables**
3. **Update**:
   ```
   FRONTEND_URL=https://your-actual-site.vercel.app
   ```
4. **Redeploy** (otomatis)

---

## 🎉 SELESAI!

Portfolio Anda sudah live di:
- **Frontend**: https://your-site.vercel.app
- **Backend**: https://your-backend.railway.app
- **Admin**: https://your-site.vercel.app/admin/login

---

## 🔐 Login Admin

```
Email: admin@portfolio.com
Password: <yang Anda set di Railway>
```

**PENTING**: Segera ganti password setelah login pertama!

---

## 🐛 Troubleshooting

### Backend Error 500
- Cek Railway logs: Backend service → "Deployments" → Latest → "View Logs"
- Pastikan DATABASE_URL sudah di-set
- Pastikan migrations sudah dijalankan

### Frontend Can't Connect
- Cek VITE_API_BASE_URL di Vercel
- Pastikan CORS (FRONTEND_URL) sudah benar di Railway
- Cek browser console untuk error

### Database Connection Error
- Pastikan DATABASE_URL format benar
- Cek PostgreSQL service masih running di Railway

---

## 📊 Monitoring

### Railway
- Dashboard → Backend service → "Metrics"
- Lihat CPU, Memory, Network usage

### Vercel
- Dashboard → Project → "Analytics"
- Lihat visitor stats

---

## 💰 Biaya

**GRATIS** untuk:
- Railway: 500MB database, $5 credit/month
- Vercel: 100GB bandwidth/month

Cukup untuk portfolio personal dengan traffic moderate!

---

## 🔄 Update Code

### Auto-Deploy
Setiap push ke GitHub akan otomatis deploy:
```bash
git add .
git commit -m "Update feature"
git push
```

Railway dan Vercel akan auto-detect dan deploy!

---

## 📝 Next Steps

1. [ ] Setup custom domain
2. [ ] Configure SSL (otomatis di Vercel)
3. [ ] Add Google Analytics
4. [ ] Setup monitoring alerts
5. [ ] Regular database backups

---

**Selamat! Portfolio Anda sudah production-ready! 🎊**

Butuh bantuan? Cek `DEPLOYMENT_GUIDE.md` untuk panduan lengkap.
