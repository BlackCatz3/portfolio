# 🚀 VPS Setup Commands - Copy Paste Ready

Panduan step-by-step untuk deploy portfolio ke VPS Ubuntu 24.04.

**VPS Info**:
- IP: 43.228.213.128
- OS: Ubuntu 24.04.3 LTS
- User: root

---

## 📋 STEP 1: Update System & Install Dependencies (5 menit)

Copy paste command ini satu per satu:

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version

# Install Git
apt install git -y

# Install Nginx
apt install nginx -y

# Start Nginx
systemctl start nginx
systemctl enable nginx
```

---

## 📦 STEP 2: Clone Project dari GitHub (3 menit)

### Option A: Jika sudah ada di GitHub

```bash
# Clone repository
cd /root
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

### Option B: Jika belum push ke GitHub

**Di local machine (Windows)**:

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Add Docker configuration"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

Lalu di VPS:
```bash
cd /root
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

### Option C: Upload via SCP (dari Windows)

**Di local machine (PowerShell)**:

```powershell
# Upload files ke VPS
scp -r backend root@43.228.213.128:/root/portfolio/
scp docker-compose.yml root@43.228.213.128:/root/portfolio/
scp .env.example root@43.228.213.128:/root/portfolio/
```

---

## 🔐 STEP 3: Setup Environment Variables (2 menit)

```bash
# Copy example
cp .env.example .env

# Edit .env
nano .env
```

**Isi dengan credentials ini** (ganti password-nya):

```env
# Database
DB_PASSWORD=SuperStrongPassword123!

# JWT Secret (random 32 chars)
JWT_SECRET=aB3dE7fG9hJ2kL4mN6pQ8rS0tU1vW5xY

# Admin
ADMIN_EMAIL=admin@4leafclover.id
ADMIN_PASSWORD=YourAdminPassword123!
```

**Save**: `Ctrl+X`, tekan `Y`, tekan `Enter`

---

## 🐳 STEP 4: Start Docker Containers (3 menit)

```bash
# Build and start containers
docker-compose up -d

# Wait 30 seconds for database to be ready
sleep 30

# Check status
docker-compose ps

# Expected output:
# NAME                  STATUS              PORTS
# portfolio-db          Up (healthy)        0.0.0.0:5432->5432/tcp
# portfolio-backend     Up                  0.0.0.0:5000->5000/tcp
```

**View logs** (optional):
```bash
# View all logs
docker-compose logs -f

# Press Ctrl+C to exit
```

---

## 🗃️ STEP 5: Run Database Migrations (2 menit)

```bash
# Run migrations
docker-compose exec backend node src/database/migrate-all.js

# Expected output:
# 🔄 Starting database migration...
# Creating messages table...
# ✅ Messages table created
# Creating analytics table...
# ✅ Analytics table created
# Creating certifications table...
# ✅ Certifications table created
# Adding whatsapp_url to contact table...
# ✅ Contact table updated
# Adding project_id to testimonials table...
# ✅ Testimonials table updated
# 🎉 All migrations completed successfully!
```

---

## ✅ STEP 6: Test Backend (1 menit)

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected output:
# {"status":"OK","message":"Portfolio CMS API is running"}
```

**Jika berhasil**, lanjut ke step berikutnya! 🎉

---

## 🌐 STEP 7: Setup Nginx Reverse Proxy (5 menit)

### 7.1 Create Nginx Config

```bash
nano /etc/nginx/sites-available/portfolio-api
```

**Paste config ini**:

```nginx
server {
    listen 80;
    server_name 43.228.213.128;

    # Logs
    access_log /var/log/nginx/portfolio-api-access.log;
    error_log /var/log/nginx/portfolio-api-error.log;

    # Proxy to backend
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

**Save**: `Ctrl+X`, tekan `Y`, tekan `Enter`

### 7.2 Enable Site

```bash
# Create symlink
ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test config
nginx -t

# Expected: "syntax is ok" and "test is successful"

# Reload Nginx
systemctl reload nginx
```

---

## 🔥 STEP 8: Setup Firewall (2 menit)

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw --force enable

# Check status
ufw status
```

---

## 🎯 STEP 9: Test dari Internet (1 menit)

**Buka browser**, test URL ini:

```
http://43.228.213.128/health
```

**Expected response**:
```json
{
  "status": "OK",
  "message": "Portfolio CMS API is running"
}
```

**Jika berhasil**, backend Anda sudah LIVE! 🎉

---

## 🔗 STEP 10: Update Netlify (2 menit)

