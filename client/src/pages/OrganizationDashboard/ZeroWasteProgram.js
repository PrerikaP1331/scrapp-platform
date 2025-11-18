import React, { useState } from 'react';
import { Container, Paper, Title, Button, Stack, Group, Tabs, Card, Text, Grid } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

function ZeroWasteProgram() {
  const [partners] = useState([
    {
      id: 1,
      name: 'GreenCycle Solutions',
      service: 'Comprehensive Waste Audit',
      description: 'Full facility audit with waste stream analysis and diversion strategies',
      costRange: '₹25,000 - ₹50,000',
      timeline: '2-4 weeks',
    },
    {
      id: 2,
      name: 'EcoWaste Management',
      service: 'Hazardous Waste Disposal',
      description: 'Certified hazardous waste collection and proper disposal',
      costRange: '₹15,000 - ₹35,000',
      timeline: 'Ongoing',
    },
    {
      id: 3,
      name: 'ZeroWaste Consulting',
      service: 'Waste Reduction Strategy',
      description: 'Custom waste reduction plan with employee training programs',
      costRange: '₹40,000 - ₹80,000',
      timeline: '4-8 weeks',
    },
  ]);

  const [selectedPartner, setSelectedPartner] = useState(null);

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Zero-Waste Program</Title>
            <p style={{ color: '#666' }}>Partner with experts to achieve zero-waste goals</p>
          </div>
          <Button
            style={{ backgroundColor: '#588157' }}
            leftSection={<IconPlus size={18} />}
          >
            Request Consultation
          </Button>
        </Group>

        {/* Program Overview */}
        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#f0f8f4' }}>
          <Title order={4} style={{ color: '#344e41' }} mb="md">What is Zero-Waste?</Title>
          <Text>
            A zero-waste program aims to divert 90% or more of waste from landfills through prevention, reduction, 
            reuse, recycling, and composting. Scrapp partners with certified waste management experts to help your 
            organization achieve ambitious sustainability targets.
          </Text>
        </Paper>

        <Tabs defaultValue="partners">
          <Tabs.List>
            <Tabs.Tab value="partners">Available Partners</Tabs.Tab>
            <Tabs.Tab value="services">Service Categories</Tabs.Tab>
          </Tabs.List>

          {/* Partners Tab */}
          <Tabs.Panel value="partners" pt="md">
            <Stack gap="lg">
              {partners.map((partner) => (
                <Paper
                  key={partner.id}
                  p="lg"
                  radius="md"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    border: selectedPartner?.id === partner.id ? '2px solid #588157' : '1px solid #dee2e6',
                    backgroundColor: selectedPartner?.id === partner.id ? '#f0f8f4' : 'white',
                  }}
                  onClick={() => setSelectedPartner(partner)}
                >
                  <Group justify="space-between" mb="md">
                    <div>
                      <Title order={4} style={{ color: '#344e41' }}>{partner.name}</Title>
                      <Text fw={600} style={{ color: '#588157' }}>{partner.service}</Text>
                    </div>
                    <Button variant="light">View Details</Button>
                  </Group>
                  <Text mb="md">{partner.description}</Text>
                  <Group>
                    <div>
                      <Text size="sm" color="dimmed">Cost Range</Text>
                      <Text fw={600}>{partner.costRange}</Text>
                    </div>
                    <div>
                      <Text size="sm" color="dimmed">Timeline</Text>
                      <Text fw={600}>{partner.timeline}</Text>
                    </div>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Tabs.Panel>

          {/* Service Categories Tab */}
          <Tabs.Panel value="services" pt="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder p="lg" radius="md">
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Waste Audits</Title>
                  <Text size="sm" mb="md">
                    Comprehensive analysis of current waste streams, identification of reduction opportunities, 
                    and actionable improvement plans.
                  </Text>
                  <Button variant="light" fullWidth>Learn More</Button>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder p="lg" radius="md">
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Compliance & Training</Title>
                  <Text size="sm" mb="md">
                    Employee training programs, policy development, and regulatory compliance support for 
                    sustainable waste management.
                  </Text>
                  <Button variant="light" fullWidth>Learn More</Button>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder p="lg" radius="md">
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Specialized Waste</Title>
                  <Text size="sm" mb="md">
                    Professional handling of e-waste, hazardous materials, and specialized waste streams with 
                    proper certification.
                  </Text>
                  <Button variant="light" fullWidth>Learn More</Button>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder p="lg" radius="md">
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Reporting & Analytics</Title>
                  <Text size="sm" mb="md">
                    Detailed waste metrics, ESG reporting, and progress tracking against zero-waste goals 
                    for corporate disclosure.
                  </Text>
                  <Button variant="light" fullWidth>Learn More</Button>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default ZeroWasteProgram;
