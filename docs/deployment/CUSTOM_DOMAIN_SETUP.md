# 🌐 Custom Domain Setup Guide

Panduan setup custom domain untuk portfolio Anda (contoh: www.johndoe.com)

---

## 📋 Prerequisites

- [ ] Domain sudah dibeli (Namecheap, GoDaddy, Cloudflare, dll)
- [ ] Portfolio sudah deploy di Vercel
- [ ] Backend sudah deploy di Railway

---

## 🎯 Setup Frontend Domain (Vercel)

### Step 1: Add Domain di Vercel

1. **Buka Vercel Dashboard**
   - Pilih project Anda
   - Settings → Domains

2. **Add Domain**
   - Masukkan domain: `johndoe.com`
   - Click "Add"

3. **Vercel akan memberikan DNS records**:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Step 2: Configure DNS di Domain Provider

#### Option A: Namecheap

1. Login ke Namecheap
2. Domain List → Manage → Advanced DNS
3. Add Records:
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic

   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

#### Option B: GoDaddy

1. Login ke GoDaddy
2. My Products → DNS
3. Add Records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600
   ```

#### Option C: Cloudflare

1. Login ke Cloudflare
2. Select domain → DNS
3. Add Records:
   ```
   Type: A
   Name: @
   IPv4: 76.76.21.21
   Proxy: ON (orange cloud)

   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy: ON (orange cloud)
   ```

### Step 3: Verify Domain

1. **Kembali ke Vercel**
2. **Refresh page**
3. **Wait for verification** (bisa 5 menit - 48 jam)
4. **Status akan berubah**: "Valid Configuration"

### Step 4: SSL Certificate

- Vercel otomatis generate SSL certificate
- HTTPS akan aktif dalam beberapa menit
- Certificate auto-renew

---

## 🔧 Setup Backend Domain (Railway)

### Option 1: Subdomain (Recommended)

Gunakan subdomain untuk API: `api.johndoe.com`

#### Step 1: Add Custom Domain di Railway

1. **Railway Dashboard**
   - Backend service → Settings
   - Domains → Add Custom Domain
   - Masukkan: `api.johndoe.com`

2. **Railway akan memberikan CNAME**:
   ```
   Type: CNAME
   Name: api
   Value: xxx.railway.app
   ```

#### Step 2: Add DNS Record

Di domain provider Anda:
```
Type: CNAME
Name: api
Value: xxx.railway.app (dari Railway)
TTL: Automatic/600
```

#### Step 3: Verify

- Railway akan auto-verify
- SSL certificate otomatis
- Status: "Active"

### Option 2: Path-based (Alternative)

Gunakan Vercel rewrites untuk proxy ke Railway.

**Vercel Configuration** (`vercel.json`):
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.railway.app/api/:path*"
    }
  ]
}
```

Dengan ini, API accessible via: `johndoe.com/api/*`

---

## 🔄 Update Environment Variables

### 1. Update Backend CORS

**Railway** → Backend service → Variables:
```env
FRONTEND_URL=https://johndoe.com
```

Redeploy (automatic).

### 2. Update Frontend API URL

**Vercel** → Project → Settings → Environment Variables:
```env
VITE_API_BASE_URL=https://api.johndoe.com/api
```

Atau jika pakai path-based:
```env
VITE_API_BASE_URL=https://johndoe.com/api
```

Redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## ✅ Verification Checklist

### DNS Propagation

Check DNS propagation:
```bash
# Check A record
nslookup johndoe.com

# Check CNAME
nslookup www.johndoe.com
nslookup api.johndoe.com
```

Online tools:
- https://dnschecker.org
- https://www.whatsmydns.net

### SSL Certificate

1. Visit `https://johndoe.com`
2. Click padlock icon
3. Verify certificate is valid
4. Issued by: Let's Encrypt (Vercel) or Railway

### API Connection

Test API:
```bash
curl https://api.johndoe.com/health
# Should return: {"status":"OK","message":"Portfolio CMS API is running"}
```

### Frontend

1. Visit `https://johndoe.com`
2. Check homepage loads
3. Test admin login: `https://johndoe.com/admin/login`
4. Verify no CORS errors in console

---

## 🎨 Email Setup (Optional)

Setup professional email: `contact@johndoe.com`

### Option 1: Google Workspace

