#!/bin/bash

# Deploy Production reCAPTCHA with Enhanced Security
# Run this script on VPS after pushing code to GitHub

echo "🚀 Deploying Production reCAPTCHA with Enhanced Security..."
echo ""

# Navigate to project directory
cd /root/n8n-production/portfolio || exit 1

echo "📥 Pulling latest code from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to pull code from GitHub"
    exit 1
fi

echo ""
echo "🔄 Restarting backend container..."
docker compose restart backend

if [ $? -ne 0 ]; then
    echo "❌ Failed to restart backend"
    exit 1
fi

echo ""
echo "⏳ Waiting for backend to start..."
sleep 5

echo ""
echo "📋 Checking backend logs..."
docker logs portfolio-backend --tail 20

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Monitor logs with:"
echo "   docker logs portfolio-backend --tail 100 -f"
echo ""
echo "🧪 Test the contact form at:"
echo "   https://4leafclover.id"
echo ""
echo "🔍 Check for spam in admin panel:"
echo "   https://4leafclover.id/admin"
echo ""
