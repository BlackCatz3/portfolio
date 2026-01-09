# Script untuk membersihkan file database yang tidak terpakai
# Jalankan dengan: .\CLEANUP_DATABASE_FILES.ps1

Write-Host "🧹 Membersihkan file database yang tidak terpakai..." -ForegroundColor Cyan

# Buat folder archive untuk database files
New-Item -ItemType Directory -Path "docs-archive/database-migrations" -Force | Out-Null

Write-Host "✅ Folder archive dibuat" -ForegroundColor Green

# ============================================
# FILE DATABASE YANG TIDAK TERPAKAI
# ============================================

# Migration files yang sudah selesai dijalankan (tidak perlu lagi)
$oldMigrationFiles = @(
    "backend/src/database/add-certification-fields.js",
    "backend/src/database/add-headline.sql",
    "backend/src/database/add-project-to-testimonials.sql",
    "backend/src/database/add-whatsapp-field.js",
    "backend/src/database/add-whatsapp-url.sql",
    "backend/src/database/create-about-info.sql",
    "backend/src/database/fix-schema.sql",
    "backend/src/database/migrate-about-info.js",
    "backend/src/database/migrate-blog.js",
    "backend/src/database/migrate-headline.js",
    "backend/src/database/migrate-messages.js",
    "backend/src/database/migrate-newsletter.js",
    "backend/src/database/migrate-project-testimonials.js",
    "backend/src/database/migrate-skills.js",
    "backend/src/database/migrate-testimonials.js",
    "backend/src/database/migrate.js"
)

Write-Host "`n📦 Memindahkan file database migrations yang sudah selesai..." -ForegroundColor Yellow
foreach ($file in $oldMigrationFiles) {
    if (Test-Path $file) {
        $fileName = Split-Path $file -Leaf
        Move-Item $file "docs-archive/database-migrations/$fileName" -Force
        Write-Host "  ✓ $fileName" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Cleanup database files selesai!" -ForegroundColor Green
Write-Host "📁 File-file lama dipindahkan ke 'docs-archive/database-migrations'" -ForegroundColor Cyan

Write-Host "`n📋 FILE DATABASE YANG MASIH DIGUNAKAN:" -ForegroundColor Green
Write-Host "  ✓ backend/src/database/schema.sql (MAIN SCHEMA)" -ForegroundColor White
Write-Host "  ✓ backend/src/database/create-analytics-table.js" -ForegroundColor White
Write-Host "  ✓ backend/src/database/create-certifications-table.js" -ForegroundColor White
Write-Host "  ✓ backend/src/database/create-messages-table.js" -ForegroundColor White
Write-Host "  ✓ backend/src/database/create-rate-limit-settings.sql" -ForegroundColor White
Write-Host "  ✓ backend/src/database/create-rate-limit-tables.js" -ForegroundColor White
Write-Host "  ✓ backend/src/database/migrate-all.js (MASTER MIGRATION)" -ForegroundColor White
Write-Host "  ✓ backend/src/database/check-admin.js" -ForegroundColor White
Write-Host "  ✓ backend/src/database/cleanup-admin.js" -ForegroundColor White
Write-Host "  ✓ backend/src/database/reset-admin-password.js" -ForegroundColor White

Write-Host "`n💡 Jika butuh file migration lama, cek di 'docs-archive/database-migrations'" -ForegroundColor Yellow
