#!/bin/bash

# Script to fix all hardcoded localhost:5000 URLs in frontend

echo "Fixing upload URLs in frontend files..."

# Array of files to update
files=(
  "porto/src/pages/admin/AdminTestimonials.tsx"
  "porto/src/pages/admin/AdminProjects.tsx"
  "porto/src/pages/admin/AdminProfile.tsx"
  "porto/src/pages/admin/AdminCV.tsx"
  "porto/src/pages/admin/AdminCertifications.tsx"
  "porto/src/pages/admin/AdminBlog.tsx"
  "porto/src/components/TestimonialsModal.tsx"
  "porto/src/components/portfolio/ExperienceSection.tsx"
  "porto/src/components/portfolio/ProjectsSection.tsx"
  "porto/src/components/portfolio/ContactSection.tsx"
)

# Replace http://localhost:5000 with ${getUploadBaseURL()}
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Replace in src attributes
    sed -i 's|http://localhost:5000\${|${getUploadBaseURL()}${|g' "$file"
    
    # Replace in href attributes  
    sed -i 's|http://localhost:5000\${|${getUploadBaseURL()}${|g' "$file"
    
    # Add import if not exists
    if ! grep -q "getUploadBaseURL" "$file"; then
      # Find the line with api import and add getUploadBaseURL
      sed -i 's|from "@/services/api";|, getUploadBaseURL } from "@/services/api";|' "$file"
      sed -i 's|from "../../services/api";|, getUploadBaseURL } from "../../services/api";|' "$file"
    fi
    
    echo "✓ Updated $file"
  else
    echo "✗ File not found: $file"
  fi
done

echo ""
echo "Done! All files updated."
echo ""
echo "Next steps:"
echo "1. Build frontend: cd porto && npm run build"
echo "2. Commit changes: git add . && git commit -m 'Fix: Replace hardcoded localhost URLs with dynamic base URL'"
echo "3. Push to GitHub: git push"
echo "4. Netlify will auto-deploy"
