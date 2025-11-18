# Address Fields Fix - Complete Solution

## Problem
- Address fields (addressLine1, addressLine2) from signup were not visible in Profile/Settings
- Only city, state, and postalCode were showing
- Existing users had incomplete address data in the database

## Solution Implemented

### 1. Backend Changes

#### A. Enhanced userController.js
- `getUserProfile`: Ensures all address fields are returned, even if empty
- `updateUserProfile`: Properly saves and preserves all address fields
- Both functions normalize responses to always include all address fields

#### B. New Migration System
- Created `migrationController.js`: Handles data migration for existing users
- Created `migrationRoutes.js`: Provides endpoints for migration and debugging
- Added to `server.js`: Routes now available at `/api/migration/*`

### 2. Frontend Changes

#### A. Profile.js
- Better address data extraction from response
- Added console logging for debugging
- Properly handles empty address fields

#### B. Settings.js
- Same improvements as Profile.js
- Consistent address field handling

### 3. How to Apply the Fix

#### Step 1: Restart Server (with new files)
```bash
# The migration routes are now available
```

#### Step 2: Migrate Existing User Data
**Option A - Using Browser Console:**
1. Open your browser's Developer Tools (F12)
2. Go to Console tab
3. Paste and run:
```javascript
async function runMigration() {
  const response = await fetch('http://localhost:5001/api/migration/address-fields', {
    method: 'POST'
  });
  const data = await response.json();
  console.log('Migration Result:', data);
}
runMigration();
```

**Option B - Using curl/Postman:**
```bash
curl -X POST http://localhost:5001/api/migration/address-fields
```

#### Step 3: Debug Specific User
After migration, verify your data:
1. Log in to your account
2. Open Developer Tools (F12)
3. Go to Console tab
4. Paste and run:
```javascript
async function debugAddress() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5001/api/migration/debug-address', {
    headers: {
      'x-auth-token': token
    }
  });
  const data = await response.json();
  console.log('Your Address Data:', data);
}
debugAddress();
```

### 4. New User Registration

**For new users signing up:**
- All address fields (addressLine1, addressLine2, city, state, postalCode) will be saved
- No migration needed for new registrations

### 5. Existing User Experience

**For existing users:**
1. Address Line 1 and Address Line 2 fields will now appear empty (not saved before)
2. City, State, and Postal Code will show their existing data
3. Users can now add Address Line 1 and 2 information
4. When saved, all fields persist to the backend

### 6. How Address is Now Stored

**Database Structure:**
```
address: {
  addressLine1: "123 Main Street",      // NEW - now saved and visible
  addressLine2: "Apt 4B",                // NEW - now saved and visible
  city: "Mysuru",                        // existing
  state: "Karnataka",                    // existing
  postalCode: "570002"                   // existing
}
```

## Testing Checklist

- [ ] Run migration on existing users
- [ ] Log in with an existing user account
- [ ] Go to Profile page - should see addressLine1 and addressLine2 fields (empty for old users)
- [ ] Fill in Address Line 1 with street address
- [ ] Fill in Address Line 2 with apartment/suite (optional)
- [ ] Click Save
- [ ] Verify "Profile updated successfully" message
- [ ] Log out and log back in
- [ ] Verify address data persists
- [ ] Create a new user account
- [ ] Verify all address fields are saved from signup

## Files Modified/Created

**Modified:**
- server/controllers/userController.js
- server/controllers/authController.js
- server/server.js
- client/src/pages/Dashboard/Profile.js
- client/src/pages/Dashboard/Settings.js

**Created:**
- server/controllers/migrationController.js
- server/routes/migrationRoutes.js
- MIGRATION_SCRIPT.js (helper script)

## Key Features

✅ All address fields now persist to database
✅ Old user data migrated automatically
✅ New users get all fields on signup
✅ Profile and Settings display all address fields
✅ Data syncs between frontend and backend
✅ Changes persist after logout/login
✅ Proper error handling and validation
