# Community Admin Dashboard

A complete dashboard system for community administrators (RWAs, housing societies) to manage recycling initiatives, residents, and community impact.

## 📋 Sitemap & Routes

### Main Dashboard

- **Route:** `/community-dashboard`
- **Component:** `CommunityDashboardHome`
- **Purpose:** Central landing page showing community impact, member engagement, and upcoming events

### Schedule Community Pickup

- **Route:** `/community-dashboard/schedule`
- **Component:** `SchedulePickup`
- **Purpose:** Schedule large-scale pickups for central collection points with recurring options

### Drive Management Hub

- **Route:** `/community-dashboard/drives`
- **Component:** `DriveManagement`
- **Purpose:** View, manage, and organize community recycling drives

#### Drive Sub-Routes

- **Create New Drive:** `/community-dashboard/drives/new`
  - Component: `CreateDrive`
  - Purpose: Create public or private recycling drives
- **Edit Drive:** `/community-dashboard/drives/:id/edit`
  - Component: `EditDrive`
  - Purpose: Modify drive details and settings
- **Drive Statistics:** `/community-dashboard/drives/:id/stats`
  - Component: `DriveStatistics`
  - Purpose: View completion reports and waste breakdown analytics

### Manage Residents

- **Route:** `/community-dashboard/members`
- **Component:** `ManageResidents`
- **Purpose:** View approved members, approve pending requests, and invite new residents

**Features:**

- View approved resident list
- Manage pending join requests (approve/deny)
- Send email invitations to new residents

### Community Impact Report

- **Route:** `/community-dashboard/report`
- **Component:** `CommunityImpactReport`
- **Purpose:** Detailed analytics and visualizations of collective recycling performance

**Features:**

- Total CO₂ saved metrics
- Waste collected by type
- Monthly trends and participation rates
- Download report functionality

### Community Billing

- **Route:** `/community-dashboard/billing`
- **Component:** `CommunityBilling`
- **Purpose:** Manage subscription, payments, and invoices

**Features:**

- Current subscription plan details
- Payment history
- Invoice management
- Download receipts

### Settings

- **Route:** `/community-dashboard/settings`
- **Component:** `CommunitySettings`
- **Purpose:** Manage admin profile and community details

**Tabs:**

- **Admin Profile:** Personal details, email, phone, password change
- **Community Details:** Community name, type, address, registration info

## 🗂️ File Structure

```
/client/src/pages/CommunityDashboard/
├── CommunityDashboardLayout.js          # Main layout wrapper with header & sidebar
├── CommunityDashboardLayout.module.css   # Layout styles
├── CommunitySidebar.js                  # Navigation sidebar
├── CommunityDashboardHome.js            # Dashboard landing page
├── SchedulePickup.js                    # Schedule pickup form
├── DriveManagement.js                   # Drive hub with tabbed interface
├── CreateDrive.js                       # Create new drive form
├── EditDrive.js                         # Edit drive form
├── DriveStatistics.js                   # Drive performance analytics
├── ManageResidents.js                   # Resident management interface
├── CommunityImpactReport.js             # Community-wide analytics
├── CommunityBilling.js                  # Billing & subscription management
├── CommunitySettings.js                 # Settings with admin & community tabs
└── index.js                             # Component exports
```

## 🔐 Access Control

All routes are protected by the `ProtectedRoute` component with role validation:

```
allowedRoles={['community_admin']}
```

Only users with the `community_admin` role can access these pages.

## 🎨 Design System

- **Color Palette:**

  - Primary Green: `#588157`
  - Light Green: `#a3b18a`
  - Dark Green: `#3a5a40`
  - Charcoal: `#344e41`

- **Components:** All pages use Mantine UI components
  - Paper, Card, Table, Grid for layouts
  - Form inputs with validation
  - Navigation with active state
  - Modals for actions

## 📱 Responsive Design

- **Desktop:** Full navigation sidebar with all menu items
- **Mobile:** Collapsible hamburger menu with drawer sidebar

## 🔗 Component Imports

All components are exported via `index.js` for easy importing:

```javascript
import {
  CommunityDashboardLayout,
  CommunityDashboardHome,
  DriveManagement,
  ManageResidents,
  // ... etc
} from "./pages/CommunityDashboard";
```

## 🔄 Data Flow