1. **Sign up**: https://workspace.google.com
2. **Verify domain**
3. **Add MX records**:
   ```
   Priority: 1
   Value: ASPMX.L.GOOGLE.COM

   Priority: 5
   Value: ALT1.ASPMX.L.GOOGLE.COM
   ```

**Cost**: $6/user/month

### Option 2: Zoho Mail (Free)

1. **Sign up**: https://www.zoho.com/mail
2. **Verify domain**
3. **Add MX records**:
   ```
   Priority: 10
   Value: mx.zoho.com

   Priority: 20
   Value: mx2.zoho.com
   ```

**Cost**: FREE (up to 5 users)

### Option 3: Cloudflare Email Routing (Free)

1. **Cloudflare Dashboard**
2. **Email → Email Routing**
3. **Add destination email**
4. **Create routing rule**:
   ```
   contact@johndoe.com → your-personal@gmail.com
   ```

**Cost**: FREE

---

## 🔒 Security Best Practices

### 1. Force HTTPS

**Vercel**: Automatic

**Cloudflare**: 
- SSL/TLS → Overview
- Mode: "Full (strict)"
- Always Use HTTPS: ON

### 2. Security Headers

Create `vercel.json` in `porto/`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 3. Rate Limiting

**Cloudflare**:
- Security → WAF
- Create rate limiting rule
- Example: 100 requests/minute per IP

---

## 📊 Analytics & Monitoring

### Google Analytics

1. **Create GA4 property**
2. **Get Measurement ID**: G-XXXXXXXXXX
3. **Add to frontend**:

Create `porto/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Google Search Console

1. **Add property**: https://search.google.com/search-console
2. **Verify ownership** (DNS or HTML file)
3. **Submit sitemap**: `https://johndoe.com/sitemap.xml`

---

## 🚀 Performance Optimization

### 1. CDN (Cloudflare)

If using Cloudflare:
- Speed → Optimization
- Auto Minify: ON (JS, CSS, HTML)
- Brotli: ON
- Early Hints: ON

### 2. Image Optimization

Use Vercel Image Optimization:
```jsx
import Image from 'next/image'

<Image 
  src="/profile.jpg" 
  width={500} 
  height={500}
  alt="Profile"
/>
```

### 3. Caching

**Vercel** handles caching automatically.

**Cloudflare**:
- Caching → Configuration
- Browser Cache TTL: 4 hours
- Always Online: ON

---

## 🐛 Troubleshooting

### Domain Not Resolving

1. **Check DNS propagation**: https://dnschecker.org
2. **Wait 24-48 hours** for full propagation
3. **Clear DNS cache**:
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac
   sudo dscacheutil -flushcache

   # Linux
   sudo systemd-resolve --flush-caches
   ```

### SSL Certificate Error

1. **Wait for certificate generation** (5-10 minutes)
2. **Check Vercel/Railway dashboard** for status
3. **Force refresh**: Ctrl+Shift+R
4. **Clear browser cache**

### CORS Error After Domain Change

1. **Update FRONTEND_URL** in Railway
2. **Redeploy backend**
3. **Clear browser cache**
4. **Test in incognito mode**

### Email Not Working

1. **Check MX records**: https://mxtoolbox.com
2. **Wait for DNS propagation**
3. **Verify SPF/DKIM records**
4. **Check spam folder**

---

## 💰 Cost Summary

### Domain
- **Namecheap**: $8-15/year
- **GoDaddy**: $12-20/year
- **Cloudflare**: $9-10/year

### Email (Optional)
- **Google Workspace**: $6/month
- **Zoho Mail**: FREE
- **Cloudflare Routing**: FREE

### Hosting
- **Vercel**: FREE (or $20/month Pro)
- **Railway**: FREE (or $5/month)

**Total**: $8-15/year (domain only) + optional email

---

## ✅ Final Checklist

- [ ] Domain purchased
- [ ] DNS records configured
- [ ] Domain verified on Vercel
- [ ] Custom domain added to Railway
- [ ] Environment variables updated
- [ ] SSL certificates active
- [ ] HTTPS working
- [ ] API accessible
- [ ] No CORS errors
- [ ] Email configured (optional)
- [ ] Analytics setup
- [ ] Search Console verified

---

## 🎉 Success!

Portfolio Anda sekarang accessible via custom domain:
- **Frontend**: https://johndoe.com
- **API**: https://api.johndoe.com
- **Admin**: https://johndoe.com/admin
- **Email**: contact@johndoe.com (optional)

**Selamat! Domain custom Anda sudah aktif! 🌐**
