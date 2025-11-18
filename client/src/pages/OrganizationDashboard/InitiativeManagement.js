import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Paper,
  Title,
  Button,
  Stack,
  Group,
  Tabs,
  Table,
  Badge,
  ActionIcon,
  Modal,
  Grid,
  Card,
  Text,
  Loader,
  Center,
  Menu,
  NumberInput,
  Textarea,
  Alert,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconPlus,
  IconChevronDown,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
  getInitiatives,
  deleteInitiative,
  updateInitiativeStatus,
  updateInitiativeParticipants,
} from "../../api/initiativeService";
import { AuthContext } from "../../context/AuthContext";

function InitiativeManagement() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeInitiatives, setActiveInitiatives] = useState([]);
  const [completedInitiatives, setCompletedInitiatives] = useState([]);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusUpdateId, setStatusUpdateId] = useState(null);
  const [participantUpdateId, setParticipantUpdateId] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [completionDetails, setCompletionDetails] = useState({
    challenges: "",
    lessons: "",
    nextSteps: "",
    additionalNotes: "",
  });
  const [initiativeToComplete, setInitiativeToComplete] = useState(null);

  useEffect(() => {
    fetchInitiatives();
  }, [user?.orgId]);

  const fetchInitiatives = async () => {
    try {
      setLoading(true);
      // Fetch all initiatives without filtering - will be improved once org association is proper
      const response = await getInitiatives();
      const initiatives = response.data || response || [];

      const active = initiatives.filter((init) => init.status !== "completed");
      const completed = initiatives.filter(
        (init) => init.status === "completed"
      );

      setActiveInitiatives(active);
      setCompletedInitiatives(completed);
    } catch (error) {
      console.error("Error fetching initiatives:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInitiative = async (id) => {
    if (window.confirm("Are you sure you want to delete this initiative?")) {
      try {
        await deleteInitiative(id);
        fetchInitiatives();
      } catch (error) {
        console.error("Error deleting initiative:", error);
        alert("Failed to delete initiative");
      }
    }
  };

  const handleViewReport = (initiative) => {
    setSelectedInitiative(initiative);
    setModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    // If marking as completed, show dialog for report details
    if (newStatus === "completed") {
      setInitiativeToComplete(id);
      setCompletionDialogOpen(true);
      return;
    }

    // For other status changes, update directly
    try {
      setStatusUpdateId(id);
      await updateInitiativeStatus(id, newStatus);
      fetchInitiatives();
    } catch (error) {
      console.error("Error updating initiative status:", error);
      alert("Failed to update initiative status");
    } finally {
      setStatusUpdateId(null);
    }
  };

  const handleCompleteInitiative = async () => {
    try {
      setStatusUpdateId(initiativeToComplete);
      // Update status to completed and add report details
      await updateInitiativeStatus(
        initiativeToComplete,
        "completed",
        completionDetails
      );

      // Close dialog and reset state
      setCompletionDialogOpen(false);
      setCompletionDetails({
        challenges: "",
        lessons: "",
        nextSteps: "",
        additionalNotes: "",
      });

      // Navigate to report after a brief delay to allow backend to process
      const initiativeId = initiativeToComplete;
      setInitiativeToComplete(null);

      setTimeout(() => {
        navigate(`/org-dashboard/initiatives/${initiativeId}/report`);
      }, 500);
    } catch (error) {
      console.error("Error completing initiative:", error);
      alert("Failed to complete initiative");
    } finally {
      setStatusUpdateId(null);
    }
  };

  const handleParticipantUpdate = async (id, count) => {
    try {
      setParticipantUpdateId(id);
      await updateInitiativeParticipants(id, count);
      fetchInitiatives();
      setParticipantCount(0);
    } catch (error) {
      console.error("Error updating initiative participants:", error);
      alert("Failed to update participant count");
    } finally {
      setParticipantUpdateId(null);
    }
  };

  const formatDate = (startDate, endDate) => {
    if (!startDate) return "";
    const start = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (endDate) {
      const end = new Date(endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${start} - ${end}`;
    }
    return start;
  };

  if (loading) {
    return (
      <Container size="xl">
        <Center h={400}>
          <Loader />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: "#344e41" }} mb="xs">
              Initiative Management
            </Title>
            <p style={{ color: "#666" }}>
              Create and manage corporate sustainability campaigns
            </p>
          </div>
          <Button
            style={{ backgroundColor: "#588157" }}
            leftSection={<IconPlus size={18} />}
            onClick={() => navigate("/org-dashboard/initiatives/new")}
          >
            Create Initiative
          </Button>
        </Group>

        <Tabs defaultValue="active">
          <Tabs.List>
            <Tabs.Tab value="active">
              Active & Upcoming ({activeInitiatives.length})
            </Tabs.Tab>
            <Tabs.Tab value="completed">
              Completed ({completedInitiatives.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: "#f8f9fa" }}>
                    <Table.Th>Initiative Title</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Visibility</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Participants</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {activeInitiatives.length === 0 ? (
                    <Table.Tr>
                      <Table.Td
                        colSpan={7}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No active initiatives yet. Create one to get started!
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    activeInitiatives.map((initiative) => (
                      <Table.Tr key={initiative._id}>
                        <Table.Td fw={500}>{initiative.title}</Table.Td>
                        <Table.Td>
                          {formatDate(initiative.startDate, initiative.endDate)}
                        </Table.Td>
                        <Table.Td>{initiative.category}</Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={initiative.isPublic ? "blue" : "gray"}
                          >
                            {initiative.isPublic ? "Public" : "Internal"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {initiative.status === "completed" ? (
                            <Badge
                              color="blue"
                              style={{ cursor: "not-allowed" }}
                              title="Completed initiatives cannot be edited"
                            >
                              {initiative.status}
                            </Badge>
                          ) : (
                            <Menu shadow="md" width={150}>
                              <Menu.Target>
                                <Badge
                                  color={
                                    initiative.status === "active"
                                      ? "green"
                                      : initiative.status === "completed"
                                      ? "blue"
                                      : "yellow"
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  {initiative.status}{" "}
                                  <IconChevronDown size={12} />
                                </Badge>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  onClick={() =>
                                    handleStatusChange(
                                      initiative._id,
                                      "planning"
                                    )
                                  }
                                >
                                  Planning
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() =>
                                    handleStatusChange(initiative._id, "active")
                                  }
                                >
                                  Active
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() =>
                                    handleStatusChange(
                                      initiative._id,
                                      "completed"
                                    )
                                  }
                                >
                                  Completed
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() =>
                                    handleStatusChange(
                                      initiative._id,
                                      "cancelled"
                                    )
                                  }
                                >
                                  Cancelled
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Text size="sm">
                              {initiative.actualParticipants || 0}
                            </Text>
                            {initiative.status !== "completed" && (
                              <ActionIcon
                                size="sm"
                                variant="light"
                                color="blue"
                                onClick={() => {
                                  setParticipantUpdateId(initiative._id);
                                  setParticipantCount(
                                    initiative.actualParticipants || 0
                                  );
                                }}
                              >
                                <IconEdit size={14} />
                              </ActionIcon>
                            )}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={0}>
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => handleViewReport(initiative)}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              onClick={() =>
                                navigate(
                                  `/org-dashboard/initiatives/${initiative._id}/edit`
                                )
                              }
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() =>
                                handleDeleteInitiative(initiative._id)
                              }
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="completed" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: "#f8f9fa" }}>
                    <Table.Th>Initiative Title</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Visibility</Table.Th>
                    <Table.Th>Participants</Table.Th>
                    <Table.Th>Waste Collected</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {completedInitiatives.length === 0 ? (
                    <Table.Tr>
                      <Table.Td
                        colSpan={7}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No completed initiatives yet
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    completedInitiatives.map((initiative) => (
                      <Table.Tr key={initiative._id}>
                        <Table.Td fw={500}>{initiative.title}</Table.Td>
                        <Table.Td>
                          {formatDate(initiative.startDate, initiative.endDate)}
                        </Table.Td>
                        <Table.Td>{initiative.category}</Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={initiative.isPublic ? "blue" : "gray"}
                          >
                            {initiative.isPublic ? "Public" : "Internal"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color="blue"
                            style={{ cursor: "not-allowed" }}
                            title="Completed initiatives cannot be edited"
                          >
                            completed
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Text size="sm">
                              {initiative.actualParticipants || 0}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewReport(initiative)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* View Report Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Initiative Summary"
        size="lg"
      >
        {selectedInitiative && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={{ base: 6 }}>
                <Card withBorder p="md" radius="md">
                  <Title order={5} mb="xs">
                    Initiative
                  </Title>
                  <Text fw={600} size="lg">
                    {selectedInitiative.title}
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6 }}>
                <Card withBorder p="md" radius="md">
                  <Title order={5} mb="xs">
                    Participants
                  </Title>
                  <Text fw={600} size="lg" style={{ color: "#588157" }}>
                    {selectedInitiative.actualParticipants || 0}
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
            {selectedInitiative.wasteCollected && (
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <Card withBorder p="md" radius="md">
                    <Title order={5} mb="xs">
                      Waste Collected
                    </Title>
                    <Text fw={600} size="lg" style={{ color: "#588157" }}>
                      {selectedInitiative.wasteCollected} kg
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>
            )}
            {selectedInitiative.status === "completed" && (
              <Button
                style={{ backgroundColor: "#588157" }}
                onClick={() =>
                  navigate(
                    `/org-dashboard/initiatives/${selectedInitiative._id}/report`
                  )
                }
              >
                View Full Report
              </Button>
            )}
            {selectedInitiative.status !== "completed" && (
              <Alert color="yellow" icon={<IconAlertCircle size={16} />}>
                Report will be available after this initiative is marked as
                completed.
              </Alert>
            )}
          </Stack>
        )}
      </Modal>

      {/* Update Participants Modal */}
      <Modal
        opened={participantUpdateId !== null}
        onClose={() => {
          setParticipantUpdateId(null);
          setParticipantCount(0);
        }}
        title="Update Participant Count"
        size="sm"
      >
        <Stack gap="md">
          <NumberInput
            label="Number of Participants"
            placeholder="Enter participant count"
            value={participantCount}
            onChange={(val) => setParticipantCount(val || 0)}
            min={0}
          />
          <Group justify="flex-end">
            <Button
              variant="outline"
              onClick={() => {
                setParticipantUpdateId(null);
                setParticipantCount(0);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#588157" }}
              onClick={() =>
                handleParticipantUpdate(participantUpdateId, participantCount)
              }
            >
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Complete Initiative Dialog */}
      <Modal
        opened={completionDialogOpen}
        onClose={() => {
          setCompletionDialogOpen(false);
          setCompletionDetails({
            challenges: "",
            lessons: "",
            nextSteps: "",
            additionalNotes: "",
          });
          setInitiativeToComplete(null);
        }}
        title="Complete Initiative - Add Report Details"
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" color="dimmed">
            Please provide details about the initiative completion to generate
            the final report.
          </Text>

          <Textarea
            label="Challenges Faced"
            placeholder="Describe any challenges or obstacles encountered during the initiative..."
            minRows={3}
            value={completionDetails.challenges}
            onChange={(e) =>
              setCompletionDetails({
                ...completionDetails,
                challenges: e.currentTarget.value,
              })
            }
          />

          <Textarea
            label="Lessons Learned"
            placeholder="Share key learnings and insights from this initiative..."
            minRows={3}
            value={completionDetails.lessons}
            onChange={(e) =>
              setCompletionDetails({
                ...completionDetails,
                lessons: e.currentTarget.value,
              })
            }
          />

          <Textarea
            label="Next Steps"
            placeholder="What are the recommended next steps or follow-up actions?..."
            minRows={3}
            value={completionDetails.nextSteps}
            onChange={(e) =>
              setCompletionDetails({
                ...completionDetails,
                nextSteps: e.currentTarget.value,
              })
            }
          />

          <Textarea
            label="Additional Notes"
            placeholder="Any other relevant information or notes..."
            minRows={3}
            value={completionDetails.additionalNotes}
            onChange={(e) =>
              setCompletionDetails({
                ...completionDetails,
                additionalNotes: e.currentTarget.value,
              })
            }
          />

          <Group justify="flex-end">
            <Button
              variant="outline"
              onClick={() => {
                setCompletionDialogOpen(false);
                setCompletionDetails({
                  challenges: "",
                  lessons: "",
                  nextSteps: "",
                  additionalNotes: "",
                });
                setInitiativeToComplete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#588157" }}
              onClick={handleCompleteInitiative}
              loading={statusUpdateId !== null}
            >
              Complete Initiative & Generate Report
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default InitiativeManagement;
