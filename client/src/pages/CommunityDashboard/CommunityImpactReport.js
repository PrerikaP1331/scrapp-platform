import { useEffect, useState, useContext } from 'react';
import { Container, Paper, Title, Grid, Card, Text, Group, Button, Stack, Loader, Center, Box } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';
import ReportControls from '../../components/BusinessAnalytics/ReportControls';
import { getCommunityImpactReport } from '../../api/communityService';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#588157', '#344e41', '#a3b18a', '#3a5a40', '#7d9c70', '#b4c09c'];

function CommunityImpactReport() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [stats, setStats] = useState({
    totalCO2SavedKg: 0,
    totalWasteDivertedKg: 0,
    pickupsCompleted: 0,
    drivesHosted: 0,
    participationRate: null,
    mostSuccessfulDrive: null
  });

  const [wasteByMaterial, setWasteByMaterial] = useState([]);
  const [volumeOverTime, setVolumeOverTime] = useState([]);

  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const end = today;
    setStartDate(start);
    setEndDate(end);
    fetchReport(start, end);
  }, []);

  const fetchReport = async (start, end) => {
    if (!user?.communityId) return;
    setIsLoading(true);
    try {
      const data = await getCommunityImpactReport(user.communityId, { startDate: start, endDate: end });
      setStats({
        totalCO2SavedKg: data?.lifetimeImpact?.totalCO2SavedKg ?? 0,
        totalWasteDivertedKg: data?.lifetimeImpact?.totalWasteDivertedKg ?? 0,
        pickupsCompleted: data?.lifetimeImpact?.totalPickupsCompleted ?? 0,
        drivesHosted: data?.lifetimeImpact?.totalDrivesHosted ?? 0,
        participationRate: data?.engagement?.participationRate ?? null,
        mostSuccessfulDrive: data?.engagement?.mostSuccessfulDrive ?? null
      });
      setWasteByMaterial(data?.wasteByMaterial ?? []);
      setVolumeOverTime(data?.volumeOverTime ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    fetchReport(start, end);
  };

  const handleExport = () => {
    const rows = [];
    rows.push(['Metric', 'Value']);
    rows.push(['Total CO2 Saved (kg)', stats.totalCO2SavedKg]);
    rows.push(['Total Waste Diverted (kg)', stats.totalWasteDivertedKg]);
    rows.push(['Pickups Completed', stats.pickupsCompleted]);
    rows.push(['Drives Hosted', stats.drivesHosted]);
    if (stats.participationRate != null) rows.push(['Participation Rate (%)', stats.participationRate]);
    rows.push([]);
    rows.push(['Material', 'Weight (kg)']);
    wasteByMaterial.forEach(m => rows.push([m.category, m.weight]));
    rows.push([]);
    rows.push(['Date', 'Weight (kg)']);
    volumeOverTime.forEach(p => rows.push([p.date || p.month, p.weight]));

    const csv = rows.map(r => r.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'community-impact-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <Container size="xl">
      <style>{`
        @page { size: A4; margin: 16mm; }
        @media print {
          html, body { background: #fff; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-card { break-inside: avoid; }
        }
      `}</style>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Community Impact Report</Title>
            <p style={{ color: '#666' }}>Comprehensive analytics of your community's recycling performance</p>
            {startDate && endDate && (
              <Text size="sm" c="dimmed">Range: {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}</Text>
            )}
          </div>
          <Group className="no-print" gap="sm">
            <Button leftSection={<IconDownload size={18} />} variant="default" onClick={handlePrintPdf}>
              Export PDF
            </Button>
            <Button variant="light" onClick={handleExport}>
              Export CSV
            </Button>
          </Group>
        </Group>

        <div className="no-print">
          <ReportControls onDateRangeChange={handleDateRangeChange} onExport={handleExport} isLoading={isLoading} />
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md" className="print-card">
              <Text size="sm" c="dimmed" fw={500} mb="xs">Total CO₂ Saved</Text>
              <Title order={3} style={{ color: '#588157' }}>{stats.totalCO2SavedKg} kg</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md" className="print-card">
              <Text size="sm" c="dimmed" fw={500} mb="xs">Total Waste Diverted</Text>
              <Title order={3} style={{ color: '#588157' }}>{stats.totalWasteDivertedKg} kg</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md" className="print-card">
              <Text size="sm" c="dimmed" fw={500} mb="xs">Pickups Completed</Text>
              <Title order={3} style={{ color: '#344e41' }}>{stats.pickupsCompleted}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md" className="print-card">
              <Text size="sm" c="dimmed" fw={500} mb="xs">Drives Hosted</Text>
              <Title order={3} style={{ color: '#344e41' }}>{stats.drivesHosted}</Title>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="lg" radius="md" withBorder>
              <Text fw={600} size="lg" mb="md" style={{ color: '#344e41' }}>Total Waste Collected by Material</Text>
              {isLoading ? (
                <Center h={360}><Loader /></Center>
              ) : wasteByMaterial.length === 0 ? (
                <Text c="dimmed">No data for selected range</Text>
              ) : (
                <Box style={{ width: '100%', height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip formatter={(value) => `${value} kg`} />
                      <Legend />
                      <Pie data={wasteByMaterial} dataKey="weight" nameKey="category" outerRadius={120} label>
                        {wasteByMaterial.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="lg" radius="md" withBorder>
              <Text fw={600} size="lg" mb="md" style={{ color: '#344e41' }}>Recycling Volume Over Time</Text>
              {isLoading ? (
                <Center h={360}><Loader /></Center>
              ) : volumeOverTime.length === 0 ? (
                <Text c="dimmed">No data for selected range</Text>
              ) : (
                <Box style={{ width: '100%', height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={volumeOverTime.map(p => ({
                      ...p,
                      label: p.date ? new Date(p.date).toLocaleDateString() : p.month
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => `${value} kg`} />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#588157" dot={{ r: 3 }} strokeWidth={2} name="Recycled" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>
          </Grid.Col>
        </Grid>

        <Paper p="lg" radius="md" withBorder>
          <Text fw={600} size="lg" mb="md" style={{ color: '#344e41' }}>Community Engagement</Text>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" c="dimmed" fw={500} mb="xs">Participation Rate</Text>
                <Title order={3} style={{ color: '#588157' }}>{stats.participationRate != null ? `${stats.participationRate}%` : '—'}</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" c="dimmed" fw={500} mb="xs">Most Successful Drive</Text>
                {stats.mostSuccessfulDrive ? (
                  <Text>{stats.mostSuccessfulDrive.name} • {stats.mostSuccessfulDrive.totalWeight} kg</Text>
                ) : (
                  <Text c="dimmed">No drives in selected range</Text>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
      </Stack>
    </Container>
  );
}

export default CommunityImpactReport;
