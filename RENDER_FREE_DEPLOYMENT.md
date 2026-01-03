# 🚀 Deploy ke Render - 100% GRATIS (No Credit Card!)

Panduan lengkap deploy backend + database ke Render untuk portfolio yang sudah live di Netlify.

**Frontend Anda**: https://4leafclover.id ✅ (Sudah Live!)

---

## ✨ Kenapa Render?

- ✅ **100% GRATIS** - Tidak perlu kartu kredit
- ✅ **PostgreSQL 256MB** - Cukup untuk portfolio
- ✅ **750 jam/bulan** - Cukup untuk traffic moderate
- ✅ **SSL otomatis** - HTTPS gratis
- ✅ **Auto-deploy** - Push ke GitHub = auto deploy

**Cukup untuk**:
- 100+ projects
- 1000+ testimonials
- 10,000+ analytics events
- 50+ blog posts

---

## 📋 Yang Akan Kita Setup

1. **PostgreSQL Database** di Render (GRATIS)
2. **Backend API** di Render (GRATIS)
3. **Connect** ke Netlify frontend

**Total Waktu**: 10-15 menit
**Biaya**: $0

---

## 🗄️ STEP 1: Setup Database di Render (5 menit)

### 1.1 Buat Akun Render

1. **Buka**: https://render.com
2. **Sign up** dengan GitHub (GRATIS, no credit card!)
3. **Authorize** Render

### 1.2 Create PostgreSQL Database

1. **Dashboard** → **New +** → **PostgreSQL**
2. **Isi form**:
   ```
   Name: portfolio-db
   Database: portfolio_cms_2026
   User: (auto-generated)
   Region: Singapore (Southeast Asia)
   PostgreSQL Version: 16
   ```
3. **Plan**: Pilih **FREE** (256MB)
4. **Create Database**

### 1.3 Copy Database Credentials

Setelah database dibuat (tunggu 1-2 menit):

1. **Scroll ke bawah** ke section **Connections**
2. **Copy** kedua URL ini:

**Internal Database URL** (untuk backend):
```
postgresql://user:pass@dpg-xxx-a.singapore-postgres.render.com/portfolio_cms_2026
```

**External Database URL** (untuk migrations):
```
postgresql://user:pass@dpg-xxx-a.singapore-postgres.render.com/portfolio_cms_2026?ssl=true
```

**SIMPAN** kedua URL ini di notepad!

---

## 🔧 STEP 2: Deploy Backend ke Render (5 menit)

### 2.1 Push Code ke GitHub (Jika Belum)

```bash
# Di root folder project
cd C:\path\to\your\project

# Initialize git (jika belum)
git init
git add .
git commit -m "Ready for Render deployment"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/username/portfolio.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy Backend Service

1. **Render Dashboard** → **New +** → **Web Service**
2. **Connect GitHub** repository
3. **Select repository** Anda
4. **Isi form**:
   ```
   Name: portfolio-backend
   Region: Singapore (Southeast Asia)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node src/server.js
   ```
5. **Plan**: Pilih **FREE** (750 hrs/month)
6. **Klik "Advanced"** untuk set environment variables

### 2.3 Set Environment Variables

Di section **Environment Variables**, tambahkan satu per satu:

```env
NODE_ENV=production

DATABASE_URL=<paste Internal Database URL dari Step 1.3>

JWT_SECRET=<generate random 32 chars - lihat di bawah>

JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@4leafclover.id

ADMIN_PASSWORD=<your strong password>

FRONTEND_URL=https://4leafclover.id
```

**Generate JWT_SECRET** (Windows PowerShell):
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Contoh output: `aB3dE7fG9hJ2kL4mN6pQ8rS0tU1vW5xY`

### 2.4 Create Web Service

1. **Klik "Create Web Service"**
2. **Tunggu deploy** (3-5 menit)
3. **Status** akan berubah jadi **Live** (hijau)

### 2.5 Copy Backend URL

Setelah deploy selesai:

1. **Di atas halaman**, copy URL: `https://portfolio-backend-xxxx.onrender.com`
2. **SIMPAN** URL ini!

---

## 🗃️ STEP 3: Run Database Migrations (3 menit)

Sekarang kita perlu setup tables di database.

### 3.1 Set Database URL Locally

```bash
# Buka PowerShell di folder backend
cd backend

# Set DATABASE_URL (External dari Step 1.3)
$env:DATABASE_URL="<paste External Database URL>"
```

### 3.2 Run Migrations

```bash
node src/database/migrate-all.js
```

**Expected Output**:
```
🔄 Starting database migration...

Creating messages table...
✅ Messages table created

Creating analytics table...
✅ Analytics table created

Creating certifications table...
✅ Certifications table created

Adding whatsapp_url to contact table...
✅ Contact table updated

Adding project_id to testimonials table...
✅ Testimonials table updated

🎉 All migrations completed successfully!
```

---

## 🔗 STEP 4: Connect Netlify ke Render (2 menit)

### 4.1 Update Netlify Environment Variable

1. **Netlify Dashboard**: https://app.netlify.com
2. **Sites** → **blackcatz3** (atau nama site Anda)
3. **Site configuration** → **Environment variables**
4. **Add a variable**:
   ```
   Key: VITE_API_BASE_URL
   Value: https://portfolio-backend-xxxx.onrender.com/api
   ```
   (Ganti dengan URL backend Anda dari Step 2.5)
5. **Save**

### 4.2 Redeploy Netlify

1. **Deploys** tab
2. **Trigger deploy** → **Deploy site**
3. **Tunggu** 1-2 menit

---

## ✅ STEP 5: Test Everything! (2 menit)

### 5.1 Test Backend Health

Buka browser:
```
https://portfolio-backend-xxxx.onrender.com/health
```

