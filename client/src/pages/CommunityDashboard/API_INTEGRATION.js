/**
 * COMMUNITY DASHBOARD - API INTEGRATION GUIDE
 * 
 * This file documents all API endpoints needed for the Community Admin Dashboard.
 * Replace the TODO comments in each page with the corresponding API calls.
 * 
 * All endpoints require:
 * - Authentication header: Bearer token
 * - Role verification: community_admin
 * - Community ID parameter: /api/communities/:id/*
 */

// ============================================================================
// DASHBOARD HOME - /community-dashboard
// ============================================================================

/*
GET /api/communities/:id/overview

Response Example:
{
  totalCO2Saved: "2,340 kg",
  totalWasteCollected: "15,600 kg",
  activeHouseholds: "152 of 200",
  upcomingDrives: 3,
  totalResidents: 200,
  pendingRequests: 5,
  nextPickupDate: "2025-11-20",
  upcomingEvents: [
    {
      id: "1",
      title: "Weekly Compost Collection",
      description: "Every Monday",
      date: "2025-11-18",
      location: "Clubhouse"
    }
  ]
}
*/

// ============================================================================
// SCHEDULE PICKUP - /community-dashboard/schedule
// ============================================================================

/*
POST /api/communities/:id/schedule-pickup

Request Payload:
{
  title: string,
  description: string,
  date: string (ISO),
  time: string,
  location: string,
  wasteTypes: string[],
  isRecurring: boolean,
  frequency?: string ("weekly" | "biweekly" | "monthly"),
  maxCapacity?: number,
  instructions?: string,
  image?: File
}

Response:
{
  success: true,
  pickupId: string,
  message: "Pickup scheduled successfully"
}
*/

// ============================================================================
// DRIVE MANAGEMENT - /community-dashboard/drives
// ============================================================================

/*
GET /api/communities/:id/drives?status=active

Response Example (Array):
[
  {
    id: "1",
    title: "E-waste Drive",
    date: "2025-11-20",
    visibility: "Public",
    status: "Upcoming",
    participants: 24
  }
]

GET /api/communities/:id/drives?status=completed

Response Example (Array):
[
  {
    id: "3",
    title: "Monthly Recycling Drive",
    date: "2025-11-10",
    visibility: "Public",
    totalCollected: "450 kg",
    participants: 67
  }
]
*/

// ============================================================================
// CREATE DRIVE - /community-dashboard/drives/new
// ============================================================================

/*
POST /api/communities/:id/drives

Request Payload:
{
  title: string,
  description: string,
  startDate: string (ISO),
  endDate: string (ISO),
  wasteTypes: string,
  location: string,
  isPublic: boolean,
  targetQuantity?: number,
  image?: File
}

Response:
{
  success: true,
  driveId: string,
  message: "Drive created successfully"
}
*/

// ============================================================================
// EDIT DRIVE - /community-dashboard/drives/:id/edit
// ============================================================================

/*
GET /api/communities/:id/drives/:driveId

Response Example:
{
  id: "1",
  title: "E-waste Drive",
  description: "Community-wide electronic waste collection",
  startDate: "2025-11-20",
  endDate: "2025-11-20",
  wasteTypes: "Electronics, Old phones, Cables",
  location: "Community Center",
  targetQuantity: 500,
  isPublic: true
}

PUT /api/communities/:id/drives/:driveId

Request Payload: (same as POST /drives)

Response:
{
  success: true,
  message: "Drive updated successfully"
}

DELETE /api/communities/:id/drives/:driveId

Response:
{
  success: true,
  message: "Drive deleted successfully"
}
*/

// ============================================================================
// DRIVE STATISTICS - /community-dashboard/drives/:id/stats
// ============================================================================

/*
GET /api/communities/:id/drives/:driveId/statistics

Response Example:
{
  title: "E-waste Drive",
  totalParticipants: 87,
  totalCollected: "580 kg",
  targetQuantity: 500,
  wasteBreakdown: [
    {
      category: "Phones & Tablets",
      quantity: 245,
      color: "#588157"
    }
  ],
  dailyProgress: [
    { date: "Day 1", collected: 150 },
    { date: "Day 2", collected: 245 }
  ]
}
*/

// ============================================================================
// MANAGE RESIDENTS - /community-dashboard/members
// ============================================================================

/*
GET /api/communities/:id/members?status=approved

Response Example (Array):
[
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2025-11-05",
    status: "Active",
    unit?: "A-101"
  }
]

GET /api/communities/:id/members?status=pending

Response Example (Array):
[
  {
    id: "101",
    name: "Alice Williams",
    email: "alice@example.com",
    requestDate: "2025-11-16"
  }
]

PUT /api/communities/:id/members/:memberId/approve

Response:
{
  success: true,
  message: "Member approved successfully"
}

PUT /api/communities/:id/members/:memberId/deny

Response:
{
  success: true,
  message: "Request denied successfully"
}

DELETE /api/communities/:id/members/:memberId

Response:
{
  success: true,
  message: "Member removed successfully"
}

POST /api/communities/:id/members/invite

Request Payload:
{
  email: string,
  unit?: string
}

Response:
{
  success: true,
  invitationId: string,
  message: "Invitation sent successfully"
}
*/

