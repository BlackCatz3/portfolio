# Script untuk mengorganisir file dokumentasi dan database
# Jalankan dengan: .\ORGANIZE_FILES.ps1

Write-Host "🗂️  Mengorganisir file dokumentasi dan database..." -ForegroundColor Cyan

# ============================================
# BUAT STRUKTUR FOLDER
# ============================================

Write-Host "`n📁 Membuat struktur folder..." -ForegroundColor Yellow

# Folder dokumentasi
New-Item -ItemType Directory -Path "docs" -Force | Out-Null
New-Item -ItemType Directory -Path "docs/deployment" -Force | Out-Null
New-Item -ItemType Directory -Path "docs/features" -Force | Out-Null
New-Item -ItemType Directory -Path "docs/security" -Force | Out-Null
New-Item -ItemType Directory -Path "docs/guides" -Force | Out-Null
New-Item -ItemType Directory -Path "docs/specs" -Force | Out-Null

# Folder database SQL
New-Item -ItemType Directory -Path "backend/src/database/sql" -Force | Out-Null

Write-Host "✅ Struktur folder dibuat" -ForegroundColor Green

# ============================================
# PINDAHKAN FILE DOKUMENTASI
# ============================================

Write-Host "`n📦 Memindahkan file dokumentasi..." -ForegroundColor Yellow

# Deployment Documentation
$deploymentDocs = @(
    "COMPLETE_DEPLOYMENT_GUIDE.md",
    "DEPLOYMENT_CHECKLIST.md",
    "DEPLOYMENT_GUIDE.md",
    "DEPLOYMENT_QUICK_REFERENCE.md",
    "DEPLOYMENT_README.md",
    "DEPLOYMENT_SUMMARY.md",
    "PRODUCTION_CHECKLIST.md",
    "QUICK_DEPLOY.md",
    "VPS_SETUP_COMMANDS.md",
    "VPS_DOCKER_DEPLOYMENT.md",
    "SSL_SETUP_GUIDE.md",
    "CLOUDFLARE_SSL_SETUP.md",
    "CLOUDFLARE_SETUP_CHECKLIST.md",
    "SETUP_NGINX_SSL_PANDUAN.md",
    "CUSTOM_DOMAIN_SETUP.md",
    "NETLIFY_RAILWAY_DEPLOY.md",
    "RENDER_FREE_DEPLOYMENT.md",
    "FREE_DEPLOYMENT_OPTIONS.md",
    "PERINTAH_INSTALL_SSL_SEKARANG.txt",
    "INSTALL_SSL_SEKARANG.txt"
)

Write-Host "  → Deployment docs..." -ForegroundColor Gray
foreach ($file in $deploymentDocs) {
    if (Test-Path $file) {
        Move-Item $file "docs/deployment/" -Force
        Write-Host "    ✓ $file" -ForegroundColor DarkGray
    }
}

# Features Documentation
$featureDocs = @(
    "TESTIMONIALS_COMPLETE_SUMMARY.md",
    "TESTIMONIALS_ADMIN_GUIDE.md",
    "TESTIMONIALS_MIGRATION_COMPLETE.md",
    "TESTIMONIALS_TO_PROJECTS_IMPLEMENTATION.md",
    "TESTIMONIALS_POPUP_FIX.md",
    "TESTIMONIALS_BEFORE_AFTER.md",
    "QUICK_START_TESTIMONIALS.md",
    "POPUP_BEHAVIOR_EXPLANATION.md",
    "ADMIN_TESTIMONIALS_UPDATE.md",
    "ANALYTICS_DASHBOARD_COMPLETE.md",
    "ANALYTICS_BLOG_TO_MESSAGES_UPDATE.md",
    "ANALYTICS_MESSAGES_TABLE_FIX.md",
    "HOME_SECTION_COMPLETE.md",
    "HOME_VS_ABOUT_GUIDE.md",
    "HOME_SKILLS_GUIDE.md",
    "SEPARATED_HOME_ABOUT_GUIDE.md",
    "HERO_HEADLINE_GUIDE.md",
    "SKILLS_BADGE_VS_TECH_STACK_EXPLAINED.txt",
    "ADD_MOBILE_SWIPE_HINT.txt",
    "ADMIN_MESSAGES_BULK_ACTIONS.txt",
    "FORCE_CLEAR_CACHE_SKILLS_UNLIMITED.txt",
    "FIX_HOME_MOBILE_OVERLAP_FINAL.txt"
)

