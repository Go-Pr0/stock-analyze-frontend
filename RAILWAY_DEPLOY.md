# Frontend Railway Deployment Guide

## Setup Instructions

Since Railway treats this as a separate repository, make sure you:

### 1. Railway Service Configuration

1. **Create a new Railway service**
2. **Connect to your repository**
3. **Set the root directory to `frontend`** (this is crucial!)
4. **Railway will automatically detect the `Dockerfile`**

### 2. Environment Variables

Set these environment variables in your Railway frontend service:

```env
# Replace with your actual backend Railway URL
BACKEND_URL=https://your-backend-service.railway.app
VITE_API_URL=https://your-backend-service.railway.app
```

### 3. Build Configuration

Railway should automatically use the `railway.json` configuration:
- Dockerfile: `Dockerfile`
- Health check: `/nginx-health`

### 4. Files Required

Make sure these files exist in the frontend directory:
- ✅ `Dockerfile`
- ✅ `nginx.conf`
- ✅ `docker-entrypoint.sh`
- ✅ `railway.json`
- ✅ `package.json`
- ✅ All source files

### 5. Common Issues

**"Dockerfile does not exist"**
- Ensure Railway root directory is set to `frontend`
- Check that `Dockerfile` exists in the frontend directory
- Verify Railway is looking in the right path

**Build fails**
- Check that all dependencies are in `package.json`
- Verify `VITE_API_URL` is set correctly

**NGINX fails to start**
- Check that `BACKEND_URL` environment variable is set
- Verify the backend URL is accessible

### 6. Testing

After deployment:
1. Health check: `https://your-frontend.railway.app/nginx-health`
2. App: `https://your-frontend.railway.app/`
3. API proxy: `https://your-frontend.railway.app/api/`

### 7. Your Specific URLs

Based on your setup:
```env
BACKEND_URL=https://stock-analyze-backend-production.up.railway.app
VITE_API_URL=https://stock-analyze-backend-production.up.railway.app
```

(Replace with your actual backend public URL)