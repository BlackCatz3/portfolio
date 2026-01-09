# Script untuk membersihkan dokumentasi yang tidak terpakai
# Jalankan dengan: .\CLEANUP_DOCUMENTATION.ps1

Write-Host "🧹 Membersihkan dokumentasi yang tidak terpakai..." -ForegroundColor Cyan

# Buat folder archive jika belum ada
New-Item -ItemType Directory -Path "docs-archive" -Force | Out-Null
New-Item -ItemType Directory -Path "docs-archive/database-migrations" -Force | Out-Null
New-Item -ItemType Directory -Path "docs-archive/old-fixes" -Force | Out-Null
New-Item -ItemType Directory -Path "docs-archive/deployment-old" -Force | Out-Null
New-Item -ItemType Directory -Path "docs-archive/recaptcha-debug" -Force | Out-Null
New-Item -ItemType Directory -Path "docs-archive/upload-fixes" -Force | Out-Null

Write-Host "✅ Folder archive dibuat" -ForegroundColor Green

# ============================================
# FILE DOKUMENTASI YANG TIDAK TERPAKAI
# ============================================

# Database migration files (sudah selesai, tidak perlu lagi)
$dbMigrationFiles = @(
    "add-name-column.sql",
    "update-name.sql",
    "ADD_NAME_FIELD.txt",
    "ADD_SKILLS_MENU_AND_NAME_FIELD.txt",
    "ADD_AVAILABILITY_STATUS.txt",
    "ADD_WHATSAPP_COLUMN.txt",
    "FIX_ABOUT_TABLE.txt",
    "FIX_ALL_DATABASE.txt",
    "FIX_ALL_TABLES_SCHEMA.txt",
    "FIX_CERTIFICATIONS_TABLE.txt",
    "FIX_CONTACT_TABLE_UPDATED_AT.txt",
    "FIX_DATABASE_SCHEMA.txt",
    "FIX_EXPERIENCES_TABLE.txt",
    "FIX_PROJECTS_TABLE.txt",
    "COMPLETE_DATABASE_FIX.txt"
)

# Old fix documentation (masalah sudah selesai)
$oldFixFiles = @(
    "AKAR_MASALAH_DAN_SOLUSI_FINAL.txt",
    "AKAR_MASALAH_FINAL_DITEMUKAN.txt",
    "BACA_INI_DULU.txt",
    "BUILD_ERROR_FIXED.txt",
    "CEK_DEBUG_LOG_SEKARANG.txt",
    "CEK_KONDISI_SERVER.txt",
    "CEK_STATUS_SEKARANG.txt",
    "DEBUG_COMPLETE_SYSTEM.txt",
    "DEBUG_DAN_FIX_FINAL.txt",
    "DEBUG_LOGS_REMOVED.txt",
    "FINAL_FIX_SUMMARY.txt",
    "FIX_BACKEND_ERROR.txt",
    "FIX_CONTACT_ERROR_500_SUMMARY.txt",
    "FIX_DOWNLOAD_CV_BUTTON.txt",
    "INVESTIGASI_AKAR_MASALAH_LENGKAP.txt",
    "INVESTIGASI_LENGKAP_HASIL.txt",
    "JALANKAN_INI_SAJA.txt",
    "JALANKAN_SCRIPT_INI.txt",
    "JALANKAN_SEKARANG.txt",
    "LANGKAH_FIX_FINAL_PASTI_BERHASIL.txt",
    "LANGKAH_TERAKHIR_PASTI_BERHASIL.txt",
    "MASALAH_DITEMUKAN_DAN_SOLUSI.txt",
    "NAME_FIELD_WORKING_NOW.txt",
    "RESTART_DAN_TEST.txt",
    "TEST_UPLOAD_BARU.txt"
)

# Deployment documentation (sudah tidak relevan, ada yang baru)
$oldDeploymentFiles = @(
    "DEPLOYMENT_SUCCESS.md",
    "HASIL_PENGECEKAN.md",
    "STATUS_SEKARANG.md",
    "STATUS_DEPLOYMENT_SEKARANG.txt",
    "BACKEND_DEPLOYED_PRODUCTION_KEY.txt",
    "VPS_UPDATE_COMPLETE_SUMMARY.txt",
    "NETLIFY_AUTO_DEPLOY_TRIGGERED.txt",
    "TRIGGER_NETLIFY_DEPLOY_BULK_ACTIONS.txt"
)

