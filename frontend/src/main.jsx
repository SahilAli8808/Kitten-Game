// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import "@radix-ui/themes/styles.css";

import { Theme } from '@radix-ui/themes';

const rootElement = document.getElementById('root'); // Get the root element
const root = createRoot(rootElement); // Create a root

root.render(
  // <Provider store={store}>
    <Theme appearance="dark">

      <App />

    </Theme>
  // </Provider>
);
