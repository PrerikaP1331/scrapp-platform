// /client/src/App.js (Corrected with All Providers)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import CommunityDashboardLayout from './pages/CommunityDashboard/CommunityDashboardLayout';
import OrganizationDashboardLayout from './pages/OrganizationDashboard/OrganizationDashboardLayout';
import RecyclerLayout from './layouts/RecyclerLayout/RecyclerLayout';

// Public Pages
import LoginPage from './pages/LoginPage/LoginPage';
import SelectRolePage from './pages/SelectRolePage/SelectRolePage';
import IndividualSignUpPage from './pages/IndividualSignUpPage/IndividualSignUpPage';
import LandingPage from './pages/LandingPage/LandingPage';
import CommunitySignUpPage from './pages/CommunitySignUpPage/CommunitySignUpPage';
import CorporateSignUpPage from './pages/CorporateSignUpPage/CorporateSignUpPage'; 
import RecyclerSignUpPage from './pages/RecyclerSignUpPage/RecyclerSignUpPage';

// Individual Dashboard Pages
import DashboardHome from './pages/Dashboard/DashboardHome';
import SchedulePickup from './pages/Dashboard/SchedulePickup';
import History from './pages/Dashboard/History';
import Impact from './pages/Dashboard/Impact';
import Communities from './pages/Dashboard/Communities';
import Coupons from './pages/Dashboard/Coupons';
import Profile from './pages/Dashboard/Profile';
import Settings from './pages/Dashboard/Settings';

// Community Dashboard Pages
import CommunityDashboardHome from './pages/CommunityDashboard/CommunityDashboardHome';
import DriveManagement from './pages/CommunityDashboard/DriveManagement';
import CreateDrive from './pages/CommunityDashboard/CreateDrive';
import EditDrive from './pages/CommunityDashboard/EditDrive';
import DriveStatistics from './pages/CommunityDashboard/DriveStatistics';
import ManageResidents from './pages/CommunityDashboard/ManageResidents';
import CommunityImpactReport from './pages/CommunityDashboard/CommunityImpactReport';
import CommunityBilling from './pages/CommunityDashboard/CommunityBilling';
import CommunitySettings from './pages/CommunityDashboard/CommunitySettings';

// Organization Dashboard Pages
import OrganizationDashboardHome from './pages/OrganizationDashboard/OrganizationDashboardHome';
import ScheduleBulkPickup from './pages/OrganizationDashboard/ScheduleBulkPickup';
import InitiativeManagement from './pages/OrganizationDashboard/InitiativeManagement';
import CreateInitiative from './pages/OrganizationDashboard/CreateInitiative';
import EditInitiative from './pages/OrganizationDashboard/EditInitiative';
import InitiativeReport from './pages/OrganizationDashboard/InitiativeReport';
import ManageEmployees from './pages/OrganizationDashboard/ManageEmployees';
import ESGReport from './pages/OrganizationDashboard/ESGReport';
import ZeroWasteProgram from './pages/OrganizationDashboard/ZeroWasteProgram';
import OrganizationBilling from './pages/OrganizationDashboard/OrganizationBilling';
import OrganizationSettings from './pages/OrganizationDashboard/OrganizationSettings';

