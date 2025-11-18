// /client/src/index.js (Simplified and Corrected)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider } from '@mantine/core';

// Import global CSS files
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);