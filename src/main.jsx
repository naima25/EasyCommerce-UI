/*
 Main.jsx

  - Entry point for the React application.
  - StrictMode: Enforces additional checks and warnings for potential issues during development.
  - AppProvider: Wraps the App component with a context provider to share state across the application.
  - createRoot: Initialises the root of the React app and renders the App component to the DOM.
  - index.css: Global styles are applied to the application.
*/


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppProvider } from './context/AppContext';     

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AppProvider> 
        <App />
      </AppProvider>
  </StrictMode>
);
