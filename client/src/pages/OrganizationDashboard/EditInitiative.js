import React, { useEffect, useState } from "react";
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
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateInitiative,
  getInitiativeById,
} from "../../api/initiativeService";

function EditInitiative() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      startDate: (value) => (!value ? "Start date is required" : null),
    },
  });

  useEffect(() => {
    const fetchInitiative = async () => {
      try {
        setLoading(true);
        const response = await getInitiativeById(id);
        const data = response.data || response;
        form.setValues({
          title: data.title || "",
          description: data.description || "",
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "",
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split("T")[0]
            : "",
          category: data.category || "",
          location: data.location || "",
          isPublic: data.isPublic !== undefined ? data.isPublic : true,
          targetParticipants: data.targetParticipants || "",
        });
      } catch (error) {
        console.error("Error fetching initiative:", error);
        alert("Failed to load initiative details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInitiative();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setError("");
      setSaving(true);
      const response = await updateInitiative(id, values);
      alert("Initiative updated successfully!");
      navigate("/org-dashboard/initiatives");
    } catch (error) {
      console.error("Error updating initiative:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        "Failed to update initiative. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container size="lg">
      {loading ? (
        <Center h={400}>
          <Loader />
        </Center>
      ) : (
        <Stack gap="lg">
          <div>
            <Title order={2} style={{ color: "#344e41" }} mb="xs">
              Edit Sustainability Initiative
            </Title>
            <p style={{ color: "#666" }}>
              Update the initiative details and settings
            </p>
          </div>

          {error && (
            <Alert icon={<IconAlertCircle />} color="red" title="Error">
              {error}
            </Alert>
          )}

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
                  <Group gap="lg">
                    <label>
                      <input
                        type="checkbox"
                        checked={form.values.isPublic}
                        onChange={(e) =>
                          form.setFieldValue(
                            "isPublic",
                            e.currentTarget.checked
                          )
                        }
                      />{" "}
                      Make this initiative PUBLIC (visible to all Scrapp users)
                    </label>
                  </Group>
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
                    Update Initiative
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </form>
        </Stack>
      )}
    </Container>
  );
}

export default EditInitiative;
