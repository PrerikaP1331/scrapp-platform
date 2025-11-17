import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Stack,
  Tabs,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Select,
  Card,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";

function CommunitySettings() {
  const { user } = useContext(AuthContext);
  const [adminFormLoading, setAdminFormLoading] = useState(false);
  const [communityFormLoading, setCommunityFormLoading] = useState(false);

  const adminForm = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (!/^\S+@\S+$/.test(value) ? "Invalid email" : null),
      newPassword: (value) =>
        value && value.length < 6
          ? "Password must be at least 6 characters"
          : null,
    },
  });

  const communityForm = useForm({
    initialValues: {
      communityName: "",
      communityType: "residential",
      address: "123 Green Street, City",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      totalHouseholds: "200",
      registrationNumber: "RWA/2023/00001",
    },
    validate: {
      communityName: (value) => (!value ? "Community name is required" : null),
      address: (value) => (!value ? "Address is required" : null),
    },
  });

  useEffect(() => {
    if (user) {
      adminForm.setValues({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      communityForm.setValues({
        communityName: user.communityName || "",
      });
    }
  }, [user]);
  const handleAdminSubmit = async (values) => {
    setAdminFormLoading(true);
    try {
      // Handle password change if provided
      if (values.newPassword) {
        if (values.newPassword.length < 8) {
          adminForm.setFieldError(
            "newPassword",
            "Password must be at least 8 characters"
          );
          setAdminFormLoading(false);
          return;
        }

        if (values.newPassword !== values.confirmPassword) {
          adminForm.setFieldError(
            "confirmPassword",
            "Passwords do not match"
          );
          setAdminFormLoading(false);
          return;
        }

        await axios.put("/api/user/password", {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
      }

      // TODO: Replace with API call to /communities/admin/profile for name/email/phone updates
      console.log("Updating admin profile:", values);
      
      // Clear password fields on success
      adminForm.setValues({
        ...values,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Admin profile updated successfully!");
      setAdminFormLoading(false);
    } catch (error) {
      console.error("Error updating admin profile:", error);
      const errorMsg = error.response?.data?.message || "Failed to update profile";
      if (error.response?.status === 401) {
        adminForm.setFieldError("currentPassword", "Current password is incorrect");
      } else {
        alert(errorMsg);
      }
      setAdminFormLoading(false);
    }
  };

  const handleCommunitySubmit = async (values) => {
    setCommunityFormLoading(true);
    try {
      // TODO: Replace with API call to /communities/details
      console.log("Updating community details:", values);
      setTimeout(() => {
        alert("Community details updated successfully!");
        setCommunityFormLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating community details:", error);
      setCommunityFormLoading(false);
    }
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: "#344e41" }} mb="xs">
            Settings
          </Title>
          <p style={{ color: "#666" }}>
            Manage your account and community information
          </p>
        </div>

        <Tabs defaultValue="admin">
          <Tabs.List>
            <Tabs.Tab value="admin">Admin Profile</Tabs.Tab>
            <Tabs.Tab value="community">Community Details</Tabs.Tab>
          </Tabs.List>

          {/* Admin Profile Tab */}
          <Tabs.Panel value="admin" pt="md">
            <form onSubmit={adminForm.onSubmit(handleAdminSubmit)}>
              <Paper p="lg" radius="md" withBorder>
                <Stack gap="lg">
                  {/* Personal Information */}
                  <div>
                    <Title order={4} style={{ color: "#344e41" }} mb="md">
                      Personal Information
                    </Title>
                    <Stack gap="md">
                      <TextInput
                        label="Full Name"
                        placeholder="Your full name"
                        {...adminForm.getInputProps("name")}
                      />
                      <TextInput
                        label="Email Address"
                        placeholder="your.email@example.com"
                        {...adminForm.getInputProps("email")}
                      />
                      <TextInput
                        label="Phone Number"
                        placeholder="+91-XXXXXXXXXX"
                        {...adminForm.getInputProps("phone")}
                      />
                    </Stack>
                  </div>

                  {/* Change Password */}
                  <div>
                    <Title order={4} style={{ color: "#344e41" }} mb="md">
                      Change Password
                    </Title>
                    <Stack gap="md">
                      <PasswordInput
                        label="Current Password"
                        placeholder="Enter your current password"
                        {...adminForm.getInputProps("currentPassword")}
                      />
                      <PasswordInput
                        label="New Password"
                        placeholder="Enter new password"
                        {...adminForm.getInputProps("newPassword")}
                      />
                      <PasswordInput
                        label="Confirm New Password"
                        placeholder="Confirm new password"
                        {...adminForm.getInputProps("confirmPassword")}
                      />
                    </Stack>
                  </div>

                  {/* Submit */}
                  <Group justify="flex-end" gap="md" mt="lg">
                    <Button variant="default" onClick={() => adminForm.reset()}>
                      Cancel
                    </Button>
                    <Button
                      style={{ backgroundColor: "#588157" }}
                      loading={adminFormLoading}
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            </form>
          </Tabs.Panel>

          {/* Community Details Tab */}
          <Tabs.Panel value="community" pt="md">
            <form onSubmit={communityForm.onSubmit(handleCommunitySubmit)}>
              <Paper p="lg" radius="md" withBorder>
                <Stack gap="lg">
                  {/* Basic Information */}
                  <div>
                    <Title order={4} style={{ color: "#344e41" }} mb="md">
                      Basic Information
                    </Title>
                    <Stack gap="md">
                      <TextInput
                        label="Community Name"
                        placeholder="e.g., Green Meadows RWA"
                        {...communityForm.getInputProps("communityName")}
                      />
                      <Select
                        label="Community Type"
                        placeholder="Select community type"
                        data={[
                          {
                            value: "residential",
                            label: "Residential Society / RWA",
                          },
                          { value: "apartment", label: "Apartment Complex" },
                          { value: "gated", label: "Gated Community" },
                          { value: "other", label: "Other" },
                        ]}
                        {...communityForm.getInputProps("communityType")}
                      />
                    </Stack>
                  </div>

                  {/* Address */}
                  <div>
                    <Title order={4} style={{ color: "#344e41" }} mb="md">
                      Address
                    </Title>
                    <Stack gap="md">
                      <TextInput
                        label="Street Address"
                        placeholder="123 Green Street"
                        {...communityForm.getInputProps("address")}
                      />
                      <Group grow>
                        <TextInput
                          label="City"
                          placeholder="Mumbai"
                          {...communityForm.getInputProps("city")}
                        />
                        <TextInput
                          label="State"
                          placeholder="Maharashtra"
                          {...communityForm.getInputProps("state")}
                        />
                      </Group>
                      <TextInput
                        label="Pincode"
                        placeholder="400001"
                        {...communityForm.getInputProps("pincode")}
                      />
                    </Stack>
                  </div>

                  {/* Community Details */}
                  <div>
                    <Title order={4} style={{ color: "#344e41" }} mb="md">
                      Community Details
                    </Title>
                    <Stack gap="md">
                      <TextInput
                        label="Total Households"
                        type="number"
                        placeholder="e.g., 200"
                        {...communityForm.getInputProps("totalHouseholds")}
                      />
                      <TextInput
                        label="Registration Number"
                        placeholder="e.g., RWA/2023/00001"
                        {...communityForm.getInputProps("registrationNumber")}
                      />
                    </Stack>
                  </div>

                  {/* Submit */}
                  <Group justify="flex-end" gap="md" mt="lg">
                    <Button
                      variant="default"
                      onClick={() => communityForm.reset()}
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ backgroundColor: "#588157" }}
                      loading={communityFormLoading}
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default CommunitySettings;
