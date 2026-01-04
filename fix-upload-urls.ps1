# PowerShell script to fix all hardcoded localhost:5000 URLs in frontend

Write-Host "Fixing upload URLs in frontend files..." -ForegroundColor Green

# Array of files to update
$files = @(
    "porto\src\pages\admin\AdminTestimonials.tsx",
    "porto\src\pages\admin\AdminProjects.tsx",
    "porto\src\pages\admin\AdminProfile.tsx",
    "porto\src\pages\admin\AdminCV.tsx",
    "porto\src\pages\admin\AdminCertifications.tsx",
    "porto\src\pages\admin\AdminBlog.tsx",
    "porto\src\components\TestimonialsModal.tsx",
    "porto\src\components\portfolio\ExperienceSection.tsx",
    "porto\src\components\portfolio\ContactSection.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        # Read file content
        $content = Get-Content $file -Raw
        
        # Replace http://localhost:5000 with ${getUploadBaseURL()}
        $content = $content -replace 'http://localhost:5000\$\{', '${getUploadBaseURL()}${'
        
        # Add import if not exists
        if ($content -notmatch 'getUploadBaseURL') {
            # Add to existing import from @/services/api
            $content = $content -replace 'from "@/services/api";', ', getUploadBaseURL } from "@/services/api";'
            $content = $content -replace 'from "../../services/api";', ', getUploadBaseURL } from "../../services/api";'
            $content = $content -replace 'from "\.\./\.\./services/api";', ', getUploadBaseURL } from "../../services/api";'
        }
        
        # Write back to file
        $content | Set-Content $file -NoNewline
        
        Write-Host "✓ Updated $file" -ForegroundColor Green
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! All files updated." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Build frontend: cd porto; npm run build"
Write-Host "2. Commit changes: git add .; git commit -m 'Fix: Replace hardcoded localhost URLs with dynamic base URL'"
Write-Host "3. Push to GitHub: git push"
Write-Host "4. Netlify will auto-deploy"