**Expected Response**:
```json
{
  "status": "OK",
  "message": "Portfolio CMS API is running"
}
```

### 5.2 Test Frontend

1. **Visit**: https://4leafclover.id
2. **Open Console** (F12)
3. **Check**: No errors (red text)

### 5.3 Test Admin Login

1. **Visit**: https://4leafclover.id/admin/login
2. **Login** dengan:
   ```
   Email: admin@4leafclover.id
   Password: <password dari Step 2.3>
   ```
3. **Check**:
   - ✅ Dashboard loads
   - ✅ All menu items work
   - ✅ Analytics shows data
   - ✅ Can create/edit content

---

## 🎉 SELESAI! Portfolio Anda LIVE!

**URLs**:
- 🌐 **Frontend**: https://4leafclover.id
- 🔧 **Backend**: https://portfolio-backend-xxxx.onrender.com
- 🗄️ **Database**: PostgreSQL di Render
- 🔐 **Admin**: https://4leafclover.id/admin/login

**Status**: ✅ PRODUCTION READY!

---

## ⚠️ Render Free Tier - Penting!

### Sleep Mode

Backend akan **"sleep"** setelah **15 menit** tidak ada traffic.

**Efek**:
- First request setelah sleep: **30-60 detik** (cold start)
- Request berikutnya: Normal (cepat)

**Solusi** (Optional):
- Ping backend setiap 10 menit
- Upgrade ke paid plan ($7/month) untuk always-on

### Keep Backend Awake (Optional)

Tambahkan di frontend (optional):

```javascript
// porto/src/App.tsx
useEffect(() => {
  // Ping backend every 10 minutes
  const interval = setInterval(() => {
    fetch('https://portfolio-backend-xxxx.onrender.com/health')
      .catch(() => {}); // Ignore errors
  }, 10 * 60 * 1000); // 10 minutes

  return () => clearInterval(interval);
}, []);
```

---

## 🐛 Troubleshooting

### Backend Error 500

**Check Logs**:
1. Render Dashboard → Backend service
2. **Logs** tab
3. Lihat error messages

**Common Issues**:
- ❌ Environment variables salah
- ❌ DATABASE_URL tidak set
- ❌ Migrations belum dijalankan

**Fix**:
1. Verify semua environment variables
2. Rerun migrations
3. Restart service (Manual Deploy)

### CORS Error di Frontend

**Symptoms**:
- Console error: "CORS policy blocked"
- API calls fail

**Fix**:
1. Render → Backend → Environment
2. Verify: `FRONTEND_URL=https://4leafclover.id`
3. **Manual Deploy** (redeploy)

### Database Connection Error

**Symptoms**:
- Backend logs: "Connection refused"
- API returns 500

**Fix**:
1. Verify DATABASE_URL is correct
2. Check PostgreSQL service is running (Render Dashboard)
3. Rerun migrations with External URL

### Admin Login Fails

**Symptoms**:
- "Invalid credentials"

**Fix**:
1. Check ADMIN_EMAIL and ADMIN_PASSWORD in Render environment
2. Restart backend service
3. Try again

---

## 📊 Monitoring

### Render Dashboard

**Backend Service**:
- **Metrics**: CPU, Memory, Requests
- **Logs**: Real-time application logs
- **Events**: Deploy history

**PostgreSQL Service**:
- **Metrics**: Connections, Storage
- **Info**: Connection strings
- **Backups**: Manual backups available

### Netlify Dashboard

**Site**:
- **Analytics**: Visitor stats
- **Logs**: Build & deploy logs
- **Forms**: Contact form submissions

---

## 🔄 Update Process

### Code Updates

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Render & Netlify auto-deploy!
```

### Database Schema Changes

```bash
# Create migration file in backend/src/database/
# Example: add-new-field.js

# Test locally
node src/database/add-new-field.js

# Deploy to production
$env:DATABASE_URL="<External URL>"
node src/database/add-new-field.js
```

---

## 💰 Cost Breakdown

**100% GRATIS**:
- ✅ Netlify: 100GB bandwidth/month
- ✅ Render Database: 256MB PostgreSQL
- ✅ Render Backend: 750 hours/month

**Cukup untuk**:
- 1000+ visitors/month
- 100+ projects
- 10,000+ analytics events

**Upgrade jika perlu** (nanti):
- Render Paid: $7/month (always-on, no sleep)
- Database upgrade: $7/month (1GB)

---

## 🎯 Next Steps (Optional)

### 1. Custom Domain untuk Backend

Setup `api.4leafclover.id`:

1. Render → Backend → Settings → Custom Domain
2. Add: `api.4leafclover.id`
3. Update DNS (CNAME record)
4. Update Netlify env: `VITE_API_BASE_URL=https://api.4leafclover.id/api`

### 2. Email Notifications

Setup email untuk contact form:
- SendGrid (100 emails/day free)
- Mailgun (5000 emails/month free)

### 3. Analytics

- Google Analytics
- Google Search Console
- Umami (privacy-friendly)

### 4. Monitoring

- UptimeRobot (free uptime monitoring)
- Sentry (error tracking)

---

## 📞 Support

**Render**:
- Docs: https://render.com/docs
- Community: https://community.render.com

**Netlify**:
- Docs: https://docs.netlify.com
- Support: https://www.netlify.com/support

---

## ✅ Checklist

Setelah deploy, pastikan:

- [ ] Backend health endpoint works
- [ ] Frontend loads tanpa error
- [ ] Admin login works
- [ ] Can create/edit content
- [ ] File uploads work
- [ ] Analytics tracking works
- [ ] Contact form works
- [ ] No CORS errors
- [ ] All sections display correctly

---

**Selamat! Portfolio Anda sudah PRODUCTION! 🎊**

**Share portfolio Anda**: https://4leafclover.id

