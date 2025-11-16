// /client/src/index.js (Corrected)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App';
import { AuthProvider } from './context/AuthContext'; 

import './index.css';
import '@mantine/core/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider theme={{
      colors: {
        fern: [
          '#f4f5f1',
          '#eef0ea',
          '#e6eadf',
          '#dfe3d5',
          '#d3dbc8',
          '#c2ccb4',
          '#a3b18a',
          '#7b946f',
          '#5f7a5a',
          '#3a5a40'
        ],
      },
      primaryColor: 'fern',
    }}>
      <AuthProvider>
          <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);