// ============================================================================
// COMMUNITY IMPACT REPORT - /community-dashboard/report
// ============================================================================

/*
GET /api/communities/:id/report

Response Example:
{
  totalCO2Saved: "2,340 kg",
  totalWasteCollected: "15,600 kg",
  activeParticipants: 152,
  activitiesCompleted: 24,
  monthlyData: [
    {
      month: "August",
      collected: 1200,
      co2: 180
    }
  ],
  wasteBreakdown: [
    { waste: "Plastic", quantity: 4200 },
    { waste: "Paper", quantity: 3800 }
  ]
}
*/

// ============================================================================
// COMMUNITY BILLING - /community-dashboard/billing
// ============================================================================

/*
GET /api/communities/:id/billing

Response Example:
{
  planName: "Community Pro",
  monthlyFee: "2499",
  billingCycle: "Monthly",
  nextBillingDate: "2025-12-16",
  status: "Active",
  paymentHistory: [
    {
      id: "1",
      date: "2025-11-16",
      amount: "2499",
      status: "Paid",
      method: "Credit Card"
    }
  ],
  invoices: [
    {
      id: "INV-001",
      date: "2025-11-16",
      amount: "2499",
      status: "Paid"
    }
  ]
}

POST /api/communities/:id/billing/update-payment

Request Payload:
{
  paymentMethodId: string,
  cardDetails?: object,
  // Include payment details as needed
}

Response:
{
  success: true,
  message: "Payment method updated successfully"
}

GET /api/communities/:id/billing/invoices/:invoiceId

Response: Binary file (PDF)
*/

// ============================================================================
// COMMUNITY SETTINGS - /community-dashboard/settings
// ============================================================================

/*
GET /api/communities/:id/settings

Response Example:
{
  admin: {
    name: "Admin Name",
    email: "admin@community.com",
    phone: "+91-XXXXXXXXXX"
  },
  community: {
    name: "Sample RWA Society",
    type: "residential",
    address: "123 Green Street, City",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    totalHouseholds: 200,
    registrationNumber: "RWA/2023/00001"
  }
}

PUT /api/communities/:id/settings/admin

Request Payload:
{
  name?: string,
  email?: string,
  phone?: string,
  currentPassword?: string,
  newPassword?: string
}

Response:
{
  success: true,
  message: "Admin profile updated successfully"
}

PUT /api/communities/:id/settings/community

Request Payload:
{
  name: string,
  type: string,
  address: string,
  city: string,
  state: string,
  pincode: string,
  totalHouseholds: number,
  registrationNumber: string
}

Response:
{
  success: true,
  message: "Community details updated successfully"
}
*/

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
Example 1: Fetching Dashboard Overview
----------------------------------

const fetchDashboardData = async () => {
  try {
    const response = await apiClient.get(`/communities/${communityId}/overview`);
    setCommunityStats(response.data);
  } catch (error) {
    console.error('Error fetching overview:', error);
    notifications.show({
      color: 'red',
      title: 'Error',
      message: 'Failed to load dashboard data'
    });
  }
};


Example 2: Creating a Drive
-----------------------------

const handleCreateDrive = async (values) => {
  const formData = new FormData();
  Object.keys(values).forEach(key => {
    formData.append(key, values[key]);
  });

  try {
    const response = await apiClient.post(
      `/communities/${communityId}/drives`,
      formData
    );
    
    notifications.show({
      color: 'green',
      title: 'Success',
      message: 'Drive created successfully!'
    });
    
    navigate('/community-dashboard/drives');
  } catch (error) {
    notifications.show({
      color: 'red',
      title: 'Error',
      message: error.response?.data?.message || 'Failed to create drive'
    });
  }
};


Example 3: Approving a Member Request
--------------------------------------

const handleApproveMember = async (memberId) => {
  try {
    await apiClient.put(
      `/communities/${communityId}/members/${memberId}/approve`
    );
    
    // Refresh members list
    const response = await apiClient.get(
      `/communities/${communityId}/members?status=pending`
    );
    setPendingRequests(response.data);
    
    notifications.show({
      color: 'green',
      title: 'Success',
      message: 'Member approved successfully'
    });
  } catch (error) {
    notifications.show({
      color: 'red',
      title: 'Error',
      message: 'Failed to approve member'
    });
  }
};
*/

export default function APIIntegrationGuide() {
  return null;
}
