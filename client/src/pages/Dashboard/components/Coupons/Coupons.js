import React, { useEffect, useState } from 'react';
import {
  Container, Tabs, Card, Text, Group, Stack, Badge, Button, CopyButton,
  Skeleton, Alert, Box, Center, Title, ThemeIcon, ActionIcon, Tooltip, SimpleGrid,
} from '@mantine/core';
import {
  IconGift, IconClock, IconAlertCircle, IconCheck, IconCopy, IconShoppingCart,
} from '@tabler/icons-react';
import { getCoupons, copyCouponCode } from '../../../../api/couponService';
import styles from './Coupons.module.css';

// Summary Card at top
const CouponSummary = ({ totalValue, activeCoupons }) => (
  <Card withBorder p="lg" className={styles.summaryCard}>
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" c="dimmed" fw={500} mb="xs">Total Value Earned</Text>
          <Title order={1} style={{ fontSize: 48, lineHeight: 1 }}>₹{totalValue}</Title>
          <Text size="sm" c="dimmed" mt="xs">
            You have <strong>{activeCoupons}</strong> active coupon{activeCoupons !== 1 ? 's' : ''} ready to use
          </Text>
        </div>
        <ThemeIcon size="xl" radius="md" variant="light" color="green">
          <IconGift size={32} />
        </ThemeIcon>
      </Group>
      <Button fullWidth size="lg" color="green" leftSection={<IconShoppingCart size={18} />}>
        Shop on Recraft & Redeem
      </Button>
    </Stack>
  </Card>
);

