#!/bin/bash

# Setup Nginx + SSL untuk api.4leafclover.id
# Run this script on your VPS as root

echo "🚀 Starting Nginx + SSL Setup for api.4leafclover.id"
echo "=================================================="

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Nginx
echo "📦 Installing Nginx..."
apt install -y nginx

# Install Certbot for Let's Encrypt
echo "📦 Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Create Nginx configuration for api.4leafclover.id
echo "⚙️  Creating Nginx configuration..."
cat > /etc/nginx/sites-available/api.4leafclover.id << 'EOF'
server {
    listen 80;
    server_name api.4leafclover.id;

    # Allow large file uploads
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
echo "✅ Enabling site configuration..."
ln -sf /etc/nginx/sites-available/api.4leafclover.id /etc/nginx/sites-enabled/

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Restart Nginx
    echo "🔄 Restarting Nginx..."
    systemctl restart nginx
    systemctl enable nginx
    
    echo ""
    echo "✅ Nginx installed and configured successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Wait for DNS to propagate (check with: nslookup api.4leafclover.id)"
    echo "2. Once DNS is working, run this command to get SSL certificate:"
    echo ""
    echo "   certbot --nginx -d api.4leafclover.id --non-interactive --agree-tos --email admin@4leafclover.id"
    echo ""
    echo "3. Certbot will automatically configure HTTPS and redirect HTTP to HTTPS"
    echo ""
    echo "🔍 Check status:"
    echo "   - Nginx status: systemctl status nginx"
    echo "   - Test HTTP: curl http://api.4leafclover.id/health"
    echo "   - Test HTTPS (after SSL): curl https://api.4leafclover.id/health"
    echo ""
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi
