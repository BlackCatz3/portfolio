# ⚡ Quick Reference - Deployment

Cheat sheet untuk deploy portfolio Anda.

---

## ✅ Status Saat Ini

- ✅ **Frontend**: LIVE di https://4leafclover.id (Netlify)
- ⏳ **Backend**: Perlu deploy ke Railway
- ⏳ **Database**: Perlu setup di Railway

---

## 🚀 Next Steps (15 menit)

### 1. Setup Railway (5 menit)

```
1. Buka: https://railway.app
2. Sign up dengan GitHub
3. New Project → Provision PostgreSQL
4. Copy DATABASE_URL
```

### 2. Deploy Backend (5 menit)

```
1. Push code ke GitHub (jika belum)
2. Railway → New → GitHub Repo
3. Select repo → Root: backend
4. Set environment variables (lihat di bawah)
5. Copy backend URL
```

### 3. Run Migrations (3 menit)

```bash
npm install -g @railway/cli
railway login
railway link
railway run node src/database/migrate-all.js
```

### 4. Connect Netlify (2 menit)

```
1. Netlify Dashboard → blackcatz3
2. Site settings → Environment variables
3. Add: VITE_API_BASE_URL = https://your-backend.railway.app/api
4. Trigger redeploy
```

---

## 🔑 Environment Variables untuk Railway

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate 32+ random chars>
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@4leafclover.id
ADMIN_PASSWORD=<your strong password>
FRONTEND_URL=https://4leafclover.id
```

**Generate JWT_SECRET**:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## 📝 Panduan Lengkap

**Baca**: `NETLIFY_RAILWAY_DEPLOY.md`

Step-by-step detail dengan screenshots dan troubleshooting.

---

## 🧪 Testing Checklist

Setelah deploy, test:

- [ ] Backend health: `curl https://your-backend.railway.app/health`
- [ ] Frontend loads: https://4leafclover.id
- [ ] Admin login: https://4leafclover.id/admin/login
- [ ] No CORS errors (F12 console)
- [ ] Can create content
- [ ] File uploads work
- [ ] Analytics tracking

---

## 🆘 Quick Troubleshooting

### Backend Error 500
```
Railway → Backend → Deployments → View Logs
Check: Environment variables set?
Check: Migrations ran?
```

### CORS Error
```
Railway → Backend → Variables
Verify: FRONTEND_URL=https://4leafclover.id
Redeploy
```

### Database Connection Error
```
Check: DATABASE_URL is set
Check: PostgreSQL service running
Rerun: railway run node src/database/migrate-all.js
```

---

## 💰 Cost

**FREE** untuk start:
- Netlify: 100GB/month
- Railway: $5 credit/month

Cukup untuk portfolio dengan traffic moderate!

---

## 📞 Need Help?

1. Check `NETLIFY_RAILWAY_DEPLOY.md` untuk detail
2. Check Railway logs untuk errors
3. Verify semua environment variables

---

**Ready? Mulai dari Step 1! 🚀**

Buka: https://railway.app
