import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Button,
  Stack,
  Group,
  Tabs,
  TextInput,
  PasswordInput,
  Select,
  Textarea,
  Avatar,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { AuthContext } from "../../context/AuthContext";

function OrganizationSettings() {
  const { user } = useContext(AuthContext);

  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Organization Admin",
  });

  const [orgData, setOrgData] = useState({
    companyName: "",
    registrationNumber: "REG-2024-001",
    industry: "Technology",
    website: "www.techcompany.com",
    address: "123 Business Street",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
    contactEmail: "",
    contactPhone: "",
    description: "Leading technology solutions provider",
  });

  const [activeTab, setActiveTab] = useState("admin");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [orgSaved, setOrgSaved] = useState(false);
  const [orgError, setOrgError] = useState("");
  const [orgLoading, setOrgLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(" ") : ["Admin", "User"];
      setAdminData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "Admin",
        lastName: nameParts.slice(1).join(" ") || "User",
        email: user.email || "",
        phone: user.phone || "+91 9876543210",
      }));

      setOrgData((prev) => ({
        ...prev,
        companyName: user.organizationName || "",
        contactEmail: user.email || "",
      }));
    }
  }, [user]);

  const handleAdminChange = (field, value) => {
    setAdminData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrgChange = (field, value) => {
    setOrgData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePassword = async () => {
    setPasswordError("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      const axios = require("../../api/axios").default;
      await axios.put("/user/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveOrganization = async () => {
    setOrgError("");
    setOrgLoading(true);

    try {
      const axios = require("../../api/axios").default;
      await axios.put("/api/organization/details", {
        companyName: orgData.companyName,
        registrationNumber: orgData.registrationNumber,
        industry: orgData.industry,
        website: orgData.website,
        address: orgData.address,
        city: orgData.city,
        state: orgData.state,
        postalCode: orgData.postalCode,
        contactEmail: orgData.contactEmail,
        contactPhone: orgData.contactPhone,
        description: orgData.description,
      });

      setOrgSaved(true);
      setTimeout(() => setOrgSaved(false), 3000);
    } catch (error) {
      setOrgError(
        error.response?.data?.message || "Failed to save organization details"
      );
    } finally {
      setOrgLoading(false);
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
            Manage your profile and organization details
          </p>
        </div>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="admin">Admin Profile</Tabs.Tab>
            <Tabs.Tab value="organization">Organization Details</Tabs.Tab>
          </Tabs.List>

          {/* Admin Profile Tab */}
          <Tabs.Panel value="admin" pt="md">
            <Paper p="lg" radius="md" withBorder>
              <Stack gap="lg">
                <Group>
                  <Avatar size={80} radius="lg" />
                  <Button
                    leftSection={<IconUpload size={18} />}
                    variant="default"
                  >
                    Change Photo
                  </Button>
                </Group>

                <div>
                  <Title order={5} style={{ color: "#344e41" }} mb="md">
                    Personal Information
                  </Title>
                  <Group grow>
                    <TextInput
                      label="First Name"
                      placeholder="First name"
                      value={adminData.firstName}
                      onChange={(e) =>
                        handleAdminChange("firstName", e.currentTarget.value)
                      }
                    />
                    <TextInput
                      label="Last Name"
                      placeholder="Last name"
                      value={adminData.lastName}
                      onChange={(e) =>
                        handleAdminChange("lastName", e.currentTarget.value)
                      }
                    />
                  </Group>
                </div>

                <div>
                  <Title order={5} style={{ color: "#344e41" }} mb="md">
                    Contact Information
                  </Title>
                  <Stack gap="md">
                    <TextInput
                      label="Email Address"
                      type="email"
                      value={adminData.email}
                      onChange={(e) =>
                        handleAdminChange("email", e.currentTarget.value)
                      }
                    />
                    <TextInput
                      label="Phone Number"
                      value={adminData.phone}
                      onChange={(e) =>
                        handleAdminChange("phone", e.currentTarget.value)
                      }
                    />
                  </Stack>
                </div>

                <div>
                  <Title order={5} style={{ color: "#344e41" }} mb="md">
                    Security
                  </Title>
                  <Stack gap="md">
                    <PasswordInput
                      label="Current Password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.currentTarget.value,
                        }))
                      }
                    />
                    <PasswordInput
                      label="New Password"
                      placeholder="Enter new password"
                      description="Minimum 8 characters"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.currentTarget.value,
                        }))
                      }
                    />
                    <PasswordInput
                      label="Confirm New Password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.currentTarget.value,
                        }))
                      }
                    />
                    {passwordError && (
                      <p style={{ color: "red", fontSize: "0.9rem" }}>
                        {passwordError}
                      </p>
                    )}
                    {passwordSaved && (
                      <p style={{ color: "green", fontSize: "0.9rem" }}>
                        Password updated successfully!
                      </p>
                    )}
                  </Stack>
                </div>

                <Group justify="flex-end">
                  <Button variant="default">Cancel</Button>
                  <Button
                    style={{ backgroundColor: "#588157" }}
                    onClick={handleUpdatePassword}
                    loading={passwordLoading}
                  >
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* Organization Details Tab */}
          <Tabs.Panel value="organization" pt="md">
            <Paper p="lg" radius="md" withBorder>
              <Stack gap="lg">
                <div>
                  <Title order={5} style={{ color: "#344e41" }} mb="md">
                    Company Information
                  </Title>
                  <Stack gap="md">
                    <TextInput
                      label="Company Name"
                      placeholder="Organization name"
                      value={orgData.companyName}
                      onChange={(e) =>
                        handleOrgChange("companyName", e.currentTarget.value)
                      }
                    />
                    <Group grow>
                      <TextInput
                        label="Registration Number"
                        value={orgData.registrationNumber}
                        onChange={(e) =>
                          handleOrgChange(
                            "registrationNumber",
                            e.currentTarget.value
                          )
                        }
                      />
                      <Select
                        label="Industry"
                        placeholder="Select industry"
                        data={[
                          { value: "technology", label: "Technology" },
                          { value: "manufacturing", label: "Manufacturing" },
                          { value: "retail", label: "Retail" },
                          { value: "healthcare", label: "Healthcare" },
                          { value: "finance", label: "Finance" },
                          { value: "other", label: "Other" },
                        ]}
                        value={orgData.industry}
                        onChange={(value) => handleOrgChange("industry", value)}
                      />
                    </Group>
                    <TextInput
                      label="Website"
                      placeholder="https://example.com"
                      value={orgData.website}
                      onChange={(e) =>
                        handleOrgChange("website", e.currentTarget.value)
                      }
                    />
                  </Stack>
                </div>

                <div>
                  <Title order={5} style={{ color: "#344e41" }} mb="md">
                    Address
                  </Title>
                  <Stack gap="md">
                    <TextInput
                      label="Street Address"
                      placeholder="123 Business Street"
                      value={orgData.address}
                      onChange={(e) =>
                        handleOrgChange("address", e.currentTarget.value)
                      }
                    />
                    <Group grow>
                      <TextInput
                        label="City"
                        value={orgData.city}
                        onChange={(e) =>
                          handleOrgChange("city", e.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="State/Province"
                        value={orgData.state}
                        onChange={(e) =>
                          handleOrgChange("state", e.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="Postal Code"
                        value={orgData.postalCode}
                        onChange={(e) =>
                          handleOrgChange("postalCode", e.currentTarget.value)
                        }
                      />
                    </Group>
                  </Stack>
                </div>

                <div>
                  <Title order={5} style={{ color: "#344e41" }} mb="md">
                    Contact
                  </Title>
                  <Stack gap="md">
                    <TextInput
                      label="Contact Email"
                      type="email"
                      value={orgData.contactEmail}
                      onChange={(e) =>
                        handleOrgChange("contactEmail", e.currentTarget.value)
                      }
                    />
                    <TextInput
                      label="Contact Phone"
                      value={orgData.contactPhone}
                      onChange={(e) =>
                        handleOrgChange("contactPhone", e.currentTarget.value)
                      }
                    />
                  </Stack>
                </div>

                <div>
                  <Title order={5} style={{ color: "#344e41" }} mb="md">
                    Description
                  </Title>
                  <Textarea
                    label="Company Description"
                    placeholder="Tell us about your organization"
                    rows={4}
                    value={orgData.description}
                    onChange={(e) =>
                      handleOrgChange("description", e.currentTarget.value)
                    }
                  />
                </div>

                {orgError && (
                  <p style={{ color: "red", fontSize: "0.9rem" }}>{orgError}</p>
                )}
                {orgSaved && (
                  <p style={{ color: "green", fontSize: "0.9rem" }}>
                    Organization details saved successfully!
                  </p>
                )}

                <Group justify="flex-end">
                  <Button variant="default">Cancel</Button>
                  <Button
                    style={{ backgroundColor: "#588157" }}
                    onClick={handleSaveOrganization}
                    loading={orgLoading}
                  >
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default OrganizationSettings;
