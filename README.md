# 🎨 Portfolio Website

Modern portfolio website dengan admin dashboard untuk mengelola konten.

## 📁 Struktur Project

```
porto-baru/
├── docs/                          ← 📚 SEMUA DOKUMENTASI
│   ├── deployment/                ← Deployment & Infrastructure
│   ├── features/                  ← Feature Documentation
│   ├── security/                  ← Security & Anti-Spam
│   ├── guides/                    ← Development Guides
│   └── specs/                     ← Feature Specifications
│
├── backend/                       ← Backend API (Node.js + Express)
│   └── src/
│       ├── database/
│       │   ├── sql/               ← 🗄️ SQL DATABASE FILES
│       │   └── [migration scripts]
│       ├── controllers/
│       ├── middleware/
│       └── routes/
│
├── porto/                         ← Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
│
├── scripts/                       ← Deployment & utility scripts
├── netlify/                       ← Netlify functions
└── docs-archive/                  ← File lama (archived)
```

## 🚀 Quick Start

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan database credentials
npm run dev
```

### 2. Setup Frontend
```bash
cd porto
npm install
cp .env.example .env.local
# Edit .env.local dengan API URL
npm run dev
```

### 3. Setup Database
```bash
# Import schema
psql -U postgres -d portfolio_db -f backend/src/database/sql/schema.sql

# Run migrations
cd backend
node src/database/migrate-all.js
```

## 📚 Dokumentasi

Semua dokumentasi ada di folder **`docs/`**:

### Untuk Development:
- **Start Here:** `docs/guides/START_HERE.md`
- **Backend Setup:** `docs/guides/BACKEND_INTEGRATION.md`
- **Database Migration:** `docs/guides/README_MIGRATION.md`

### Untuk Deployment:
- **Deployment Checklist:** `docs/deployment/DEPLOYMENT_CHECKLIST.md`
- **Complete Guide:** `docs/deployment/COMPLETE_DEPLOYMENT_GUIDE.md`
- **VPS Setup:** `docs/deployment/VPS_SETUP_COMMANDS.md`

### Untuk Features:
- **Testimonials:** `docs/features/TESTIMONIALS_COMPLETE_SUMMARY.md`
- **Analytics:** `docs/features/ANALYTICS_DASHBOARD_COMPLETE.md`
- **Mobile Layout:** `docs/features/FIX_HOME_MOBILE_OVERLAP_FINAL.txt`

### Untuk Security:
- **ReCAPTCHA:** `docs/security/RECAPTCHA_COMPLETE_SUMMARY.md`
- **Rate Limiting:** `docs/security/BACA_INI_RATE_LIMIT_EMAIL.txt`
- **Contact Security:** `docs/security/CONTACT_SECURITY_IMPLEMENTATION.md`

**📖 Lihat `FILE_ORGANIZATION.md` untuk navigasi lengkap!**

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication

### Deployment
- Frontend: Netlify
- Backend: Railway / VPS
- Database: PostgreSQL

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db
JWT_SECRET=your-secret-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
PORT=3001
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3001
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

## 📦 Scripts

### Backend
```bash
npm run dev          # Development server
npm start            # Production server
npm run migrate      # Run database migrations
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌐 Production URLs

- **Frontend:** https://4leafclover.id
- **Backend API:** https://api.4leafclover.id
- **Admin Dashboard:** https://4leafclover.id/admin

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek dokumentasi di folder `docs/`
2. Lihat `FILE_ORGANIZATION.md` untuk navigasi
3. Cek `docs-archive/` untuk referensi historis

## 📄 License

Private project - All rights reserved

---

**Last Updated:** 9 Januari 2026
