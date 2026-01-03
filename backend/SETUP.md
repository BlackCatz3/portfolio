# Setup Guide - Portfolio CMS Backend

## 📦 Langkah-langkah Setup

### 1. Install PostgreSQL

#### Windows:
1. Download PostgreSQL dari https://www.postgresql.org/download/windows/
2. Jalankan installer dan ikuti wizard
3. Catat password yang Anda buat untuk user `postgres`
4. Default port: 5432

#### Atau gunakan Docker:
```bash
docker run --name portfolio-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

### 2. Buat Database

Buka Command Prompt atau PowerShell dan jalankan:

```bash
# Login ke PostgreSQL (akan minta password)
psql -U postgres -h localhost

# Di dalam psql, buat database:
CREATE DATABASE portfolio_cms;

# Cek database sudah dibuat:
\l

# Keluar dari psql:
\q
```

**Atau** jika menggunakan pgAdmin:
1. Buka pgAdmin
2. Connect ke server PostgreSQL
3. Klik kanan "Databases" → Create → Database
4. Nama: `portfolio_cms`
5. Klik Save

### 3. Konfigurasi Environment

File `.env` sudah dibuat dengan konfigurasi default:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_cms
DB_USER=postgres
DB_PASSWORD=postgres
```

**Sesuaikan `DB_PASSWORD`** dengan password PostgreSQL Anda!

### 4. Jalankan Migration

Migration akan membuat semua tabel dan data default:

```bash
npm run db:migrate
```

Output yang diharapkan:
```
🚀 Starting database migration...
✅ Database migration completed successfully!
📧 Admin email: admin@portfolio.com
🔑 Admin password: admin123
⚠️  Please change the admin password after first login!
```

### 5. Start Backend Server

Development mode (auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server akan berjalan di: **http://localhost:5000**

### 6. Test API

Buka browser atau Postman dan test:

**Health Check:**
```
GET http://localhost:5000/health
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@portfolio.com",
  "password": "admin123"
}
```

Jika berhasil, Anda akan mendapat token JWT!

## 🔧 Troubleshooting

### Error: "password authentication failed"
- Pastikan password di `.env` sesuai dengan password PostgreSQL Anda
- Coba reset password PostgreSQL

### Error: "database does not exist"
- Pastikan sudah membuat database `portfolio_cms`
- Jalankan: `CREATE DATABASE portfolio_cms;` di psql

### Error: "ECONNREFUSED"
- Pastikan PostgreSQL service sudah running
- Windows: Cek di Services → PostgreSQL
- Docker: `docker ps` untuk cek container running

### Error: "port 5000 already in use"
- Ubah PORT di `.env` ke port lain (misal 5001)
- Atau stop aplikasi yang menggunakan port 5000

## 📊 Database Schema

Backend ini membuat 5 tabel:

1. **admins** - User admin untuk login
2. **projects** - Portfolio projects
3. **experiences** - Work experience
4. **about** - About section info
5. **contact** - Contact information

## 🔐 Default Credentials

**Email:** admin@portfolio.com  
**Password:** admin123

⚠️ **PENTING:** Ganti password setelah login pertama kali!

## 🎯 Next Steps

Setelah backend running:

1. Test semua endpoints dengan Postman/Thunder Client
2. Ganti password admin
3. Integrasikan dengan frontend React
4. Upload beberapa project dan experience untuk testing

## 📞 Need Help?

Jika ada masalah, cek:
- PostgreSQL service running
- Port 5432 tidak diblok firewall
- Credentials di `.env` benar
- Database `portfolio_cms` sudah dibuat
