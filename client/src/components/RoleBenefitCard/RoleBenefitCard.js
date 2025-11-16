import React from 'react';
import { Title, Text, List, ThemeIcon } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import styles from './RoleBenefitCard.module.css';

function RoleBenefitCard({ icon, title, description, features }) {
  return (
    <div className={styles.cardWrapper}>
      {icon}
      <Title order={3} mt="lg" style={{ color: '#344e41' }}>{title}</Title>
      <Text c="dimmed" mt="sm">{description}</Text>
      <List
        spacing="sm"
        size="sm"
        mt="xl"
        icon={
          <ThemeIcon size={20} radius="xl" style={{ backgroundColor: '#588157' }}>
            <IconCheck size={12} stroke={3} />
          </ThemeIcon>
        }
      >
        {features.map((feature, index) => (
          <List.Item key={index}>{feature}</List.Item>
        ))}
      </List>
    </div>
  );
}

export default RoleBenefitCard;