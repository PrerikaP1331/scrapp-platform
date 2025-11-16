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
    <MantineProvider>
      <AuthProvider>
          <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);