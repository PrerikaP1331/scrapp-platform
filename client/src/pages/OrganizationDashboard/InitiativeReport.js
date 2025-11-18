import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Stack,
  Grid,
  Card,
  Text,
  Progress,
  Group,
  Button,
  Loader,
  Center,
  Alert,
  ActionIcon,
} from "@mantine/core";
import {
  IconDownload,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { getInitiativeById } from "../../api/initiativeService";

function InitiativeReport() {
  const { id } = useParams();
  const [initiative, setInitiative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitiativeDetails();
  }, [id]);

  const fetchInitiativeDetails = async () => {
    try {
      setLoading(true);
      const data = await getInitiativeById(id);
      console.log("Fetched initiative data:", data);
      setInitiative(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching initiative:", err);
      setError("Failed to load initiative report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  if (error || !initiative) {
    return (
      <Container size="xl">
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
          {error || "Initiative not found"}
        </Alert>
      </Container>
    );
  }

  // Check if initiative is completed
  if (initiative.status !== "completed") {
    console.log(
      "Initiative status:",
      initiative.status,
      "Type:",
      typeof initiative.status
    );
    return (
      <Container size="xl" py="lg">
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="yellow"
          title="Report Not Available"
        >
          <Text>
            The report is only available after the initiative is completed.
            Current status:{" "}
            <Text span fw={600} style={{ textTransform: "capitalize" }}>
              {initiative.status}
            </Text>
          </Text>
        </Alert>
      </Container>
    );
  }

  // Calculate stats from initiative data
  const initiativeStats = {
    title: initiative.title,
    totalParticipants: initiative.actualParticipants || 0,
    targetParticipants: initiative.targetParticipants || 0,
    totalCollected: `${initiative.wasteCollected || 0} kg`,
    carbonOffset: `${((initiative.wasteCollected || 0) * 0.004).toFixed(
      2
    )} tonnes CO₂`,
    costSavings: `₹${((initiative.wasteCollected || 0) * 10).toFixed(0)}`,
    completionRate: initiative.targetParticipants
      ? Math.round(
          ((initiative.actualParticipants || 0) /
            initiative.targetParticipants) *
            100
        )
      : 0,
  };

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: "#344e41" }} mb="xs">
              {initiativeStats.title} - Report
            </Title>
            <p style={{ color: "#666" }}>
              Campaign performance and impact summary
            </p>
          </div>
          <Group gap="xs">
            <ActionIcon
              variant="light"
              onClick={fetchInitiativeDetails}
              title="Refresh report data"
            >
              <IconRefresh size={18} />
            </ActionIcon>
            <Button leftSection={<IconDownload size={18} />} variant="default">
              Download Report
            </Button>
          </Group>
        </Group>

        {/* Basic Details */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: "#344e41" }} mb="lg">
            Initiative Details
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">
                  Category
                </Text>
                <Text fw={600}>{initiative.category || "N/A"}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">
                  Location
                </Text>
                <Text fw={600}>{initiative.location || "N/A"}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">
                  Status
                </Text>
                <Text fw={600} style={{ textTransform: "capitalize" }}>
                  {initiative.status || "N/A"}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">
                  Visibility
                </Text>
                <Text fw={600}>
                  {initiative.isPublic ? "Public" : "Internal"}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Description */}
          {initiative.description && (
            <Paper
              p="md"
              radius="md"
              style={{ backgroundColor: "#f5f5f5" }}
              mt="md"
            >
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                Description
              </Text>
              <Text style={{ whiteSpace: "pre-wrap" }}>
                {initiative.description}
              </Text>
            </Paper>
          )}

          {/* Date Range */}
          <Group mt="md" grow>
            <Card withBorder p="md" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                Start Date
              </Text>
              <Text fw={600}>
                {initiative.startDate
                  ? new Date(initiative.startDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Card>
            <Card withBorder p="md" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                End Date
              </Text>
              <Text fw={600}>
                {initiative.endDate
                  ? new Date(initiative.endDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Card>
          </Group>
        </Paper>

        {/* Key Metrics */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                Total Participants
              </Text>
              <Title order={3} style={{ color: "#588157" }}>
                {initiativeStats.totalParticipants}
              </Title>
              <Text size="xs" color="dimmed">
                of {initiativeStats.targetParticipants} target
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                Total Collected
              </Text>
              <Title order={3} style={{ color: "#588157" }}>
                {initiativeStats.totalCollected}
              </Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                Carbon Offset
              </Text>
              <Title order={3} style={{ color: "#588157" }}>
                {initiativeStats.carbonOffset}
              </Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                Cost Savings
              </Text>
              <Title order={3} style={{ color: "#588157" }}>
                {initiativeStats.costSavings}
              </Title>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Completion Rate */}
        <Paper p="lg" radius="md" withBorder>
          <Text fw={600} mb="xs">
            Campaign Completion Rate
          </Text>
          <Progress
            value={initiativeStats.completionRate}
            color="#588157"
            size="lg"
            radius="md"
            label={`${initiativeStats.completionRate}% Complete`}
          />
        </Paper>

        {/* Impact Summary */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: "#344e41" }} mb="lg">
            Impact Summary
          </Title>
          <Stack gap="md">
            <Group
              justify="space-between"
              pb="md"
              style={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <Text fw={500}>Waste Diverted from Landfill</Text>
              <Text fw={600} style={{ color: "#588157" }}>
                {initiativeStats.totalCollected}
              </Text>
            </Group>
            <Group
              justify="space-between"
              pb="md"
              style={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <Text fw={500}>CO₂ Emissions Reduced</Text>
              <Text fw={600} style={{ color: "#588157" }}>
                {initiativeStats.carbonOffset}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Estimated Cost Savings</Text>
              <Text fw={600} style={{ color: "#588157" }}>
                {initiativeStats.costSavings}
              </Text>
            </Group>
          </Stack>
        </Paper>

        {/* Participation Analysis */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: "#344e41" }} mb="lg">
            Participation Analysis
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">
                  Total Participants
                </Text>
                <Text fw={600} size="lg" style={{ color: "#588157" }}>
                  {initiativeStats.totalParticipants}
                </Text>
                <Text size="xs" color="dimmed" mt="xs">
                  Target: {initiativeStats.targetParticipants}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">
                  Average per Participant
                </Text>
                <Text fw={600} size="lg" style={{ color: "#588157" }}>
                  {initiativeStats.totalParticipants > 0
                    ? (
                        (initiative.wasteCollected || 0) /
                        initiativeStats.totalParticipants
                      ).toFixed(2)
                    : 0}{" "}
                  kg
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Efficiency Metrics */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: "#344e41" }} mb="lg">
            Efficiency Metrics
          </Title>
          <Stack gap="md">
            <Group
              justify="space-between"
              pb="md"
              style={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <div>
                <Text fw={500}>Participation Rate</Text>
                <Text size="sm" color="dimmed">
                  Based on target participants
                </Text>
              </div>
              <Text fw={600} style={{ color: "#588157" }}>
                {initiativeStats.completionRate}%
              </Text>
            </Group>
            <Group
              justify="space-between"
              pb="md"
              style={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <div>
                <Text fw={500}>Environmental Impact</Text>
                <Text size="sm" color="dimmed">
                  CO₂ per kg waste
                </Text>
              </div>
              <Text fw={600} style={{ color: "#588157" }}>
                0.004 tonnes
              </Text>
            </Group>
            <Group justify="space-between">
              <div>
                <Text fw={500}>Economic Value</Text>
                <Text size="sm" color="dimmed">
                  Per kg waste collected
                </Text>
              </div>
              <Text fw={600} style={{ color: "#588157" }}>
                ₹10
              </Text>
            </Group>
          </Stack>
        </Paper>

        {/* Completion Report Details */}
        {initiative.reportDetails && (
          <Paper p="lg" radius="md" withBorder>
            <Title order={4} style={{ color: "#344e41" }} mb="lg">
              Completion Report
            </Title>
            <Stack gap="lg">
              {initiative.reportDetails.challenges && (
                <div>
                  <Text fw={600} mb="xs" style={{ color: "#344e41" }}>
                    Challenges Faced
                  </Text>
                  <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {initiative.reportDetails.challenges}
                  </Text>
                </div>
              )}
              {initiative.reportDetails.lessons && (
                <div>
                  <Text fw={600} mb="xs" style={{ color: "#344e41" }}>
                    Lessons Learned
                  </Text>
                  <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {initiative.reportDetails.lessons}
                  </Text>
                </div>
              )}
              {initiative.reportDetails.nextSteps && (
                <div>
                  <Text fw={600} mb="xs" style={{ color: "#344e41" }}>
                    Recommended Next Steps
                  </Text>
                  <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {initiative.reportDetails.nextSteps}
                  </Text>
                </div>
              )}
              {initiative.reportDetails.additionalNotes && (
                <div>
                  <Text fw={600} mb="xs" style={{ color: "#344e41" }}>
                    Additional Notes
                  </Text>
                  <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {initiative.reportDetails.additionalNotes}
                  </Text>
                </div>
              )}
            </Stack>
          </Paper>
        )}

        {/* Key Insights */}
        <Paper
          p="lg"
          radius="md"
          withBorder
          style={{ backgroundColor: "#f0f5f2" }}
        >
          <Title order={4} style={{ color: "#344e41" }} mb="lg">
            Key Insights
          </Title>
          <Stack gap="sm">
            <Text>
              ✓ This initiative has{" "}
              <Text span fw={600} style={{ color: "#588157" }}>
                diverted {initiativeStats.totalCollected} of waste
              </Text>{" "}
              from landfills.
            </Text>
            <Text>
              ✓ The carbon offset achieved is equivalent to{" "}
              <Text span fw={600} style={{ color: "#588157" }}>
                {initiativeStats.carbonOffset}
              </Text>
              , helping combat climate change.
            </Text>
            <Text>
              ✓ With{" "}
              <Text span fw={600} style={{ color: "#588157" }}>
                {initiativeStats.totalParticipants} participants
              </Text>
              , the initiative achieved{" "}
              <Text span fw={600} style={{ color: "#588157" }}>
                {initiativeStats.completionRate}%
              </Text>{" "}
              of the target participation.
            </Text>
            <Text>
              ✓ Estimated savings of{" "}
              <Text span fw={600} style={{ color: "#588157" }}>
                {initiativeStats.costSavings}
              </Text>{" "}
              in waste management costs.
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default InitiativeReport;