Write-Host "  → Features docs..." -ForegroundColor Gray
foreach ($file in $featureDocs) {
    if (Test-Path $file) {
        Move-Item $file "docs/features/" -Force
        Write-Host "    ✓ $file" -ForegroundColor DarkGray
    }
}

# Security Documentation
$securityDocs = @(
    "RECAPTCHA_COMPLETE_SUMMARY.md",
    "RECAPTCHA_IMPLEMENTATION_COMPLETE.txt",
    "RECAPTCHA_SPAM_PROTECTION_EXPLAINED.txt",
    "RECAPTCHA_V2_VS_V3_EXPLAINED.txt",
    "RECAPTCHA_CHANGED_TO_CHECKBOX.txt",
    "CARA_DAFTAR_RECAPTCHA.txt",
    "CARA_DAFTAR_RECAPTCHA_V2_BARU.txt",
    "ANTI_SPAM_DEPLOYED.txt",
    "CONTACT_FORM_SUDAH_FIXED.txt",
    "CONTACT_SECURITY_IMPLEMENTATION.md",
    "CONTACT_SECTION_COMPLETE.md",
    "CONTACT_SECTION_GUIDE.md",
    "CONTACT_IMPLEMENTATION_SUMMARY.md",
    "CONTACT_ARCHITECTURE.md",
    "CONTACT_ADMIN_VS_FRONTEND.md",
    "QUICK_REFERENCE_CONTACT.md",
    "BACA_INI_RATE_LIMIT_EMAIL.txt",
    "CARA_ATUR_RATE_LIMIT_EMAIL.txt",
    "EMAIL_RATE_LIMIT_DEPLOYED.txt",
    "EMAIL_RATE_LIMIT_READY.txt",
    "RATE_LIMIT_EMAIL_DEPLOYMENT_SUCCESS.txt",
    "ADD_EMAIL_RATE_LIMIT_FEATURE.txt",
    "CREATE_RATE_LIMIT_TABLES_NOW.txt",
    "DEPLOY_EMAIL_RATE_LIMIT.txt"
)

Write-Host "  → Security docs..." -ForegroundColor Gray
foreach ($file in $securityDocs) {
    if (Test-Path $file) {
        Move-Item $file "docs/security/" -Force
        Write-Host "    ✓ $file" -ForegroundColor DarkGray
    }
}

# Guides Documentation
$guideDocs = @(
    "START_HERE.md",
    "README_MIGRATION.md",
    "BACKEND_INTEGRATION.md",
    "ENDPOINT_MAPPING.md",
    "MIGRATION_SUMMARY.md",
    "QUICK_START_MIGRATION.md",
    "NETLIFY_FUNCTIONS_COMPLETE_GUIDE.md",
    "NETLIFY_SUPABASE_MIGRATION.md",
    "WHAT_I_DID.md",
    "FIX_UPLOAD_URLS.md",
    "NETLIFY_ENV_VAR_WAJIB_DISET.txt"
)

Write-Host "  → Guides docs..." -ForegroundColor Gray
foreach ($file in $guideDocs) {
    if (Test-Path $file) {
        Move-Item $file "docs/guides/" -Force
        Write-Host "    ✓ $file" -ForegroundColor DarkGray
    }
}

# Specs Documentation
Write-Host "  → Specs docs..." -ForegroundColor Gray
if (Test-Path ".kiro/specs") {
    Move-Item ".kiro/specs/*" "docs/specs/" -Force
    Write-Host "    ✓ .kiro/specs/* → docs/specs/" -ForegroundColor DarkGray
}

