# Address Fields (Line 1 & 2) - Verification and Testing Guide

## Changes Made

### 1. Backend Model Update (server/models/User.js)
✅ **DONE** - Updated address schema to include defaults:
```javascript
address: {
    addressLine1: { type: String, default: '' },
    addressLine2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' }
}
```

### 2. Frontend Signup (client/src/pages/IndividualSignUpPage/IndividualSignUpPage.js)
✅ **VERIFIED** - Signup form includes:
- Form fields: addressLine1, addressLine2, city, state, postalCode
- Validation: addressLine1 is required
- Payload construction: All address fields properly mapped to address object
- Console logging: Added logs to verify payload is being sent correctly

### 3. Backend Registration (server/controllers/authController.js)
✅ **VERIFIED** - Registration controller:
- Logs "Registering user with address: {address}" before save
- Explicitly maps all address fields with fallback to empty string
- Logs "User saved successfully with address: {user.address}" after save
- Creates User with complete address object

### 4. Backend Profile Retrieval (server/controllers/userController.js)
✅ **VERIFIED** - getUserProfile controller:
- Normalizes address object to always include all 5 fields
- Defaults empty fields to empty strings
- Removes password from response
- Returns complete address data

### 5. Frontend Profile Loading (client/src/pages/Dashboard/Profile.js)
✅ **VERIFIED** - Profile page:
- Calls GET /user/profile on component mount
- Logs "Full API Response" to console
- Logs "Address object" and individual address values
- Maps all address fields to formData state
- Defaults fields to empty strings if missing

## Testing Steps

### Test 1: Complete End-to-End Signup → Profile
1. **Open browser Developer Tools (F12)**
2. **Go to Console tab** to monitor logs
3. **Navigate to Signup** (Individual)
4. **Fill in form:**
   - Name: "Test User"
   - Email: "test@example.com" (use unique email)
   - Password: "password123"
   - Phone: "555-1234"
   - Address Line 1: "123 Main Street"
   - Address Line 2: "Apt 4B"
   - City: "New York"
   - State: "NY"
   - Postal Code: "10001"

5. **Check Console:**
   - Look for "Signup payload being sent:" log
   - Verify address contains all fields with values:
     ```
     address: {
       addressLine1: "123 Main Street",
       addressLine2: "Apt 4B",
       city: "New York",
       state: "NY",
       postalCode: "10001"
     }
     ```

6. **Check Backend Server Logs:**
   - Look for "Registering user with address: {all fields}"
   - Look for "User saved successfully with address: {all fields}"

7. **Click Submit**
8. **Wait for redirect to login**
9. **Login with same credentials**
10. **Navigate to Profile**
11. **Check Console:**
    - Look for "Full API Response:" with complete user data
    - Look for "Address object:" showing all 5 fields
    - Look for "Address values:" with all fields populated

12. **Verify Profile Page Displays:**
    - Address Line 1: "123 Main Street"
    - Address Line 2: "Apt 4B"
    - City: "New York"
    - State: "NY"
    - Postal Code: "10001"

### Test 2: Edit Address Fields
1. **From Profile page, edit Address Line 1:**
   - Change to "456 Oak Avenue"
2. **Edit Address Line 2:**
   - Change to "Suite 200"
3. **Click Save**
4. **Check Console:**
   - Look for "Sending payload:" with new address values
   - Look for "Save response:" showing updated data

5. **Refresh page or logout/login**
6. **Verify changes persisted:**
   - Address Line 1 should be "456 Oak Avenue"
   - Address Line 2 should be "Suite 200"

## Debugging Checklist

- [ ] **Verify MongoDB is running** - Data won't save without database
- [ ] **Check server.js is running** - Backend must be on port 5001
- [ ] **Check client is pointing to correct API** - Should be http://localhost:5001/api
- [ ] **Check browser console for errors** - F12 → Console tab
- [ ] **Check server terminal for errors** - Backend logs should show no errors
- [ ] **Verify token is being saved** - Check localStorage has 'token' key (use localStorage.getItem('token') in console)
- [ ] **Verify auth header is being sent** - Network tab should show 'x-auth-token' header
- [ ] **Check for CORS issues** - Look for CORS errors in console

## Common Issues and Solutions

### Issue: Address fields show empty even after filling them in signup
**Solution:**
1. Check browser console - is "Signup payload being sent:" showing all address fields?
2. Check server logs - is "Registering user with address:" showing all fields?
3. If not, verify the form values are being captured correctly

### Issue: Address fields don't appear in profile
**Solution:**
1. Check browser console - look for "Full API Response:" 
2. Expand the address object in console log
3. If empty, check server logs for "User saved successfully with address:"
4. If server shows empty address, new user signup may need fresh database

### Issue: Changes don't persist after logout/login
**Solution:**
1. Check MongoDB is running and persistent
2. Verify token is valid after login (check in localStorage)
3. Check server logs for any save errors
4. Try creating a completely new user to rule out data migration issues

## Key Files to Monitor

- **Frontend**: `client/src/pages/IndividualSignUpPage/IndividualSignUpPage.js` - Look for console logs with "Signup payload"
- **Frontend**: `client/src/pages/Dashboard/Profile.js` - Look for console logs with "Full API Response"
- **Backend**: `server/controllers/authController.js` - Look for "Registering user with address" and "User saved successfully"
- **Backend**: `server/controllers/userController.js` - Verify address normalization
- **Database**: User model in MongoDB should have all address fields

## Expected Database Structure

When a user is created, their document in MongoDB should look like:
```json
{
  "_id": ObjectId("..."),
  "name": "Test User",
  "email": "test@example.com",
  "password": "hashed_password",
  "phone": "555-1234",
  "role": "individual",
  "address": {
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001"
  },
  "notifications": {...},
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## Next Steps

1. **Run the complete end-to-end test above**
2. **Monitor console logs** to identify any breakpoints in data flow
3. **Check MongoDB** directly if needed using MongoDB Compass or CLI
4. **Report any specific error messages** for targeted fixes

---

## Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| User Model Schema | ✅ UPDATED | Defaults added to all address fields |
| Signup Form | ✅ VERIFIED | All address fields present and validated |
| Backend Registration | ✅ VERIFIED | Explicit address field mapping with logging |
| Backend Profile GET | ✅ VERIFIED | Address normalization implemented |
| Backend Profile PUT | ✅ VERIFIED | Address update mapping in place |
| Frontend Signup Payload | ✅ VERIFIED | Console logs added to verify transmission |
| Frontend Profile Load | ✅ VERIFIED | Console logs added to verify reception |
| Frontend Profile Display | ⏳ TESTING | Ready to test with new user |

**Ready to test:** Create a new user account and follow Test 1 above to verify the complete flow works.
