import React, { useState, useContext } from "react";
import {
  Container,
  Paper,
  Title,
  Button,
  TextInput,
  Textarea,
  Select,
  Stack,
  Group,
  Checkbox,
  FileInput,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { createInitiative } from "../../api/initiativeService";
import { AuthContext } from "../../context/AuthContext";

function CreateInitiative() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      category: "",
      location: "",
      isPublic: true,
      targetParticipants: "",
      image: null,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      startDate: (value) => (!value ? "Start date is required" : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      // Get organization ID - try multiple sources
      let orgId =
        user?.orgId || user?.organizationId || localStorage.getItem("orgId");

      // For now, use a placeholder if no orgId - this will be fixed once auth properly stores orgId
      if (!orgId) {
        // This is a temporary solution - in production, orgId should come from login
        console.warn("No organization ID found - using placeholder");
        // You may want to show an error instead
        // orgId = '507f1f77bcf86cd799439011'; // MongoDB ObjectId format
      }

      const initiativeData = {
        title: values.title,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        category: values.category,
        location: values.location,
        isPublic: values.isPublic,
        targetParticipants: parseInt(values.targetParticipants) || 0,
      };

      if (orgId) {
        initiativeData.organizationId = orgId;
      }

      console.log("Creating initiative with data:", initiativeData);
      console.log("Token in localStorage:", localStorage.getItem("token"));

      const response = await createInitiative(initiativeData);
      console.log("Response:", response);
      alert("Initiative created successfully!");
      navigate("/org-dashboard/initiatives");
    } catch (error) {
      console.error("Error creating initiative:", error);
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
      console.error("Error message:", errorMessage);
      alert(`Failed to create initiative: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: "#344e41" }} mb="xs">
            Create Sustainability Initiative
          </Title>
          <p style={{ color: "#666" }}>
            Launch a new sustainability campaign or program
          </p>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="lg">
              <div>
                <Title order={4} style={{ color: "#344e41" }} mb="md">
                  Basic Information
                </Title>
                <Stack gap="md">
                  <TextInput
                    label="Initiative Title"
                    placeholder="e.g., Office E-Waste Collection Week"
                    {...form.getInputProps("title")}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Describe the initiative and its goals"
                    rows={3}
                    {...form.getInputProps("description")}
                  />
                </Stack>
              </div>

              <div>
                <Title order={4} style={{ color: "#344e41" }} mb="md">
                  Schedule
                </Title>
                <Group grow>
                  <TextInput
                    label="Start Date"
                    type="date"
                    {...form.getInputProps("startDate")}
                  />
                  <TextInput
                    label="End Date"
                    type="date"
                    {...form.getInputProps("endDate")}
                  />
                </Group>
              </div>

              <div>
                <Title order={4} style={{ color: "#344e41" }} mb="md">
                  Initiative Details
                </Title>
                <Stack gap="md">
                  <Select
                    label="Category"
                    placeholder="Select category"
                    data={[
                      { value: "training", label: "Training/Education" },
                      { value: "collection", label: "Waste Collection" },
                      { value: "challenge", label: "Employee Challenge" },
                      { value: "awareness", label: "Awareness Campaign" },
                      { value: "reduction", label: "Waste Reduction" },
                    ]}
                    {...form.getInputProps("category")}
                  />
                  <TextInput
                    label="Location"
                    placeholder="Office or facility location"
                    {...form.getInputProps("location")}
                  />
                  <TextInput
                    label="Target Participants"
                    type="number"
                    placeholder="Expected number of participants"
                    {...form.getInputProps("targetParticipants")}
                  />
                </Stack>
              </div>

              <div>
                <Title order={4} style={{ color: "#344e41" }} mb="md">
                  Visibility & Access
                </Title>
                <Checkbox
                  label="Make this initiative PUBLIC (visible to all Scrapp users)"
                  description="Private initiatives are only visible to organization employees"
                  {...form.getInputProps("isPublic", { type: "checkbox" })}
                />
              </div>

              <div>
                <Title order={4} style={{ color: "#344e41" }} mb="md">
                  Media
                </Title>
                <FileInput
                  label="Upload Initiative Banner"
                  placeholder="Click to upload image"
                  icon={<IconUpload size={14} />}
                  {...form.getInputProps("image")}
                />
              </div>

              <Group justify="flex-end" gap="md" mt="lg">
                <Button
                  variant="default"
                  onClick={() => navigate("/org-dashboard/initiatives")}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  style={{ backgroundColor: "#588157" }}
                  type="submit"
                  loading={saving}
                >
                  Create Initiative
                </Button>
              </Group>
            </Stack>
          </Paper>
        </form>
      </Stack>
    </Container>
  );
}

export default CreateInitiative;