# ============================================
# PINDAHKAN FILE SQL DATABASE
# ============================================

Write-Host "`n📦 Memindahkan file SQL database..." -ForegroundColor Yellow

$sqlFiles = @(
    "backend/src/database/schema.sql",
    "backend/src/database/create-rate-limit-settings.sql"
)

foreach ($file in $sqlFiles) {
    if (Test-Path $file) {
        $fileName = Split-Path $file -Leaf
        Move-Item $file "backend/src/database/sql/$fileName" -Force
        Write-Host "  ✓ $fileName" -ForegroundColor Gray
    }
}

# ============================================
# BUAT README FILES
# ============================================

Write-Host "`n📝 Membuat README files..." -ForegroundColor Yellow

# README untuk docs/
$docsReadme = @"
# 📚 Dokumentasi Portfolio

Folder ini berisi semua dokumentasi project yang masih aktif digunakan.

## 📁 Struktur Folder

### /deployment/
Dokumentasi deployment, VPS setup, SSL, dan infrastructure:
- Deployment guides
- VPS commands
- SSL setup
- Cloudflare configuration
- Production checklist

### /features/
Dokumentasi fitur-fitur aplikasi:
- Testimonials system
- Analytics dashboard
- Home & About sections
- Mobile optimizations
- Admin features

### /security/
Dokumentasi security dan anti-spam:
- ReCAPTCHA implementation
- Rate limiting
- Contact form security
- Spam protection

### /guides/
Panduan development dan setup:
- Getting started
- Backend integration
- Database migration
- Netlify functions
- API endpoints

### /specs/
Spesifikasi fitur dan requirements:
- Feature specifications
- Requirements documents
- Design documents

## 🚀 Quick Start

1. Baca **guides/START_HERE.md** untuk memulai
2. Setup backend: **guides/BACKEND_INTEGRATION.md**
3. Deploy: **deployment/DEPLOYMENT_CHECKLIST.md**

## 📞 Support

Jika ada pertanyaan, cek dokumentasi yang sesuai di folder masing-masing.
"@

Set-Content -Path "docs/README.md" -Value $docsReadme
Write-Host "  ✓ docs/README.md" -ForegroundColor Gray

# README untuk backend/src/database/sql/
$sqlReadme = @"
# 🗄️ SQL Database Files

Folder ini berisi file-file SQL untuk database schema dan configuration.

## 📋 File List

### schema.sql
Main database schema yang berisi semua table definitions.

**Cara pakai:**
``````sql
-- Import ke PostgreSQL
psql -U postgres -d portfolio_db -f schema.sql
``````

### create-rate-limit-settings.sql
SQL untuk membuat table rate limit settings.

**Cara pakai:**
``````sql
psql -U postgres -d portfolio_db -f create-rate-limit-settings.sql
``````

## 🔧 Maintenance

File-file SQL ini adalah source of truth untuk database schema.
Jangan edit langsung di database, edit file SQL ini lalu run migration.

## 📚 Related Documentation

- Migration guide: ../../docs/guides/README_MIGRATION.md
- Database setup: ../../docs/guides/BACKEND_INTEGRATION.md
"@

Set-Content -Path "backend/src/database/sql/README.md" -Value $sqlReadme
Write-Host "  ✓ backend/src/database/sql/README.md" -ForegroundColor Gray

# ============================================
# BUAT INDEX FILE
# ============================================

Write-Host "`n📝 Membuat index file..." -ForegroundColor Yellow

$indexContent = @"
# 📁 Portfolio Project - File Organization

## 🗂️ Struktur Project

