# Fix Upload URLs - Mixed Content Error

## Masalah
Website menggunakan hardcode `http://localhost:5000` untuk menampilkan gambar upload, yang menyebabkan Mixed Content Error di production (HTTPS).

## Solusi
Menggunakan helper function `getUploadBaseURL()` yang otomatis menggunakan URL yang benar berdasarkan environment.

## Files yang Perlu Diupdate

### ✅ SUDAH DIUPDATE:
1. `porto/src/services/api.js` - Added `getUploadBaseURL()` function
2. `porto/src/pages/admin/AdminHome.tsx` - Updated import and image src

### ⏳ PERLU DIUPDATE:
3. `porto/src/pages/admin/AdminTestimonials.tsx` (2 locations)
4. `porto/src/pages/admin/AdminProjects.tsx` (2 locations)
5. `porto/src/pages/admin/AdminProfile.tsx` (1 location)
6. `porto/src/pages/admin/AdminCV.tsx` (1 location)
7. `porto/src/pages/admin/AdminCertifications.tsx` (2 locations)
8. `porto/src/pages/admin/AdminBlog.tsx` (2 locations)
9. `porto/src/components/TestimonialsModal.tsx` (1 location)
10. `porto/src/components/portfolio/ExperienceSection.tsx` (2 locations)
11. `porto/src/components/portfolio/ProjectsSection.tsx` (2 locations)
12. `porto/src/components/portfolio/HeroSection.tsx` (2 locations)
13. `porto/src/components/portfolio/ContactSection.tsx` (1 location)

## Pattern to Replace

### Before:
```tsx
src={`http://localhost:5000${imageUrl}`}
```

### After:
```tsx
import { getUploadBaseURL } from "@/services/api";
// ...
src={`${getUploadBaseURL()}${imageUrl}`}
```

## Status
- Helper function created ✅
- AdminHome updated ✅
- Remaining files: 12 files to update

## Next Steps
Saya akan update semua file yang tersisa satu per satu.