### 10.1 Update Environment Variable

1. **Buka**: https://app.netlify.com
2. **Sites** → **blackcatz3**
3. **Site configuration** → **Environment variables**
4. **Edit** `VITE_API_BASE_URL`:
   ```
   http://43.228.213.128/api
   ```
5. **Save**

### 10.2 Redeploy Netlify

1. **Deploys** tab
2. **Trigger deploy** → **Deploy site**
3. **Tunggu** 1-2 menit

---

## ✅ STEP 11: Test Full Stack (2 menit)

1. **Visit**: https://4leafclover.id
2. **Open Console** (F12)
3. **Check**: No errors
4. **Visit**: https://4leafclover.id/admin/login
5. **Login** dengan credentials dari `.env`

**Jika berhasil login**, portfolio Anda sudah FULL PRODUCTION! 🎊

---

## 🎉 SELESAI! Portfolio LIVE!

**URLs**:
- 🌐 **Frontend**: https://4leafclover.id (Netlify)
- 🔧 **Backend**: http://43.228.213.128 (VPS)
- 🗄️ **Database**: PostgreSQL di VPS (Docker)
- 🔐 **Admin**: https://4leafclover.id/admin/login

---

## 📊 Useful Commands

### View Logs
```bash
# Backend logs
docker-compose logs -f backend

# Database logs
docker-compose logs -f postgres

# Nginx logs
tail -f /var/log/nginx/portfolio-api-access.log
tail -f /var/log/nginx/portfolio-api-error.log
```

### Restart Services
```bash
# Restart all containers
docker-compose restart

# Restart backend only
docker-compose restart backend

# Restart Nginx
systemctl restart nginx
```

### Stop/Start Services
```bash
# Stop all
docker-compose stop

# Start all
docker-compose start

# Stop and remove (⚠️ keeps data)
docker-compose down
```

### Update Code
```bash
# Pull latest code
cd /root/portfolio
git pull

# Rebuild and restart
docker-compose up -d --build

# Check logs
docker-compose logs -f backend
```

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U portfolio_user portfolio_cms_2026 > backup_$(date +%Y%m%d).sql

# Restore
docker-compose exec -T postgres psql -U portfolio_user portfolio_cms_2026 < backup_20260103.sql
```

### Check Resources
```bash
# Docker stats
docker stats

# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Restart
docker-compose restart backend
```

### Database Connection Error

```bash
# Check database is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Nginx 502 Error

```bash
# Check backend is running
docker-compose ps backend

# Test backend directly
curl http://localhost:5000/health

# Restart Nginx
systemctl restart nginx
```

### Out of Disk Space

```bash
# Check disk
df -h

# Clean Docker
docker system prune -a -f

# Clean logs
journalctl --vacuum-time=7d
```

---

## 🔒 Security Recommendations

### 1. Change SSH Port (Optional)

```bash
nano /etc/ssh/sshd_config
# Change: Port 22 to Port 2222
systemctl restart sshd

# Update firewall
ufw allow 2222/tcp
ufw delete allow 22/tcp
```

### 2. Setup Fail2Ban

```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Setup SSL (Jika punya domain)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d api.yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

---

## 📈 Next Steps (Optional)

### 1. Setup Domain

Jika punya domain (misal: api.4leafclover.id):

1. **DNS Settings**:
   - Type: A
   - Name: api
   - Value: 43.228.213.128
   - TTL: 3600

2. **Update Nginx**:
   ```bash
   nano /etc/nginx/sites-available/portfolio-api
   # Change: server_name 43.228.213.128;
   # To: server_name api.4leafclover.id;
   nginx -t
   systemctl reload nginx
   ```

3. **Get SSL**:
   ```bash
   certbot --nginx -d api.4leafclover.id
   ```

4. **Update Netlify**:
   ```
   VITE_API_BASE_URL=https://api.4leafclover.id/api
   ```

### 2. Setup Monitoring

**Portainer** (Docker GUI):
```bash
docker run -d -p 9000:9000 --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Access: http://43.228.213.128:9000

### 3. Setup Automated Backups

```bash
# Create backup script
nano /root/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup database
cd /root/portfolio
docker-compose exec -T postgres pg_dump -U portfolio_user portfolio_cms_2026 > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz backend/uploads/

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /root/backup.sh

# Test
/root/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

---

**Selamat! Portfolio Anda sudah production-ready di VPS! 🎊**

**Keuntungan**:
- ✅ Always-on (no sleep mode)
- ✅ Full control
- ✅ Better performance
- ✅ Production-grade