``````
porto-baru/
├── docs/                          ← SEMUA DOKUMENTASI
│   ├── README.md
│   ├── deployment/                ← Deployment & Infrastructure
│   ├── features/                  ← Feature Documentation
│   ├── security/                  ← Security & Anti-Spam
│   ├── guides/                    ← Development Guides
│   └── specs/                     ← Feature Specifications
│
├── backend/
│   └── src/
│       └── database/
│           ├── sql/               ← FILE SQL DATABASE
│           │   ├── README.md
│           │   ├── schema.sql
│           │   └── create-rate-limit-settings.sql
│           │
│           └── [JavaScript files untuk migration & maintenance]
│
├── docs-archive/                  ← File lama (archived)
├── scripts/                       ← Deployment scripts
├── netlify/                       ← Netlify functions
└── porto/                         ← Frontend code
``````

## 🚀 Quick Access

### Untuk Development:
- **Start Here:** \`docs/guides/START_HERE.md\`
- **Backend Setup:** \`docs/guides/BACKEND_INTEGRATION.md\`
- **Database Migration:** \`docs/guides/README_MIGRATION.md\`

### Untuk Deployment:
- **Deployment Checklist:** \`docs/deployment/DEPLOYMENT_CHECKLIST.md\`
- **Complete Guide:** \`docs/deployment/COMPLETE_DEPLOYMENT_GUIDE.md\`
- **VPS Setup:** \`docs/deployment/VPS_SETUP_COMMANDS.md\`

### Untuk Features:
- **Testimonials:** \`docs/features/TESTIMONIALS_COMPLETE_SUMMARY.md\`
- **Analytics:** \`docs/features/ANALYTICS_DASHBOARD_COMPLETE.md\`
- **Mobile Layout:** \`docs/features/FIX_HOME_MOBILE_OVERLAP_FINAL.txt\`

### Untuk Security:
- **ReCAPTCHA:** \`docs/security/RECAPTCHA_COMPLETE_SUMMARY.md\`
- **Rate Limiting:** \`docs/security/BACA_INI_RATE_LIMIT_EMAIL.txt\`
- **Contact Security:** \`docs/security/CONTACT_SECURITY_IMPLEMENTATION.md\`

### Database:
- **Main Schema:** \`backend/src/database/sql/schema.sql\`
- **SQL Files:** \`backend/src/database/sql/\`

## 📦 Archive

File-file lama yang sudah tidak digunakan ada di folder \`docs-archive/\`

## 📞 Support

Semua dokumentasi sudah terorganisir dengan rapi di folder \`docs/\`
"@

Set-Content -Path "FILE_ORGANIZATION.md" -Value $indexContent
Write-Host "  ✓ FILE_ORGANIZATION.md" -ForegroundColor Gray

# ============================================
# SELESAI
# ============================================

Write-Host "`n✅ Organisasi file selesai!" -ForegroundColor Green
Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✓ Dokumentasi dipindahkan ke folder 'docs/'" -ForegroundColor White
Write-Host "  ✓ SQL files dipindahkan ke 'backend/src/database/sql/'" -ForegroundColor White
Write-Host "  ✓ README files dibuat" -ForegroundColor White
Write-Host "  ✓ Index file dibuat (FILE_ORGANIZATION.md)" -ForegroundColor White

Write-Host "`n📁 Struktur baru:" -ForegroundColor Yellow
Write-Host "  docs/" -ForegroundColor White
Write-Host "    ├── deployment/     (Deployment docs)" -ForegroundColor Gray
Write-Host "    ├── features/       (Feature docs)" -ForegroundColor Gray
Write-Host "    ├── security/       (Security docs)" -ForegroundColor Gray
Write-Host "    ├── guides/         (Development guides)" -ForegroundColor Gray
Write-Host "    └── specs/          (Feature specs)" -ForegroundColor Gray
Write-Host "`n  backend/src/database/sql/" -ForegroundColor White
Write-Host "    ├── schema.sql" -ForegroundColor Gray
Write-Host "    └── create-rate-limit-settings.sql" -ForegroundColor Gray

Write-Host "`n💡 Lihat FILE_ORGANIZATION.md untuk navigasi lengkap!" -ForegroundColor Yellow
