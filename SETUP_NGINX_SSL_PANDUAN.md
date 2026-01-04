# 🔒 Panduan Setup Nginx + SSL untuk api.4leafclover.id

## 📋 Status Saat Ini

✅ **Frontend**: Sudah di-deploy di Netlify dengan konfigurasi HTTPS  
✅ **Backend**: Berjalan di VPS (43.228.213.128:5000)  
✅ **DNS Record**: Sudah ditambahkan di CloudHost (`api` → `43.228.213.128`)  
⏳ **DNS Propagation**: Masih dalam proses (butuh 30 menit - 2 jam)  
❌ **SSL**: Belum terinstall  

## 🎯 Tujuan

Setup Nginx sebagai reverse proxy dan install SSL certificate agar:
- Backend bisa diakses via `https://api.4leafclover.id`
- Tidak ada Mixed Content Error
- Website bisa login dan berfungsi normal

## 📝 Langkah-Langkah

### STEP 1: Setup Nginx (Lakukan Sekarang)

1. **Login ke VPS Anda**:
   ```bash
   ssh root@43.228.213.128
   ```

2. **Download script setup**:
   ```bash
   curl -o setup-nginx-ssl.sh https://raw.githubusercontent.com/[YOUR-REPO]/main/scripts/setup-nginx-ssl.sh
   ```
   
   ATAU copy manual script dari file `scripts/setup-nginx-ssl.sh`

3. **Jalankan script**:
   ```bash
   chmod +x setup-nginx-ssl.sh
   ./setup-nginx-ssl.sh
   ```

4. **Verifikasi Nginx berjalan**:
   ```bash
   systemctl status nginx
   curl http://localhost:5000/health  # Test backend langsung
   curl http://43.228.213.128/health  # Test via Nginx
   ```

### STEP 2: Tunggu DNS Propagate (30 menit - 2 jam)

Cek DNS secara berkala dengan command ini:

```bash
nslookup api.4leafclover.id 8.8.8.8
```

**Jika DNS sudah working**, Anda akan melihat:
```
Server:  dns.google
Address:  8.8.8.8

Name:    api.4leafclover.id
Address: 43.228.213.128
```

**Jika DNS belum working**, Anda akan melihat:
```
*** dns.google can't find api.4leafclover.id: Non-existent domain
```

### STEP 3: Install SSL Certificate (Setelah DNS Working)

1. **Jalankan command ini di VPS**:
   ```bash
   certbot --nginx -d api.4leafclover.id --non-interactive --agree-tos --email admin@4leafclover.id
   ```

2. **Certbot akan otomatis**:
   - Generate SSL certificate dari Let's Encrypt
   - Update konfigurasi Nginx untuk HTTPS
   - Setup auto-redirect dari HTTP ke HTTPS
   - Setup auto-renewal setiap 90 hari

3. **Test HTTPS**:
   ```bash
   curl https://api.4leafclover.id/health
   ```

### STEP 4: Test Website

1. Buka browser dan akses: `https://4leafclover.id/admin/login`
2. Login dengan credentials:
   - Email: `admin@4leafclover.id`
   - Password: `YourAdminPassword123!`
3. Seharusnya tidak ada Mixed Content Error lagi

## 🔧 Troubleshooting

### Problem: Nginx tidak bisa start

**Cek error log**:
```bash
journalctl -u nginx -n 50
```

**Cek konfigurasi**:
```bash
nginx -t
```

### Problem: Port 80/443 sudah digunakan

**Cek process yang menggunakan port**:
```bash
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

**Stop process yang conflict**:
```bash
systemctl stop apache2  # Jika ada Apache
```

### Problem: Certbot gagal install SSL

**Pastikan DNS sudah working**:
```bash
nslookup api.4leafclover.id
```

**Cek firewall**:
```bash
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
```

### Problem: Backend tidak bisa diakses via Nginx

**Cek backend masih running**:
```bash
docker ps
curl http://localhost:5000/health
```

**Restart backend jika perlu**:
```bash
cd /root/backend
docker-compose restart
```

## 📊 Konfigurasi Nginx

File konfigurasi ada di: `/etc/nginx/sites-available/api.4leafclover.id`

```nginx
server {
    listen 80;
    server_name api.4leafclover.id;

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

Setelah SSL terinstall, Certbot akan otomatis menambahkan konfigurasi HTTPS.

## ✅ Checklist

- [ ] Nginx terinstall dan berjalan
- [ ] Konfigurasi Nginx untuk api.4leafclover.id sudah dibuat
- [ ] Backend bisa diakses via `http://43.228.213.128/health`
- [ ] DNS sudah propagate (`nslookup api.4leafclover.id` berhasil)
- [ ] SSL certificate terinstall
- [ ] HTTPS berfungsi (`https://api.4leafclover.id/health` berhasil)
- [ ] Website bisa login tanpa Mixed Content Error

## 🚀 Quick Commands

```bash
# Cek status Nginx
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# Cek DNS
nslookup api.4leafclover.id 8.8.8.8

# Test backend langsung
curl http://localhost:5000/health

# Test via Nginx HTTP
curl http://api.4leafclover.id/health

# Test via Nginx HTTPS (setelah SSL)
curl https://api.4leafclover.id/health

# Cek SSL certificate
certbot certificates

# Test SSL renewal
certbot renew --dry-run
```

## 📞 Bantuan

Jika ada masalah, cek:
1. Backend logs: `docker logs backend-app-1`
2. Nginx logs: `tail -f /var/log/nginx/error.log`
3. Certbot logs: `tail -f /var/log/letsencrypt/letsencrypt.log`
