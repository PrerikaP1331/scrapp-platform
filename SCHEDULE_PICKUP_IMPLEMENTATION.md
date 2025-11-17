# Schedule Community Pickup Implementation

## Overview

Complete implementation of the Schedule Community Pickup feature with multi-step form flow, recurring schedule support, and bulk recycler selection.

## Backend Changes

### 1. Updated Models (`/server/models/Pickup.js`)

- Added `pickupType` field: `'individual'` or `'community_bulk'`
- Added `pickupLocation` field: Specific location instructions within community
- Added `recurring` object with:
  - `isRecurring`: Boolean flag
  - `frequency`: `'weekly'`, `'biweekly'`, or `'monthly'`
  - `dayOfWeek`: 0-6 (Sunday-Saturday)
  - `recurringPickupId`: Reference to parent recurring pickup
  - `nextOccurrence`: Date of next scheduled pickup
- Updated `quantity` enum to include bulk options:
  - `'Multiple Large Bins (10+)'`
  - `'Small Truckload'`
  - `'Specialty Bulk Items'`

### 2. Controller Enhancements (`/server/controllers/pickupController.js`)

- **createCommunityPickup(req, res)**

  - Creates community-level bulk pickup
  - Verifies community admin authorization
  - Handles recurring schedule creation
  - Calculates next occurrence dates
  - Returns success message with pickup data

- **getBulkRecyclers(req, res)**

  - Filters recyclers by bulk capacity
  - Supports waste type filtering
  - Returns recyclers with specialties and ratings
  - Limits results to top 20 matches

- **Helper Functions**:
  - `calculateNextOccurrence()`: Computes next pickup date based on frequency
  - Enhanced error handling with MongoDB integration

### 3. Route Updates (`/server/routes/pickupRoutes.js`)

- `POST /api/pickups/community/schedule` - Schedule community pickup (auth required)
- `GET /api/pickups/recyclers/bulk` - Get bulk recyclers with filters (auth required)
- Both routes use authMiddleware for security

## Frontend Implementation

### 1. Component (`/client/src/pages/CommunityDashboard/CommunitySchedulePickup.js`)

**Features:**

- Multi-step form with visual stepper (2 steps)
- Real-time validation and error handling
- Success modal with booking confirmation

**Step 1: Details & Schedule**

- Waste Type Selection: Grid of clickable cards (6 waste types)
  - Paper & Cardboard
  - Plastics
  - Glass
  - Metals
  - E-Waste
  - Organic Waste
- Estimated Quantity: Dropdown with bulk options
- Schedule Type: Radio buttons for "One-Time" or "Recurring"
- Conditional Fields:
  - **One-Time**: Date picker + time slot selector
  - **Recurring**: Frequency + Day of Week + Time Slot (forms sentence)
- Pickup Location: Text input with helper text
- Additional Notes: Optional textarea
- Form validation on "Next: Choose Recycler" button

**Step 2: Recycler & Confirmation**

- Pickup Summary: Card displaying all Step 1 selections
- Available Recyclers List:
  - Recycler cards with business name, rating, specialties
  - Dynamic loading state while fetching recyclers
  - "No recyclers available" fallback message
  - Click to select recycler (visual feedback)
- Confirmation Summary: Shows all details for final review
- Navigation: Back button + "Confirm & Schedule Pickup" (disabled until recycler selected)
- Success Modal: Shows final booking details and confirmation

### 2. API Service Functions (`/client/src/api/communityService.js`)

```javascript
- scheduleCommunityPickup(communityId, pickupData)
  - POST to /api/pickups/community/schedule
  - Sends: wasteTypes, quantity, date, time, location, recurring info, recycler ID

- getBulkRecyclers(params)
  - GET /api/pickups/recyclers/bulk?capacity=bulk&wasteTypes=...
  - Filters by waste types and capacity
  - Returns recycler list with ratings and specialties
```

### 3. Styling (`/client/src/pages/CommunityDashboard/CommunitySchedulePickup.module.css`)

- `.wasteTypeCard`: Clickable waste type selection with hover/selected states
- `.recyclerCard`: Recycler selection cards with visual feedback
- `.summary`: Styled confirmation summary box (green accent)
- `.successBox`: Success modal styling
- Color scheme: `#588157` (primary green), `#344e41` (dark), `#f0f8f5` (light background)

## Data Flow

### Step 1: Collect Details

```
User selects waste types → Select quantity → Choose schedule type
  → If recurring: Select frequency/day/time
  → If one-time: Select date/time
  → Enter pickup location → Proceed to Step 2
```

### Step 2: Select Recycler

```
Frontend calls: GET /api/pickups/recyclers/bulk?wasteTypes=...
Backend returns: List of qualified recyclers
User selects recycler → Reviews summary → Confirms
```

### Step 3: Submit & Confirm

```
Frontend calls: POST /api/pickups/community/schedule
Backend creates: Pickup document with recurring schedule (if applicable)
Returns: Success response with pickup ID
Frontend shows: Success modal → Redirects to Drive Management
```

## Key Features

### Multi-Step Form

- Clean, guided UX for community admins
- Progress visualization with Stepper component
- Validation at each step
- Back button to review selections

### Recurring Pickups

- Supports: Weekly, Bi-weekly, Monthly
- Automatically calculates next occurrence dates
- Stored with parent pickup reference
- Can be managed in Drive Management section

### Bulk Recycler Selection

- Filters recyclers by:
  - Waste type capacity
  - Bulk handling capability
  - Availability
- Shows specialties (e-waste, commercial, etc.)
- Displays ratings for informed selection

### Community Integration

- Automatically uses community address
- Community admin verification
- Linked to specific community

## Routes Added

### Frontend Routes (`/client/src/App.js`)

```
/community-dashboard/schedule
  - Protected route (community_admin role required)
  - Wrapped in CommunityDashboardLayout
  - Imports: CommunitySchedulePickup component
```

### Sidebar Navigation (`/client/src/pages/CommunityDashboard/CommunitySidebar.js`)

- Already configured with Schedule Pickup link
- Path: `/community-dashboard/schedule`
- Icon: IconTruck (tabler-icons-react)

## Testing Checklist

- [ ] Both servers running (backend:5001, frontend:3000)
- [ ] Community admin can access /community-dashboard/schedule
- [ ] Waste type selection works with multi-select
- [ ] Quantity dropdown shows all bulk options
- [ ] One-time vs recurring toggle works
- [ ] Recurring fields show/hide correctly
- [ ] Date/time pickers functional
- [ ] "Next" button validates form
- [ ] Recyclers load on Step 2
- [ ] Recycler selection visual feedback works
- [ ] Form submission creates pickup in database
- [ ] Success modal shows correct details
- [ ] Redirect to drives page after confirmation
- [ ] Verify pickup appears in Drive Management

## Future Enhancements

- Map view showing recycler locations (Step 2)
- Email notifications to recycler
- SMS confirmations to admin
- Recurring pickup management (pause/resume/cancel)
- Pickup history and analytics
- Batch scheduling for multiple pickups
- Integration with calendar view
- Automatic recycler assignment based on capacity
