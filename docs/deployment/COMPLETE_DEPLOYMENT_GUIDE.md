# 🚀 Complete End-to-End Deployment Guide

Panduan lengkap deploy portfolio dari awal sampai selesai.

**Target**:
- ✅ Database PostgreSQL di VPS
- ✅ Backend API di VPS (Docker)
- ✅ Frontend di Netlify
- ✅ Semua terkoneksi dan berfungsi

---

## 📊 Current Status

Berdasarkan informasi sebelumnya:
- ✅ **VPS**: 43.228.213.128 (Ubuntu 24.04)
- ✅ **Docker**: Installed
- ✅ **Backend**: Running di VPS
- ✅ **Database**: PostgreSQL di VPS
- ✅ **Frontend**: Deployed di Netlify (https://4leafclover.id)
- ⚠️ **Issue**: Frontend belum connect ke backend VPS

---

## 🎯 STEP 1: Verify Backend & Database di VPS (5 menit)

### 1.1 SSH ke VPS

```bash
ssh root@43.228.213.128
```

### 1.2 Check Docker Containers

```bash
cd /root/n8n-production/portfolio
docker compose ps
```

**Expected output**:
```
NAME                  STATUS              PORTS
portfolio-db          Up (healthy)        0.0.0.0:5432->5432/tcp
portfolio-backend     Up                  0.0.0.0:5000->5000/tcp
```

### 1.3 Test Backend Health

```bash
curl http://localhost:5000/health
```

**Expected**:
```json
{"status":"OK","message":"Portfolio CMS API is running"}
```

### 1.4 Check Database Tables

```bash
docker compose exec postgres psql -U portfolio_user -d portfolio_cms_2026 -c "\dt"
```

**Expected**: List of tables (admins, projects, testimonials, etc.)

---

## 🔧 STEP 2: Jika Backend/Database Tidak Running

### 2.1 Restart Containers

```bash
cd /root/n8n-production/portfolio
docker compose restart
```

### 2.2 Check Logs

```bash
docker compose logs backend --tail 50
docker compose logs postgres --tail 50
```

### 2.3 Jika Ada Error, Rebuild

```bash
docker compose down
docker compose up -d --build
```

### 2.4 Rerun Migrations (Jika Database Kosong)

```bash
docker compose exec backend node src/database/migrate-all.js
```

---

## 🌐 STEP 3: Setup Nginx (Jika Belum)

### 3.1 Check Nginx Status

```bash
systemctl status nginx
```

### 3.2 Check Nginx Config

```bash
cat /etc/nginx/sites-available/portfolio-api
```

### 3.3 Jika Config Tidak Ada, Buat Baru

```bash
nano /etc/nginx/sites-available/portfolio-api
```

Paste config ini:

```nginx
server {
    listen 80;
    server_name 43.228.213.128;

    access_log /var/log/nginx/portfolio-api-access.log;
    error_log /var/log/nginx/portfolio-api-error.log;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save: `Ctrl+X`, `Y`, `Enter`

### 3.4 Enable Site

```bash
ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

### 3.5 Test dari Internet

Buka browser:
```
http://43.228.213.128/health
```

**Expected**:
```json
{"status":"OK","message":"Portfolio CMS API is running"}
```

---

## 🎨 STEP 4: Build Frontend Locally (5 menit)

### 4.1 Update API URL di Frontend

Edit file `porto/.env.production`:

```bash
# Di Windows PowerShell (local machine)
cd "D:\porto baru"
```

Buat/edit file `porto/.env.production`:

```env
VITE_API_BASE_URL=http://43.228.213.128/api
```

### 4.2 Build Frontend

```bash
cd porto
npm run build
```

**Expected**: Folder `porto/dist` tercipta dengan file-file production

### 4.3 Test Build Locally (Optional)

```bash
npm run preview
```

Buka: http://localhost:4173

---

## 📤 STEP 5: Deploy Frontend ke Netlify (3 cara)

### Option A: Manual Upload (Paling Mudah)

1. **Buka**: https://app.netlify.com
2. **Sites** → **blackcatz3**
3. **Deploys** tab
4. **Drag & drop** folder `porto/dist` ke area upload
5. **Tunggu** deploy selesai

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI (jika belum)
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd porto
netlify deploy --prod --dir=dist
```

### Option C: Via Git (Auto-deploy)

Sudah dilakukan sebelumnya dengan push ke GitHub.

---

## 🔗 STEP 6: Update Netlify Environment Variable

### 6.1 Via Netlify Dashboard

1. **Buka**: https://app.netlify.com
2. **Sites** → **blackcatz3**
3. **Site configuration** → **Environment variables**
4. **Add variable** (atau edit jika ada):
   - Key: `VITE_API_BASE_URL`
   - Value: `http://43.228.213.128/api`
   - Scope: **All scopes**
5. **Save**

### 6.2 Redeploy

- **Deploys** tab
- **Trigger deploy** → **Deploy site**
- **Tunggu** 1-2 menit

---

## ✅ STEP 7: Test End-to-End (5 menit)

### 7.1 Test Backend

```bash
curl http://43.228.213.128/health
```

**Expected**:
```json
{"status":"OK","message":"Portfolio CMS API is running"}
```

### 7.2 Test Frontend

1. **Buka**: https://4leafclover.id
2. **Tekan F12** (Console)
3. **Check**: Tidak ada error merah
4. **Check**: Network tab, lihat API calls ke `http://43.228.213.128/api`

### 7.3 Test Admin Login

1. **Buka**: https://4leafclover.id/admin/login
2. **Login**:
   - Email: `admin@4leafclover.id`
   - Password: `YourAdminPassword123!` (sesuai .env di VPS)
3. **Check**: Dashboard loads
4. **Check**: Semua menu accessible

### 7.4 Test CRUD Operations

1. **Projects** → Create new project
2. **Check**: Data tersimpan
3. **Refresh** halaman
4. **Check**: Data masih ada

---

## 🎉 STEP 8: Verification Checklist

Pastikan semua ini berfungsi:

- [ ] Backend health endpoint: `http://43.228.213.128/health`
- [ ] Frontend loads: `https://4leafclover.id`
- [ ] No CORS errors di console
- [ ] Admin login works
- [ ] Dashboard loads
- [ ] Can create/edit projects
- [ ] Can create/edit testimonials
- [ ] Can view analytics
- [ ] Images upload works
- [ ] All sections display correctly

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Symptoms**: Console error "CORS policy blocked"

**Fix**:
```bash
# SSH ke VPS
ssh root@43.228.213.128
cd /root/n8n-production/portfolio

# Check .env
cat .env | grep FRONTEND_URL

# Should be: FRONTEND_URL=https://4leafclover.id
# If not, edit:
nano .env
# Change FRONTEND_URL=https://4leafclover.id
# Save: Ctrl+X, Y, Enter

# Restart backend
docker compose restart backend
```

### Issue 2: Backend Not Responding

**Fix**:
```bash
# Check logs
docker compose logs backend --tail 100

# Restart
docker compose restart backend

# If still not working, rebuild
docker compose down
docker compose up -d --build
```

### Issue 3: Database Connection Error

**Fix**:
```bash
# Check database is running
docker compose ps postgres

# Check logs
docker compose logs postgres --tail 50

# Restart database
docker compose restart postgres

# Wait 30 seconds
sleep 30

# Restart backend
docker compose restart backend
```

### Issue 4: Frontend Shows Old Data

**Fix**:
```bash
# Clear browser cache
# Or hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

# Or rebuild and redeploy frontend
cd porto
npm run build
# Upload dist folder to Netlify
```

### Issue 5: Admin Login Fails

**Fix**:
```bash
# SSH ke VPS
ssh root@43.228.213.128
cd /root/n8n-production/portfolio

# Check admin credentials in .env
cat .env | grep ADMIN

# Should show:
# ADMIN_EMAIL=admin@4leafclover.id
# ADMIN_PASSWORD=YourAdminPassword123!

# If wrong, edit:
nano .env
# Fix credentials
# Save: Ctrl+X, Y, Enter

# Restart backend
docker compose restart backend
```

---

## 📊 Monitoring Commands

### Check Backend Status

```bash
# SSH ke VPS
ssh root@43.228.213.128
cd /root/n8n-production/portfolio

# Check containers
docker compose ps

# View logs
docker compose logs backend --tail 50 -f

# Check resources
docker stats
```

### Check Nginx Status

```bash
# Status
systemctl status nginx

# Logs
tail -f /var/log/nginx/portfolio-api-access.log
tail -f /var/log/nginx/portfolio-api-error.log

# Restart
systemctl restart nginx
```

### Check Database

```bash
# Connect to database
docker compose exec postgres psql -U portfolio_user -d portfolio_cms_2026

# List tables
\dt

# Count records
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM testimonials;

# Exit
\q
```

---

## 🔄 Update Process (Nanti)

### Update Code

```bash
# Local machine
git add .
git commit -m "Update feature"
git push

# VPS
ssh root@43.228.213.128
cd /root/n8n-production/portfolio
git pull
docker compose up -d --build

# Netlify (auto-deploy jika connected ke GitHub)
# Atau manual upload dist folder
```

### Database Migration

```bash
# Create migration file locally
# Upload to VPS
# Run migration
ssh root@43.228.213.128
cd /root/n8n-production/portfolio
docker compose exec backend node src/database/your-migration.js
```

---

## 🎯 Final Architecture

```
┌─────────────────────────────────────────────┐
│           USER (Browser)                    │
└─────────────────┬───────────────────────────┘
                  │
                  ├─────────────────────────────┐
                  │                             │
                  ▼                             ▼
┌─────────────────────────────┐   ┌──────────────────────────┐
│  Frontend (Netlify)         │   │  Backend (VPS)           │
│  https://4leafclover.id     │   │  http://43.228.213.128   │
│                             │   │                          │
│  - React + Vite             │   │  - Node.js + Express     │
│  - Tailwind CSS             │   │  - Docker Container      │
│  - Admin Panel              │   │  - Nginx Reverse Proxy   │
└─────────────────────────────┘   └──────────┬───────────────┘
                                             │
                                             ▼
                                  ┌──────────────────────────┐
                                  │  Database (VPS)          │
                                  │  PostgreSQL              │
                                  │                          │
                                  │  - Docker Container      │
                                  │  - Persistent Volume     │
                                  └──────────────────────────┘
```

---

## 📝 Important URLs

- **Frontend**: https://4leafclover.id
- **Admin**: https://4leafclover.id/admin/login
- **Backend**: http://43.228.213.128
- **Health Check**: http://43.228.213.128/health
- **Netlify Dashboard**: https://app.netlify.com
- **GitHub Repo**: https://github.com/BlackCatz3/portfolio

---

## 🔐 Credentials

**Admin Login**:
- Email: `admin@4leafclover.id`
- Password: (check `.env` di VPS)

**VPS SSH**:
- IP: `43.228.213.128`
- User: `root`
- Password: (your VPS password)

**Database**:
- Host: `localhost` (dari dalam VPS)
- Port: `5432`
- Database: `portfolio_cms_2026`
- User: `portfolio_user`
- Password: (check `.env` di VPS)

---

**Selamat! Portfolio Anda sudah FULL PRODUCTION! 🎊**

