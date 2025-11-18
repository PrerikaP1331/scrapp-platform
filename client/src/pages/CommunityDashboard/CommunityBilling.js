import { useEffect, useState, useContext } from 'react';
import { Container, Stack, Group, Title, Card, Text, Button, Grid, Table, Badge, Modal } from '@mantine/core';
import { IconCreditCard, IconDownload } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';
import { getCommunityBilling, getCommunityInvoices } from '../../api/communityService';

function CommunityBilling() {
  const { user } = useContext(AuthContext);
  const [billing, setBilling] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.communityId) return;
    setLoading(true);
    Promise.all([
      getCommunityBilling(user.communityId),
      getCommunityInvoices(user.communityId)
    ])
      .then(([billingData, invoicesData]) => {
        setBilling(billingData);
        setInvoices(invoicesData || []);
      })
      .finally(() => setLoading(false));
  }, [user?.communityId]);

  const formatCurrency = (amount, currency = 'INR') => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
    } catch (_) {
      return `₹${amount}`;
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  const handleDownloadInvoice = async (invoice) => {
    try {
      const pdfUrl = `/invoices/${invoice.id}.pdf`;
      const res = await fetch(pdfUrl, { method: 'HEAD' });
      if (res.ok) {
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = `${invoice.id}.pdf`;
        a.click();
        return;
      }
    } catch (_) {}

    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice ${invoice.id}</title>
        <style>
          @page { size: A4; margin: 16mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif; color: #222; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          .brand { color: #344e41; font-weight: 700; font-size: 22px; }
          .meta { text-align: right; font-size: 14px; color: #666; }
          .section { margin: 18px 0; }
          .title { font-weight: 600; color: #344e41; margin-bottom: 8px; }
          .box { border: 1px solid #dad7cd; border-radius: 8px; padding: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border-bottom: 1px solid #ecebe5; padding: 10px; text-align: left; font-size: 14px; }
          th { background: #f4f3ef; color: #344e41; }
          .total { font-weight: 700; color: #588157; }
          .status { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #e6f4ea; color: #1b5e20; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">Scrapp • Invoice</div>
          <div class="meta">
            <div>Invoice ID: ${invoice.id}</div>
            <div>Date: ${formatDate(invoice.date)}</div>
            <div>Status: <span class="status">${invoice.status}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="title">Billed To</div>
          <div class="box">
            <div>${billing?.plan || 'Community Plan'}</div>
            <div>${billing?.status || 'Active'} Subscription</div>
          </div>
        </div>

        <div class="section">
          <div class="title">Summary</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${billing?.plan || 'Community Pro'} — Monthly Subscription</td>
                <td>1</td>
                <td>${formatCurrency(billing?.price ?? invoice.amount, billing?.currency ?? invoice.currency)}</td>
                <td>${formatCurrency(invoice.amount, invoice.currency)}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align:right">Total</td>
                <td class="total">${formatCurrency(invoice.amount, invoice.currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section" style="font-size:12px;color:#666">
          <div>Payment Method: ${billing?.paymentMethod ? `${billing.paymentMethod.brand} •••• ${billing.paymentMethod.last4}` : '—'}</div>
          <div>Thank you for being part of the Scrapp community.</div>
        </div>

        <script>
          window.onload = () => window.print();
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Billing & Subscription</Title>
            <Text c="dimmed">Manage your plan and view invoice history</Text>
          </div>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" radius="md">
              <Group justify="space-between" mb="md">
                <Text fw={600}>Current Plan</Text>
                {billing?.status && (
                  <Badge color={billing.status === 'Active' ? 'green' : 'gray'}>{billing.status}</Badge>
                )}
              </Group>
              <Stack gap="xs">
                <Text fw={500}>{billing?.plan || '—'}</Text>
                <Text c="dimmed">{billing ? `${formatCurrency(billing.price, billing.currency)} / month` : '—'}</Text>
                {billing?.nextBillingDate && (
                  <Text size="sm" c="dimmed">Your plan will renew on {new Date(billing.nextBillingDate).toLocaleDateString()}</Text>
                )}
              </Stack>
              <Group mt="md">
                <Button onClick={() => setModalOpen(true)}>Manage Subscription</Button>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" radius="md">
              <Group justify="space-between" mb="md">
                <Text fw={600}>Payment Method</Text>
              </Group>
              <Group>
                <IconCreditCard size={18} />
                <Text>{billing?.paymentMethod ? `${billing.paymentMethod.brand} ending in •••• ${billing.paymentMethod.last4}` : '—'}</Text>
              </Group>
              {billing?.paymentMethod && (
                <Text size="sm" c="dimmed">Expires: {String(billing.paymentMethod.expMonth).padStart(2, '0')}/{billing.paymentMethod.expYear}</Text>
              )}
              <Group mt="md">
                <Button variant="light" onClick={() => setModalOpen(true)}>Update Payment Method</Button>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder p="lg" radius="md">
          <Text fw={600} mb="md">Invoice History</Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Invoice ID</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {invoices.map((inv) => (
                <Table.Tr key={inv.id}>
                  <Table.Td>{formatDate(inv.date)}</Table.Td>
                  <Table.Td>{inv.id}</Table.Td>
                  <Table.Td>{formatCurrency(inv.amount, inv.currency)}</Table.Td>
                  <Table.Td>
                    <Badge color={inv.status === 'Paid' ? 'green' : 'gray'}>{inv.status}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="subtle" leftSection={<IconDownload size={14} />} onClick={() => handleDownloadInvoice(inv)}>Download</Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Subscription Management">
          <Stack gap="md">
            <Text>
              This feature will be fully enabled upon launch. Here, you will be able to upgrade, downgrade, or cancel your plan through our secure payment partner.
            </Text>
            <Group justify="flex-end">
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}

export default CommunityBilling;
