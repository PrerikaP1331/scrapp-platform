import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  Skeleton,
  SimpleGrid,
  Title,
  ThemeIcon,
  ActionIcon,
  CopyButton,
  Tooltip,
  Alert,
} from '@mantine/core';
import {
  IconLeaf,
  IconRecycle,
  IconTruck,
  IconDroplet,
  IconShare2,
  IconBrandFacebook,
  IconBrandTwitter,
  IconCheck,
  IconCopy,
  IconAlertCircle,
} from '@tabler/icons-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUserImpactStats } from '../../../../api/impactService';
import styles from './Impact.module.css';

const COLORS = ['#51CF66', '#40C057', '#37B24D', '#2F9E44', '#2B8A3E'];

const ImpactStatCard = ({ icon: Icon, label, value, unit, color, subtitle }) => (
  <Card className={styles.statCard} withBorder>
    <Group position="apart" mb="md">
      <Text size="sm" weight={600} color="dimmed">
        {label}
      </Text>
      <ThemeIcon size="lg" radius="md" variant="light" color={color}>
        <Icon size={20} />
      </ThemeIcon>
    </Group>
    <Group align="flex-end" spacing="xs" grow>
      <div>
        <Text weight={700} size="lg">
          {value.toLocaleString()}
        </Text>
        {unit && <Text size="xs" color="dimmed">{unit}</Text>}
      </div>
    </Group>
    {subtitle && (
      <Text size="xs" color="dimmed" mt="xs">
        {subtitle}
      </Text>
    )}
  </Card>
);

const Impact = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchImpactStats();
  }, []);

  const fetchImpactStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserImpactStats();
      setStats(response);
    } catch (err) {
      setError(err.msg || 'Failed to load impact statistics');
      console.error('Error fetching impact stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateShareMessage = () => {
    if (!stats) return '';
    return `🌱 I've made an environmental impact! Through Scrapp, I've diverted ${stats.lifetime_waste_diverted.toFixed(1)}kg of waste and saved ${stats.lifetime_co2_saved.toFixed(1)}kg of CO2. Join me in making a difference! 🌍♻️`;
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Stack spacing="lg">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={120} radius="md" />
          ))}
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
          {error}
        </Alert>
        <Button mt="md" onClick={fetchImpactStats}>
          Try Again
        </Button>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} color="blue" title="No Data">
          Start recycling to see your impact!
        </Alert>
      </Container>
    );
  }

  const chartData = stats.monthly_trend
    ? stats.monthly_trend.map((m) => ({
        month: new Date(m.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        waste: parseFloat(m.weight.toFixed(2)),
      }))
    : [];

  const wasteData = stats.waste_by_category
    ? stats.waste_by_category.map((w) => ({
        name: w.category,
        value: parseFloat(w.weight.toFixed(2)),
      }))
    : [];

  const shareMessage = generateShareMessage();

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <div className={styles.header}>
        <Title order={1} mb="xs">
          Your Environmental Impact
        </Title>
        <Text color="dimmed">Track your contribution to a sustainable future</Text>
      </div>

      {/* Lifetime Impact Hero Stats */}
      <div className={styles.heroSection}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
          <ImpactStatCard
            icon={IconRecycle}
            label="CO₂ Saved"
            value={stats.lifetime_co2_saved}
            unit="kg"
            color="green"
            subtitle={`≈ ${stats.equivalencies?.trees_planted || 0} trees planted`}
          />
          <ImpactStatCard
            icon={IconLeaf}
            label="Waste Diverted"
            value={stats.lifetime_waste_diverted}
            unit="kg"
            color="lime"
            subtitle={`≈ ${stats.equivalencies?.plastic_bottles_saved || 0} plastic bottles`}
          />
          <ImpactStatCard
            icon={IconTruck}
            label="Pickups Completed"
            value={stats.lifetime_pickups}
            unit="pickups"
            color="blue"
            subtitle={`≈ ${stats.equivalencies?.car_km_avoided || 0}km avoided`}
          />
          <ImpactStatCard
            icon={IconDroplet}
            label="Water Saved"
            value={(stats.lifetime_waste_diverted * 10).toFixed(0)}
            unit="liters"
            color="cyan"
            subtitle="Through recycled materials"
          />
        </SimpleGrid>
      </div>

      {/* Charts Section */}
      <Grid gutter="lg" mb="xl">
        {/* Waste Breakdown Pie Chart */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder className={styles.chartCard}>
            <Card.Section withBorder inheritPadding py="md">
              <Group position="apart">
                <Title order={3}>Waste Breakdown by Category</Title>
                <Badge>Last 12 months</Badge>
              </Group>
            </Card.Section>
            <Card.Section inheritPadding py="md">
              {wasteData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={wasteData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}kg`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {wasteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(value) => `${value}kg`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Text align="center" color="dimmed" py="xl">
                  No waste data available
                </Text>
              )}
            </Card.Section>
          </Card>
        </Grid.Col>

        {/* Recycling Trend Chart */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder className={styles.chartCard}>
            <Card.Section withBorder inheritPadding py="md">
              <Group position="apart">
                <Title order={3}>Recycling Trend</Title>
                <Badge>CO₂ & Waste</Badge>
              </Group>
            </Card.Section>
            <Card.Section inheritPadding py="md">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="waste" fill="#51CF66" name="Waste Diverted (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Text align="center" color="dimmed" py="xl">
                  No trend data available
                </Text>
              )}
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Share Your Impact Section */}
      <Card withBorder className={styles.shareSection}>
        <Card.Section withBorder inheritPadding py="md">
          <Title order={3}>Share Your Impact</Title>
        </Card.Section>
        <Card.Section inheritPadding py="md">
          <Stack spacing="md">
            <Card withBorder p="md" bg="gray.0">
              <Group position="apart">
                <Text size="sm" lineClamp={2}>
                  {shareMessage}
                </Text>
                <CopyButton value={shareMessage} timeout={2000}>
                  {({ copied }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                      <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle">
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </Card>

            <Group spacing="sm">
              <Button
                variant="outline"
                leftIcon={<IconBrandFacebook size={18} />}
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    'facebook-share',
                    'width=600,height=400'
                  );
                }}
              >
                Share on Facebook
              </Button>
              <Button
                variant="outline"
                leftIcon={<IconBrandTwitter size={18} />}
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${window.location.href}`,
                    'twitter-share',
                    'width=600,height=400'
                  );
                }}
              >
                Share on Twitter
              </Button>
            </Group>
          </Stack>
        </Card.Section>
      </Card>

      {/* Refresh Button */}
      <Group mt="xl">
        <Button onClick={fetchImpactStats} variant="light">
          Refresh Stats
        </Button>
      </Group>
    </Container>
  );
};

export default Impact;
