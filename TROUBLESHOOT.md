# Troubleshooting "Dockerfile does not exist"

## The Error
```
Dockerfile `frontend/Dockerfile` does not exist
```

## Root Cause
Railway is looking for `frontend/Dockerfile` but it should just be looking for `Dockerfile` since the frontend directory is the root.

## Solutions

### Solution 1: Check Railway Root Directory Setting
1. Go to Railway dashboard
2. Click on your frontend service
3. Go to **Settings** → **Source**
4. Ensure **Root Directory** is set to `frontend`
5. If not set, change it to `frontend`
6. Redeploy

### Solution 2: Verify Repository Structure
Make sure Railway is connected to the correct repository and branch where the frontend directory exists.

### Solution 3: Check railway.json
The `railway.json` should have:
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  }
}
```

NOT:
```json
{
  "dockerfilePath": "frontend/Dockerfile"
}
```

### Solution 4: Manual Verification
Check that these files exist in your frontend directory:
- `Dockerfile` ✅
- `package.json` ✅
- `nginx.conf` ✅
- `docker-entrypoint.sh` ✅
- `railway.json` ✅

### Solution 5: Alternative Railway Setup
If Railway is treating the entire repository as one project:

1. **Option A**: Deploy from frontend subdirectory
   - Set root directory to `frontend` in Railway settings

2. **Option B**: Use monorepo approach
   - Update `railway.json` to use `frontend/Dockerfile`
   - But this requires the backend to be in the same Railway project

## Expected Behavior
When correctly configured:
1. Railway sees only the frontend directory contents
2. Finds `Dockerfile` in the root (of frontend directory)
3. Builds successfully using NGINX
4. Deploys with health check at `/nginx-health`

## Next Steps
1. Fix the root directory setting in Railway
2. Redeploy the service
3. Check build logs for success
4. Test the health endpoint