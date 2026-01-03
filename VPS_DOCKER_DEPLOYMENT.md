# 🐳 Deploy ke VPS dengan Docker

Panduan lengkap deploy backend + database ke VPS Anda menggunakan Docker.

**Kelebihan VPS + Docker**:
- ✅ Full control
- ✅ Always-on (no sleep mode)
- ✅ Unlimited resources (sesuai VPS)
- ✅ Easy scaling
- ✅ Production-ready

---

## 📋 Prerequisites

- VPS dengan Docker installed
- Domain/subdomain (optional, bisa pakai IP)
- SSH access ke VPS

---

## 🚀 STEP 1: Setup Docker Files (5 menit)

Saya akan buatkan Docker configuration untuk Anda.

### 1.1 Create Dockerfile untuk Backend

File: `backend/Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "src/server.js"]
```

### 1.2 Create docker-compose.yml

File: `docker-compose.yml` (di root project)

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: portfolio-db
    restart: always
    environment:
      POSTGRES_DB: portfolio_cms_2026
      POSTGRES_USER: portfolio_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - portfolio-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio_user -d portfolio_cms_2026"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: portfolio-backend
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://portfolio_user:${DB_PASSWORD}@postgres:5432/portfolio_cms_2026
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 7d
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      FRONTEND_URL: https://4leafclover.id
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - portfolio-network
    volumes:
      - ./backend/uploads:/app/uploads

volumes:
  postgres_data:

networks:
  portfolio-network:
    driver: bridge
```

### 1.3 Create .env file

File: `.env` (di root project)

```env
# Database
DB_PASSWORD=your_strong_database_password_here

# JWT
JWT_SECRET=your_32_character_random_string_here

# Admin
ADMIN_EMAIL=admin@4leafclover.id
ADMIN_PASSWORD=your_admin_password_here
```

**Generate JWT_SECRET**:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## 🗄️ STEP 2: Deploy ke VPS (10 menit)

### 2.1 Upload Files ke VPS

**Option A: Via Git (Recommended)**

```bash
# Di VPS
cd /home/your-user
git clone https://github.com/username/portfolio.git
cd portfolio
```

**Option B: Via SCP/SFTP**

```bash
# Di local machine
scp -r ./backend user@your-vps-ip:/home/user/portfolio/
scp docker-compose.yml user@your-vps-ip:/home/user/portfolio/
scp .env user@your-vps-ip:/home/user/portfolio/
```

### 2.2 Setup Environment Variables

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Masuk ke folder project
cd /home/user/portfolio

# Edit .env file
nano .env
```

Isi dengan credentials Anda:
```env
DB_PASSWORD=SuperStrongPassword123!
JWT_SECRET=aB3dE7fG9hJ2kL4mN6pQ8rS0tU1vW5xY
ADMIN_EMAIL=admin@4leafclover.id
ADMIN_PASSWORD=YourAdminPassword123!
```

Save: `Ctrl+X`, `Y`, `Enter`

### 2.3 Start Docker Containers

```bash
# Build and start containers
docker-compose up -d

# Check status
docker-compose ps

# Expected output:
# NAME                  STATUS              PORTS
# portfolio-db          Up (healthy)        0.0.0.0:5432->5432/tcp
# portfolio-backend     Up                  0.0.0.0:5000->5000/tcp
```

### 2.4 Check Logs

```bash
# View backend logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f postgres

# Expected: "✅ Connected to PostgreSQL database"
```

---

## 🗃️ STEP 3: Run Database Migrations (3 menit)

```bash
# Run migrations inside backend container
docker-compose exec backend node src/database/migrate-all.js

# Expected output:
# 🔄 Starting database migration...
# Creating messages table...
# ✅ Messages table created
# Creating analytics table...
# ✅ Analytics table created
# ...
# 🎉 All migrations completed successfully!
```

---

## 🌐 STEP 4: Setup Nginx Reverse Proxy (5 menit)

