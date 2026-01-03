# 🚀 Deploy Backend & Database - Railway

Panduan deploy backend Node.js + PostgreSQL ke Railway untuk portfolio yang sudah live di Netlify.

**Frontend Anda**: https://4leafclover.id ✅ (Sudah Live!)

---

## 📋 Yang Akan Kita Setup

1. **PostgreSQL Database** di Railway (GRATIS)
2. **Backend API** di Railway (GRATIS)
3. **Connect** ke Netlify frontend

**Total Waktu**: 10-15 menit
**Biaya**: $0 (Railway free tier: $5 credit/month)

---

## 🗄️ Step 1: Setup Database di Railway (3 menit)

### 1.1 Buat Akun Railway

1. **Buka**: https://railway.app
2. **Sign up** dengan GitHub
3. **Authorize** Railway

### 1.2 Create Database

1. **Dashboard** → **New Project**
2. **Provision PostgreSQL**
3. Railway akan create database otomatis

### 1.3 Get Database Credentials

1. **Click PostgreSQL service**
2. **Tab "Variables"**
3. **Copy** `DATABASE_URL`
   ```
   Format: postgresql://user:password@host:port/database
   ```

**SIMPAN** DATABASE_URL ini, akan dipakai nanti!

---

## 🔧 Step 2: Deploy Backend ke Railway (5 menit)

### 2.1 Push Code ke GitHub (Jika Belum)

```bash
# Di root folder project
git init
git add .
git commit -m "Ready for Railway deployment"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/username/portfolio.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy Backend Service

1. **Di Railway project yang sama** (tempat PostgreSQL)
2. **Click "New"** → **GitHub Repo**
3. **Select repository** Anda
4. **Root Directory**: Ketik `backend`
5. **Deploy**

Railway akan auto-detect Node.js dan deploy!

### 2.3 Set Environment Variables

1. **Click Backend service**
2. **Tab "Variables"**
3. **Add variables** satu per satu:

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=generate_random_32_characters_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@4leafclover.id
ADMIN_PASSWORD=YourStrongPassword123!
FRONTEND_URL=https://4leafclover.id
```

**PENTING**:
- `DATABASE_URL`: Ketik `${{Postgres.DATABASE_URL}}` (Railway auto-link)
- `JWT_SECRET`: Generate random string (min 32 chars)
- `ADMIN_PASSWORD`: Ganti dengan password kuat Anda

**Generate JWT_SECRET**:
```bash
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 2.4 Get Backend URL

1. **Backend service** → **Settings** → **Networking**
2. **Generate Domain**
3. **Copy URL**: `https://your-backend.railway.app`

**SIMPAN** URL ini!

---

## 🗃️ Step 3: Run Database Migrations (3 menit)

### Option A: Via Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run node src/database/migrate-all.js
```

### Option B: Locally with Railway Database

```bash
cd backend

# Set DATABASE_URL dari Railway
$env:DATABASE_URL="postgresql://user:pass@host:port/db"

# Run migrations
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
...
🎉 All migrations completed successfully!
```

---

## 🔗 Step 4: Connect Netlify ke Railway (2 menit)

### 4.1 Update Netlify Environment Variable

1. **Netlify Dashboard**: https://app.netlify.com/projects/blackcatz3
2. **Site settings** → **Environment variables**
3. **Add variable**:
   ```
   Key: VITE_API_BASE_URL
   Value: https://your-backend.railway.app/api
   ```
4. **Save**

### 4.2 Redeploy Netlify

```bash
# Trigger redeploy
git commit --allow-empty -m "Update API URL"
git push

# Atau di Netlify Dashboard:
# Deploys → Trigger deploy → Deploy site
```

---

## ✅ Step 5: Verify Everything Works

### 5.1 Test Backend

```bash
# Test health endpoint
curl https://your-backend.railway.app/health

# Expected: {"status":"OK","message":"Portfolio CMS API is running"}
```

### 5.2 Test Frontend

1. **Visit**: https://4leafclover.id
2. **Open Console** (F12)
3. **Check**: No CORS errors
4. **Visit**: https://4leafclover.id/admin/login
5. **Login** dengan credentials Anda

### 5.3 Test Admin Panel

- ✅ Dashboard loads
- ✅ All sections accessible
- ✅ Can create/edit content
- ✅ Analytics shows data
- ✅ File uploads work

---

## 🎉 SELESAI!

Portfolio Anda sekarang FULL PRODUCTION:

- ✅ **Frontend**: https://4leafclover.id (Netlify)
- ✅ **Backend**: https://your-backend.railway.app (Railway)
- ✅ **Database**: PostgreSQL (Railway)
- ✅ **SSL**: Otomatis (Netlify + Railway)
- ✅ **Auto-deploy**: Push ke GitHub = auto deploy

---

## 💰 Biaya

**GRATIS** untuk portfolio:
- Netlify: 100GB bandwidth/month
- Railway: $5 credit/month (cukup untuk traffic moderate)

**Total**: $0/month

---

## 🔒 Security Checklist

Setelah deploy, segera:

1. **Change Admin Password**
   - Login ke admin
   - Settings → Change Password

2. **Verify CORS**
   - Test dari https://4leafclover.id
   - No CORS errors di console

3. **Test All Features**
   - Create project
   - Upload image
   - Check analytics
   - Test contact form

---

## 🐛 Troubleshooting

### Backend Not Starting

**Check Railway Logs**:
1. Backend service → Deployments
2. Click latest deployment
3. View Logs

**Common Issues**:
- Missing environment variables
- Database connection failed
- Port already in use

### CORS Error

**Fix**:
1. Railway → Backend → Variables
2. Verify `FRONTEND_URL=https://4leafclover.id`
3. Redeploy

### Database Connection Error

**Fix**:
1. Verify `DATABASE_URL` is set
2. Check PostgreSQL service is running
3. Run migrations again

---

## 📊 Monitoring

### Railway Dashboard

**Backend Service**:
- Metrics: CPU, Memory, Network
- Logs: Real-time application logs
- Deployments: History & rollback

**PostgreSQL Service**:
- Metrics: Connections, queries
- Backups: Automatic daily backups

### Netlify Dashboard

**Site**:
- Analytics: Visitor stats
- Logs: Build & deploy logs
- Performance: Core Web Vitals

---

## 🔄 Update Process

### Code Updates

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Railway & Netlify auto-deploy!
```

### Database Schema Changes

```bash
# Create migration in backend/src/database/
# Test locally
# Deploy:
railway run node src/database/your-migration.js
```

---

## 📞 Support

**Railway**:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Netlify**:
- Docs: https://docs.netlify.com
- Support: https://www.netlify.com/support

---

## 🎯 Next Steps (Optional)

1. **Custom Domain**
   - Setup `api.4leafclover.id` untuk backend
   - See: `CUSTOM_DOMAIN_SETUP.md`

2. **Email Setup**
   - Professional email: `contact@4leafclover.id`
   - See: `CUSTOM_DOMAIN_SETUP.md`

3. **Analytics**
   - Google Analytics
   - Search Console

4. **Monitoring**
   - Error tracking (Sentry)
   - Uptime monitoring

---

**Selamat! Portfolio Anda sudah production-ready! 🎊**

**Live URLs**:
- Frontend: https://4leafclover.id
- Admin: https://4leafclover.id/admin/login
- Backend: https://your-backend.railway.app
