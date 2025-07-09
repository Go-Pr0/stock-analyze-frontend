#!/bin/sh

# Set default backend URL if not provided
BACKEND_URL=${BACKEND_URL:-"http://localhost:8000"}

echo "🔧 Configuring NGINX with BACKEND_URL: $BACKEND_URL"

# Replace the placeholder in nginx.conf with the actual backend URL
sed -i "s|\${BACKEND_URL}|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf

# Verify the configuration
echo "📋 NGINX configuration:"
cat /etc/nginx/conf.d/default.conf | grep -A 5 -B 5 "proxy_pass"

# Test NGINX configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ NGINX configuration is valid"
    echo "🚀 Starting NGINX..."
    exec nginx -g "daemon off;"
else
    echo "❌ NGINX configuration is invalid"
    exit 1
fi