// Individual Coupon Card (works for all states)
const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);
  
  const isAvailable = coupon.status === 'available';
  const isUsed = coupon.status === 'used';
  const isExpired = coupon.status === 'expired';

  const getStatusBadge = () => {
    if (isUsed) {
      return <Badge color="gray">Used on {new Date(coupon.usedAt).toLocaleDateString()}</Badge>;
    }
    if (isExpired) {
      return <Badge color="red">Expired on {new Date(coupon.expiryDate).toLocaleDateString()}</Badge>;
    }
    return null;
  };

  const getExpiryDisplay = () => {
    if (isExpired || isUsed) return null;
    const expiryDate = new Date(coupon.expiryDate);
    const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
    return `Expires ${expiryDate.toLocaleDateString()}${daysLeft > 0 ? ` (${daysLeft} days)` : ''}`;
  };

  return (
    <Card
      withBorder
      p="lg"
      className={`${styles.couponCard} ${!isAvailable ? styles.couponCardInactive : ''}`}
    >
      <Stack gap="md">
        {/* Header: Value + Status */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xs" c="dimmed" fw={500}>Discount Value</Text>
            <Text size="xl" fw={700} style={{ fontSize: 36, lineHeight: 1 }}>
              ₹{coupon.discountValue}
            </Text>
            {coupon.discountType === 'percentage' && <Text size="xs" c="dimmed">({coupon.discountValue}% off)</Text>}
          </div>
          {getStatusBadge()}
        </Group>

        {/* Code Section */}
        <Card withBorder p="sm" bg={isAvailable ? "blue.0" : "gray.1"}>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" fw={500}>Coupon Code</Text>
              <Text fw={700} size="lg" style={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                {coupon.code}
              </Text>
            </div>
            {isAvailable && (
              <CopyButton value={coupon.code} timeout={1500}>
                {({ copied }) => (
                  <Tooltip label={copied ? "Copied!" : "Copy code"} withArrow position="left">
                    <ActionIcon color={copied ? "teal" : "blue"} variant="subtle">
                      {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            )}
          </Group>
        </Card>

        {/* Description */}
        <Text size="sm" c={isAvailable ? "dark" : "dimmed"}>
          {coupon.description || 'Valid on any purchase'}
        </Text>

        {/* Expiry Info */}
        {getExpiryDisplay() && (
          <Group gap="xs" c="dimmed" size="sm">
            <IconClock size={16} />
            <Text size="sm">{getExpiryDisplay()}</Text>
          </Group>
        )}

        {/* CTA for Available Coupons */}
        {isAvailable && (
          <Button variant="light" size="sm" rightSection={<IconShoppingCart size={16} />}>
            Use Now →
          </Button>
        )}
      </Stack>
    </Card>
  );
};

// Main Component
const Coupons = () => {
  const [status, setStatus] = useState('available');
  const [coupons, setCoupons] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllCoupons();
  }, []);

  useEffect(() => {
    loadCoupons(status);
  }, [status]);

  const loadAllCoupons = async () => {
    try {
      const res = await getCoupons('all');
      setAllCoupons(res.data || []);
    } catch (err) {
      console.error('Error loading all coupons:', err);
    }
  };

  const loadCoupons = async (filterStatus) => {
    setLoading(true);
    try {
      const res = await getCoupons(filterStatus);
      setCoupons(res.data || []);
    } catch (err) {
      console.error('Error loading coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary stats
  const availableCoupons = allCoupons.filter(c => c.status === 'available');
  const totalValue = availableCoupons.reduce((sum, c) => sum + (c.discountValue || 0), 0);

  return (
    <Container size="lg" py="xl">
      {/* Summary Card */}
      <CouponSummary totalValue={totalValue} activeCoupons={availableCoupons.length} />

      {/* Filter Tabs */}
      <Tabs value={status} onTabChange={setStatus} mt="lg">
        <Tabs.List>
          <Tabs.Tab value="available" leftSection={<IconGift size={14} />}>
            Available ({availableCoupons.length})
          </Tabs.Tab>
          <Tabs.Tab value="used" leftSection={<IconCheck size={14} />}>
            Used
          </Tabs.Tab>
          <Tabs.Tab value="expired" leftSection={<IconAlertCircle size={14} />}>
            Expired
          </Tabs.Tab>
        </Tabs.List>

        {/* Available Coupons Panel */}
        <Tabs.Panel value="available" py="md">
          {loading ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {[1, 2, 3].map((i) => <Skeleton key={i} height={300} radius="md" />)}
            </SimpleGrid>
          ) : coupons.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {coupons.map((coupon) => (
                <CouponCard key={coupon._id} coupon={coupon} />
              ))}
            </SimpleGrid>
          ) : (
            <Alert icon={<IconAlertCircle size={16} />} color="blue" mt="md">
              <Stack gap="xs">
                <Text fw={600}>You don't have any active coupons right now.</Text>
                <Text size="sm">Schedule a pickup to start earning coupons!</Text>
              </Stack>
            </Alert>
          )}
        </Tabs.Panel>

        {/* Used Coupons Panel */}
        <Tabs.Panel value="used" py="md">
          {loading ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {[1, 2, 3].map((i) => <Skeleton key={i} height={300} radius="md" />)}
            </SimpleGrid>
          ) : coupons.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {coupons.map((coupon) => (
                <CouponCard key={coupon._id} coupon={coupon} />
              ))}
            </SimpleGrid>
          ) : (
            <Alert icon={<IconAlertCircle size={16} />} color="blue" mt="md">
              <Text fw={600}>No used coupons yet.</Text>
            </Alert>
          )}
        </Tabs.Panel>

        {/* Expired Coupons Panel */}
        <Tabs.Panel value="expired" py="md">
          {loading ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {[1, 2, 3].map((i) => <Skeleton key={i} height={300} radius="md" />)}
            </SimpleGrid>
          ) : coupons.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {coupons.map((coupon) => (
                <CouponCard key={coupon._id} coupon={coupon} />
              ))}
            </SimpleGrid>
          ) : (
            <Alert icon={<IconAlertCircle size={16} />} color="blue" mt="md">
              <Text fw={600}>No expired coupons.</Text>
            </Alert>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default Coupons;
