#!/bin/bash

# Install SSL Certificate after DNS propagates
# Run this script AFTER DNS is working

echo "🔒 Installing SSL Certificate for api.4leafclover.id"
echo "=================================================="

# Check if DNS is working
echo "🔍 Checking DNS..."
if nslookup api.4leafclover.id | grep -q "Address:"; then
    echo "✅ DNS is working!"
else
    echo "❌ DNS is not working yet. Please wait and try again."
    echo "Check with: nslookup api.4leafclover.id"
    exit 1
fi

# Install SSL certificate
echo "📜 Installing SSL certificate with Let's Encrypt..."
certbot --nginx -d api.4leafclover.id --non-interactive --agree-tos --email admin@4leafclover.id

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL Certificate installed successfully!"
    echo ""
    echo "🎉 Your API is now available at:"
    echo "   https://api.4leafclover.id"
    echo ""
    echo "🧪 Test your API:"
    echo "   curl https://api.4leafclover.id/health"
    echo ""
    echo "📋 SSL Certificate will auto-renew every 90 days"
    echo "   Check renewal: certbot renew --dry-run"
    echo ""
else
    echo "❌ SSL installation failed!"
    echo "Please check the error messages above"
    exit 1
fi
