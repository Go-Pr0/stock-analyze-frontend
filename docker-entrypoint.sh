#!/bin/sh

# Set default values if not provided
BACKEND_URL=${BACKEND_URL:-"http://localhost:8000"}
PORT=${PORT:-80}

echo "🔧 Configuring NGINX with:"
echo "   BACKEND_URL: $BACKEND_URL"
echo "   PORT: $PORT"

# Check if static files exist
echo "📁 Checking static files:"
ls -la /usr/share/nginx/html/
echo "📄 Index file check:"
if [ -f "/usr/share/nginx/html/index.html" ]; then
    echo "✅ index.html exists"
    echo "📝 First few lines of index.html:"
    head -5 /usr/share/nginx/html/index.html
else
    echo "❌ index.html NOT found!"
fi

# Replace placeholders in nginx.conf
sed -i "s|\${BACKEND_URL}|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf
sed -i "s|\${PORT:-80}|${PORT}|g" /etc/nginx/conf.d/default.conf

# Verify the configuration
echo "📋 NGINX configuration:"
cat /etc/nginx/conf.d/default.conf | grep -A 10 -B 5 "location /api/"

# Test backend connectivity
echo "🔗 Testing backend connectivity:"
echo "Backend URL: $BACKEND_URL"
if command -v curl >/dev/null 2>&1; then
    echo "Testing backend health endpoint..."
    curl -v --connect-timeout 10 "$BACKEND_URL/health" || echo "❌ Backend not reachable"
else
    echo "curl not available, skipping connectivity test"
fi

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