1. **Authentication:** User logs in with `community_admin` role
2. **Context:** AuthContext provides user data and role verification
3. **Routes:** ProtectedRoute checks role before rendering
4. **Layout:** CommunityDashboardLayout wraps all pages
5. **Sidebar:** CommunitySidebar handles navigation with active state
6. **Content:** Individual pages display role-specific features

## 📝 Features Overview

### Home Dashboard

- ✅ Community impact metrics (CO₂ saved, waste collected)
- ✅ Active household engagement percentage
- ✅ Quick action cards for common tasks
- ✅ Upcoming events feed
- ✅ Recent activity feed

### Schedule Pickup

- ✅ Form for scheduling large pickups
- ✅ Recurring pickup options (weekly, bi-weekly, monthly)
- ✅ Waste type specifications
- ✅ Location and capacity details
- ✅ Special instructions for residents
- ✅ Image upload for promotional materials

### Drive Management

- ✅ Active & upcoming drives table
- ✅ Completed drives with statistics
- ✅ Public/Private visibility toggle
- ✅ Participant tracking
- ✅ Drive statistics modal preview
- ✅ Edit and delete options

### Create/Edit Drive

- ✅ Drive title and description
- ✅ Date range specification
- ✅ Waste types accepted
- ✅ Target quantity settings
- ✅ Public/Private visibility option
- ✅ Banner image upload

### Drive Statistics

- ✅ Total participants count
- ✅ Total waste collected
- ✅ Goal achievement percentage
- ✅ Waste type breakdown with visualizations
- ✅ Daily collection progress chart
- ✅ Report download functionality

### Manage Residents

- ✅ Approved members list with details
- ✅ Pending requests tab with approve/deny options
- ✅ Send email invitations to new residents
- ✅ Member status tracking
- ✅ Edit and remove member options

### Impact Report

- ✅ Community-wide metrics dashboard
- ✅ Monthly collection trend visualization
- ✅ Waste type breakdown by quantity
- ✅ Participation rate tracking
- ✅ Report download functionality

### Billing

- ✅ Current subscription plan details
- ✅ Monthly fee display
- ✅ Next billing date
- ✅ Payment history table
- ✅ Invoice management and downloads
- ✅ Plan change options
- ✅ Payment method updates

### Settings

- ✅ Admin profile management (name, email, phone)
- ✅ Password change functionality
- ✅ Community information management
- ✅ Address and location details
- ✅ Registration number storage
- ✅ Household count tracking

## 🚀 API Integration

All pages have placeholder API endpoints that need to be implemented:

```javascript
// Examples of endpoints to create:
POST   /api/communities/schedule-pickup
GET    /api/communities/drives
POST   /api/communities/drives
PUT    /api/communities/drives/:id
DELETE /api/communities/drives/:id
GET    /api/communities/drives/:id/stats

GET    /api/communities/members
POST   /api/communities/members/invite
PUT    /api/communities/members/:id/approve

GET    /api/communities/report
GET    /api/communities/billing
POST   /api/communities/billing/update-payment
GET    /api/communities/settings
PUT    /api/communities/settings
```

## 📊 State Management

Uses React Context API (AuthContext) for:

- User authentication and role validation
- User profile data (name, email, role)
- Token management
- Logout functionality

Local state in individual components for:

- Form data and validation
- Modal open/close states
- Tab selections
- Sorting and filtering

## ✨ Key Features

1. **Multi-tab Interfaces:** Drive management and resident management use tabs for organization
2. **Modal Dialogs:** For actions like inviting residents and viewing statistics
3. **Data Tables:** With sorting, filtering, and action buttons
4. **Charts & Analytics:** Line and bar charts for impact visualization
5. **Form Validation:** Using Mantine's form hooks
6. **Responsive Layout:** Mobile-first design with hamburger menu
7. **Role-based Access:** Protected by community_admin role verification

## 🔄 Next Steps for Implementation

1. Create backend API endpoints for all CRUD operations
2. Connect form submissions to API endpoints
3. Implement real data fetching and pagination
4. Add filters and search functionality
5. Implement real-time notifications
6. Add export/download functionality for reports
7. Implement file upload handling for images
8. Add member statistics and engagement tracking

## 📚 Dependencies

- `@mantine/core` - UI components
- `@mantine/form` - Form validation
- `@mantine/notifications` - Notifications
- `@tabler/icons-react` - Icons
- `react-router-dom` - Routing

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Ready for backend API integration
