# 🔒 SSL/HTTPS Setup Guide untuk Backend API

Panduan lengkap untuk setup HTTPS di VPS agar frontend (HTTPS) bisa connect ke backend.

**Problem**: Mixed Content Error
- Frontend: `https://4leafclover.id` (HTTPS)
- Backend: `http://43.228.213.128` (HTTP)
- Browser blocks HTTP requests from HTTPS pages

**Solution**: Setup SSL certificate untuk backend API

---

## 📋 Prerequisites

- Domain: `4leafclover.id` (sudah ada)
- Subdomain: `api.4leafclover.id` (akan dibuat)
- VPS IP: `43.228.213.128`
- Email: (untuk Let's Encrypt notifications)

---

## 🌐 STEP 1: Setup DNS A Record (5 menit)

Login ke DNS provider Anda (tempat domain `4leafclover.id` terdaftar) dan tambahkan A Record:

```
Type: A
Name: api
Value: 43.228.213.128
TTL: 3600 (atau Auto)
```

**Hasil**: `api.4leafclover.id` akan pointing ke VPS Anda.

**Test DNS** (tunggu 5-10 menit untuk propagasi):
```bash
ping api.4leafclover.id
# Should return: 43.228.213.128
```

---

## 🔧 STEP 2: Install Certbot di VPS (3 menit)

SSH ke VPS dan install Certbot:

```bash
# SSH ke VPS
ssh root@43.228.213.128

# Install Certbot dan Nginx plugin
apt update
apt install certbot python3-certbot-nginx -y

# Verify installation
certbot --version
```

---

## 📝 STEP 3: Update Nginx Configuration (5 menit)

Update Nginx config untuk menggunakan domain:

```bash
# Edit Nginx config
nano /etc/nginx/sites-available/portfolio-api
```

**Replace dengan config ini**:

```nginx
server {
    listen 80;
    server_name api.4leafclover.id;

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

**Save**: `Ctrl+X`, `Y`, `Enter`

**Test dan reload Nginx**:
```bash
# Test config
nginx -t

# Reload Nginx
systemctl reload nginx
```

**Test HTTP** (sebelum SSL):
```bash
curl http://api.4leafclover.id/health
# Should return: {"status":"OK","message":"Portfolio CMS API is running"}
```

---

## 🔐 STEP 4: Generate SSL Certificate (3 menit)

Generate FREE SSL certificate dari Let's Encrypt:

```bash
# Generate SSL certificate
certbot --nginx -d api.4leafclover.id

# Follow prompts:
# 1. Enter email address: your-email@example.com
# 2. Agree to Terms of Service: Y
# 3. Share email with EFF: N (optional)
# 4. Redirect HTTP to HTTPS: 2 (Yes, redirect)
```

**Certbot akan otomatis**:
- Generate SSL certificate
- Update Nginx config untuk HTTPS
- Setup auto-redirect dari HTTP ke HTTPS
- Configure auto-renewal

**Expected output**:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/api.4leafclover.id/fullchain.pem
Key is saved at: /etc/letsencrypt/live/api.4leafclover.id/privkey.pem
```

---

## ✅ STEP 5: Test HTTPS (1 menit)

Test SSL certificate:

```bash
# Test HTTPS endpoint
curl https://api.4leafclover.id/health

# Expected: {"status":"OK","message":"Portfolio CMS API is running"}
```

**Test di browser**:
- Buka: https://api.4leafclover.id/health
- Should show JSON response
- Lock icon di address bar (secure)

---

## 🔄 STEP 6: Update Netlify Environment Variable (2 menit)

Update frontend untuk menggunakan HTTPS backend:

### Option A: Via Netlify Dashboard

1. **Buka**: https://app.netlify.com
2. **Sites** → **blackcatz3**
3. **Site configuration** → **Environment variables**
4. **Edit** `VITE_API_BASE_URL`:
   ```
   https://api.4leafclover.id/api
   ```
5. **Save**
6. **Deploys** tab → **Trigger deploy** → **Deploy site**

### Option B: Via netlify.toml (Recommended)

Update `netlify.toml`:

```toml
[build]
  base = "porto"
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_BASE_URL = "https://api.4leafclover.id/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Then:
```bash
git add netlify.toml
git commit -m "Update API URL to HTTPS"
git push origin main
```

Netlify will auto-deploy.

---

## 🔄 STEP 7: Update Backend CORS (2 menit)

Update backend `.env` di VPS:

```bash
# SSH ke VPS
ssh root@43.228.213.128

# Edit .env
cd /root/portfolio
nano .env
```

**Update FRONTEND_URL**:
```env
FRONTEND_URL=https://4leafclover.id
```

**Save**: `Ctrl+X`, `Y`, `Enter`

**Restart backend**:
```bash
docker-compose restart backend

# Wait 10 seconds
sleep 10

# Check logs
docker-compose logs backend --tail 20
```

---

## 🎉 STEP 8: Test Full Stack (2 menit)

1. **Wait** for Netlify deploy to complete (2-3 minutes)
2. **Visit**: https://4leafclover.id/admin/login
3. **Open Console** (F12) - Should see NO mixed content errors
4. **Login** with:
   - Email: `admin@4leafclover.id`
   - Password: `YourAdminPassword123!`

**If successful**: You're now fully HTTPS! 🎊

---

## 🔄 Auto-Renewal SSL Certificate

Certbot automatically sets up auto-renewal. Verify:

```bash
# Test renewal (dry run)
certbot renew --dry-run

# Expected: "Congratulations, all simulated renewals succeeded"
```

**Auto-renewal runs twice daily**. Certificate will auto-renew 30 days before expiration.

**Check renewal timer**:
```bash
systemctl status certbot.timer
```

---

## 📊 Final URLs

After setup complete:

| Service | URL | Protocol |
|---------|-----|----------|
| **Frontend** | https://4leafclover.id | HTTPS ✅ |
| **Backend API** | https://api.4leafclover.id | HTTPS ✅ |
| **Admin Login** | https://4leafclover.id/admin/login | HTTPS ✅ |
| **Database** | VPS Internal (Docker) | N/A |

---

## 🐛 Troubleshooting

### SSL Certificate Failed

```bash
# Check DNS
dig api.4leafclover.id

# Check Nginx
nginx -t
systemctl status nginx

# Check firewall
ufw status

# Try again
certbot --nginx -d api.4leafclover.id
```

### Mixed Content Still Appears

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+F5)
3. **Check Netlify env**: Should be `https://api.4leafclover.id/api`
4. **Check browser console**: Look for HTTP requests

### Backend Not Responding

```bash
# Check backend
docker-compose ps backend

# Check logs
docker-compose logs backend --tail 50

# Restart
docker-compose restart backend
```

### Certificate Renewal Failed

```bash
# Check renewal
certbot renew --dry-run

# Manual renewal
certbot renew

# Check timer
systemctl status certbot.timer
```

---

## 🔒 Security Best Practices

### 1. Force HTTPS Redirect

Already configured by Certbot. Verify:

```bash
curl -I http://api.4leafclover.id
# Should return: 301 Moved Permanently
# Location: https://api.4leafclover.id/
```

### 2. HSTS Header (Optional)

Add to Nginx config for extra security:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 3. SSL Labs Test

Test SSL configuration:
- Visit: https://www.ssllabs.com/ssltest/
- Enter: `api.4leafclover.id`
- Should get A or A+ rating

---

## 📝 Summary

**What we did**:
1. ✅ Created subdomain `api.4leafclover.id`
2. ✅ Installed Certbot on VPS
3. ✅ Generated FREE SSL certificate from Let's Encrypt
4. ✅ Configured Nginx for HTTPS
5. ✅ Updated Netlify to use HTTPS backend
6. ✅ Setup auto-renewal for SSL certificate

**Result**:
- 🔒 Full HTTPS stack (frontend + backend)
- ✅ No more mixed content errors
- ✅ Secure communication
- ✅ Auto-renewing SSL certificate (valid 90 days, auto-renews)

**Cost**: $0 (FREE SSL from Let's Encrypt)

---

**Selamat! Backend API Anda sekarang aman dengan HTTPS! 🎊**