### 4.1 Install Nginx (jika belum)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4.2 Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/portfolio-api
```

Paste config ini:

```nginx
server {
    listen 80;
    server_name api.4leafclover.id;  # Ganti dengan domain/IP Anda

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

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

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

### 4.3 Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 4.4 Setup SSL dengan Let's Encrypt (Optional tapi Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d api.4leafclover.id

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔗 STEP 5: Update Netlify (2 menit)

### 5.1 Update Environment Variable

1. **Netlify Dashboard**: https://app.netlify.com
2. **Sites** → **blackcatz3**
3. **Site configuration** → **Environment variables**
4. **Edit** `VITE_API_BASE_URL`:
   ```
   # Jika pakai domain:
   https://api.4leafclover.id/api
   
   # Jika pakai IP:
   http://your-vps-ip:5000/api
   ```
5. **Save**

### 5.2 Redeploy Netlify

1. **Deploys** tab
2. **Trigger deploy** → **Deploy site**

---

## ✅ STEP 6: Test Everything! (2 menit)

### 6.1 Test Backend Health

```bash
# Via curl
curl http://your-vps-ip:5000/health

# Expected:
# {"status":"OK","message":"Portfolio CMS API is running"}
```

### 6.2 Test via Domain (jika sudah setup)

```bash
curl https://api.4leafclover.id/health
```

### 6.3 Test Frontend

1. Visit: https://4leafclover.id
2. Open Console (F12)
3. Check: No errors
4. Visit: https://4leafclover.id/admin/login
5. Login dengan credentials Anda

---

## 🎉 SELESAI! Portfolio LIVE di VPS!

**URLs**:
- 🌐 **Frontend**: https://4leafclover.id (Netlify)
- 🔧 **Backend**: http://your-vps-ip:5000 atau https://api.4leafclover.id
- 🗄️ **Database**: PostgreSQL di VPS (Docker)
- 🔐 **Admin**: https://4leafclover.id/admin/login

---

## 🔧 Docker Commands Cheat Sheet

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Database only
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart backend only
docker-compose restart backend

# Restart database only
docker-compose restart postgres
```

### Stop/Start Services
```bash
# Stop all
docker-compose stop

# Start all
docker-compose start

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (⚠️ deletes data!)
docker-compose down -v
```

### Update Code
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or rebuild specific service
docker-compose up -d --build backend
```

### Database Backup
```bash
# Backup database
docker-compose exec postgres pg_dump -U portfolio_user portfolio_cms_2026 > backup.sql

# Restore database
docker-compose exec -T postgres psql -U portfolio_user portfolio_cms_2026 < backup.sql
```

### Access Database
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U portfolio_user -d portfolio_cms_2026

# Run SQL query
docker-compose exec postgres psql -U portfolio_user -d portfolio_cms_2026 -c "SELECT * FROM projects;"
```

### Monitor Resources
```bash
# View resource usage
docker stats

# View container details
docker-compose ps
docker inspect portfolio-backend
```

---

## 🔒 Security Best Practices

### 1. Firewall Setup

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Block direct access to backend port (optional)
# Only allow via Nginx
sudo ufw deny 5000/tcp
```

### 2. Change Default Passwords

```bash
# Edit .env
nano .env

# Change:
# - DB_PASSWORD
# - JWT_SECRET
# - ADMIN_PASSWORD

# Restart containers
docker-compose restart
```

### 3. Regular Updates

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### 4. Enable Fail2Ban (Optional)

```bash
# Install
sudo apt install fail2ban -y

# Configure
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 Monitoring

### 1. Setup Uptime Monitoring

**UptimeRobot** (Free):
- Monitor: https://api.4leafclover.id/health
- Alert via email/SMS when down

### 2. View Logs

```bash
# Backend logs
docker-compose logs -f backend

# Nginx logs
sudo tail -f /var/log/nginx/portfolio-api-access.log
sudo tail -f /var/log/nginx/portfolio-api-error.log
```

### 3. Database Monitoring

```bash
# Check connections
docker-compose exec postgres psql -U portfolio_user -d portfolio_cms_2026 -c "SELECT count(*) FROM pg_stat_activity;"

# Check database size
docker-compose exec postgres psql -U portfolio_user -d portfolio_cms_2026 -c "SELECT pg_size_pretty(pg_database_size('portfolio_cms_2026'));"
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Database not ready: Wait for postgres to be healthy
# - Port already in use: Change port in docker-compose.yml
# - Environment variables missing: Check .env file
```

### Database Connection Error

```bash
# Check database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U portfolio_user -d portfolio_cms_2026 -c "SELECT 1;"
```

### Nginx 502 Bad Gateway

```bash
# Check backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend

# Test backend directly
curl http://localhost:5000/health

# Check Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a

# Clean old logs
sudo journalctl --vacuum-time=7d
```

---

## 🔄 Update Process

### Code Updates

```bash
# SSH to VPS
ssh user@your-vps-ip

# Pull latest code
cd /home/user/portfolio
git pull

# Rebuild and restart
docker-compose up -d --build

# Check logs
docker-compose logs -f backend
```

### Database Schema Changes

```bash
# Create migration file locally
# Upload to VPS
# Run migration
docker-compose exec backend node src/database/your-migration.js
```

---

## 💰 Cost Comparison

| Platform | Cost | Resources | Sleep Mode |
|----------|------|-----------|------------|
| **VPS** | $5-10/month | Full control | ❌ No |
| Render Free | $0 | 256MB DB, 750hrs | ✅ Yes |
| Railway | $5 credit | 500MB DB | ❌ No |

**VPS Advantages**:
- Always-on
- Full control
- Better performance
- No limitations

---

## 🎯 Next Steps (Optional)

### 1. Setup Monitoring Dashboard

**Portainer** (Docker GUI):
```bash
docker run -d -p 9000:9000 --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Access: http://your-vps-ip:9000

### 2. Setup Automated Backups

```bash
# Create backup script
nano /home/user/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U portfolio_user portfolio_cms_2026 > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz backend/uploads/

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /home/user/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/user/backup.sh
```

### 3. Setup CI/CD

**GitHub Actions** untuk auto-deploy:
- Push ke GitHub
- Auto-deploy ke VPS
- Run tests
- Notify on Slack/Discord

---

**Selamat! Portfolio Anda sudah production-ready di VPS! 🎊**

**Keuntungan VPS**:
- ✅ Always-on (no cold start)
- ✅ Full control
- ✅ Better performance
- ✅ Unlimited resources (sesuai VPS)
- ✅ Production-grade

