# Contact Form Security Implementation

## Overview
Implementasi keamanan lengkap untuk melindungi contact form dari spam, SQL injection, XSS attacks, dan abuse.

## Security Features Implemented

### 1. Rate Limiting
**File**: `backend/src/middleware/rateLimiter.js`

- **Contact Form Limiter**: Maksimal 3 pesan per 15 menit per IP address
- **General API Limiter**: Maksimal 100 request per 15 menit per IP address
- Rate limit di-skip untuk authenticated admin users
- Response headers menunjukkan rate limit info

**Cara Kerja**:
```javascript
// User hanya bisa kirim 3 pesan dalam 15 menit
// Setelah itu akan mendapat error 429 (Too Many Requests)
// Setelah 15 menit, counter akan reset
```

### 2. Input Validation
**File**: `backend/src/controllers/messagesController.js`

**Validasi yang diterapkan**:
- **Name**: 
  - Required
  - 2-100 karakter
  - Hanya huruf, spasi, tanda hubung, dan apostrof
  
- **Email**: 
  - Required
  - Format email valid
  - Maksimal 255 karakter
  - Auto-normalized (lowercase, trim whitespace)
  
- **Message**: 
  - Required
  - 10-5000 karakter
  - Tidak boleh kosong atau hanya whitespace

### 3. XSS Protection (Cross-Site Scripting)
**Library**: `xss` package

**Proteksi**:
- Semua input di-sanitize untuk menghapus HTML tags
- Script tags, iframe, dan JavaScript code dihapus otomatis
- Deteksi pattern berbahaya:
  - `<script>` tags
  - `javascript:` protocol
  - Event handlers (`onclick`, `onerror`, dll)
  - `<iframe>` tags
  - `eval()` dan `expression()` functions

### 4. SQL Injection Protection
**Metode**: Parameterized Queries

```javascript
// ✅ AMAN - Menggunakan parameterized query
pool.query(
  'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
  [name, email, subject, message]
);

// ❌ TIDAK AMAN - String concatenation
pool.query(`INSERT INTO contact_messages VALUES ('${name}', '${email}')`);
```

### 5. Client-Side Validation
**File**: `porto/src/components/portfolio/ContactSection.tsx`

**Features**:
- Real-time validation sebelum submit
- Error messages yang jelas untuk setiap field
- Character counter untuk message (max 5000)
- Visual feedback (red border) untuk field yang error
- Deteksi suspicious content di client-side

### 6. Logging & Monitoring
**File**: `backend/src/controllers/messagesController.js`

**Log yang dicatat**:
- Setiap message yang berhasil dikirim (ID, email, IP, timestamp)
- Deteksi suspicious content (IP, name, email)
- Error yang terjadi

```javascript
console.log('Message received:', { 
  id: result.rows[0].id, 
  from: email, 
  ip: req.ip,
  timestamp: new Date().toISOString()
});
```

## Testing Security Features

### Test 1: Rate Limiting
```bash
# Kirim 4 pesan berturut-turut dalam waktu singkat
# Pesan ke-4 akan ditolak dengan error 429
curl -X POST https://api.4leafclover.id/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test message"}'
```

**Expected Result**: Pesan ke-4 akan mendapat response:
```json
{
  "error": "Too many messages sent from this IP, please try again after 15 minutes"
}
```

### Test 2: XSS Attack Prevention
```bash
# Coba kirim message dengan script tag
curl -X POST https://api.4leafclover.id/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Hacker","email":"hack@test.com","message":"<script>alert(\"XSS\")</script>"}'
```

**Expected Result**:
```json
{
  "error": "Invalid content detected. Please remove any HTML or script tags."
}
```

### Test 3: Input Validation
```bash
# Coba kirim message terlalu pendek
curl -X POST https://api.4leafclover.id/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"invalid-email","message":"Hi"}'
```

**Expected Result**:
```json
{
  "error": "Validation failed",
  "details": [
    "Name must be between 2 and 100 characters",
    "Please provide a valid email address",
    "Message must be between 10 and 5000 characters"
  ]
}
```

### Test 4: SQL Injection Prevention
```bash
# Coba SQL injection attack
curl -X POST https://api.4leafclover.id/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Robert","email":"test@test.com","message":"Test\"; DROP TABLE contact_messages; --"}'
```

**Expected Result**: Message tersimpan dengan aman, SQL injection tidak dieksekusi karena menggunakan parameterized query.

## Deployment Steps

### 1. Update Backend di VPS
```bash
# SSH ke VPS
ssh root@43.228.213.128

# Navigate ke project directory
cd /root/n8n-production/portfolio

# Pull latest code
git pull origin main

# Install dependencies
cd backend
npm install

# Restart backend container
cd ..
docker-compose restart backend
```

### 2. Update Frontend
```bash
# Di local machine
cd porto
npm run build

# Push ke GitHub
git add .
git commit -m "Add contact form security features"
git push origin main

# Netlify akan auto-deploy
```

## Monitoring & Maintenance

### Check Logs
```bash
# SSH ke VPS
ssh root@43.228.213.128

# View backend logs
docker logs portfolio-backend --tail 100 -f
```

### Monitor Suspicious Activity
Perhatikan log untuk:
- Multiple failed validation attempts dari IP yang sama
- Suspicious content detection warnings
- Rate limit violations

### Adjust Rate Limits (Optional)
Edit `backend/src/middleware/rateLimiter.js`:
```javascript
export const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ubah durasi window
  max: 3, // Ubah jumlah maksimal request
  // ...
});
```

## Additional Security Recommendations

### 1. Add Google reCAPTCHA (Optional)
Untuk proteksi tambahan dari bot:
- Daftar di https://www.google.com/recaptcha/admin
- Install `react-google-recaptcha` di frontend
- Verify token di backend

### 2. Email Notifications
Setup email notification untuk admin saat ada message baru:
- Install `nodemailer`
- Configure SMTP settings
- Send email setelah message berhasil disimpan

### 3. IP Blacklist (Optional)
Jika ada IP yang terus melakukan abuse:
```javascript
const blacklistedIPs = ['1.2.3.4', '5.6.7.8'];

app.use((req, res, next) => {
  if (blacklistedIPs.includes(req.ip)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
});
```

### 4. Database Backup
Pastikan database di-backup secara regular:
```bash
# Backup database
docker exec portfolio-db pg_dump -U postgres portfolio_cms_2026 > backup.sql

# Setup cron job untuk auto backup
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## Summary

✅ **Implemented**:
- Rate limiting (3 messages per 15 minutes)
- Input validation (name, email, message)
- XSS protection (sanitize all inputs)
- SQL injection protection (parameterized queries)
- Client-side validation with error messages
- Suspicious content detection
- Logging & monitoring

✅ **Protected Against**:
- Spam attacks
- SQL injection
- XSS (Cross-Site Scripting)
- HTML injection
- JavaScript injection
- Brute force attacks
- Bot attacks

✅ **User Experience**:
- Clear error messages
- Character counter
- Visual feedback
- Rate limit notification
- Smooth form submission

## Contact Form Security Status: PRODUCTION READY ✅
