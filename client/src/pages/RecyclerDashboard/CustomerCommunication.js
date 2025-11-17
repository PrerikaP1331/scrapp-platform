import React, { useEffect, useState, useContext } from 'react';
import { Container, Tabs, Stack, Alert, Loader, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';
import {
  getCustomers,
  getAnnouncements,
  sendAnnouncement
} from '../../api/customerCommunicationService';
import SendAnnouncement from '../../components/CustomerCommunication/SendAnnouncement';
import MyCustomerList from '../../components/CustomerCommunication/MyCustomerList';
import SentHistory from '../../components/CustomerCommunication/SentHistory';

function CustomerCommunication() {
  const { user } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('send');
  const [successMessage, setSuccessMessage] = useState(null);

  const recyclerId = user?.recyclerProfileId || user?.id;

  // Fetch customers and announcements
  useEffect(() => {
    if (!recyclerId) return;

    const fetchData = async () => {
      setLoadingCustomers(true);
      setLoadingAnnouncements(true);
      setError(null);

      try {
        const [customersData, announcementsData] = await Promise.all([
          getCustomers(recyclerId),
          getAnnouncements(recyclerId)
        ]);

        setCustomers(customersData.customers || []);
        setAnnouncements(announcementsData.announcements || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          err.response?.data?.msg ||
          'Failed to load customer communication data'
        );
      } finally {
        setLoadingCustomers(false);
        setLoadingAnnouncements(false);
      }
    };

    fetchData();
  }, [recyclerId]);

  const handleSendAnnouncement = async (subject, message) => {
    try {
      setError(null);
      await sendAnnouncement(recyclerId, subject, message);

      // Refresh announcements
      const announcementsData = await getAnnouncements(recyclerId);
      setAnnouncements(announcementsData.announcements || []);

      setSuccessMessage('Announcement sent successfully!');
      setActiveTab('history');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error sending announcement:', err);
      throw err;
    }
  };

  const handleViewHistory = (customer) => {
    // Optional: Navigate to schedule history page with customer filter
    // navigate(`/recycler/schedule?customerId=${customer._id}`);
    // For now, just switch to history tab to see all announcements
    setActiveTab('history');
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Page Title */}
        <div>
          <h1>Customer Communication</h1>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Send announcements and manage your customer base
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert icon={<IconAlertCircle size={16} />} color="green" title="Success">
            {successMessage}
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="send">Send Announcement</Tabs.Tab>
            <Tabs.Tab value="customers">
              My Customer List {customers.length > 0 && `(${customers.length})`}
            </Tabs.Tab>
            <Tabs.Tab value="history">
              Sent History {announcements.length > 0 && `(${announcements.length})`}
            </Tabs.Tab>
          </Tabs.List>

          {/* Send Announcement Tab */}
          <Tabs.Panel value="send" pt="md">
            {loadingCustomers ? (
              <Center py="xl">
                <Loader />
              </Center>
            ) : (
              <SendAnnouncement
                customerCount={customers.length}
                onSend={handleSendAnnouncement}
                isLoading={loadingCustomers}
              />
            )}
          </Tabs.Panel>

          {/* My Customer List Tab */}
          <Tabs.Panel value="customers" pt="md">
            <MyCustomerList
              customers={customers}
              isLoading={loadingCustomers}
              onViewHistory={handleViewHistory}
            />
          </Tabs.Panel>

          {/* Sent History Tab */}
          <Tabs.Panel value="history" pt="md">
            <SentHistory
              announcements={announcements}
              isLoading={loadingAnnouncements}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default CustomerCommunication;
