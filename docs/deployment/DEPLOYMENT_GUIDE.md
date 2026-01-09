# 🚀 Production Deployment Guide

Panduan lengkap untuk deploy Portfolio CMS ke production dengan database PostgreSQL.

---

## 📋 Table of Contents

1. [Persiapan Sebelum Deploy](#persiapan-sebelum-deploy)
2. [Option 1: Deploy ke Vercel + Railway](#option-1-vercel--railway)
3. [Option 2: Deploy ke Netlify + Render](#option-2-netlify--render)
4. [Option 3: Deploy ke VPS (DigitalOcean/AWS)](#option-3-deploy-ke-vps)
5. [Database Migration](#database-migration)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Persiapan Sebelum Deploy

### 1. Build Frontend untuk Production

```bash
cd porto
npm run build
```

Ini akan membuat folder `dist` dengan file production-ready.

### 2. Test Production Build Locally

```bash
# Di folder porto
npm run preview
```

### 3. Siapkan Database Schema

Buat file lengkap untuk semua tabel:

```bash
# File sudah ada di: backend/src/database/
# - create-analytics-table.js
# - create-certifications-table.js
# - create-messages-table.js
```

### 4. Update Environment Variables

Pastikan semua hardcoded URLs diganti dengan environment variables.

---

## Option 1: Deploy ke Vercel + Railway

**Best for**: Deployment cepat, gratis untuk start, mudah setup

### A. Deploy Database ke Railway

1. **Buat Akun Railway**
   - Kunjungi: https://railway.app
   - Sign up dengan GitHub

2. **Create New Project**
   - Click "New Project"
   - Pilih "Provision PostgreSQL"
   - Railway akan otomatis membuat database

3. **Get Database Credentials**
   ```
   Railway Dashboard → PostgreSQL → Connect → Variables
   
   Catat:
   - PGHOST
   - PGPORT
   - PGUSER
   - PGPASSWORD
   - PGDATABASE
   ```

4. **Run Migrations**
   
   Update `backend/.env` dengan credentials Railway:
   ```env
   DB_HOST=your-railway-host.railway.app
   DB_PORT=5432
   DB_NAME=railway
   DB_USER=postgres
   DB_PASSWORD=your-railway-password
   ```

   Jalankan migrations:
   ```bash
   cd backend
   node src/database/create-messages-table.js
   node src/database/create-analytics-table.js
   node src/database/create-certifications-table.js
   ```

### B. Deploy Backend ke Railway

1. **Create New Service**
   - Di Railway project yang sama
   - Click "New" → "GitHub Repo"
   - Connect repository Anda
   - Pilih folder `backend`

2. **Configure Build Settings**
   
   Railway akan auto-detect Node.js. Tambahkan di `backend/package.json`:
   ```json
   {
     "scripts": {
       "start": "node src/server.js",
       "build": "echo 'No build needed'"
     }
   }
   ```

3. **Set Environment Variables**
   
   Di Railway Dashboard → Backend Service → Variables:
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=<dari PostgreSQL service>
   DB_PORT=5432
   DB_NAME=railway
   DB_USER=postgres
   DB_PASSWORD=<dari PostgreSQL service>
   JWT_SECRET=<generate random string>
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=<change this>
   FRONTEND_URL=<your-vercel-url>
   ```

4. **Deploy**
   - Railway akan auto-deploy
   - Catat URL backend: `https://your-backend.railway.app`

### C. Deploy Frontend ke Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Update API Base URL**
   
   Buat file `porto/.env.production`:
   ```env
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

   Update `porto/src/services/api.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
   ```

3. **Deploy ke Vercel**
   ```bash
   cd porto
   vercel --prod
   ```

4. **Configure Vercel**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Set Environment Variables di Vercel**
   
   Vercel Dashboard → Settings → Environment Variables:
   ```env
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

---

## Option 2: Deploy ke Netlify + Render

**Best for**: Alternative gratis, CI/CD otomatis

### A. Deploy Database ke Render

1. **Buat Akun Render**
   - Kunjungi: https://render.com
   - Sign up dengan GitHub

2. **Create PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Name: `portfolio-db`
   - Plan: Free
   - Create Database

3. **Get Connection String**
   ```
   Render Dashboard → Database → Connections
   
   Internal Database URL:
   postgresql://user:pass@host/dbname
   
   External Database URL (untuk migrations):
   postgresql://user:pass@external-host/dbname
   ```

4. **Run Migrations**
   
   Update `backend/.env`:
   ```env
   DATABASE_URL=<External Database URL dari Render>
   ```

   Update `backend/src/config/database.js`:
   ```javascript
   import pg from 'pg';
   const { Pool } = pg;

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
   });

   export default pool;
   ```

   Jalankan migrations:
   ```bash
   cd backend
   node src/database/create-messages-table.js
   node src/database/create-analytics-table.js
   node src/database/create-certifications-table.js
   ```

### B. Deploy Backend ke Render

1. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect GitHub repository
   - Root Directory: `backend`

2. **Configure Build**
   ```
   Build Command: npm install
   Start Command: node src/server.js
   ```

3. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<Internal Database URL>
   JWT_SECRET=<generate random>
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=<change this>
   FRONTEND_URL=<your-netlify-url>
   ```

4. **Deploy**
   - Render akan auto-deploy
   - URL: `https://your-backend.onrender.com`

### C. Deploy Frontend ke Netlify

1. **Update API URL**
   
   `porto/.env.production`:
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

2. **Create netlify.toml**
   
   `porto/netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy**
   - Netlify Dashboard → New site from Git
   - Connect repository
   - Base directory: `porto`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Environment Variables**
   
   Netlify Dashboard → Site settings → Environment variables:
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

---

## Option 3: Deploy ke VPS (DigitalOcean/AWS)

**Best for**: Full control, custom domain, production-grade

### A. Setup VPS

1. **Create Droplet/EC2**
   - OS: Ubuntu 22.04 LTS
   - Size: 2GB RAM minimum
   - Add SSH key

2. **Connect to Server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y

   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs

   # Install PostgreSQL
   apt install -y postgresql postgresql-contrib

   # Install Nginx
   apt install -y nginx

   # Install PM2
   npm install -g pm2

   # Install Certbot (SSL)
   apt install -y certbot python3-certbot-nginx
   ```

### B. Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE portfolio_cms_2026;
CREATE USER portfolio_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE portfolio_cms_2026 TO portfolio_user;
\q

# Allow remote connections (if needed)
nano /etc/postgresql/14/main/postgresql.conf
# Uncomment: listen_addresses = '*'

nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

# Restart PostgreSQL
systemctl restart postgresql
```

### C. Deploy Backend

```bash
# Create app directory
mkdir -p /var/www/portfolio
cd /var/www/portfolio

# Clone repository (or upload files)
git clone your-repo-url .

# Install backend dependencies
cd backend
npm install --production

# Create .env file
nano .env
```

`.env` content:
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_cms_2026
DB_USER=portfolio_user
DB_PASSWORD=strong_password_here
JWT_SECRET=generate_random_string_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=change_this_password
FRONTEND_URL=https://yourdomain.com
```

```bash
# Run migrations
node src/database/create-messages-table.js
node src/database/create-analytics-table.js
node src/database/create-certifications-table.js

# Start with PM2
pm2 start src/server.js --name portfolio-backend
pm2 save
pm2 startup
```

### D. Deploy Frontend

```bash
# Build frontend
cd /var/www/portfolio/porto
npm install
npm run build

# Copy to nginx directory
cp -r dist/* /var/www/html/
```

### E. Configure Nginx

```bash
nano /etc/nginx/sites-available/portfolio
```

Content:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### F. Setup SSL (HTTPS)

```bash
# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

---

## Database Migration

### Complete Migration Script

Buat file `backend/src/database/migrate-all.js`:

```javascript
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrateAll() {
  try {
    console.log('🔄 Starting database migration...\n');

    // 1. Messages table
    console.log('Creating messages table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)`);
    console.log('✅ Messages table created\n');

    // 2. Analytics table
    console.log('Creating analytics table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        page VARCHAR(255),
        project_id INTEGER,
        blog_id INTEGER,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)`);
    console.log('✅ Analytics table created\n');

    // 3. Certifications table
    console.log('Creating certifications table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        date VARCHAR(100),
        description TEXT,
        certificate_url VARCHAR(500),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Certifications table created\n');

    // 4. Add whatsapp_url to contact table
    console.log('Adding whatsapp_url to contact table...');
    await pool.query(`
      ALTER TABLE contact 
      ADD COLUMN IF NOT EXISTS whatsapp_url VARCHAR(255)
    `);
    console.log('✅ Contact table updated\n');

    // 5. Add project_id to testimonials table
    console.log('Adding project_id to testimonials table...');
    await pool.query(`
      ALTER TABLE testimonials 
      ADD COLUMN IF NOT EXISTS project_id INTEGER
    `);
    console.log('✅ Testimonials table updated\n');

    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateAll();
```

Run migration:
```bash
node backend/src/database/migrate-all.js
```

---

## Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=generate-random-string-min-32-chars
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=strong-password-here

# CORS
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env.production)

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## Post-Deployment Checklist

### ✅ Security

- [ ] Change default admin password
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure database password
- [ ] Enable firewall (UFW on Ubuntu)
- [ ] Regular security updates

### ✅ Performance

- [ ] Enable gzip compression (Nginx)
- [ ] Setup CDN for static assets
- [ ] Configure database connection pooling
- [ ] Enable caching headers
- [ ] Optimize images before upload

### ✅ Monitoring

- [ ] Setup error logging (Sentry)
- [ ] Configure uptime monitoring
- [ ] Setup database backups
- [ ] Monitor server resources
- [ ] Setup alerts for downtime

### ✅ Testing

- [ ] Test all API endpoints
- [ ] Test file uploads
- [ ] Test admin login
- [ ] Test analytics tracking
- [ ] Test contact form
- [ ] Test on mobile devices
- [ ] Test SSL certificate

### ✅ SEO & Analytics

- [ ] Add Google Analytics
- [ ] Configure meta tags
- [ ] Setup sitemap.xml
- [ ] Configure robots.txt
- [ ] Test page speed

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
systemctl status postgresql

# Check connection
psql -U portfolio_user -d portfolio_cms_2026 -h localhost

# Check logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

### Backend Not Starting

```bash
# Check PM2 logs
pm2 logs portfolio-backend

# Check port availability
netstat -tulpn | grep 5000

# Restart backend
pm2 restart portfolio-backend
```

### Frontend Not Loading

```bash
# Check Nginx
nginx -t
systemctl status nginx

# Check logs
tail -f /var/log/nginx/error.log
```

---

## Backup Strategy

### Database Backup

```bash
# Manual backup
pg_dump -U portfolio_user portfolio_cms_2026 > backup_$(date +%Y%m%d).sql

# Restore
psql -U portfolio_user portfolio_cms_2026 < backup_20240103.sql

# Automated daily backup (crontab)
0 2 * * * pg_dump -U portfolio_user portfolio_cms_2026 > /backups/db_$(date +\%Y\%m\%d).sql
```

### File Backup

```bash
# Backup uploads folder
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/portfolio/backend/uploads

# Restore
tar -xzf uploads_backup_20240103.tar.gz -C /var/www/portfolio/backend/
```

---

## Cost Estimation

### Free Tier (Recommended untuk start)
- **Railway**: PostgreSQL Free (500MB, 5GB transfer)
- **Vercel**: Frontend Free (100GB bandwidth)
- **Total**: $0/month

### Paid Tier (Production-ready)
- **Railway**: $5/month (PostgreSQL + Backend)
- **Vercel**: $20/month (Pro plan)
- **Total**: $25/month

### VPS Option
- **DigitalOcean**: $6-12/month (Droplet)
- **Domain**: $10-15/year
- **Total**: $6-12/month + domain

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- PostgreSQL Docs: https://www.postgresql.org/docs

---

**Selamat! Portfolio Anda siap production! 🎉**
