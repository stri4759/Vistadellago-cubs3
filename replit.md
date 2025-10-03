# Vista del Lago Club Directory

## Overview
This is a club management system for Vista del Lago High School. It allows students to browse clubs, filter by tags/categories, and view detailed club information. The system integrates with Google Sheets for data management and Firebase for authentication.

## Purpose
- Display school clubs with detailed information (president, advisors, meeting times, etc.)
- Filter clubs by tags (Science, Sports, Volunteering, etc.)
- Authenticate users via Google Sign-In
- Pull club data from Google Sheets in real-time

## Architecture
The application consists of two components:
1. **Backend API** (Flask) - Runs on localhost:8080
   - Fetches club data from Google Sheets
   - Handles Firebase authentication
   - Provides RESTful API endpoints
2. **Frontend Server** (Python HTTP server) - Runs on 0.0.0.0:5000
   - Serves static HTML/CSS/JavaScript
   - Proxies API requests to backend
   - Displays club listings and filtering UI

## Project Structure
```
/
├── api/                       # Vercel serverless functions
│   ├── index.py              # Serverless entry point
│   ├── app.py                # Flask routes
│   ├── club_util.py          # Club data models
│   ├── user_util.py          # Firebase auth
│   └── constants.py          # Google Sheets URL config
├── static/                   # Frontend static assets
│   ├── app.js                # Frontend JavaScript
│   └── style.css             # Frontend styles
├── index.html                # Main HTML page (root level)
├── club-directory-api/       # Original application (for Replit)
│   ├── api/                  # Backend API
│   ├── frontend/             # Frontend application
│   ├── main.py               # Backend entry point
│   └── SETUP_GUIDE.md        # Setup instructions
├── start.sh                  # Unified startup script (Replit)
├── vercel.json               # Vercel deployment config
├── VERCEL_DEPLOYMENT.md      # Vercel deployment guide
└── replit.md                 # This file

## Current State
- ✅ Fully configured for Replit environment
- ✅ Backend running on localhost:8080
- ✅ Frontend running on 0.0.0.0:5000
- ✅ Connected to Google Sheets for club data
- ✅ Firebase authentication configured
- ✅ Deployment settings configured for production

## Recent Changes
- **Oct 3, 2025**: Fixed Vercel deployment configuration
  - Created `/api/index.py` as serverless function entry point
  - Copied frontend files (`index.html`, `static/`) to root for Vercel
  - Updated `vercel.json` to route API requests to serverless functions
  - Copied all API modules to `/api/` folder for Vercel access
  - Created comprehensive Vercel deployment guide (`VERCEL_DEPLOYMENT.md`)
  - Configured Replit deployment for VM target
  
- **Oct 2, 2025**: GitHub import configured for Replit
  - Installed Python 3.11 and all dependencies
  - Created unified startup script for both servers
  - Set up workflow with webview output on port 5000
  - Added .gitignore for Python
  - Verified full functionality

## How to Run

### On Replit (Development)
The application starts automatically via the workflow. Both servers run concurrently:
1. Backend API starts on localhost:8080
2. Frontend server starts on 0.0.0.0:5000 (visible in webview)

### On Vercel (Production)
See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions. Quick deploy:
```bash
vercel --prod
```

The Vercel deployment uses:
- Serverless functions in `/api/` folder for backend
- Static files (`index.html`, `static/`) served from root
- No proxy server needed (Vercel routes automatically)

## Configuration
- **Google Sheets URL**: Set in `club-directory-api/api/constants.py`
- **Firebase Config**: Update in `club-directory-api/frontend/static/app.js`
- **Firebase Credentials**: `club-directory-api/api/creds.json`

For detailed setup instructions, see `club-directory-api/SETUP_GUIDE.md`

## Dependencies
- Python 3.11
- Flask & Flask-CORS
- Firebase Admin SDK
- Google API Python Client
- Pandas for data processing
- See `club-directory-api/api/requirements.txt` for complete list
