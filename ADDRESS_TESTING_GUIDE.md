# Address Fix - Complete Testing Guide

## Quick Test Steps

### 1. Open Browser Console
- Press **F12** (or Right-click → Inspect → Console tab)
- Keep console open while testing

### 2. Navigate to Profile Page
- Click on your user dashboard
- Go to **Profile** or **Settings** → **Profile Tab**
- Watch the console for the logs

### 3. Check Console Output
Look for these logs:
```
Full API Response: {Object}
Address object: {Object}
Loaded profile data: {...}
```

If you see empty address fields in "Loaded profile data", then:
- City, state, postal code are existing fields - should show
- Address Line 1 and 2 are new - will be empty for old users

### 4. Edit Address
1. Fill in **"Address Line 1"** with your street address
2. Fill in **"Address Line 2"** with apt/suite (optional)
3. Modify any other fields you want

### 5. Click Save
- Look in console for: `Sending payload: {...}`
- Look for: `Save response: {...}`
- Should see green success message: "✓ Profile saved successfully!"

### 6. Verify Persistence
Close browser completely, then reopen and log in again
- Go back to Profile/Settings
- Your address should still be there

## What Each Console Log Means

| Log | Meaning |
|-----|---------|
| `Full API Response: {Object}` | Data returned from server |
| `Address object: {Object}` | The address sub-object from server |
| `Loaded profile data: {...}` | What was loaded into form |
| `Sending payload: {...}` | What we're sending to save |
| `Save response: {...}` | Confirmation of what was saved |

## If Address Still Shows Empty

This is NORMAL for existing users who registered before address fields were added!

**Solution:**
1. Fill in the Address Line 1 field
2. Click Save
3. The data will now be stored in the database
4. It will persist after logout/login

## If Address Shows But Doesn't Save

1. Check console for errors
2. Look for `Save response` - did it succeed?
3. Check the error message displayed
4. Try again

## If You Get an Error

Common errors:
- **"Error loading profile"** → Backend connection issue, restart server
- **"Error updating profile"** → Check console for details, restart server
- **Network Error** → Check if backend is running on http://localhost:5001

## Backend Status Check

In terminal running backend (npm run dev in /server):
- Should see: "Server running in development mode on port 5001"
- When you save, should see: "Profile updated successfully. Address saved: {...}"

## Summary of What Should Happen

1. ✅ Open Profile → Existing city/state/zip appear, address line 1 & 2 empty
2. ✅ Enter your address line 1
3. ✅ Click Save → See success message
4. ✅ Console shows data being saved
5. ✅ Log out and log back in
6. ✅ Your address line 1 is still there

This confirms backend ↔ frontend sync is working!
