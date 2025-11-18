import React, { useState } from "react";
import {
  Container,
  Paper,
  Title,
  Button,
  TextInput,
  Stack,
  Group,
  Tabs,
  Table,
  Badge,
  Text,
  Grid,
  Card,
  Modal,
  SimpleGrid,
} from "@mantine/core";
import { IconDownload, IconPlus, IconCheck } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

function OrganizationBilling() {
  const [subscription, setSubscription] = useState({
    plan: "Professional",
    status: "Active",
    monthlyCharge: 4999,
    billingCycle: "Monthly",
    nextBillingDate: "Dec 1, 2025",
    autoRenewal: true,
  });

  const [invoices] = useState([
    {
      id: 1,
      date: "Nov 1, 2025",
      amount: "₹4,999",
      status: "Paid",
      pdf: "INV-001",
    },
    {
      id: 2,
      date: "Oct 1, 2025",
      amount: "₹4,999",
      status: "Paid",
      pdf: "INV-002",
    },
    {
      id: 3,
      date: "Sep 1, 2025",
      amount: "₹4,999",
      status: "Paid",
      pdf: "INV-003",
    },
  ]);

  const [paymentMethods] = useState([
    {
      id: 1,
      type: "Credit Card",
      last4: "4242",
      expiry: "12/26",
      isDefault: true,
    },
  ]);

  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [planModal, setPlanModal] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);

  const plans = [
    {
      name: "Basic",
      price: 1999,
      features: ["Up to 50 employees", "Basic analytics", "Email support"],
    },
    {
      name: "Professional",
      price: 4999,
      features: [
        "Up to 500 employees",
        "Advanced analytics",
        "Phone support",
        "Custom branding",
      ],
    },
    {
      name: "Enterprise",
      price: 9999,
      features: [
        "Unlimited employees",
        "Real-time analytics",
        "24/7 support",
        "API access",
        "Dedicated account manager",
      ],
    },
  ];

  const handlePlanChange = (planName) => {
    const selectedPlanData = plans.find((p) => p.name === planName);
    if (selectedPlanData && planName !== subscription.plan) {
      setChangingPlan(true);
      // Simulate API call
      setTimeout(() => {
        setSubscription({
          ...subscription,
          plan: planName,
          monthlyCharge: selectedPlanData.price,
          nextBillingDate: new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });
        setChangingPlan(false);
        setPlanModal(false);
      }, 1000);
    }
  };

  const form = useForm({
    initialValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: "#344e41" }} mb="xs">
            Billing & Subscriptions
          </Title>
          <p style={{ color: "#666" }}>
            Manage your organization's billing and payment methods
          </p>
        </div>

        {/* Current Plan */}
        <Paper
          p="lg"
          radius="md"
          withBorder
          style={{ backgroundColor: "#f0f8f4" }}
        >
          <Group justify="space-between" mb="md">
            <div>
              <Title order={4} style={{ color: "#344e41" }}>
                Current Plan
              </Title>
              <Group gap="md" mt="md">
                <div>
                  <Text size="sm" color="dimmed">
                    Plan Type
                  </Text>
                  <Text fw={600}>{subscription.plan}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">
                    Status
                  </Text>
                  <Badge color="green">{subscription.status}</Badge>
                </div>
                <div>
                  <Text size="sm" color="dimmed">
                    Monthly Charge
                  </Text>
                  <Text fw={600} style={{ color: "#588157" }}>
                    ₹{subscription.monthlyCharge.toLocaleString()}
                  </Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">
                    Next Billing
                  </Text>
                  <Text fw={600}>{subscription.nextBillingDate}</Text>
                </div>
              </Group>
            </div>
            <Button variant="default" onClick={() => setPlanModal(true)}>
              Change Plan
            </Button>
          </Group>
        </Paper>

        <Tabs defaultValue="invoices">
          <Tabs.List>
            <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
            <Tabs.Tab value="payments">Payment Methods</Tabs.Tab>
          </Tabs.List>

          {/* Invoices Tab */}
          <Tabs.Panel value="invoices" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: "#f8f9fa" }}>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {invoices.map((invoice) => (
                    <Table.Tr key={invoice.id}>
                      <Table.Td fw={500}>{invoice.pdf}</Table.Td>
                      <Table.Td>{invoice.date}</Table.Td>
                      <Table.Td fw={600} style={{ color: "#588157" }}>
                        {invoice.amount}
                      </Table.Td>
                      <Table.Td>
                        <Badge color="green">{invoice.status}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          leftSection={<IconDownload size={14} />}
                          variant="subtle"
                          size="xs"
                        >
                          Download
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>

          {/* Payment Methods Tab */}
          <Tabs.Panel value="payments" pt="md">
            <Stack gap="lg">
              {paymentMethods.map((method) => (
                <Paper key={method.id} p="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text fw={600}>
                        {method.type} ending in {method.last4}
                      </Text>
                      <Text size="sm" color="dimmed">
                        Expires {method.expiry}
                      </Text>
                      {method.isDefault && (
                        <Badge color="green" mt="xs">
                          Default Payment Method
                        </Badge>
                      )}
                    </div>
                    <Group gap="xs">
                      <Button variant="default" size="sm">
                        Edit
                      </Button>
                      <Button variant="light" color="red" size="sm">
                        Remove
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              ))}

              <Button
                style={{ backgroundColor: "#588157" }}
                leftSection={<IconPlus size={18} />}
                onClick={() => setAddPaymentModal(true)}
              >
                Add Payment Method
              </Button>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Add Payment Modal */}
      <Modal
        opened={addPaymentModal}
        onClose={() => setAddPaymentModal(false)}
        title="Add Payment Method"
      >
        <form
          onSubmit={form.onSubmit((values) => {
            console.log("Payment added:", values);
            alert("Payment method added successfully!");
            form.reset();
            setAddPaymentModal(false);
          })}
        >
          <Stack gap="md">
            <TextInput
              label="Cardholder Name"
              placeholder="Full name"
              {...form.getInputProps("cardName")}
              required
            />
            <TextInput
              label="Card Number"
              placeholder="4242 4242 4242 4242"
              {...form.getInputProps("cardNumber")}
              required
            />
            <Group grow>
              <TextInput
                label="Expiry Date"
                placeholder="MM/YY"
                {...form.getInputProps("expiry")}
                required
              />
              <TextInput
                label="CVV"
                placeholder="123"
                {...form.getInputProps("cvv")}
                required
              />
            </Group>
            <Button style={{ backgroundColor: "#588157" }} type="submit">
              Add Payment Method
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Plan Change Modal */}
      <Modal
        opened={planModal}
        onClose={() => setPlanModal(false)}
        title="Choose Your Plan"
        size="lg"
        centered
      >
        <SimpleGrid cols={{ base: 1, md: 3 }} gap="lg">
          {plans.map((plan) => (
            <Paper
              key={plan.name}
              p="lg"
              radius="md"
              withBorder
              style={{
                border:
                  plan.name === subscription.plan
                    ? "2px solid #588157"
                    : "1px solid #ddd",
              }}
            >
              <Text fw={600} style={{ color: "#344e41" }} mb="xs">
                {plan.name}
              </Text>
              <Text size="xl" fw={700} style={{ color: "#588157" }} mb="md">
                ₹{plan.price}/mo
              </Text>
              <Stack gap="xs" mb="lg">
                {plan.features.map((feature) => (
                  <Group key={feature} gap="xs">
                    <IconCheck size={16} color="#588157" />
                    <Text size="sm">{feature}</Text>
                  </Group>
                ))}
              </Stack>
              <Button
                fullWidth
                variant={plan.name === subscription.plan ? "filled" : "light"}
                style={{
                  backgroundColor:
                    plan.name === subscription.plan ? "#588157" : "transparent",
                }}
                onClick={() => handlePlanChange(plan.name)}
                disabled={plan.name === subscription.plan}
                loading={changingPlan}
              >
                {plan.name === subscription.plan
                  ? "Current Plan"
                  : "Switch to " + plan.name}
              </Button>
            </Paper>
          ))}
        </SimpleGrid>
      </Modal>
    </Container>
  );
}

export default OrganizationBilling;
