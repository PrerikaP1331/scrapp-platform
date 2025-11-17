// /client/src/pages/Dashboard/components/SchedulePickup/SchedulePickup.js
import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Stepper,
  Card,
  Stack,
  Title,
  Modal,
  Text,
  Button,
  Group,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../../../context/AuthContext';
import { createPickup, assignRecycler, getAvailableRecyclers } from '../../../../api/pickupService';
import Step1_WasteDetails from './Step1_WasteDetails';
import Step2_TimePlace from './Step2_TimePlace';
import Step3_ChooseRecycler from './Step3_ChooseRecycler';
import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal';
import styles from './SchedulePickup.module.css';

function SchedulePickup() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeStep, setActiveStep] = useState(0);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [createdPickupId, setCreatedPickupId] = useState(null);
  const [allRecyclers, setAllRecyclers] = useState([]);

  const [formData, setFormData] = useState({
    wasteTypes: [],
    quantity: '',
    notes: '',
    scheduledDate: null,
    timeSlot: '',
    address: user?.address || {},
    selectedRecyclerId: null,
  });

  // Fetch recycler details when selectedRecyclerId changes
  useEffect(() => {
    if (formData.selectedRecyclerId && allRecyclers.length > 0) {
      const recycler = allRecyclers.find(r => r._id === formData.selectedRecyclerId);
      if (recycler) {
        setSelectedRecycler(recycler);
      }
    }
  }, [formData.selectedRecyclerId, allRecyclers]);

  const handleNext = async () => {
    if (activeStep === 2) {
      // Before confirming, fetch all available recyclers to get their details
      if (formData.selectedRecyclerId) {
        try {
          const criteria = {
            scheduledDate: formData.scheduledDate,
            timeSlot: formData.timeSlot,
            wasteTypes: formData.wasteTypes,
            userCity: user?.address?.city || '',
          };
          const recyclers = await getAvailableRecyclers(criteria);
          setAllRecyclers(recyclers);
          setConfirmationOpen(true);
        } catch (error) {
          notifications.show({
            title: 'Error',
            message: 'Failed to load recycler details',
            color: 'red',
          });
        }
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleConfirmPickup = async () => {
    try {
      setLoading(true);

      // Step 1: Create the pickup with initial data
      const pickupData = {
        wasteTypes: formData.wasteTypes,
        quantity: formData.quantity,
        notes: formData.notes,
        scheduledDate: formData.scheduledDate,
        timeSlot: formData.timeSlot,
        address: formData.address,
      };

      const createdPickup = await createPickup(pickupData);
      setCreatedPickupId(createdPickup._id);

      // Step 2: Assign the selected recycler
      if (createdPickup._id && formData.selectedRecyclerId) {
        await assignRecycler(createdPickup._id, formData.selectedRecyclerId);
      }

      setConfirmationOpen(false);
      setSuccessOpen(true);

      notifications.show({
        title: 'Success',
        message: 'Pickup scheduled successfully!',
        color: 'teal',
      });
    } catch (error) {
      console.error('Error confirming pickup:', error);
      notifications.show({
        title: 'Error',
        message: error.msg || 'Failed to schedule pickup',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = () => {
    setSuccessOpen(false);
    navigate('/dashboard/history');
  };

  const handleBackToDashboard = () => {
    setSuccessOpen(false);
    navigate('/dashboard');
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Card withBorder p="lg" style={{ backgroundColor: '#f0f8f5' }}>
          <Title order={1} style={{ color: '#344e41' }} mb="xs">
            Schedule a New Pickup
          </Title>
          <Text color="dimmed">Complete all steps to schedule your waste pickup</Text>
        </Card>

        {/* Stepper */}
        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          allowNextStepsSelect={false}
          size="lg"
        >
          <Stepper.Step label="Waste Details" description="Select what you're recycling" />
          <Stepper.Step label="Time & Place" description="When and where" />
          <Stepper.Step label="Choose Recycler" description="Who will pick it up" />
        </Stepper>

        {/* Step Content */}
        <Card withBorder p="lg">
          {activeStep === 0 && (
            <Step1_WasteDetails
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {activeStep === 1 && (
            <Step2_TimePlace
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {activeStep === 2 && (
            <Step3_ChooseRecycler
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
        </Card>
      </Stack>

      {/* Confirmation Modal */}
      {selectedRecycler && (
        <ConfirmationModal
          opened={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          onConfirm={handleConfirmPickup}
          formData={formData}
          selectedRecycler={selectedRecycler}
          loading={loading}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        opened={successOpen}
        onViewHistory={handleViewHistory}
        onBackToDashboard={handleBackToDashboard}
        pickupId={createdPickupId}
      />
    </Container>
  );
}

export default SchedulePickup;
