# 🔗 API Endpoint Mapping - Old vs New

## Overview

Mapping dari Express.js endpoints (VPS) ke Netlify Functions endpoints.

---

## 🔐 Authentication Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/auth/login` | `/auth-login` | POST | No |
| `/api/auth/profile` | `/auth-profile` | GET | Yes |
| `/api/auth/change-password` | `/auth-change-password` | POST | Yes |

---

## 📁 Projects Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/projects` | `/projects` | GET | No |
| `/api/projects/:id` | `/projects/:id` | GET | No |
| `/api/projects` | `/projects` | POST | Yes |
| `/api/projects/:id` | `/projects/:id` | PUT | Yes |
| `/api/projects/:id` | `/projects/:id` | DELETE | Yes |

---

## 💼 Experiences Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/experiences` | `/experiences` | GET | No |
| `/api/experiences/:id` | `/experiences/:id` | GET | No |
| `/api/experiences` | `/experiences` | POST | Yes |
| `/api/experiences/:id` | `/experiences/:id` | PUT | Yes |
| `/api/experiences/:id` | `/experiences/:id` | DELETE | Yes |

---

## 👤 About Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/about` | `/about` | GET | No |
| `/api/about` | `/about` | PUT | Yes |

---

## 📝 About Info Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/about-info` | `/about-info` | GET | No |
| `/api/about-info` | `/about-info` | PUT | Yes |

---

## 📞 Contact Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/contact` | `/contact` | GET | No |
| `/api/contact` | `/contact` | PUT | Yes |

---

## 💬 Messages Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/messages` | `/messages` | GET | Yes |
| `/api/messages/:id` | `/messages/:id` | GET | Yes |
| `/api/messages` | `/messages` | POST | No (Public contact form) |
| `/api/messages/:id/status` | `/messages/:id/status` | PATCH | Yes |
| `/api/messages/:id` | `/messages/:id` | DELETE | Yes |

---

## 📰 Blog Posts Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/blog/posts` | `/blog-posts` | GET | No |
| `/api/blog/posts/:id` | `/blog-posts/:id` | GET | No |
| `/api/blog/posts/slug/:slug` | `/blog-posts/slug/:slug` | GET | No |
| `/api/blog/posts` | `/blog-posts` | POST | Yes |
| `/api/blog/posts/:id` | `/blog-posts/:id` | PUT | Yes |
| `/api/blog/posts/:id` | `/blog-posts/:id` | DELETE | Yes |

---

## 💭 Testimonials Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/testimonials` | `/testimonials` | GET | No |
| `/api/testimonials?project_id=X` | `/testimonials?project_id=X` | GET | No |
| `/api/testimonials/:id` | `/testimonials/:id` | GET | No |
| `/api/testimonials` | `/testimonials` | POST | Yes |
| `/api/testimonials/:id` | `/testimonials/:id` | PUT | Yes |
| `/api/testimonials/:id` | `/testimonials/:id` | DELETE | Yes |

---

## 🎯 Skills Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/skills` | `/skills` | GET | No |
| `/api/skills/:id` | `/skills/:id` | GET | No |
| `/api/skills` | `/skills` | POST | Yes |
| `/api/skills/:id` | `/skills/:id` | PUT | Yes |
| `/api/skills/:id` | `/skills/:id` | DELETE | Yes |

---

## 🎓 Certifications Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/certifications` | `/certifications` | GET | No |
| `/api/certifications/:id` | `/certifications/:id` | GET | No |
| `/api/certifications` | `/certifications` | POST | Yes |
| `/api/certifications/:id` | `/certifications/:id` | PUT | Yes |
| `/api/certifications/:id` | `/certifications/:id` | DELETE | Yes |

---

## 📧 Newsletter Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/newsletter/subscribers` | `/newsletter-subscribers` | GET | Yes |
| `/api/newsletter/subscribe` | `/newsletter-subscribe` | POST | No |
| `/api/newsletter/unsubscribe/:email` | `/newsletter-unsubscribe/:email` | POST | No |
| `/api/newsletter/subscribers/:id` | `/newsletter-subscribers/:id` | DELETE | Yes |

---

## 📊 Analytics Endpoints

| Old Endpoint (VPS) | New Endpoint (Netlify) | Method | Auth Required |
|-------------------|------------------------|--------|---------------|
| `/api/analytics/track` | `/analytics-track` | POST | No |
| `/api/analytics/statistics` | `/analytics-statistics` | GET | Yes |
| `/api/analytics/activities` | `/analytics-activities` | GET | Yes |
| `/api/analytics/chart` | `/analytics-chart` | GET | Yes |

---

## 🔄 Frontend API Service Changes

File: `porto/src/services/api.js`

### Changed:
```javascript
// OLD
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// NEW
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// But in production (netlify.toml): VITE_API_BASE_URL = "/.netlify/functions"
```

### Auth API:
```javascript
// OLD
login: (email, password) => api.post('/auth/login', { email, password })

// NEW
login: (email, password) => api.post('/auth-login', { email, password })
```

### Blog API:
```javascript
// OLD
getAll: (params) => api.get('/blog/posts', { params })

// NEW
getAll: (params) => api.get('/blog-posts', { params })
```

### Newsletter API:
```javascript
// OLD
getSubscribers: () => api.get('/newsletter/subscribers')

// NEW
getSubscribers: () => api.get('/newsletter-subscribers')
```

### Analytics API:
```javascript
// OLD
trackEvent: (data) => api.post('/analytics/track', data)

// NEW
trackEvent: (data) => api.post('/analytics-track', data)
```

---

## 🌐 Full URL Examples

### Development (Local):
```
http://localhost:5000/api/projects
```

### Production (Old - VPS):
```
http://43.228.213.128/api/projects  ❌ Mixed Content Error
```

### Production (New - Netlify Functions):
```
https://4leafclover.id/.netlify/functions/projects  ✅ HTTPS
```

---

## 📝 Notes

1. **Netlify Functions** otomatis menambahkan prefix `/.netlify/functions/` ke semua function calls
2. **Frontend tidak perlu tahu** tentang prefix ini karena sudah di-set di `VITE_API_BASE_URL`
3. **Authentication** menggunakan JWT token yang sama seperti sebelumnya
4. **CORS** otomatis di-handle oleh Netlify Functions untuk same-origin requests
5. **Response format** sama persis dengan Express.js backend

---

## ✅ Testing Endpoints

### Test Public Endpoint:
```bash
curl https://4leafclover.id/.netlify/functions/projects
```

### Test Protected Endpoint:
```bash
# 1. Login dulu untuk dapat token
curl -X POST https://4leafclover.id/.netlify/functions/auth-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@4leafclover.id","password":"YourPassword123"}'

# 2. Copy token dari response

# 3. Use token untuk protected endpoint
curl https://4leafclover.id/.netlify/functions/auth-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Last Updated**: January 3, 2026
