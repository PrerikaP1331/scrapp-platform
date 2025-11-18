import React from 'react';
import { Container, Paper, Grid } from '@mantine/core';
import styles from './RegistrationLayout.module.css';

function RegistrationLayout({ benefitCard, form }) {
  return (
    <div className={styles.wrapper}>
      <Container size="xl" style={{ width: '100%' }}>
        <Paper withBorder shadow="xl" p={0} radius="md" style={{ overflow: 'hidden' }}>
          <Grid grow gutter={0}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              {benefitCard}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <div className={styles.formPanel}>
                {form}
              </div>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}

export default RegistrationLayout;