# ReCAPTCHA debug files (masalah sudah selesai)
$recaptchaDebugFiles = @(
    "DEBUG_RECAPTCHA_ISSUE.txt",
    "DEBUG_RECAPTCHA_TOKEN_ISSUE.txt",
    "DEBUG_SPAM_MASIH_MASUK.txt",
    "FIX_RECAPTCHA_INVISIBLE_EXECUTE.txt",
    "FIX_RECAPTCHA_SECRET_KEY_MISSING.txt",
    "FIX_SPAM_MASUK_SOLUSI.txt",
    "IMPORTANT_WARNING_TEST_KEY_PRODUCTION.txt",
    "INVESTIGASI_SPAM_BYPASS.txt",
    "LANGKAH_DEPLOY_PRODUCTION_KEY.txt",
    "RECAPTCHA_ALWAYS_SHOW_PUZZLE.txt",
    "RECAPTCHA_FIX_COMPLETE.txt",
    "RECAPTCHA_PUZZLE_PRODUCTION_SOLUTION.txt",
    "RECAPTCHA_READY_TO_TEST.txt",
    "RECAPTCHA_V2_INVISIBLE_COMPLETE.txt",
    "RESTART_BACKEND_VPS.txt",
    "SET_RECAPTCHA_SECRET_VPS.txt",
    "SOLUSI_ERROR_400_RECAPTCHA.txt",
    "SOLUSI_SPAM_FINAL.txt",
    "UPDATE_BACKEND_RECAPTCHA_VPS.txt",
    "UPDATE_NETLIFY_ENV_TEST_KEY.txt"
)

# Upload/Image fix files (masalah sudah selesai)
$uploadFixFiles = @(
    "ADD_CORS_NGINX_UPLOADS.txt",
    "CARA_FIX_GAMBAR_TIDAK_MUNCUL.txt",
    "CHECK_NEW_IMAGE.txt",
    "COPY_PASTE_INI.txt",
    "COPY_PASTE_TEST_INI.txt",
    "DEBUG_UPLOAD_ISSUE.txt",
    "DEPLOY_FIX_MIXED_CONTENT.txt",
    "DEPLOY_VOLUME_FIX.txt",
    "FIX_DOCKER_VOLUME_UPLOADS.txt",
    "FIX_MIXED_CONTENT_COMPLETE.txt",
    "FIX_NETLIFY_ENV_VARIABLE.txt",
    "FIX_NGINX_UPLOADS.txt",
    "FIX_NODE_ENV_PRODUCTION.txt",
    "FIX_PERMISSION_OTOMATIS.txt",
    "FIX_UPLOAD_PATH_PRODUCTION.txt",
    "MIXED_CONTENT_FIX_COMPLETE.txt",
    "SETELAH_HAPUS_ENV_VARIABLE.txt",
    "SET_ENV_VARIABLE_SEKARANG.txt",
    "SOLUSI_FINAL_GAMBAR.txt",
    "TEST_GAMBAR_DI_BROWSER.txt",
    "TEST_UPLOAD_GAMBAR_BARU_SEKARANG.txt",
    "UPLOAD_GAMBAR_BARU_SEKARANG.txt",
    "test-image-display.html"
)

# Old UI/Layout fixes (sudah selesai)
$oldUIFiles = @(
    "CEK_PERUBAHAN_BACKGROUND.txt",
    "GRID_PATTERN_BACKGROUND_COMPLETE.txt",
    "REBRANDING_ZOGI_COMPLETE.txt",
    "TAMBAH_MOTIF_WAVE_DIVIDER_SELARAS.txt",
    "UBAH_BACKGROUND_GRADIENT_SELARAS.txt"
)

# Test/trigger files (tidak perlu lagi)
$testFiles = @(
    "BUKA_TEST_PAGE_INI.txt",
    "CARA_TEST_CONTACT_FORM_SEKARANG.txt",
    "TEST_CONTACT_SECURITY.txt",
    "test-vps-nginx.txt",
    "TRIGGER_DEPLOY.bat",
    "TRIGGER_DEPLOY.txt",
    "TRIGGER_DEPLOY_BACKGROUND_GRADIENT.bat"
)

# Pindahkan file-file
Write-Host "`n📦 Memindahkan file database migrations..." -ForegroundColor Yellow
foreach ($file in $dbMigrationFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs-archive/database-migrations/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

Write-Host "`n📦 Memindahkan file old fixes..." -ForegroundColor Yellow
foreach ($file in $oldFixFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs-archive/old-fixes/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

Write-Host "`n📦 Memindahkan file deployment lama..." -ForegroundColor Yellow
foreach ($file in $oldDeploymentFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs-archive/deployment-old/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

Write-Host "`n📦 Memindahkan file recaptcha debug..." -ForegroundColor Yellow
foreach ($file in $recaptchaDebugFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs-archive/recaptcha-debug/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

Write-Host "`n📦 Memindahkan file upload fixes..." -ForegroundColor Yellow
foreach ($file in $uploadFixFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs-archive/upload-fixes/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

Write-Host "`n📦 Memindahkan file UI lama..." -ForegroundColor Yellow
foreach ($file in $oldUIFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs-archive/old-fixes/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

Write-Host "`n📦 Memindahkan file test..." -ForegroundColor Yellow
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs-archive/old-fixes/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Cleanup selesai!" -ForegroundColor Green
Write-Host "📁 File-file lama dipindahkan ke folder 'docs-archive'" -ForegroundColor Cyan
Write-Host "`n💡 Jika butuh file lama, cek di folder 'docs-archive'" -ForegroundColor Yellow
