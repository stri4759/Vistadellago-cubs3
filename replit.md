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
├── club-directory-api/        # Main application directory
│   ├── api/                   # Backend API
│   │   ├── app.py            # Flask routes
│   │   ├── club_util.py      # Club data models
│   │   ├── user_util.py      # Firebase auth
│   │   └── constants.py      # Google Sheets URL config
│   ├── frontend/             # Frontend application
│   │   ├── index.html        # Main UI
│   │   ├── server.py         # Frontend server with API proxy
│   │   └── static/           # CSS/JS files
│   ├── main.py               # Backend entry point
│   └── requirements.txt      # Dependencies
├── start.sh                  # Unified startup script
└── replit.md                 # This file

## Current State
- ✅ Fully configured for Replit environment
- ✅ Backend running on localhost:8080
- ✅ Frontend running on 0.0.0.0:5000
- ✅ Connected to Google Sheets for club data
- ✅ Firebase authentication configured
- ✅ Deployment settings configured for production

## Recent Changes
- **Oct 2, 2025**: GitHub import configured for Replit
  - Installed Python 3.11 and all dependencies
  - Created unified startup script for both servers
  - Set up workflow with webview output on port 5000
  - Added .gitignore for Python
  - Configured deployment for VM target
  - Verified full functionality

## How to Run
The application starts automatically via the workflow. Both servers run concurrently:
1. Backend API starts on localhost:8080
2. Frontend server starts on 0.0.0.0:5000 (visible in webview)

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
