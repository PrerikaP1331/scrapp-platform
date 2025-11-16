import React, { Suspense } from 'react';
import { Container, Title, Text, Button, Paper, Grid, Group, Accordion, Badge, Blockquote, Divider } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconRecycle, IconCalendar, IconMapPin, IconChartLine, IconUsersGroup, IconBuildingFactory2, IconShieldCheck, IconGift, IconLeaf, IconSparkles, IconTrendingUp } from '@tabler/icons-react';
import styles from './LandingPage.module.css';
import Header from './Header';
import Footer from './Footer';
const InteractiveGlobeLazy = React.lazy(() => import('./InteractiveGlobe'));

const palette = {
  linen: '#dad7cd',
  sage: '#a3b18a',
  fern: '#588157',
  pine: '#3a5a40',
  forest: '#344e41',
};

function LandingPage() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <section className={styles.hero}>
        <Container size="xl">
          <div className={styles.heroInner}>
          <Grid align="center" gutter={72}>
            <Grid.Col span={{ base: 12, sm: 7, md: 6 }} className={styles.heroLeft}>
              <div className={styles.beigeBadge}>
                <IconSparkles size={14} style={{ marginRight: 6 }} />
                <span>Join 415+ households</span>
              </div>
              <Title order={1} className={styles.heroTitle}>
                Recycle from your doorstep. Earn rewards. See your impact.
              </Title>
              <Text size="lg" className={styles.heroSubtitle}>
                Scrapp connects households, communities, and businesses with verified recyclers—making sustainable action effortless.
              </Text>
              <Group mt="xl" gap="md">
                <Button 
                  component={Link} 
                  to="/signup/select-role" 
                  size="lg" 
                  radius="md" 
                  className={styles.primaryButton}
                  rightSection={<IconTrendingUp size={18} />}
                >
                  Get Started
                </Button>
                <Button 
                  component={Link} 
                  to="/login" 
                  size="lg" 
                  variant="outline" 
                  radius="md" 
                  className={styles.secondaryButton}
                >
                  Login
                </Button>
              </Group>
              <div className={styles.copyBullets}>
                <div className={styles.copyBullet}><IconMapPin size={14} style={{ marginRight: 6 }} /><span>Doorstep pickups</span></div>
                <div className={styles.copyBullet}><IconChartLine size={14} style={{ marginRight: 6 }} /><span>Impact tracking</span></div>
                <div className={styles.copyBullet}><IconGift size={14} style={{ marginRight: 6 }} /><span>Rewards</span></div>
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 5, md: 6 }} className={styles.heroRight}>
              <div className={styles.heroVisual}>
                <Suspense fallback={<div style={{ height: 360 }} />}> 
                  <InteractiveGlobeLazy />
                </Suspense>
              </div>
            </Grid.Col>
          </Grid>
          </div>
        </Container>
      </section>

      <section className={styles.featuresSection}>
        <Container size="xl">
          <Title order={2} className={styles.sectionTitle} ta="center" mb="xl">
            Why choose Scrapp?
          </Title>
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper className={styles.featureCard} p="xl" radius="md">
                <div className={styles.featureIconWrapper}>
                  <IconMapPin size={32} stroke={1.5} />
                </div>
                <Title order={4} className={styles.featureTitle} mt="md">Doorstep pickups</Title>
                <Text className={styles.featureText} mt="xs">
                  Schedule pickups at your convenience with verified recyclers.
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper className={styles.featureCard} p="xl" radius="md">
                <div className={styles.featureIconWrapper}>
                  <IconChartLine size={32} stroke={1.5} />
                </div>
                <Title order={4} className={styles.featureTitle} mt="md">Track your impact</Title>
                <Text className={styles.featureText} mt="xs">
                  See waste diverted and CO₂ saved across your pickups.
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper className={styles.featureCard} p="xl" radius="md">
                <div className={styles.featureIconWrapper}>
                  <IconGift size={32} stroke={1.5} />
                </div>
                <Title order={4} className={styles.featureTitle} mt="md">Rewards & coupons</Title>
                <Text className={styles.featureText} mt="xs">
                  Earn rewards for recycling and unlock partner benefits.
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper className={styles.featureCard} p="xl" radius="md">
                <div className={styles.featureIconWrapper}>
                  <IconUsersGroup size={32} stroke={1.5} />
                </div>
                <Title order={4} className={styles.featureTitle} mt="md">Community hubs</Title>
                <Text className={styles.featureText} mt="xs">
                  Join local hubs to coordinate and share progress.
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      <section className={styles.howItWorksSection}>
        <Container size="xl">
          <Title order={2} className={styles.sectionTitle} ta="center" mb="xl">
            How it works
          </Title>
          <Grid gutter="xl">
            {[
              { icon: IconLeaf, title: 'Sign up', text: 'Create your account and set a default pickup address.' },
              { icon: IconCalendar, title: 'Schedule', text: 'Choose waste types and a preferred time slot.' },
              { icon: IconShieldCheck, title: 'Collect', text: 'Verified recyclers collect and confirm your pickup.' },
              { icon: IconChartLine, title: 'Track & earn', text: 'Track impact and earn rewards for sustainable action.' }
            ].map((step, idx) => (
              <Grid.Col key={idx} span={{ base: 12, sm: 6, md: 3 }}>
                <Paper className={styles.stepCard} p="xl" radius="md">
                  <div className={styles.stepNumber}>{idx + 1}</div>
                  <div className={styles.stepIconWrapper}>
                    {(() => { const IconComp = step.icon; return <IconComp size={28} stroke={1.5} />; })()}
                  </div>
                  <Title order={5} className={styles.stepTitle} mt="md">{step.title}</Title>
                  <Text className={styles.stepText} mt="xs">{step.text}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </section>

      <section className={styles.statsSection}>
        <Container size="xl">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper className={styles.statCard} p="xl" radius="md">
                <Title order={2} className={styles.statNumber}>2,340 kg</Title>
                <Text className={styles.statLabel} mt="xs">Waste diverted from landfills</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper className={styles.statCard} p="xl" radius="md">
                <Title order={2} className={styles.statNumber}>1,120</Title>
                <Text className={styles.statLabel} mt="xs">Successful pickups completed</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper className={styles.statCard} p="xl" radius="md">
                <Title order={2} className={styles.statNumber}>415</Title>
                <Text className={styles.statLabel} mt="xs">Active households onboarded</Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      <section className={styles.audienceSection}>
        <Container size="xl">
          <Title order={2} className={styles.sectionTitle} ta="center" mb="xl">
            Who is Scrapp for?
          </Title>
          <Grid gutter="xl">
            {[
              { to: '/signup/individual', icon: IconLeaf, title: 'Individuals', text: 'Pickup from your home, any time.' },
              { to: '/signup/community', icon: IconUsersGroup, title: 'Communities', text: 'Coordinate society-wide recycling.' },
              { to: '/signup/corporate', icon: IconBuildingFactory2, title: 'Corporates', text: 'Compliance, reporting, scheduled pickups.' },
              { to: '/signup/recycler', icon: IconRecycle, title: 'Recyclers', text: 'Discover service requests in your area.' }
            ].map((audience, idx) => (
              <Grid.Col key={idx} span={{ base: 12, sm: 6, md: 3 }}>
                <Paper 
                  component={Link} 
                  to={audience.to} 
                  className={styles.audienceCard} 
                  p="xl" 
                  radius="md"
                >
                  <div className={styles.audienceIconWrapper}>
                    {(() => { const IconComp = audience.icon; return <IconComp size={36} stroke={1.5} />; })()}
                  </div>
                  <Title order={4} className={styles.audienceTitle} mt="md">{audience.title}</Title>
                  <Text className={styles.audienceText} mt="xs">{audience.text}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </section>

      <section className={styles.testimonialsSection}>
        <Container size="xl">
          <Title order={2} className={styles.sectionTitle} ta="center" mb="xl">
            What our users say
          </Title>
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper className={styles.testimonialCard} p="xl" radius="md">
                <Blockquote 
                  color={palette.fern} 
                  cite="— Resident, Koramangala"
                  className={styles.testimonialQuote}
                >
                  I booked my first pickup in under a minute. The rewards are a nice bonus, but knowing my waste is being properly recycled gives me peace of mind.
                </Blockquote>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper className={styles.testimonialCard} p="xl" radius="md">
                <Blockquote 
                  color={palette.fern} 
                  cite="— Community Admin, HSR Layout"
                  className={styles.testimonialQuote}
                >
                  Coordinating society pickups is finally simple and data-driven. Our residents love the transparency and ease of use.
                </Blockquote>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      <section className={styles.faqSection}>
        <Container size="xl">
          <Title order={2} className={styles.sectionTitle} ta="center" mb="xl">
            Frequently asked questions
          </Title>
          <Accordion radius="md" className={styles.accordion}>
            <Accordion.Item value="how-pickups-work">
              <Accordion.Control>How do pickups work?</Accordion.Control>
              <Accordion.Panel>
                Schedule a pickup through our platform, prepare your waste according to the selected types, and a verified recycler will collect it at your specified address and time.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="sorting">
              <Accordion.Control>Do I need to sort waste?</Accordion.Control>
              <Accordion.Panel>
                Basic sorting helps us process your waste more efficiently. When scheduling, you'll select waste types and receive simple guidelines on preparation.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="fees">
              <Accordion.Control>Is there a fee?</Accordion.Control>
              <Accordion.Panel>
                Fees depend on waste type, quantity, and your location. You'll see transparent pricing details during the scheduling process after logging in.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="rewards">
              <Accordion.Control>How are rewards issued?</Accordion.Control>
              <Accordion.Panel>
                You earn reward points with each completed pickup based on the weight and type of materials. Redeem these points for coupons with our partner brands directly from your account dashboard.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="privacy">
              <Accordion.Control>How is my data used?</Accordion.Control>
              <Accordion.Panel>
                Your data is used exclusively to facilitate pickups, show your environmental impact, and improve our service. We never sell personal data to third parties.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </section>

      <section className={styles.ctaSection}>
        <Container size="xl">
          <Paper className={styles.ctaCard} p="xl" radius="lg">
            <div className={styles.ctaContent}>
              <Title order={2} className={styles.ctaTitle}>
                Ready to make a difference?
              </Title>
              <Text size="lg" className={styles.ctaText} mt="md">
                Join hundreds of households already recycling smarter with Scrapp.
              </Text>
              <Group mt="xl" justify="center">
                <Button 
                  component={Link} 
                  to="/signup/select-role" 
                  size="lg" 
                  radius="md" 
                  className={styles.primaryButton}
                >
                  Get Started Today
                </Button>
                <Button 
                  component={Link} 
                  to="/login" 
                  size="lg" 
                  variant="outline" 
                  radius="md" 
                  className={styles.secondaryButton}
                >
                  Login
                </Button>
              </Group>
            </div>
          </Paper>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;