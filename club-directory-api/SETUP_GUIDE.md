# Setup Guide - Club Management System

## Overview
You now have a fully functional club management system with:
- **Backend API** (Flask) running on port 8080
- **Frontend** (HTML/JS) running on port 5000 with API proxy
- Integration with Firebase for authentication
- Google Sheets as the data source

## Firebase Configuration

### Step 1: Get Your Firebase Web Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **vista-club-directory**
3. Click on the gear icon (Settings) → Project Settings
4. Scroll down to "Your apps" section
5. Click on the Web app icon (`</>`)  
6. Copy the `firebaseConfig` object

### Step 2: Update the Frontend
Edit `frontend/static/app.js` and replace this section (around line 8-14):

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

With your actual Firebase config. It should look something like:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...your-key-here",
    authDomain: "vista-club-directory.firebaseapp.com",
    projectId: "vista-club-directory",
    storageBucket: "vista-club-directory.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};
```

### Step 3: Enable Google Authentication in Firebase
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Add your project's authorized domains (Replit domains are usually pre-authorized)
5. Click **Save**

## Google Sheets Connection

### Current Setup
Your backend is already connected to Google Sheets! Here's how it works:

**Current Sheet URL** (in `api/constants.py`):
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vSpuDZTPBnKX6fPmFJDikNbXhul71FCf0sg7sOs5zOd47lCO3Y5ERLTSS-FtQBXyJa25ZTFvMLoR5-h/pub?gid=658017674&single=true&output=csv
```

### To Use Your Own Google Sheet

#### Option 1: Publish Your Sheet (Simple - Read-Only)
1. Open your Google Sheet
2. Click **File** → **Share** → **Publish to web**
3. Choose the specific sheet tab you want to publish
4. Format: Select **Comma-separated values (.csv)**
5. Click **Publish**
6. Copy the published URL
7. Update `api/constants.py`:
   ```python
   CLUB_SHEET_URL = "your-published-sheet-url-here"
   ```

**Required Columns** in your Google Sheet:
- Club Name
- Club Description
- President, Vice President, Treasurer, Secretary, Webmaster, Historian
- Image, Tags, Advisor
- Meeting Times, Meeting Room
- Club Video, Instagram, Discord, Remind
- Google Classroom, Phone Number, Email Address
- Image1, Image2, Club Highlight, Gold Standard

#### Option 2: Use Google Sheets API (Advanced - Read/Write Access)
If you need to write data back to sheets:

1. **Enable Google Sheets API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Google Sheets API"

2. **Create Service Account**:
   - Go to IAM & Admin → Service Accounts
   - Create a new service account
   - Download the JSON key file

3. **Share Your Sheet**:
   - Open your Google Sheet
   - Click **Share**
   - Add the service account email (found in the JSON file)
   - Give it Editor permissions

4. **Update Code**:
   - Replace `api/creds.json` with your service account key
   - Modify `api/club_util.py` to use Google Sheets API instead of CSV

## Testing Your Setup

### 1. Test Backend API
```bash
# Get all clubs
curl http://localhost:8080/api/get-clubs-list

# Get all tags
curl http://localhost:8080/api/get-all-tags

# Filter by tag
curl -X POST http://localhost:8080/api/get-clubs-by-tag \
  -H "Content-Type: application/json" \
  -d '{"tags": ["Science"]}'
```

### 2. Test Frontend
- Open your Replit webview (the frontend on port 5000)
- You should see clubs loaded from your Google Sheet
- Click on tags to filter clubs
- Click "Login with Google" to test Firebase authentication

## How It All Works Together

```
User Browser (HTTPS)
     ↓
Frontend Server (Port 5000)
     ↓ proxies /api/* requests to →
Backend API (Port 8080)
     ↓ fetches data from →
Google Sheets (CSV/API)
     
Firebase Auth ← verifies → Backend API
```

## Troubleshooting

### Clubs Not Loading
- Check that Google Sheet URL is accessible
- Verify sheet is published or shared properly
- Check browser console for errors

### Login Not Working
- Verify Firebase config is correct in `frontend/static/app.js`
- Check that Google Sign-in is enabled in Firebase Console
- Ensure your domain is authorized in Firebase

### Tag Filtering Not Working
- Verify tags in your Google Sheet match exactly (case-sensitive)
- Check that Tags column uses comma-separated values

## Next Steps

1. **Update Firebase Config** in `frontend/static/app.js`
2. **Test Google Login** - Click the blue login button
3. **Customize Your Sheet** - Add your own clubs, update tags
4. **Style the Frontend** - Edit `frontend/static/style.css` to match your branding

## Files Reference

- **Backend Main**: `main.py`
- **API Routes**: `api/app.py`
- **Google Sheets Config**: `api/constants.py`
- **Frontend**: `frontend/index.html`, `frontend/static/app.js`
- **Firebase Backend**: `api/creds.json`, `api/user_util.py`
