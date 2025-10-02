# Club Management Backend API

## Overview
This is a Flask-based REST API backend for a school club management system. It provides endpoints for browsing clubs, filtering by tags, user authentication via Firebase, and downloading club videos from Google Drive.

## Purpose
- Backend API that serves club data from Google Sheets
- Handles Google OAuth authentication through Firebase
- Provides video downloads from Google Drive
- Designed to work with a separate frontend application (typically running on port 3000)

## Current State
- Backend API running on port 8080
- Connected to Google Sheets for club data
- Firebase authentication configured
- CORS enabled for frontend at http://localhost:3000

## Architecture

### API Endpoints
- `POST /api/login-google` - Google authentication via Firebase
- `GET /api/get-clubs-list` - Get all clubs
- `POST /api/get-clubs-by-tag` - Filter clubs by tags
- `GET /api/get-all-tags` - Get all available tags
- `POST /api/download-video` - Download club videos from Google Drive

### Key Components
- **Flask Backend** (port 8080)
- **Firebase Admin SDK** for authentication
- **Google Sheets** for club data storage
- **Pandas** for data processing
- **CORS** configured for frontend communication

## Project Structure
```
/
├── api/
│   ├── app.py              # Main Flask application with routes
│   ├── club_util.py        # Club data models and utilities
│   ├── user_util.py        # Firebase authentication
│   ├── utilities.py        # CORS configuration
│   ├── download_video.py   # Google Drive video downloads
│   ├── constants.py        # Configuration constants
│   ├── creds.json          # Firebase credentials
│   └── requirements.txt    # Python dependencies
├── main.py                 # Entry point
└── videos/                 # Downloaded videos directory

## Recent Changes
- **Oct 2, 2025**: Imported from GitHub and configured for Replit environment
  - Installed Python 3.11 and all project dependencies
  - Fixed backend to use localhost (backend runs on localhost:8080)
  - Created unified startup script (start.sh) that runs both backend and frontend
  - Configured workflow for frontend server on port 5000 with webview
  - Added comprehensive .gitignore for Python projects
  - Frontend server (port 5000) proxies API requests to backend (localhost:8080)
  - Verified application works: clubs load from Google Sheets, filtering works
  - Configured deployment settings for production

## Dependencies
- Flask 3.x - Web framework
- Firebase Admin - Authentication
- Pandas - Data processing
- Google API Client - Sheets/Drive integration
- Flask-CORS - Cross-origin support

## Frontend Integration
This backend is designed to work with a separate frontend repository. The frontend should:
- Run on port 3000 (configured in CORS)
- Make API calls to http://localhost:8080/api/*
- Handle Google OAuth token generation
- Display club information and filtering UI

## Environment Setup
- Python 3.11
- Backend runs on: http://0.0.0.0:8080
- Firebase credentials: api/creds.json
- Club data source: Google Sheets (see constants.py for URL)
