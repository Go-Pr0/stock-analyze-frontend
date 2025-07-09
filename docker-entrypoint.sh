#!/bin/sh

# Set default values if not provided
BACKEND_URL=${BACKEND_URL:-"http://localhost:8000"}
PORT=${PORT:-80}

echo "🔧 Configuring NGINX with:"
echo "   BACKEND_URL: $BACKEND_URL"
echo "   PORT: $PORT"

# Replace placeholders in nginx.conf
sed -i "s|\${BACKEND_URL}|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf
sed -i "s|\${PORT:-80}|${PORT}|g" /etc/nginx/conf.d/default.conf

# Verify the configuration
echo "📋 NGINX configuration:"
cat /etc/nginx/conf.d/default.conf | grep -A 5 -B 5 "listen\|proxy_pass"

# Test NGINX configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ NGINX configuration is valid"
    echo "🚀 Starting NGINX on port $PORT..."
    exec nginx -g "daemon off;"
else
    echo "❌ NGINX configuration is invalid"
    exit 1
fi