// Recycler Dashboard Pages
import RecyclerDashboard from './pages/RecyclerDashboard/RecyclerDashboard';
import TodayRoute from './pages/RecyclerDashboard/TodayRoute';
import ScheduleHistory from './pages/RecyclerDashboard/ScheduleHistory';
import BusinessAnalytics from './pages/RecyclerDashboard/BusinessAnalytics';
import CustomerCommunication from './pages/RecyclerDashboard/CustomerCommunication';
import PublicProfile from './pages/RecyclerDashboard/PublicProfile';
import RecyclerBilling from './pages/RecyclerDashboard/RecyclerBilling';
import RecyclerSettings from './pages/RecyclerDashboard/RecyclerSettings';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <Router>
          <Notifications />
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<Navigate to="/signup/select-role" replace />} />
              <Route path="signup/select-role" element={<SelectRolePage />} />
              <Route path="signup/individual" element={<IndividualSignUpPage />} />
              <Route path="signup/community" element={<CommunitySignUpPage />} />
              <Route path="signup/corporate" element={<CorporateSignUpPage />} />
              <Route path="signup/recycler" element={<RecyclerSignUpPage />} />
            </Route>
            
            {/* --- Protected Individual Dashboard Routes --- */}
            <Route element={<ProtectedRoute allowedRoles={['individual']} />}>
              <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
              <Route path="/dashboard/schedule-pickup" element={<DashboardLayout><SchedulePickup /></DashboardLayout>} />
              <Route path="/dashboard/history" element={<DashboardLayout><History /></DashboardLayout>} />
              <Route path="/dashboard/impact" element={<DashboardLayout><Impact /></DashboardLayout>} />
              <Route path="/dashboard/communities" element={<DashboardLayout><Communities /></DashboardLayout>} />
              <Route path="/dashboard/coupons" element={<DashboardLayout><Coupons /></DashboardLayout>} />
              <Route path="/dashboard/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
              <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            </Route>

            {/* --- Protected Community Admin Dashboard Routes --- */}
            <Route element={<ProtectedRoute allowedRoles={['community_admin']} />}>
              <Route path="/community-dashboard" element={<CommunityDashboardLayout><CommunityDashboardHome /></CommunityDashboardLayout>} />
              <Route path="/community-dashboard/drives" element={<CommunityDashboardLayout><DriveManagement /></CommunityDashboardLayout>} />
              <Route path="/community-dashboard/drives/new" element={<CommunityDashboardLayout><CreateDrive /></CommunityDashboardLayout>} />
              <Route path="/community-dashboard/drives/:id/edit" element={<CommunityDashboardLayout><EditDrive /></CommunityDashboardLayout>} />
              <Route path="/community-dashboard/drives/:id/stats" element={<CommunityDashboardLayout><DriveStatistics /></CommunityDashboardLayout>} />
              <Route path="/community-dashboard/members" element={<CommunityDashboardLayout><ManageResidents /></CommunityDashboardLayout>} />
              <Route path="/community-dashboard/report" element={<CommunityDashboardLayout><CommunityImpactReport /></CommunityDashboardLayout>} />
              <Route path="/community-dashboard/billing" element={<CommunityDashboardLayout><CommunityBilling /></CommunityDashboardLayout>} />
              <Route path="/community-dashboard/settings" element={<CommunityDashboardLayout><CommunitySettings /></CommunityDashboardLayout>} />
            </Route>

            {/* --- Protected Organization Admin Dashboard Routes --- */}
            <Route element={<ProtectedRoute allowedRoles={['org_admin']} />}>
              <Route path="/org-dashboard" element={<OrganizationDashboardLayout><OrganizationDashboardHome /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/schedule" element={<OrganizationDashboardLayout><ScheduleBulkPickup /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/initiatives" element={<OrganizationDashboardLayout><InitiativeManagement /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/initiatives/new" element={<OrganizationDashboardLayout><CreateInitiative /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/initiatives/:id/edit" element={<OrganizationDashboardLayout><EditInitiative /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/initiatives/:id/report" element={<OrganizationDashboardLayout><InitiativeReport /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/members" element={<OrganizationDashboardLayout><ManageEmployees /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/report" element={<OrganizationDashboardLayout><ESGReport /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/zero-waste" element={<OrganizationDashboardLayout><ZeroWasteProgram /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/billing" element={<OrganizationDashboardLayout><OrganizationBilling /></OrganizationDashboardLayout>} />
              <Route path="/org-dashboard/settings" element={<OrganizationDashboardLayout><OrganizationSettings /></OrganizationDashboardLayout>} />
            </Route>

            {/* --- Protected Recycler Dashboard Routes --- */}
            <Route element={<ProtectedRoute allowedRoles={['recycler']} />}>
              <Route path="/recycler/dashboard" element={<RecyclerLayout><RecyclerDashboard /></RecyclerLayout>} />
              <Route path="/recycler-dashboard" element={<RecyclerLayout><RecyclerDashboard /></RecyclerLayout>} />
              <Route path="/recycler/route" element={<RecyclerLayout><TodayRoute /></RecyclerLayout>} />
              <Route path="/recycler-dashboard/route" element={<RecyclerLayout><TodayRoute /></RecyclerLayout>} />
              <Route path="/recycler/schedule" element={<RecyclerLayout><ScheduleHistory /></RecyclerLayout>} />
              <Route path="/recycler-dashboard/schedule" element={<RecyclerLayout><ScheduleHistory /></RecyclerLayout>} />
              <Route path="/recycler/analytics" element={<RecyclerLayout><BusinessAnalytics /></RecyclerLayout>} />
              <Route path="/recycler-dashboard/analytics" element={<RecyclerLayout><BusinessAnalytics /></RecyclerLayout>} />
              <Route path="/recycler/messages" element={<RecyclerLayout><CustomerCommunication /></RecyclerLayout>} />
              <Route path="/recycler-dashboard/customers" element={<RecyclerLayout><CustomerCommunication /></RecyclerLayout>} />
              <Route path="/recycler/profile" element={<RecyclerLayout><PublicProfile /></RecyclerLayout>} />
              <Route path="/recycler-dashboard/profile" element={<RecyclerLayout><PublicProfile /></RecyclerLayout>} />
              <Route path="/recycler/billing" element={<RecyclerLayout><RecyclerBilling /></RecyclerLayout>} />
              <Route path="/recycler-dashboard/billing" element={<RecyclerLayout><RecyclerBilling /></RecyclerLayout>} />
              <Route path="/recycler/settings" element={<RecyclerLayout><RecyclerSettings /></RecyclerLayout>} />
              <Route path="/recycler-dashboard/settings" element={<RecyclerLayout><RecyclerSettings /></RecyclerLayout>} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
