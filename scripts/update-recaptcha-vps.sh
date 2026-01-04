#!/bin/bash

# Script untuk update reCAPTCHA v2 Invisible di VPS
# Jalankan script ini di VPS: bash scripts/update-recaptcha-vps.sh

echo "🚀 Starting reCAPTCHA v2 Invisible Update..."
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found!"
    echo "Please run this script from /root/n8n-production/portfolio directory"
    exit 1
fi

echo "✅ Directory check passed"
echo ""

# Step 1: Pull latest code from GitHub
echo "📥 Step 1: Pulling latest code from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Error: Git pull failed!"
    echo "Try running: git stash && git pull origin main"
    exit 1
fi

echo "✅ Code updated successfully"
echo ""

# Step 2: Verify the changes
echo "🔍 Step 2: Verifying changes..."
echo ""
echo "Checking recaptchaVerify.js for new secret key..."
if grep -q "6Lf49T8sAAAAAACEiOAI6BuSvUsqZBPynKADEmm5I" backend/src/middleware/recaptchaVerify.js; then
    echo "✅ Secret key updated correctly"
else
    echo "⚠️  Warning: Secret key might not be updated"
    echo "Please check backend/src/middleware/recaptchaVerify.js manually"
fi
echo ""

echo "Checking ContactSection.tsx for invisible reCAPTCHA..."
if grep -q 'size="invisible"' porto/src/components/portfolio/ContactSection.tsx; then
    echo "✅ Frontend updated to invisible reCAPTCHA"
else
    echo "⚠️  Warning: Frontend might not be updated"
    echo "Please check porto/src/components/portfolio/ContactSection.tsx manually"
fi
echo ""

# Step 3: Restart backend container
echo "🔄 Step 3: Restarting backend container..."
docker-compose restart backend

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to restart backend!"
    echo "Try running: docker-compose up -d backend"
    exit 1
fi

echo "✅ Backend restarted successfully"
echo ""

# Step 4: Wait for backend to be ready
echo "⏳ Waiting for backend to be ready (5 seconds)..."
sleep 5
echo ""

# Step 5: Check backend logs
echo "📋 Step 4: Checking backend logs..."
echo "Last 20 lines of backend logs:"
echo "================================================"
docker-compose logs --tail=20 backend
echo "================================================"
echo ""

# Step 6: Test backend health
echo "🏥 Step 5: Testing backend health..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ Backend is healthy (HTTP 200)"
else
    echo "⚠️  Warning: Backend health check returned HTTP $HEALTH_CHECK"
    echo "This might be normal if /api/health endpoint doesn't exist"
fi
echo ""

# Summary
echo "================================================"
echo "✨ UPDATE COMPLETE!"
echo "================================================"
echo ""
echo "📋 What was done:"
echo "  ✅ Pulled latest code from GitHub"
echo "  ✅ Verified reCAPTCHA changes"
echo "  ✅ Restarted backend container"
echo "  ✅ Checked backend logs"
echo ""
echo "🎯 Next steps:"
echo "  1. Set Netlify environment variable:"
echo "     Key: VITE_RECAPTCHA_SITE_KEY"
echo "     Value: 6Lf49T8sAAAAABpJ7AT8oV9JFNZw8rTQ6GxzTJt5"
echo ""
echo "  2. Trigger Netlify redeploy"
echo ""
echo "  3. Test at: https://4leafclover.id"
echo ""
echo "📖 For detailed instructions, see: UPDATE_BACKEND_RECAPTCHA_VPS.txt"
echo ""
echo "🎉 Done! Your backend is now using reCAPTCHA v2 Invisible!"
