import React from 'react';
import { Container, Group, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconRecycle } from '@tabler/icons-react';

const palette = {
  linen: '#dad7cd',
  sage: '#a3b18a',
  fern: '#588157',
  pine: '#3a5a40',
  forest: '#344e41',
};

const Header = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${palette.sage}20`,
      boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
    }}>
      <Container size="xl">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}>
          {/* Logo */}
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              color: palette.forest
            }}>
              <span>SCR</span>
              <IconRecycle 
                size={32} 
                style={{ 
                  color: palette.fern,
                  margin: '0 -2px',
                  strokeWidth: 2.5
                }} 
              />
              <span>PP</span>
            </div>
          </Link>

          {/* Navigation Buttons */}
          <Group gap="md">
            <Button 
              component={Link} 
              to="/login" 
              variant="subtle"
              size="md"
              style={{
                color: palette.pine
              }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/signup/select-role" 
              size="md"
              style={{
                background: `linear-gradient(135deg, ${palette.fern} 0%, ${palette.pine} 100%)`,
                border: 'none'
              }}
            >
              Get Started
            </Button>
          </Group>
        </div>
      </Container>
    </header>
  );
};

export default Header;