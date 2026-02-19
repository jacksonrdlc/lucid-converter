# Lucidchart API Debugging Guide

## Current Issue

You're encountering a `400: Cannot parse parameter id as Long: For input string: "me"` error when trying to get user profile information.

### Root Cause Analysis

The error message indicates that the Lucidchart REST API is trying to parse `"me"` as a numeric integer ID. This means:

1. **The `/users/me` endpoint does not exist** in Lucidchart's REST API
2. **User endpoints likely expect numeric IDs**, not the string `"me"`
3. **There may be no "current user" endpoint** in the public REST API

## Investigation Steps

### Step 1: Test Basic Connectivity
Try the **List Documents** tab in the Lucidchart API panel:
- This endpoint (`GET /documents`) doesn't require knowing your user ID
- If this works: Your API key is valid and the REST API is accessible
- If this fails with 400/401: Your API key configuration is incorrect

### Step 2: Check Your API Key Setup

1. Verify `.env.local` exists and contains:
   ```
   VITE_LUCID_API_KEY=key-xxxxxxxxxxxxx
   ```

2. Verify the key format matches what Lucidchart provided (should start with `key-`)

3. In the app, open browser DevTools (F12 → Console tab)
   - Make a test request (e.g., List Documents)
   - Look for the full HTTP request URL and headers
   - Check the raw error response body

### Step 3: Access Official API Documentation

Check Lucidchart's official API documentation:
- **Developer Portal**: https://developer.lucid.app/
- **API Reference**: https://lucidchart.readme.io/
- **GitHub Examples**: Search for lucidchart-rest-api examples

Look specifically for:
- Correct endpoint paths for user information
- Required scopes/permissions for API key
- Authentication header format
- Example requests

## Error: 404 Not Found on `/documents`

If you're seeing **`404 (Not Found)` errors on endpoints like `/documents`**, this means:

1. **The endpoint path doesn't exist** at that location in the API
2. **OR your API key lacks permissions** to access that endpoint
3. **OR the REST API v1 uses different endpoint paths** than we assumed

### Why This Happens

Lucidchart may use:
- Different API versioning (v1, v2, etc.)
- Different endpoint naming (`/documents` vs `/content` vs `/library`)
- Scope-based access control (certain keys can only access certain endpoints)
- Different API altogether (GraphQL, webhooks, extension SDK only)

## Possible Solutions

### Option 1: Test API Versions
We now test multiple API bases automatically. Look in console for messages like:
- `✅ v1 responds with status 200`
- `❌ v2 failed: Not Found`

This tells us which API version your key has access to.

### Option 2: Check Lucidchart Developer Account
1. Go to https://developer.lucid.app/
2. Find your API key / application
3. Look for:
   - **API Scopes** or **Permissions** section
   - Which endpoints are enabled for your key
   - Whether REST API access is even granted
   - API documentation specific to your key setup

### Option 3: Use Different Endpoint
The Lucidchart API might use a completely different structure.

**Possible alternatives to test:**
- `/library/documents` (library-scoped)
- `/api/documents` (alternative v1 pattern)
- `/account` (account info instead of user)
- Check official docs for exact endpoint paths

### Option 4: Use Browser-Based API
Instead of REST API calls:
- Use the **Lucid Extension SDK** (`lucid-package`)
- Run code inside Lucidchart editor context
- This may have different API patterns and more permissions

### Option 5: Verify API Key Permissions
Your API key might not have the right scopes:

1. Go to https://developer.lucid.app/
2. Check your application settings
3. Verify the key has these scopes:
   - `documents.read` or `documents:read`
   - `users.read` or `users:read` (if available)
   - `documents.write` or `documents:write` (for creation)

## Code Changes Made

The API client was updated with:
1. **Enhanced error logging** - All API errors now show full response details in console
2. **Endpoint fallback logic** - Tries multiple endpoint patterns for user info
3. **Diagnostic UI** - Added warnings to guide debugging
4. **Test connection method** - `testConnection()` method for basic connectivity testing

## Next Steps

1. **Run Test Requests**:
   - Open http://localhost:5174/
   - Click "Lucid API" button
   - Try "List Documents" first
   - Watch browser console (F12) for detailed error messages

2. **Share Findings**:
   - What error do you get from List Documents?
   - Check the full error response in browser console
   - Share the complete error message with exact endpoint path attempted

3. **Reference Official Docs**:
   - Check Lucidchart's official documentation
   - Look for example API calls or SDK usage
   - Verify our endpoint paths match their examples

## File Changes

- **`src/utils/lucidchartAPI.js`** - Added `testConnection()` method and improved error logging
- **`src/components/LucidAPIIntegration.jsx`** - Added diagnostic warnings about API issues
- **`API_DEBUGGING_GUIDE.md`** - This file, created for troubleshooting

## Console Debugging

To see detailed API errors:

1. Open browser DevTools: `F12` or right-click → "Inspect"
2. Go to "Console" tab
3. Make a test API request
4. Look for `[Lucid API]` prefix logs showing:
   - HTTP method (GET/POST)
   - Full endpoint URL
   - Request/response body
   - Error messages

Example console output you'll see:
```
[Lucid API] GET https://api.lucidchart.com/v1/documents
[Lucid API Error Response] {"message": "Cannot parse parameter id..."}
```

This information is crucial for debugging!
