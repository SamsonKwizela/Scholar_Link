# ScholarLink - Setup and Testing Guide

## Current Issues Identified

Based on the console errors:
1. ❌ `/api/auth/users` - 404 Not Found (NOW FIXED in code)
2. ❌ `/api/scholarships` - 404 Not Found (Route exists, server may need restart)

## Root Cause

The backend server needs to be **restarted** to pick up the new routes and controllers that were just added.

## Step-by-Step Fix

### 1. Stop the Backend Server
If you have the backend running, stop it first:
- Press `Ctrl+C` in the backend terminal

### 2. Restart the Backend Server
```bash
cd ../backend
npm run dev
```

You should see:
```
MongoDB connected successfully
Server running on port 8000
```

### 3. Verify Backend is Running
Open a new browser tab and visit:
```
http://localhost:8000/api/auth/register
```

You should see a JSON response (not a 404).

### 4. Start the Frontend (if not already running)
```bash
npm run dev
```

The frontend should be running on `http://localhost:5173` (or another port).

## Testing the Fix

### Test 1: Check if Backend Routes are Working

Open your browser console and try:
```javascript
fetch('http://localhost:8000/api/scholarships')
  .then(r => r.json())
  .then(console.log)
```

You should see scholarship data (or an empty array if none exist).

### Test 2: Check Auth Users Endpoint
```javascript
fetch('http://localhost:8000/api/auth/users', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
  .then(r => r.json())
  .then(console.log)
```

### Test 3: Login and Test Dashboard
1. Go to http://localhost:5173/login
2. Login with your credentials
3. Navigate to Dashboard
4. Check browser console - there should be no 404 errors

## Common Issues and Solutions

### Issue: "Failed to load resource: the server responded with a status of 404"

**Solution:** 
1. Make sure backend is running on port 8000
2. Restart backend after making changes
3. Check that MongoDB is connected

### Issue: "Unexpected token '<', '<!DOCTYPE' is not valid JSON"

**Solution:**
This means you're getting an HTML page instead of JSON. Usually means:
1. The route doesn't exist (404 page)
2. The server isn't running
3. Wrong URL

### Issue: CORS Errors

**Solution:**
The backend already has CORS enabled (`app.use(cors())`), but if you see CORS errors:
1. Make sure the backend is running
2. Check that the frontend is calling `http://localhost:8000/api` (not 5173)

## Quick Verification Checklist

- [ ] Backend server is running (port 8000)
- [ ] MongoDB is connected
- [ ] Frontend is running (port 5173)
- [ ] No 404 errors in console
- [ ] Can login successfully
- [ ] Dashboard loads with statistics
- [ ] Scholarships page loads
- [ ] Internships page loads

## If Issues Persist

1. **Check backend console** for error messages
2. **Check MongoDB connection** - ensure MongoDB is running
3. **Clear browser cache** and reload
4. **Check .env file** in backend folder has correct values:
   ```
   MONGODB_URI=your_mongodb_uri
   PORT=8000
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   ```

## API Endpoints Reference

All endpoints should now be available:

### Public Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`

### Protected Endpoints (require token)
- GET `/api/auth/me`
- GET `/api/auth/users` ← **NEWLY ADDED**
- GET `/api/profile`
- PUT `/api/profile`
- GET `/api/scholarships`
- GET `/api/scholarships/:id`
- GET `/api/internships`
- GET `/api/internships/:id`
- GET `/api/applications`
- POST `/api/applications/apply`
- GET `/api/assessments`
- GET `/api/dashboard/stats` ← **NEWLY ADDED**
- GET `/api/dashboard/recommendations` ← **NEWLY ADDED**
- GET `/api/notifications`
- POST `/api/upload`

## Need to Restart Servers?

**Backend:**
```bash
cd ../backend
# Press Ctrl+C to stop if running
npm run dev
```

**Frontend:**
```bash
# In a new terminal
npm run dev
```

## Success Indicators

✅ No 404 errors in browser console
✅ Can login/logout
✅ Dashboard shows statistics
✅ Scholarships and internships load
✅ Can apply to opportunities
✅ Profile page works

If you see any errors after restarting, check the backend console for specific error messages.