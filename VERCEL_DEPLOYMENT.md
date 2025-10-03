# Vercel Deployment Guide

## Issue: "Error loading clubs. Make sure the backend is running."

This error occurs because **Vercel uses serverless functions** instead of traditional servers, and the app needs to be configured differently for Vercel deployment.

## What's Been Fixed

✅ **Updated `/api/index.py`** - Now properly imports the Flask app for serverless execution  
✅ **Updated `vercel.json`** - Routes `/api/*` to serverless function, serves static files directly  
✅ **Copied frontend to root** - `index.html` and `static/` folder are now at the root level  
✅ **Created symlinks** - API modules are accessible from `/api/` folder  
✅ **Requirements.txt** - Root-level dependencies for Vercel build  

## Deployment Structure

```
/
├── api/                          # Serverless functions for Vercel
│   ├── index.py                  # Main serverless entry point
│   ├── app.py                    # Flask routes (symlink)
│   ├── club_util.py              # (symlink)
│   ├── constants.py              # (symlink)
│   ├── user_util.py              # (symlink)
│   ├── utilities.py              # (symlink)
│   ├── creds.json                # Firebase credentials (symlink)
│   └── requirements.txt          # API dependencies
├── static/                       # Static assets (CSS, JS)
│   ├── app.js                    # Frontend JavaScript
│   └── style.css                 # Frontend styles
├── index.html                    # Main HTML page (root level)
├── requirements.txt              # Python dependencies
├── vercel.json                   # Vercel configuration
└── club-directory-api/           # Original app structure (for Replit)
```

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Production deployment
vercel --prod
```

### Option 2: GitHub Integration
1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your GitHub repository
5. Vercel will auto-detect the configuration
6. Click **Deploy**

## Environment Variables

If you need to set environment variables on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add any required variables:
   - `SECRET_KEY` - Flask secret key
   - Any other API keys or credentials

## Important Notes

### Serverless Limitations

⚠️ **Execution Time**: Vercel serverless functions timeout after 10 seconds (Hobby) or 60 seconds (Pro)  
⚠️ **Stateless**: Each request is independent - no server state persists  
⚠️ **Cold Starts**: First request may be slower as the function warms up  
⚠️ **File System**: Limited to `/tmp` directory (250MB max)  

### Google Sheets Connection

Make sure your Google Sheets URL in `club-directory-api/api/constants.py` is:
- Publicly accessible OR
- The service account (`creds.json`) has access

### Firebase Authentication

Update your Firebase project settings:
1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to **Authorized domains**:
   - `your-project.vercel.app`
   - Any custom domains

## Troubleshooting

### "Error loading clubs"
- Check Vercel deployment logs for Python errors
- Verify Google Sheets URL is accessible
- Ensure `requirements.txt` has all dependencies

### "502 Bad Gateway"
- Function timeout - Google Sheets may be taking too long
- Check Vercel function logs for errors
- Consider caching club data

### "Module not found"
- All imports must be relative in `/api/index.py`
- Ensure symlinks are created (run the symlink command above)
- Check `requirements.txt` includes all packages

### Testing Locally Before Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally (simulates Vercel environment)
vercel dev

# Access at http://localhost:3000
```

## Alternative: Deploy to Replit

If Vercel's serverless limitations are too restrictive, this app runs perfectly on Replit with the existing configuration. The workflow is already set up to run both backend and frontend servers together.

## Performance Optimization for Vercel

Consider these optimizations:

1. **Cache club data** - Store clubs in memory or use Vercel Edge Config
2. **Reduce Google Sheets calls** - Fetch data once and cache for 5-10 minutes
3. **Upgrade Vercel plan** - Pro plan has 60s timeout vs 10s on Hobby

## Need Help?

If deployment fails:
1. Check Vercel deployment logs
2. Run `vercel dev` locally to test
3. Verify all symlinks exist in `/api/` folder
4. Ensure Firebase credentials (`creds.json`) are properly linked
