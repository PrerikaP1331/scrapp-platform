// /client/src/pages/SelectRolePage/SelectRolePage.js (Updated for impressive UI)
import React from 'react';
import { Container, Title, Paper, Text, Grid } from '@mantine/core';
import { Link } from 'react-router-dom';
// Import real icons from Tabler
import { IconUser, IconBuildingCommunity, IconBuildingFactory2, IconRecycle } from '@tabler/icons-react';
import styles from './SelectRolePage.module.css';

const roles = [
  { 
    name: 'Individuals', 
    desc: 'For personal and household recycling.', 
    icon: <IconUser size={48} color="#a3b18a" />, // Larger icon with our sage green color
    link: '/signup/individual' 
  },
  { 
    name: 'Communities', 
    desc: 'For RWAs and housing societies.', 
    icon: <IconBuildingCommunity size={48} color="#a3b18a" />, 
    link: '/signup/community' 
  },
  { 
    name: 'Corporates', 
    desc: 'For businesses, schools, and offices.', 
    icon: <IconBuildingFactory2 size={48} color="#a3b18a" />, 
    link: '/signup/corporate' 
  },
  { 
    name: 'Recyclers', 
    desc: 'For our recycling business partners.', 
    icon: <IconRecycle size={48} color="#a3b18a" />, 
    link: '/signup/recycler' 
  },
];

function SelectRolePage() {
  return (
    <div className={styles.wrapper}>
      <Container size="xl" px="xl"> {/* Use a larger container */}
        <Title order={1} ta="center" mb={50} style={{ color: '#344e41', fontWeight: 600 }}>
          Which user group do you belong to?
        </Title>
        <Grid justify="center" gutter="xl"> {/* Add more spacing between cards */}
          {roles.map((role) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={role.name}>
              <Paper
                component={Link}
                to={role.link}
                withBorder
                p="xl"
                radius="md"
                className={styles.roleCard}
              >
                {/* The content is now centered automatically by flexbox */}
                {role.icon}
                <Text size="xl" fw={600} ta="center" mt="md" style={{ color: '#3a5a40' }}>
                  {role.name}
                </Text>
                <Text size="sm" ta="center" mt={5} c="dimmed">
                  {role.desc}
                </Text>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default SelectRolePage;